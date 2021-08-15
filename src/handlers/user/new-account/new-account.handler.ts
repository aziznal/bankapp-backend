import express from "express";
import mongodb from "mongodb";
import bcrypt from "bcrypt";

import { StatusCodes } from "http-status-codes";

import { User } from "../../../models/user.model";

export class NewAccountHandler {
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

    this.listenToNewUserRequests();
  }

  /**
   *
   * Adds POST listener on /new-user and a function to be triggered on incoming
   * requests
   *
   * @returns void
   */
  listenToNewUserRequests(): void {
    this.app.post("/new-user", (request, response) => {
      this.handleNewUserRequest(request, response);
    });
  }

  /**
   *
   * Validates incoming request and creates a new user.
   *
   * @param  {express.Request} request
   * @param  {express.Response} response
   */
  async handleNewUserRequest(
    request: express.Request,
    response: express.Response
  ) {
    let user: User = request.body;

    console.log(user);

    let userIsValid = this.confirmValidUser(user);

    let userAlreadyExists = await this.checkUserAlreadyExists(user.email);

    if (!userIsValid) {
      return response.status(StatusCodes.BAD_REQUEST).send({
        body: "Bad Request. Check fields and try again.",
      });
    } else if (userAlreadyExists) {
      return response.status(StatusCodes.CONFLICT).send({
        body: "User with given email already exists",
      });
    } else {
      this.createNewUser(request.body).then((results) => {
        console.log(results);

        if (results === undefined || results.insertedId === undefined) {
          return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            body: "Internal server error.",
          });
        } else {
          return response.status(StatusCodes.CREATED).send({
            body: `Successfully created user! id = ${results.insertedId}`,
          });
        }
      });
    }
  }

  createNewUser(user: User): Promise<mongodb.InsertOneResult> {
    let hashedPassword = this.getHashedPassword(user.password);

    return this.db
      .collection("users")
      .insertOne({ ...user, password: hashedPassword });
  }

  confirmValidUser(user: User) {
    Object.values(user).forEach((value) => {
      if (value === undefined || value === "") {
        return false;
      }
    });

    return true;
  }

  /**
   *
   * Checks whether provided user's email is already in the database or not.
   *
   * @returns boolean
   */
  checkUserAlreadyExists(userEmail: string): Promise<boolean> {
    let query = this.db.collection("users").find({ email: userEmail });

    return new Promise<boolean>((resolve, _reject) => {
      query.count().then((count) => {
        resolve(count !== 0);
      });
    });
  }

  /**
   *
   * Returns hash of given raw password
   * 
   * @param {string} rawPassword
   * @return {*}  {string}
   * @memberof NewAccountHandler
   */
  getHashedPassword(rawPassword: string): string {
    let hashedPassword = bcrypt.hashSync(rawPassword, 10);

    return hashedPassword;
  }
}
