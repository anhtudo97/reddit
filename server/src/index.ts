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
import mongoose from "mongoose";
import MongoStore from 'connect-mongo'
import session from 'express-session'
import { COOKIE_NAME, __prod__ } from './constant';
import { Context } from './types/Context';

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

  // Session/Cookie store
	const mongoUrl = `${process.env.MONGO_URL}`;

	await mongoose.connect(mongoUrl,  {
    dbName: 'reddit',
    autoIndex: true,
  });

  // Apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    context: ({ req, res }): Context => ({
			req,
			res,
		}),
  });

  console.log("Mongo db connected")

  // Setting session mongo
  app.use(
		session({
			name: COOKIE_NAME,
			store: MongoStore.create({ mongoUrl }),
			cookie: {
				maxAge: 1000 * 60 * 60, // one hour
				httpOnly: true, // JS front end cannot access the cookie
				secure: __prod__, // cookie only works in https
				sameSite: 'none'
			},
			secret: process.env.SESSION_SECRET_DEV_PROD as string,
			saveUninitialized: false, // don't save empty sessions, right from the start
			resave: false
		})
	)

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
