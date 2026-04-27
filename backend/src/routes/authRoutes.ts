import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";
import rateLimit from "express-rate-limit";

const authRouter = Router();
const authController = new AuthController();

// Implementação direta do manual de segurança - Rate Limiting pesado para rotas de auth (evita Brute Force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, // max 10 requests por IP, dps bloqueia.
  message: { error: "Muitas tentativas. Tente novamente mais tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

// A interface burra manda os dados pra cá
// Necessária adaptação bind para não perder o escopo do 'this' na classe
authRouter.post("/register", authLimiter, authController.register.bind(authController));
authRouter.post("/login", authLimiter, authController.login.bind(authController));
authRouter.post("/logout", authController.logout.bind(authController));
authRouter.get("/me", authMiddleware, authController.me.bind(authController));

export { authRouter };
