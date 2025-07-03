const mongoose = require('mongoose');
const VersionSchema = new mongoose.Schema({
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  content: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Version', VersionSchema);