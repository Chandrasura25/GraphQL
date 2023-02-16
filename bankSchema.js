const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLBoolean, GraphQLUnionType } = require('graphql');
const userModel = require('./Model/userModel');
const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        fullname: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        accountNo: { type: GraphQLInt },
        balance: { type: GraphQLInt },
        message:{type:GraphQLString},
        success:{type:GraphQLBoolean},
        status:{type:GraphQLInt},
    })
})
const historyType = new GraphQLObjectType({
    name: 'history',
    fields: () => ({
        id: { type: GraphQLID },
        amount: { type: GraphQLInt },
        date: { type: GraphQLString },
        receiver: { type: GraphQLString },
    })
})
const signinType = new GraphQLObjectType({
    name: 'signin',
    fields:()=>({
        message:{type:GraphQLString},
        success:{type:GraphQLBoolean},
        status:{type:GraphQLInt},
    })
})
const RootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    fields: {
        allUsers: {
            type: new GraphQLList(userType),
            resolve(parent, args) {
                return userModel.find({}).select("-password")
            }
        }
    }
})


const accountNo = '13' + Math.floor(Math.random() * 100000000);
const mutation = new GraphQLObjectType({
    name: 'add_info',
    fields: {
        addUser: {
            type: userType,
            args: {
                fullname: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
                accountNo:{type:GraphQLInt},
                balance:{type:GraphQLInt}
            },
            resolve(parent, args) {
                let user = new userModel({
                    fullname: args.fullname,
                    email: args.email,
                    password: args.password,
                    phoneNumber: args.phoneNumber,
                    accountNo: accountNo,
                    balance:5000
                })
                return user.save()
            }
        },
        signInUser: {
            type:userType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
           async resolve(parent, args) {
                let email = args.email
                let password = args.password
                let auth_signin = await userModel.findOne({ email, password })
                if (!auth_signin) {
                    let err= {
                        message:'Invalid Credentials',
                        success:false,
                        status:401
                    }
                    return err
                } else {
                    return auth_signin
                    
                }

            }
        },
        transfer: {
            type: userType,
            args: {
                amount: { type: new GraphQLNonNull(GraphQLInt) },
                id: { type: GraphQLID },
                transferredToAccNo: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
            },
            resolve(parent, args) {
                let transferre = userModel.findByIdAndUpdate(args.id, { balance: (balance - args.amount) })
                return transferre
            }
        }
    }

})
module.exports = new GraphQLSchema({
    mutation,
    query: RootQuery
})