import { Request, Response } from "express";
import { DiagnosticoSchema } from "../domain/diagnosticoSchemas";
import { DiagnosticoService } from "../services/DiagnosticoService";

const diagnosticoService = new DiagnosticoService();

export class DiagnosticoController {
  async salvar(req: Request, res: Response): Promise<void> {
    try {
      // 1. Validar payload com Zod (Diretriz de Segurança)
      const dados = DiagnosticoSchema.parse(req.body);

      // 2. Extrair userId real do JWT (injetado pelo authMiddleware)
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "Usuário não autenticado." });
        return;
      }

      // 3. Delegar ao service repassando o token para RLS
      const token = req.cookies.sb_token;
      const resultado = await diagnosticoService.processar(userId, dados, token);

      res.status(200).json(resultado);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Dados inválidos.", details: error.errors });
        return;
      }
      // Nunca expor detalhes internos ao cliente
      console.error("[DiagnosticoController]", error.message);
      res.status(500).json({ error: "Não foi possível processar seu diagnóstico." });
    }
  }
}
