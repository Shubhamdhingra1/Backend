const express = require('express');
const router = express.Router();
const {
  createDocument, getDocuments, getDocument, updateDocument, deleteDocument,
  getVersions, revertVersion, inviteCollaborator
} = require('../controllers/documentController');
const auth = require('../middleware/auth');

router.post('/', auth, createDocument);
router.get('/', auth, getDocuments);
router.get('/:id', auth, getDocument);
router.put('/:id', auth, updateDocument);
router.delete('/:id', auth, deleteDocument);
router.get('/:id/versions', auth, getVersions);
router.post('/:id/revert', auth, revertVersion);
// Add this route
router.post('/:id/invite', auth, inviteCollaborator);
module.exports = router;