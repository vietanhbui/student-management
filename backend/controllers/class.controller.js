const Class = require('../models/class.model');
const Student = require('../models/student.model');
const _ = require('lodash');

exports.getClass = (req, res) => {
    Class.findOne({ _id: req.params.classId }, (err, grade) => {
        if (err || !grade) {
            return res.status(400).json({ error: 'Class not found!' })
        } else {
            return res.json(grade);
        }
    });
}

exports.getAllClasses = (req, res) => {
    Class.find((err, classes) => {
        if (err || !classes) {
            return res.status(400).json({ error: 'No class found!' })
        } else {
            return res.json(classes);
        }
    });
}

exports.createClass = async (req, res) => {
    var classExist = await Class.findOne({ class: req.body.class });
    if (classExist) {
        return res.status(403).json({ error: 'Class is taken!' });
    } else {
        var grade = await new Class(req.body);
        grade.save();
        return res.json({ message: 'Create class success!' });
    }
}

exports.updateClass = (req, res) => {
    Class.findById(req.params.classId)
        .exec((err, grade) => {
            if (err || !grade) {
                return res.status(400).json({ error: 'Class not found!' });
            } else {
                grade = _.assignIn(grade, req.body);
                grade.updated = Date.now();
                grade.save((err, result) => {
                    if (err) {
                        return res.status(400).json({ error: err });
                    }
                    return res.json(result);
                })
            }
        })
}

exports.deleteClass = (req, res) => {
    Class.deleteOne({ _id: req.params.classId }, err => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        return res.json({ message: 'Class delete successfully' });
    })
}

exports.getStudentsInClass = (req, res) => {
    Student.find({ class: req.params.classId })
        .select('_id name email class')
        .populate('class', '_id class')
        .exec((err, students) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.json(students)
        })
}

exports.addStudentInClass = (req, res) => {
    Student.findOne({ email: req.body.email })
        .exec((err, student) => {
            if (err || !student) {
                return res.status(400).json({ error: 'Student not found' });
            } else {
                var classesOfStudent = student.class;
                if (classesOfStudent.indexOf(req.params.classId) !== -1) {
                    return res.status(400).json({ error: 'Student already in class' });
                } else {
                    Student.findOneAndUpdate(
                        { email: req.body.email },
                        { $push: { class: req.params.classId } },
                        { new: true }
                    )
                        .select('_id name email class')
                        .populate('class', '_id class')
                        .exec((err, result) => {
                            if (err) {
                                return res.status(400).json({ error: err });
                            }
                            return res.json(result);
                        });
                }
            }
        })
}

exports.removeStudentInClass = (req, res) => {
    Student.findOneAndUpdate(
        { email: req.body.email },
        { $pull: { class: req.params.classId } },
        { new: true }
    )
        .select('_id name email class')
        .populate('class', '_id class')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.json(result);
        });
}