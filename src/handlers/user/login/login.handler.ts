import express from "express";
import mongodb from "mongodb";
import bcrypt from "bcrypt";

import { StatusCodes } from "http-status-codes";
import { DEFAULT_COOKIE_OPTIONS } from "../../../environment";
import { User } from "../../../models/user.model";

export class LoginHandler {
  /**
   *
   * Express Instance used to specify routes and request handling
   * @type {express.Express}
   */
  app: express.Express;

  /**
   *
   * MongoDB socket used to connect to database
   * @type {mongodb.Db}
   */
  db: mongodb.Db;

  /**
   *
   * Inits app and starts listening on relevant route
   *
   * @param  {express.Express} app
   * @param {mongodb.Db} db
   */
  constructor(app: express.Express, db: mongodb.Db) {
    this.app = app;
    this.db = db;

    this.listenToLoginRequests();
  }

  /**
   *
   * Adds POST listener on /new-user and a function to be triggered on incoming
   * requests
   *
   * @returns void
   */
  listenToLoginRequests(): void {
    this.app.post("/login", (request, response) => {
      this.handleLoginRequest(request, response);
    });
  }

  /**
   *
   * Validates incoming request and attempts to log user in.
   *
   * @param  {express.Request} request
   * @param  {express.Response} response
   */
  async handleLoginRequest(
    request: express.Request,
    response: express.Response
  ) {
    console.log("\nReceived login request. Processing ... \n\n");

    let { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .send({ body: "Must provide both email and password" });
    }

    let userExists = await this.checkUserExists(email);
    let passwordIsValid = await this.validatePassword(email, password);

    if (!userExists || !passwordIsValid) {
      return response.status(StatusCodes.NOT_FOUND).send({
        body: "No user with given email and password combination was found",
      });
    } else {
      // Set session cookie
      response.cookie("auth", await this.getUserToken(email), {
        ...DEFAULT_COOKIE_OPTIONS,
        maxAge: 3600000 * 1, // 1 hour
      });

      return response.status(StatusCodes.OK).send();
    }
  }

  async checkUserExists(email: string): Promise<boolean> {
    return new Promise<any>((resolve, _reject) => {
      this.db
        .collection("users")
        .findOne({ email: email })
        .then((results) => {
          resolve(results && results!._id !== undefined);
        });
    });
  }

  /**
   *
   * Compares given raw password with user's hashed password.
   *
   * @param {string} email
   * @param {string} rawPassword
   * @return {*}  {Promise<boolean>}
   * @memberof LoginHandler
   */
  async validatePassword(email: string, rawPassword: string): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      this.getHashedPassword(email).then((hashedPassword) => {
        let passwordIsValid = bcrypt.compareSync(rawPassword, hashedPassword);
        resolve(passwordIsValid);
      });
    });
  }

  /**
   *
   * Finds and returns user's hashed password from database
   *
   * @param {string} email
   * @return {*}  {Promise<string>}
   * @memberof LoginHandler
   */
  async getHashedPassword(email: string): Promise<string> {
    return new Promise((resolve, _reject) => {
      this.db
        .collection("users")
        .findOne({ email })
        .then((results) => {
          if (results !== undefined) {
            resolve(results.password);
          } else {
            resolve("");
          }
        });
    });
  }

  /**
   * Returns a user token including the user's email
   *
   * @param {string} email The email of the user attempting to login
   * @return {*}  {Promise<string>}
   * @memberof LoginHandler
   */
  async getUserToken(email: string): Promise<string> {
    return new Promise<string>((resolve, _reject) => {
      this.db
        .collection("users")
        .findOne<User>({ email })
        .then((user: User | undefined) => {
          if (user) {
            console.log("Found user");
            console.log(user);
            resolve(user.email);
          } else {
            console.log("No users were found with given email and password");
            resolve("nope");
          }
        });
    });
  }
}
