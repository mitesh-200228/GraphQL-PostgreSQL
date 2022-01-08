const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt } = graphql;
let books = [
    { id: '1', name: 'Harry Potter 1', genre: 'Fantasy', authorId:"1" },
    { id: '2', name: 'Harry Potter 2', genre: 'Fantasy', authorId:"2" },
    { id: '3', name: 'Harry Potter 3', genre: 'Fantasy', authorId:"3" },
    { id: '4', name: 'Harry Potter 4', genre: 'Fantasy', authorId:"2" },
    { id: '5', name: 'Harry Potter 5', genre: 'Fantasy', authorId:"3" },
    { id: '6', name: 'Harry Potter 6', genre: 'Fantasy', authorId:"3" },
]

let authors = [
    { id: '1', name: 'Mitesh1 Bediya', age: '19' },
    { id: '2', name: 'Mitesh2 Bediya', age: '20' },
    { id: '3', name: 'Mitesh3 Bediya', age: '21' },
]

const BookType = new GraphQLObjectType({
    name: 'Books',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: {
            type: AuthorType,
            resolve(parent,args){
                console.log(parent);
                return _.find(books,{id:parent.authorId});
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Authors',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books:{
            type: new graphql.GraphQLList(BookType),
            resolve(parent,args){
                return _.filter(books,{authorId:parent.id});
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return _.find(books, { id: args.id });
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return _.find(authors, { id: args.id });
            }
        },
        books:{
            type:new graphql.GraphQLList(BookType),
            resolve(parent,args){
                return books;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type: AuthorType,
            args:{
                name:{type:GraphQLString},
                age:{type:GraphQLInt}
            },
            async resolve(parent,args){
                const author = new Author({
                    name: args.name,
                    age: args.age
                });
                await author.save();
                return author.save();
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({ query: RootQuery ,mutation:Mutation});