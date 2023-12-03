const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Please add a text value']
    },
    text:{
        type: String,
        required: [true, 'Please add a text value']
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    topic:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Topic'
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Post', postSchema)