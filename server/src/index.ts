import "reflect-metadata";
import "dotenv-safe/config";
import { __prod__, COOKIE_NAME } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
// import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { Token } from "./entities/Token";
// import {MySQLStore} from "express-mysql-session";
// import https from "https"
const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    // synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot, Token],
  });
  await conn.runMigrations();

  // await Post.delete({});
  // const fs = require('fs')

  const app = express();
  const MySQLStore = require('express-mysql-session')(session);

  var options = {
    host: 'localhost',
    port: 3306,
    user: 'ession_db_user',
    password: 'admin777@@@',
    database: 'session_db'
  };
  
  const sessionStore = new MySQLStore(options);

  // const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: sessionStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".oook.sd" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,

    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });
  // ----------------------------------------------------------------
  // const manualServer = https.createServer(
  //   {
  //     key: fs.readFileSync(`./key.pem`),
  //     cert: fs.readFileSync(`./cert.pem`),
  //   },
  //   app,
  // );
  // ----------------------------------------------------------------

  apolloServer.applyMiddleware({
    app,
    cors: false,
  }); 
  // manualServer.listen(parseInt(process.env.PORT));

  app.listen(parseInt(process.env.PORT), () => {
    console.log("server started on localhost:4000");
  });
  
};

main().catch((err) => {
  console.error(err);
});
