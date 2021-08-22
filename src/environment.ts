import { CookieOptions } from "express";

export const DATABASE_URL = "mongodb://localhost:8081";

export const PREFLIGHT_OPTIONS = {
  "Access-Control-Allow-Origin": "http://localhost:4200/",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, PUT",
  credentials: true,
  origin: true,
};

export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  domain: "localhost",
  sameSite: "lax",
};
