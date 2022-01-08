require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const app = express();
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const PORT = 4000;

async function connection() {
    await mongoose.connect(`${process.env.URI}`).then(() => {
        console.log(`Connected Successfully`);
    }).catch(err => {
        console.log(err);
    });
}
connection();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});