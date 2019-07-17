const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isAdmin } = require('../middleware/authorization');
const { deleteStudent } = require('../controllers/admin.controller');
const { updateStudent, getStudent } = require('../controllers/student.controller');
const { signup } = require('../controllers/auth.controller');

router.post('/admin/students', passport.authenticate('jwt', { session: false }), isAdmin, signup);

router.get('/admin/students/:studentId', passport.authenticate('jwt', { session: false }), isAdmin, getStudent);
router.put('/admin/students/:studentId', passport.authenticate('jwt', { session: false }), isAdmin, updateStudent);
router.delete('/admin/students/:studentId', passport.authenticate('jwt', { session: false }), isAdmin, deleteStudent);

module.exports = router;