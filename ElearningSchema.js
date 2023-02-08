const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema} = require('graphql')
const studentList = [
    { id: '1', name: 'Harry Potter', teacher_id: '1', hod_id: '1' },
    { id: '2', name: 'J.K. Rowling', teacher_id: '2', hod_id: '2' },
    { id: '3', name: 'J.R. Tolkien', teacher_id: '3', hod_id: '1' },
    { id: '4', name: 'J.R. Tolkyen', teacher_id: '1', hod_id: '2' },
    { id: '5', name: 'Chandrasura', teacher_id: '2', hod_id: '1' },
]
const teacherList = [
    { id: '1', name: 'Harry Joe' },
    { id: '2', name: 'Joe Rain' },
    { id: '3', name: 'Rain Doe' }
]
const HODList = [
    { id: '1', name: 'Sean Killer', dept: 'Front-End' },
    { id: '2', name: 'Titler Finn', dept: 'Back-end' },
]
const courseList = [
    { id: '1', title: 'JavaScript', teacher_id: '3' },
    { id: '2', title: 'React', teacher_id: '1' },
    { id: '3', title: 'Angular', teacher_id: '2' },
    { id: '4', title: 'Node', teacher_id: '1' },
    { id: '5', title: 'PHP & Laravel', teacher_id: '2' },
    { id: '6', title: 'Firebase', teacher_id: '3' },
]
const studentType = new GraphQLObjectType({
    name: 'student',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        course_details: {
            type: new GraphQLList(courseType),
            resolve(parent, args) {
                return courseList.filter(val => val.teacher_id === parent.teacher_id)
            }
        },
        hod_details: {
            type: new GraphQLList(HODType),
            resolve(parent, args) {
                return HODList.filter(val => val.id === parent.hod_id)
            }
        }
    })
})
const teacherType = new GraphQLObjectType({
    name: 'teacher',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        course_details: {
            type: new GraphQLList(courseType),
            resolve(parent, args) {
                return courseList.filter((val) => val.teacher_id === parent.id)
            }
        },
        student_details: {
            type: new GraphQLList(studentType),
            resolve(parent, args) {
                return studentList.filter((val) => val.teacher_id === parent.id)
            }
        }
    })
})
const courseType = new GraphQLObjectType({
    name: 'course',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString }
    })
})
const HODType = new GraphQLObjectType({
    name: 'HOD',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        dept: { type: GraphQLString }
    })
})
const RootQuery = new GraphQLObjectType({
    name: 'Elearning',
    fields: {
        allStudents: {
            type: new GraphQLList(studentType),
            resolve(parent, args) {
                return studentList
            }
        },
        allTeachers: {
            type: new GraphQLList(teacherType),
            resolve(parent, args) {
                return teacherList
            }
        },
        allCourses: {
            type: new GraphQLList(courseType),
            resolve(parent, args) {
                return courseList
            }
        },
        allHOD: {
            type: new GraphQLList(HODType),
            resolve(parent, args) {
                return HODList
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery
})