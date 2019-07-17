const Student = require('../models/student.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.signup = async (req, res) => {
    var studentExist = await Student.findOne({ email: req.body.email });
    if (studentExist) {
        return res.status(403).json({ error: 'Email is taken!' });
    }
    var student = await new Student(req.body);
    // hash password
    await bcrypt.hash(req.body.password, 10, function (err, hash) {
        student.password = hash;
        student.save();
    });
    res.json({ message: 'Signup success!' });
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    Student.findOne({ email: email }, (err, student) => {
        if (err || !student) {
            return res.status(400).json({
                error: 'Please provide a valid email and password!'
            });
        }
        bcrypt.compare(password, student.password).then(function (check) {
            if (check) {
                const token = jwt.sign({ _id: student._id, role: student.role }, process.env.JWT_SECRET);
                const { _id, email, name, role } = student;
                res.json({ token, student: { _id, email, name, role } });
            } else {
                return res.status(400).json({
                    error: 'Please provide a valid email and password!'
                });
            }
        });
    })
}

exports.signout = (req, res) => {
    res.json({ message: 'Signout success!' });
}