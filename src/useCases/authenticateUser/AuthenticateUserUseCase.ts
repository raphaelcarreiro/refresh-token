import { client } from "../../prisma/client";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";
import { sign } from "jsonwebtoken";

interface IRequest {
  username: string;
  password: string;
}

interface AuthenticateUserResponse {
  user: User;
  token: string;
}

class AuthenticateUserUseCase {
  async execute({ username, password }: IRequest): Promise<string> {
    const user = await this.findUser(username);
    await this.checkPassword(password, user.password);
    const token = this.createToken(user.id);

    return token;
  }

  private async findUser(username: string): Promise<User> {
    const user = await client.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new Error("Usuário ou senha inválido");
    }

    return user;
  }

  private async checkPassword(password: string, hash: string) {
    const matched = await compare(password, hash);

    if (!matched) {
      throw new Error("Usuário ou senha inválido");
    }
  }

  private createToken(userId: string): string {
    const token = sign({}, "bded1326bdf4661d3df2736cea7305cec1afb037", {
      subject: userId,
      expiresIn: "20s",
    });

    return token;
  }
}

export default AuthenticateUserUseCase;
