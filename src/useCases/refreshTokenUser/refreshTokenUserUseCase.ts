import { RefreshToken, User } from "@prisma/client";
import dayjs from "dayjs";
import { AppError } from "../../errors/AppError";
import { client } from "../../prisma/client";
import GenerateRefreshToken from "../../provider/GenerateRefreshToken";
import GenerateTokenProvider from "../../provider/GenerateTokenProvider";

class RefreshTokenUserUseCase {
    async execute(refreshTokenId: string) {
      const refreshToken = await this.findRefreshToken(refreshTokenId);

      const expired = this.checkRefreshTokenIsExpired(refreshToken.expires_in);

      if (expired) {
        await this.deleteUserRefreshTokens(refreshToken.user_id);
        const newRefreshToken = await this.createRefreshToken(refreshToken.user_id);
        const token = await this.generateToken(refreshToken.user_id);

        return {
          token,
          refresh_token: newRefreshToken,
        }
      }

      const token = await this.generateToken(refreshToken.user_id);

      return {
        token,
      };
    }

    private async deleteUserRefreshTokens(userId: string): Promise<void> {
      await client.refreshToken.deleteMany({
        where: {
          user_id: userId
        }
      })
    }

    private checkRefreshTokenIsExpired(expiresIn: number): boolean {
      const expired = dayjs().isAfter(dayjs.unix(expiresIn));

      if (expired) {
        return true;
      }

      return false;
    }

    private async findRefreshToken(refreshTokenId: string): Promise<RefreshToken> {
      const refreshToken = await client.refreshToken.findFirst({
        where: {
          id: refreshTokenId,
        }
      });

      if (!refreshToken) {
        throw new AppError('Refresh token não encontrado', 404);
      }

      return refreshToken;
    }

    private async generateToken(userId: string) {
      const generateTokenProvider = new GenerateTokenProvider();
      return generateTokenProvider.execute(userId);
    }

    private async createRefreshToken(userId: string): Promise<RefreshToken> {
      const generateRefreshToken = new GenerateRefreshToken();
      return await generateRefreshToken.execute(userId);
    }
}

export default RefreshTokenUserUseCase;