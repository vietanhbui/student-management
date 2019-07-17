const Student = require('../models/student.model');
const _ = require('lodash');

exports.getAllStudents = (req, res) => {
    Student.find((err, students) => {
        if (err || !students) {
            return res.status(400).json({ error: 'No student found!' });
        } else {
            return res.json(students);
        }
    })
        .select('_id name email class')
        .populate('class', '_id class');
}

exports.getStudent = (req, res) => {
    Student.findById(req.params.studentId)
        .select('_id name email class')
        .populate('class', '_id class')
        .exec((err, student) => {
            if (err || !student) {
                return res.status(400).json({ error: 'Student not found!' })
            }
            return res.json(student)
        })
}

exports.updateStudent = (req, res) => {
    Student.findById(req.params.studentId)
        .select('_id name email class')
        .populate('class', '_id class')
        .exec((err, student) => {
            if (err || !student) {
                return res.status(400).json({ error: 'Student not found!' });
            } else {
                student = _.assignIn(student, req.body);
                student.updated = Date.now();
                student.save((err, result) => {
                    if (err) {
                        return res.status(400).json({ error: err });
                    }
                    return res.json(student);
                })
            }
        })
}