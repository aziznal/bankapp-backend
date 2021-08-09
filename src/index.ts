"use strict";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { MongoClient } from "mongodb";

import { DATABASE_URL, preflightOptions } from "./environment";

import { NewAccountHandler } from "./handlers/user/new-account/new-account.handler";

// Constants
const PORT = 8080;
const HOST = "localhost";

// App
const app = express();

app.use(cors(preflightOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    body: "hello there :)",
    status: 200,
  });
});

app.post("/", (req, res) => {
  res.send({
    body: "got your post",
    status: 200,
  });
});

console.log("Attempting to connect to mongo...")
console.log(MongoClient);

app.listen(PORT, HOST);

const mongoClient = MongoClient.connect(
  DATABASE_URL,
  (error, client) => {

    // const db = client!.db("bankapp");

    const newAccountHandler = new NewAccountHandler(app);
  }
);

console.log(`\n\nListening on http://${HOST}:${PORT}`);
