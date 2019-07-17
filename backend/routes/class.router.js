const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authorization');
const { getAllClasses, createClass, updateClass, deleteClass, getStudentsInClass, addStudentInClass, removeStudentInClass, getClass } = require('../controllers/class.controller');
const passport = require('passport');

router.get('/admin/classes', passport.authenticate('jwt', { session: false }), isAdmin, getAllClasses);
router.post('/admin/classes', passport.authenticate('jwt', { session: false }), isAdmin, createClass);

router.put('/admin/classes/:classId/add-student', passport.authenticate('jwt', { session: false }), isAdmin, addStudentInClass);
router.put('/admin/classes/:classId/remove-student', passport.authenticate('jwt', { session: false }), isAdmin, removeStudentInClass);

router.get('/admin/classes/:classId/students', passport.authenticate('jwt', { session: false }), isAdmin, getStudentsInClass);
router.get('/admin/classes/:classId', passport.authenticate('jwt', { session: false }), isAdmin, getClass);
router.put('/admin/classes/:classId', passport.authenticate('jwt', { session: false }), isAdmin, updateClass);
router.delete('/admin/classes/:classId', passport.authenticate('jwt', { session: false }), isAdmin, deleteClass);

module.exports = router;
