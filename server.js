const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "typeDefs.gql");

const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

const User = require("./models/User");
const Post = require("./models/Post");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log("DB connected"))
  .catch(error => console.error(error));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});