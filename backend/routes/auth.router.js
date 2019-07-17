var express = require('express');
var router = express.Router();
const { signup, signin, signout } = require('../controllers/auth.controller');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);

module.exports = router;
