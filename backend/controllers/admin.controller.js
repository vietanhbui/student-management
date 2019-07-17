const Student = require('../models/student.model');

exports.deleteStudent = (req, res) => {
    Student.deleteOne({ _id: req.params.studentId }, err => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        return res.json({ message: 'User delete successfully' });
    })
}