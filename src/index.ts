"use strict";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { MongoClient } from "mongodb";

import { DATABASE_URL, preflightOptions } from "./environment";

import { NewAccountHandler } from "./handlers/user/new-account/new-account.handler";

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

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

console.log("Attempting to connect to mongo...");
console.log(MongoClient);

app.listen(PORT, HOST);

MongoClient.connect(DATABASE_URL).then((client: MongoClient) => {
  const db = client.db("bankapp");

  const newAccountHandler = new NewAccountHandler(app, db);
});

console.log(`\n\nListening on http://${HOST}:${PORT}`);
