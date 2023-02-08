const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLNonNull } = require('graphql')
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
    authors_details: {
      type: new GraphQLList(authorType),
      resolve(parent, args) {
        return authors.filter((val) => val.id === parent.author_id)
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
        return bookList.filter((val) => val.author_id === parent.id)
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
        return bookList
      }
    },
    allAuthors: {
      type: new GraphQLList(authorType),
      resolve(parent, args) {
        return authors
      }
    },
    getSingleBook: {
      type: bookType,
      args: { id: { type: GraphQLID } },
      // args: { id: { type: GraphQLID },name:{type:GraphQLString} },   
      resolve(parent, args) {
        return bookList.find((val) => val.id === args.id)
      }
    },
    getSingleAuthor: {
      type: authorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return authors.find((val) => val.id === args.id)
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'add_new_info',
  fields: {
    addBook: {
      type: new GraphQLList(bookType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        author_id: { type: GraphQLID }
      },
      resolve(parent, args) {
        bookList.push(args)
        return bookList
      }
    },
    deleteBook: {
      type: new GraphQLList(bookType),
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return bookList.filter((val) => val.id != args.id)
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
    }
  }
})

module.exports = new GraphQLSchema({
  mutation: Mutation,
  query: RootQuery
})