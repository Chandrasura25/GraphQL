const  mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  name:{type:String},
    genre:{type:String},
    author_id:{type:String},
    status:{type:String}
})
const bookModel = mongoose.model("book",bookSchema)
module.exports = bookModel