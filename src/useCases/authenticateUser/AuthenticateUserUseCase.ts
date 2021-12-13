import { client } from "../../prisma/client";
import { compare } from "bcryptjs";
import { RefreshToken, User } from "@prisma/client";
import { sign } from "jsonwebtoken";
import GenerateRefreshToken from "../../provider/GenerateRefreshToken";
import GenerateTokenProvider from "../../provider/GenerateTokenProvider";

interface IRequest {
  username: string;
  password: string;
}

interface AuthenticateUserResponse {
  refresh_token: RefreshToken;
  token: string;
}

class AuthenticateUserUseCase {
  async execute({ username, password }: IRequest): Promise<AuthenticateUserResponse> {
    const user = await this.findUser(username);

    await this.checkPassword(password, user.password);

    const token = this.createToken(user.id);

    const refreshToken  = await this.createRefreshToken(user.id);

    return {
      refresh_token: refreshToken,
      token,
    }
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
    const generateTokenProvider = new GenerateTokenProvider();

    return generateTokenProvider.execute(userId);
  }

  private async createRefreshToken(userId: string): Promise<RefreshToken> {
    await this.deleteRefreshTokens(userId);

    const generateRefreshToken = new GenerateRefreshToken();

    return await generateRefreshToken.execute(userId);
  }

  private async deleteRefreshTokens(userId: string): Promise<void> {
    await client.refreshToken.deleteMany({
      where: {
        user_id: userId,
      }
    })
  }
}

export default AuthenticateUserUseCase;
