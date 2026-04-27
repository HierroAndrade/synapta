import { Router } from "express";
import rateLimit from "express-rate-limit";
import { DiagnosticoController } from "../controllers/DiagnosticoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const diagnosticoRouter = Router();
const controller = new DiagnosticoController();

// Rate limit específico para essa rota (dados financeiros sensíveis)
const diagnosticoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máx. 10 submissões por IP por janela
  message: { error: "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Ordem: Rate Limit → Auth Middleware → Controller
// Se o rate limit bloqueia, nem chega a verificar o JWT (economia de recurso)
diagnosticoRouter.post(
  "/",
  diagnosticoLimiter,
  authMiddleware,
  (req, res) => controller.salvar(req, res)
);

export { diagnosticoRouter };
