const express = require('express');
const router = express.Router();
const { register, login, getMe, verify } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/verify', auth, verify);

module.exports = router;