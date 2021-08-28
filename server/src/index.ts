import { UserResolver } from './resolvers/user';
import { Post } from "./entities/Post";
require("dotenv").config();

import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "reddit",
    username: process.env.POSTGRES_USERNAME_DEV,
    password: process.env.POSTGRES_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  });
  const app = express();

  // Apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(
      `Server is started on port ${PORT}. GraphQL Server started on localhost: ${apolloServer.graphqlPath}`
    )
  );
};

main().catch((error) => console.log(error));
