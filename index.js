const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const todoSchema = require('./todoSchema');
const schema = require('./schema');
const ElearningSchema = require('./ElearningSchema');
app.use('/graphql', graphqlHTTP({
  schema: ElearningSchema,
  graphiql: true,
}));
app.listen(5005, (req, res) => {
  console.log("server is running on port 5005")
})