import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import { client } from "../../prisma/client";

async function authMiddleware(request: Request, response: Response, next: NextFunction) {
  try {
    const token = getToken(request);

    await verifyToken(token);

    next();
  } catch (err) {
    throw new AppError(err.message, 401);
  }
}

function getToken(request: Request) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new AppError("Invalid token", 401);
  }

  return authorization.replace("Bearer", "").trim();
}

async function verifyToken(token: string): Promise<User> {
  const { sub: userId } = verify(token, "bded1326bdf4661d3df2736cea7305cec1afb037");

  const user = await client.user.findFirst({
    where: {
      id: userId.toString(),
    },
  });

  if (!user) throw new AppError("User does not exists", 401);

  return user;
}

export default authMiddleware;
