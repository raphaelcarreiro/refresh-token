import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
  async handle(request: Request, response: Response) {
    const { body } = request;

    const createUserUseCase = new CreateUserUseCase();

    const user = await createUserUseCase.execute(body);

    return response.json(user);
  }
}

export default CreateUserController;
