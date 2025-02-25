# 💰 Sistema de Gerenciamento Financeiro

API simples para controle de transações financeiras (entradas e saídas).

## 🚀 Tecnologias

- Node.js
- Express
- MongoDB Atlas
- JWT (Autenticação)
- Bcrypt (Hash de senhas)
- Joi (Validação)

---

## 📦 Instalação

```bash
git clone https://github.com/natemaciel7/financeiro-backend.git
cd financeiro-backend
npm install
Crie um arquivo .env:


DATABASE_URL=mongodb+srv://natalia:dinossauroreX7*@financeiro.ni58g.mongodb.net/?retryWrites=true&w=majority&appName=financeiro
JWT_SECRET=9f66505c-fd7b-43f2-90eb-570977d2083e
PORT=5000
Inicie o servidor:

npm run dev
🔑 Rotas Principais
Autenticação
POST /auth/sign-up → Cadastra um novo usuário
POST /auth/sign-in → Realiza o login e retorna um token JWT
Transações (Requer Token JWT)
POST /transactions → Adiciona uma transação
GET /transactions → Lista todas as transações
🌍 Deploy
Link do Deploy: https://financeiro-backend-1.onrender.com


```
