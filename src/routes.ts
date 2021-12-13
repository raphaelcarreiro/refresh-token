import { Request, Response, Router } from "express";
import authMiddleware from "./http/middlewares/AuthMiddleware";
import AuthenticateUserController from "./useCases/authenticateUser/AuthenticateUserController";
import CreateUserController from "./useCases/createUser/CreateUserController";

const router = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();

router.post("/users", createUserController.handle);
router.post("/login", authenticateUserController.handle);

router.use(authMiddleware);

router.get("/courses", (request: Request, response: Response) => {
  return response.json([
    { id: 1, name: "React Native" },
    { id: 2, name: "React JS" },
    { id: 3, name: "Flutter" },
  ]);
});

export default router;
