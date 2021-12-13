import { client } from "../prisma/client";
import dayjs from 'dayjs';

class GenerateRefreshToken {
  async execute(userId: string) {
    const expiresIn = dayjs().add(30, 'days').unix();

    const refreshToken = await client.refreshToken.create({
      data: {
        user_id: userId,
        expires_in: expiresIn
      }
    })

    return refreshToken;
  }
}

export default GenerateRefreshToken;
