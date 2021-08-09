import express from "express";
import mongodb from "mongodb";

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
  // db: mongodb.Db;

  /**
   *
   * Inits app and starts listening on relevant route
   *
   * @param  {express.Express} app
   * @param {mongodb.Db} db
   */
  constructor(app: express.Express) {
    this.app = app;
    // this.db = db;

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
      this.createNewUser(request, response);
    });
  }

  /**
   *
   * Checks whether provided user's email is already in the system or not.
   *
   * @returns boolean
   */
  checkUserAlreadyExists(): boolean {
    return false;
  }

  /**
   *
   * Validates incoming request and creates a new user.
   *
   * @param  {express.Request} request
   * @param  {express.Response} response
   */
  createNewUser(request: express.Request, response: express.Response) {
    console.log(request.body);

    response.status(200).send({
      body: "received your new user request!"
    });
  }
}
