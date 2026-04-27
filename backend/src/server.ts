import dotenv from "dotenv";
dotenv.config();
import app from "./app";

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`[Backend Synapta] 🔥 Servidor isolado rodando na porta ${PORT}`);
});
