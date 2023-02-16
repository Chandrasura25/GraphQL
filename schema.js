const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLNonNull, GraphQLEnumType } = require('graphql')
const authorModel = require('./Model/authorModel')
const bookModel = require('./Model/bookModel')
const bookList = [
  { id: '1', name: 'Harry Potter', genre: 'J.K. Rowling', author_id: '1' },
  { id: '2', name: 'The Lord of the Rings', genre: 'J.R.R. Tolkien', author_id: '1' },
  { id: '3', name: 'The Hobbit', genre: 'J.R.R. Tolyien', author_id: '3' },
  { id: '4', name: 'The Silmarillion', genre: 'J.R.R. Tolyien', author_id: '3' },
  { id: '5', name: 'The Chronicles of Narnia', genre: 'C.S. Lewis', author_id: '2' },
  { id: '6', name: 'The Lion, the Witch and the Wardrobe', genre: 'C.S. Lewis', author_id: '2' },
]
const authors = [
  { id: '1', name: 'J.K. Rowling', age: 45 },
  { id: '2', name: 'J.R.R. Tolkien', age: 34 },
  { id: '3', name: 'J.R.R. Tolkyen', age: 25 },
]
const bookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author_id: { type: GraphQLID },
    status: { type: GraphQLString },
    authors_details: {
      type: new GraphQLList(authorType),
      resolve(parent, args) {
        // return authors.filter((val) => val.id === parent.author_id)
        return authorModel.findById(parent.author_id)
      }
    }
  })
})
const authorType = new GraphQLObjectType({
  name: 'author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    book_owns: {
      type: new GraphQLList(bookType),
      resolve(parent, args) {
        // return bookList.filter((val) => val.author_id === parent.id)
        return bookModel.find({ author_id: parent.id })
      }
    }
  })
})
const RootQuery = new GraphQLObjectType({
  name: 'books',
  fields: {
    allBook: {
      type: new GraphQLList(bookType),
      resolve(parent, args) {
        return bookModel.find({})
      }
    },
    allAuthors: {
      type: new GraphQLList(authorType),
      resolve(parent, args) {
        return authorModel.find({})
      }
    },
    getSingleBook: {
      type: bookType,
      args: { id: { type: GraphQLID } },
      // args: { id: { type: GraphQLID },name:{type:GraphQLString} },   
      resolve(parent, args) {
        // return bookList.find((val) => val.id === args.id)
        return bookModel.findById(args.id)
      }
    },
    getSingleAuthor: {
      type: authorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return authors.find((val) => val.id === args.id)
        return authorModel.findById(args.id)
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'add_new_info',
  fields: {
    addBook: {
      type: bookType,
      args: {
        // id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        author_id: { type: new GraphQLNonNull(GraphQLID) },
        status: {
          type: new GraphQLEnumType({
            name: "book_status",
            values: {
              "new": { value: "Not Available" },
              "progress": { value: 'Availability in progress' },
              "ready": { value: 'Available' }
            }
          }),
          defaultValue: "Not Available"
        }
      },
      resolve(parent, args) {
        return bookModel.create(args)
      }
    },
    deleteBook: {
      type: new GraphQLList(bookType),
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return bookList.filter((val) => val.id != args.id)
        return bookModel.findOneAndDelete({ _id: args.id })
      }
    },
    editBook: {
      type: new GraphQLList(bookType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        author_id: { type: GraphQLID }
      },
      resolve(parent, args) {
        bookList[parseInt(args.id) - 1].name = args.name
        args.genre ? bookList[parseInt(args.id) - 1].genre = args.genre : ""
        return bookList
      }
    },
    addAuthor:{
      type:authorType,
      args: { 
        // id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
     resolve(parent, args) {
        let all_author = authorModel.create(args)
        return all_author
      }
    }
  }
})

module.exports = new GraphQLSchema({
  mutation: Mutation,
  query: RootQuery
})