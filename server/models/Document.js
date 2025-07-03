const mongoose = require('mongoose');
const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Document', DocumentSchema);