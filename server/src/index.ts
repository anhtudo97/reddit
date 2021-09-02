require("dotenv").config();
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Context } from "./types/Context";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import cors from "cors";

const allowedOrigins = ["http://localhost:4000"];

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

  const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
  };

  const app = express();
  app.use(cors(corsOptions));
  app.set("trust proxy", 1);

  // Session/Cookie store
  const mongoUrl = `${process.env.MONGO_URL}`;

  await mongoose.connect(mongoUrl, {
    dbName: "reddit",
    autoIndex: true,
  });

  // Apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });

  console.log("Mongo db connected");

  app.use(
    session({
      name: COOKIE_NAME,
      store: MongoStore.create({
        mongoUrl,
        crypto: {
          secret: "squirrel",
        },
      }),
      cookie: {
        maxAge: 1000 * 60 * 60, // one hour
        secure: __prod__, // cookie only works in https
        // sameSite: "none",
      },
      secret: process.env.SESSION_SECRET_DEV_PROD as string,
      saveUninitialized: false, // don't save empty sessions, right from the start
      resave: false,
    })
  );

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: "/", cors: false });

  app.get("/set_session", (req: any, res) => {
    console.log(req.session);
    req.session.tuanh = "789";

    res.send("OK");
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(
      `Server is started on port ${PORT}. GraphQL Server started on localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
};

main().catch((error) => console.log(error));
