# 🎟️ Smart Ticket API

A **Smart Ticket API** é uma aplicação backend desenvolvida com **Node.js**, **Express** e **TypeScript**, que oferece uma solução completa para o gerenciamento de eventos, locais, ingressos, reservas e usuários. A API está estruturada com uma arquitetura em camadas, garantindo escalabilidade, organização e facilidade de manutenção.

## 🚀 Funcionalidades

A API permite as seguintes operações:

* 👥 **Usuários**

  * Registro e login de usuários com autenticação JWT.
  * Atualização e remoção de contas.
  * Suporte para diferentes papéis: `admin`, `organizer`, `client`.

* 🗓️ **Eventos**

  * Criação, listagem, atualização e exclusão de eventos.
  * Filtros por data, local e categoria.

* 📍 **Locais**

  * Cadastro de locais onde os eventos serão realizados.
  * CRUD completo de locais.

* 🎫 **Ingressos**

  * Cadastro de tipos de ingresso para cada evento.
  * Controle de quantidade disponível.

* 📦 **Reservas**

  * Criação de reservas de ingressos com controle de estoque.
  * Cancelamento e listagem de reservas por usuário.

## 🧰 Tecnologias Utilizadas

* **Node.js + Express**
* **TypeScript**
* **Sequelize (ORM) + PostgreSQL**
* **Swagger (Documentação)**
* **JWT (Autenticação)**
* **Dotenv (Configuração de ambiente)**

## 📄 Documentação da API

A documentação completa da API está disponível via **Swagger**:
➡️ [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)

## 🛠️ Como executar o projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o arquivo `.env` com suas variáveis:

   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=eventmanager
   JWT_SECRET=sua_chave_secreta
   ```

4. Rode as migrações:

   ```bash
   npx sequelize-cli db:migrate
   ```

5. Inicie o servidor:

   ```bash
   npm run dev
   ```


