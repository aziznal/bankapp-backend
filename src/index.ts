"use strict";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { MongoClient } from "mongodb";

import {
  DATABASE_URL,
  DEFAULT_COOKIE_OPTIONS,
  PREFLIGHT_OPTIONS,
} from "./environment";

import { NewAccountHandler } from "./handlers/user/new-account/new-account.handler";
import { LoginHandler } from "./handlers/user/login/login.handler";
import { StatusCodes } from "http-status-codes";

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();

app.use(cors(PREFLIGHT_OPTIONS));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log(req.cookies);

  res.cookie("hello", "there", {
    ...DEFAULT_COOKIE_OPTIONS,
    maxAge: 10 * 1000, //seconds,
  });

  res.status(StatusCodes.OK).send({
    body: "hello there, have a cookie :) ",
  });
});

app.post("/", (req, res) => {
  res.send({
    body: "got your post",
    status: 200,
  });
});

console.log("Attempting to connect to mongo...");
console.log(MongoClient);

app.listen(PORT, HOST);

// #TODO: app is failing if the connected db does not have a database named 'bankapp'

MongoClient.connect(DATABASE_URL)
  .then((client: MongoClient) => {
    const db = client.db("bankapp", {
      authSource: "root:example",
    });

    const newAccountHandler = new NewAccountHandler(app, db);
    const loginHandler = new LoginHandler(app, db);

    console.log("Successfully connected to mongodb!\n");
    console.log(`\n\nListening on http://${HOST}:${PORT}`);
  })
  .catch((error) => {
    console.log("Something went wrong");
    console.log(error);
  });
