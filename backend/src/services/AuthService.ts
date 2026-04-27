import { authRepository } from "../repositories/AuthRepository";

/**
 * Esse arquivo (Camada 2 - Use Cases) é o Maestro. 
 * Ele orquestra regras de negócio pesadas, mas é Cego sobre qual banco de dados usamos.
 * Ele pega os repositórios (trabalhadores) e manda eles executarem tarefas baseadas em lógica.
 */

export class AuthService {
  private authRepository = authRepository;

  async processRegistration(email: string, pass: string, fullName: string) {
    // Aqui no futuro adicionaremos regras de negócio puras como:
    // 1. Enviar um e-mail de boas vindas com NodeMailer
    // 2. Chamar o webhook da RD Station/ActiveCampaign
    // 3. Cadastrar dados analíticos no Mixpanel
    
    // Deleta para o repositório fazer hard DB writing
    const user = await this.authRepository.register(email, pass, fullName);
    
    return user;
  }

  async processLogin(email: string, pass: string) {
    try {
      const user = await this.authRepository.login(email, pass);
      // Aqui poderíamos logar metadados de entrada (Data, IP) criando outra chamada de repository.
      return user;
    } catch (err: any) {
      if (err.message === "CREDENTIALS_REJECTED") {
         throw new Error("E-mail ou senha incorretos.");
      }
      throw new Error("Não foi possível conectar ao banco de dados. Verifique sua conexão ou tente novamente mais tarde.");
    }
  }
}
