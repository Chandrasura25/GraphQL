const express = require('express');
const app = express();
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql');
const todoSchema = require('./todoSchema');
const schema = require('./schema');
const mongoose = require('mongoose')
const URI = process.env.MONGO_URI
const ElearningSchema = require('./ElearningSchema');
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
mongoose.set('strictQuery',false) 
// let userSchema = mongoose.Schema({
//     ToDos:String
// })
// let userModel = mongoose.model('user_tb',userSchema)
mongoose.connect(URI,(err)=>{
    if(err){
        console.log(err)
        console.log(`mongoose isn't connected`)
    }
    else{
        console.log(`moogoose is connected`)
    }
})
app.listen(5005, (req, res) => {
  console.log("server is running on port 5005")
})