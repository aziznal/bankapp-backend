"use strict";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongodb from "mongodb";

import { DATABASE_URL } from "./environment";

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", (req, res) => {
  res.send(
    `
    <h1 style='text-align: center;'>
      Hello World!
      <h3 style='text-align: center;'>
        Database is hosted on ${DATABASE_URL}
      </h3>
    </h1>
    `
  );
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
