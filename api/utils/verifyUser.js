import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = async (req, res, next) => {
  console.log(req.headers);
  const token = req.cookies.access_token;

  console.log(req.headers.cookies); //
  console.log(req.cookies);
  console.log(req.signedCookies);

  //jjj
  if (!token) {
    console.log("no token"); //
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    next();
  });
};
