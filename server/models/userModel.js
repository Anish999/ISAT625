const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please add a text value'],
        unique: [true, 'Username must be unique']
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)