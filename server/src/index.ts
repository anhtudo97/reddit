import { buildDataLoaders } from './utils/dataLoader';
require("dotenv").config();
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createConnection } from "typeorm";
import cors from "cors";

import { Context } from "./types/Context";
import { COOKIE_NAME, __prod__ } from "./constants";

import { User } from "./entities/User";
import { Post } from "./entities/Post";

import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import { PostResolver } from "./resolvers/post";
import { Upvote } from "./entities/Upvote";

const main = async () => {
  const connection = await createConnection({
    type: "postgres",
    database: "reddit",
    username: process.env.POSTGRES_USERNAME_DEV,
    password: process.env.POSTGRES_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User, Post, Upvote],
  });

  const app = express();

  app.use(
    cors({
      origin: __prod__
        ? process.env.CORS_ORIGIN_PROD
        : process.env.CORS_ORIGIN_DEV,
      credentials: true,
    })
  );

  // Session/Cookie store
  const mongoUrl = `${process.env.MONGO_URL}`;
  await mongoose.connect(mongoUrl);

  console.log("MongoDB Connected");

  app.set("trust proxy", 1);

  app.use(
    session({
      name: COOKIE_NAME,
      store: MongoStore.create({ mongoUrl }),
      cookie: {
        maxAge: 1000 * 60 * 60, // one hour
        httpOnly: true, // JS front end cannot access the cookie
        secure: __prod__, // cookie only works in https
        sameSite: "lax",
      },
      secret: process.env.SESSION_SECRET_DEV_PROD as string,
      saveUninitialized: false, // don't save empty sessions, right from the start
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({
      req,
      res,
      connection,
      dataLoaders: buildDataLoaders()
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          // setting for access cookie
          ["request.credentials"]: "include",
        },
      }),
    ],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(
      `Server started on port ${PORT}. GraphQL server started on localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
};

main().catch((error) => console.log(error));
