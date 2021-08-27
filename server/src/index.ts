import { Post } from './entities/Post';
require("dotenv").config();

import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { User } from "./entities/User";

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "reddit",
    username: process.env.POSTGRES_USERNAME_DEV,
    password: process.env.POSTGRES_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User, Post]
  });
  const app = express();

  app.listen(4000, () => console.log("DB is listening on port 4000"));
};

main().catch((error) => console.log(error));
