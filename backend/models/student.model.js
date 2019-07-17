const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ObjectId } = mongoose.Schema;

var studentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: 'student'
    },
    class: [{
        type: ObjectId,
        ref: "Class"
    }],
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
    updated: {
        type: Date,
    }
});

// studentSchema.pre('save', async function (next) {
//     let student = this
//     const hashedPassword = await hashPassword(student);
//     student.password = hashedPassword
//     next()
// })

// async function hashPassword(student) {
//     const password = student.password
//     const saltRounds = 10;
//     const hashedPassword = await new Promise((resolve, reject) => {
//         bcrypt.hash(password, saltRounds, function (err, hash) {
//             if (err) reject(err)
//             resolve(hash)
//         });
//     })
//     return hashedPassword
// }

module.exports = mongoose.model('Student', studentSchema);