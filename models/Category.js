const mongoose = require('mongoose')


module.exports = new mongoose.model(
    'Category',
    new mongoose.Schema({
        name: {
            type: String,
            minlength: 0,
            maxlength: 100
        },
        tasks: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Task'
            }
        ]
    })
)
