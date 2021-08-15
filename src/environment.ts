export const DATABASE_URL = "mongodb://localhost:8081";

export const preflightOptions = {
  "Access-Control-Allow-Origin": "http://localhost:4200/",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, PUT",
  credentials: true,
  origin: true,
};
