var express = require('express');
var router = express.Router();
const passport = require('passport');
const { getStudent, updateStudent, getAllStudents } = require('../controllers/student.controller');
const { hasAuthorization } = require('../middleware/authorization');

router.get('/students', passport.authenticate('jwt', { session: false }), getAllStudents);
router.get('/students/:studentId', passport.authenticate('jwt', { session: false }), hasAuthorization, getStudent);
router.put('/students/:studentId', passport.authenticate('jwt', { session: false }), hasAuthorization, updateStudent);

module.exports = router;
