## 1. Prevenção de Abuso de Reembolso (Refund Abuse)

- [ ] **Exigência de CPF:** Para processar qualquer reembolso (Art. 49 CDC), o usuário deve obrigatoriamente fornecer e validar o CPF. Isso permite o rastreio de usuários recorrentes.
- [ ] **Blacklist de Reincidentes:** Se um CPF solicitar reembolso mais de uma vez para o mesmo produto, a conta deve ser marcada para revisão manual ou bloqueio automático de novas assinaturas.
- [ ] **Log de Visualização:** Registrar se o usuário acessou informações sensíveis (como a Carteira Recomendada) antes de solicitar o reembolso, para identificar padrões de má-fé.
- [ ] **Integração com Gateway:** Utilizar as ferramentas de proteção contra fraude do gateway (ex: Stripe Radar) para identificar cartões de crédito associados a múltiplos reembolsos.
