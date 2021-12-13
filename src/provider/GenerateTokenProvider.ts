import { sign } from "jsonwebtoken";

class GenerateTokenProvider {
  execute(userId: string): string {
    const token = sign({}, "bded1326bdf4661d3df2736cea7305cec1afb037", {
      subject: userId,
      expiresIn: "20s",
    });

    return token;
  }
}

export default GenerateTokenProvider;