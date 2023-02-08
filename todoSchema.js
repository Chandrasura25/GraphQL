const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema, GraphQLNonNull } = require('graphql')
const todoList = [
  { id: '1', todo: 'Cooking' },
  { id: '2', todo: 'Coding' },
  { id: '3', todo: 'Singing' },
  { id: '4', todo: 'Dancing' },
  { id: '5', todo: 'Reading' },
]
const todoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: { type: GraphQLID },
    todo: { type: GraphQLString }
  })
})
const RootQuery = new GraphQLObjectType({
  name: 'Todos',
  fields: {
    allTodos: {
      type: new GraphQLList(todoType),
      resolve(parent, args) {
        return todoList
      }
    },
    get_a_todo: {
      type: todoType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return todoList.find(val => val.id === args.id)
      }
    }
  }
})
const mutation = new GraphQLObjectType({
  name: 'add_new_data',
  fields: {
    addTodo: {
      type: new GraphQLList(todoType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        todo: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        todoList.push(args)
        return todoList
      }
    },
    deleteTodo: {
      type: new GraphQLList(todoType),
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return todoList.filter(todo => todo.id != args.id)
      }
    },
    editTodo: {
      type: new GraphQLList(todoType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        todo: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        todoList[parseInt(args.id) - 1].todo = args.todo
        return todoList
      }
    }
  }
})
module.exports = new GraphQLSchema({
  mutation,
  query: RootQuery
})