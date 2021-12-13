import { client } from "../../prisma/client";
import { hash } from "bcryptjs";

interface IUserRequest {
  name: string;
  password: string;
  username: string;
}

class CreateUserUseCase {
  async execute(request: IUserRequest) {
    const exists = await client.user.findFirst({
      where: {
        username: request.username,
      },
    });

    if (exists) {
      throw new Error("Esse usuário já existe");
    }

    const hashedPassword = await hash(request.password, 8);

    const user = client.user.create({
      data: {
        name: request.name,
        username: request.username,
        password: hashedPassword,
      },
    });

    return user;
  }
}

export { CreateUserUseCase };
