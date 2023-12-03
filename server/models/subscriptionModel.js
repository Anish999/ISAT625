const mongoose = require('mongoose')

const subscriptionSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
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

module.exports = mongoose.model('Subscription', subscriptionSchema)