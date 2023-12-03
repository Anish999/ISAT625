const mongoose = require('mongoose')

const topicSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a text value'],
        unique: [true, 'Topic must be unique']
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Topic', topicSchema)