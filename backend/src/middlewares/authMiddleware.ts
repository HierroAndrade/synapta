import { Request, Response, NextFunction } from "express";
import { authRepository } from "../repositories/AuthRepository";

/**
 * Middleware de Autenticação (Diretriz de Segurança §2 e §4)
 *
 * Verifica o JWT do Supabase em toda rota protegida.
 * Extrai o user_id real e injeta em req.userId.
 * Nunca confia no frontend — utiliza a Camada 4 (Repository) para validar.
 */

// Estender o tipo Request para incluir userId e user object
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Priorizar Token via Cookie (Diretriz de Segurança §4)
  const token = req.cookies?.sb_token;

  if (!token) {
    res.status(401).json({ error: "Acesso negado. Sessão não encontrada." });
    return;
  }

  try {
    const user = await authRepository.validateToken(token);

    if (!user) {
      res.status(401).json({ error: "Sessão expirada ou inválida. Faça login novamente." });
      return;
    }

    // Injeta o userId validado na request para as camadas seguintes usarem
    req.userId = user.id;
    req.user = user;
    next();
  } catch (err) {
    console.error("[AuthMiddleware] Erro inesperado:", err);
    res.status(500).json({ error: "Erro ao verificar autenticação." });
  }
}
