const mongoose = require('mongoose');
const authorSchema = mongoose.Schema({
    name:{type:String},
    age:{type:Number}
})
const authorModel = mongoose.model('Author',authorSchema);
module.exports = authorModel;