const Document = require('../models/Document');
const Version = require('../models/Version');
const User = require('../models/User');

exports.createDocument = async (req, res) => {
  const { title } = req.body;
  try {
    const doc = new Document({ title, owner: req.user.id, collaborators: [req.user.id] });
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ collaborators: req.user.id }).sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate('owner', 'username')
      .populate('collaborators', 'username');
    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    // Access control: only collaborators or owner can view
    if (
      !doc.collaborators.some(u => u._id.toString() === req.user.id) &&
      doc.owner._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json({
      ...doc.toObject(),
      ownerUsername: doc.owner.username,
      collaboratorsUsernames: doc.collaborators.map(u => u.username)
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: 'Document not found' });
    doc.content = req.body.content;
    doc.updatedAt = Date.now();
    await doc.save();
    // Save version
    const version = new Version({ document: doc._id, content: doc.content });
    await version.save();
    res.json(doc);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getVersions = async (req, res) => {
  try {
    const versions = await Version.find({ document: req.params.id }).sort({ createdAt: -1 });
    res.json(versions);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.revertVersion = async (req, res) => {
  try {
    const version = await Version.findById(req.body.versionId);
    if (!version) return res.status(404).json({ msg: 'Version not found' });
    const doc = await Document.findById(version.document);
    doc.content = version.content;
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.inviteCollaborator = async (req, res) => {
  const { username } = req.body;
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ msg: 'Document not found' });
  if (doc.owner.toString() !== req.user.id) return res.status(403).json({ msg: 'Only owner can invite' });
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ msg: 'User not found' });
  if (doc.collaborators.includes(user._id)) return res.status(400).json({ msg: 'Already a collaborator' });
  doc.collaborators.push(user._id);
  await doc.save();
  res.json({ msg: 'Collaborator added', collaborator: user.username });
};