# TRI — Sistema de Triagem

Aplicativo para ajudar cidadãos a identificar a urgência dos seus sintomas e
serem encaminhados para o atendimento/profissional correto, otimizando o
fluxo de hospitais e unidades de saúde.

**Este projeto é um MVP funcional**, pensado para rodar localmente e servir
de base para evolução (validações extras, ambiente de produção, revisão por
profissionais de saúde da lógica de triagem etc).

## Arquitetura

- **Front-end**: React (Vite) + React Router — `tri-frontend/`
- **Back-end**: Go (Gin) + JWT — `tri-backend/`
- **Banco de dados**: MongoDB (NoSQL) — coleções `users` e `triage_records`

## Fluxo do app

1. Cadastro/login (nome de usuário, e-mail, senha)
2. Hub inicial: botão "Iniciar triagem", botão "Ver histórico", explicação
   do fluxo em tópicos e disclaimer médico
3. Triagem: seleção de sintomas → dor/tempo de evolução → resultado com
   nível de prioridade (Emergência / Urgente / Pouco urgente / Não urgente),
   inspirado no Protocolo de Manchester usado no SUS
4. Toda triagem concluída é **salva automaticamente** no histórico do usuário

## Como rodar

### 1. MongoDB

Suba um MongoDB local (ou use um cluster gratuito no MongoDB Atlas):

```bash
docker run -d -p 27017:27017 --name tri-mongo mongo:7
```

### 2. Back-end (Go)

```bash
cd tri-backend
cp .env.example .env
# edite JWT_SECRET no .env para um valor seguro
go mod tidy
go run main.go
```

O servidor sobe em `http://localhost:8080`.

### 3. Front-end (React)

```bash
cd tri-frontend
cp .env.example .env
npm install
npm run dev
```

O app sobe em `http://localhost:5173`.

## Endpoints da API

| Método | Rota                 | Autenticado | Descrição                          |
|--------|-----------------------|:-----------:|-------------------------------------|
| POST   | `/api/auth/register`  | não         | Cria usuário e retorna JWT          |
| POST   | `/api/auth/login`     | não         | Autentica e retorna JWT             |
| GET    | `/api/triage/symptoms`| não         | Catálogo de sintomas do formulário  |
| POST   | `/api/triage`         | sim         | Executa a triagem e salva no histórico |
| GET    | `/api/history`        | sim         | Lista as triagens do usuário logado |

## Identidade visual

- Cores: branco (`#ffffff`) e verde escuro (`#0b3d2e`, com tons intermediários)
- Tipografia: Fraunces (títulos) + Inter (corpo/UI)
- Elemento de assinatura: uma linha de pulso (ECG) usada como divisor visual,
  reforçando o tema de saúde

## Deploy (Render)

Este projeto já vem com um `render.yaml` na raiz, configurado para subir o
back-end (Go) e o front-end (site estático) na [Render](https://render.com)
de uma vez, usando o plano gratuito.

1. Suba o projeto para um repositório no GitHub.
2. Em [render.com](https://render.com), entre com sua conta do GitHub.
3. Clique em **New +** → **Blueprint**, selecione o repositório — a Render
   detecta o `render.yaml` automaticamente.
4. Preencha as variáveis pedidas: `MONGO_URI` (a connection string do seu
   MongoDB Atlas), `VITE_API_URL` (ex: `https://tri-backend.onrender.com/api`)
   e `FRONTEND_URL` (ex: `https://tri-frontend.onrender.com`).
5. Clique em **Deploy Blueprint** e aguarde os dois serviços subirem.

No plano gratuito, o backend "dorme" após ~15 min sem uso e demora alguns
segundos para acordar na primeira requisição — isso é normal.

## Próximos passos sugeridos

- Validação clínica da lógica de pontuação de risco por profissionais de saúde
- Refresh token / expiração de sessão mais robusta
- Painel para hospitais acompanharem triagens em tempo real
- Testes automatizados (Go: `testing`; React: Vitest)
