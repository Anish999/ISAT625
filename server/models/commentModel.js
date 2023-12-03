const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    text:{
        type: String,
        required: [true, 'Please add a text value']
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Comment', commentSchema)