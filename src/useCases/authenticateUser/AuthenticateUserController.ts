import { Request, Response } from "express";
import AuthenticateUserUseCase from "./AuthenticateUserUseCase";

class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const authenticateUserUseCase = new AuthenticateUserUseCase();

    const payload = request.body;

    const token = await authenticateUserUseCase.execute(payload);

    return response.json({ token });
  }
}

export default AuthenticateUserController;
