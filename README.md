# Desafio Técnico Full Stack - PonteTech (Gerenciador de Tarefas)

Este é um sistema de gerenciamento de tarefas simples, desenvolvido como parte do desafio técnico Full Stack.

O projeto inclui um backend completo em **Python (Flask)** com uma API RESTful e um frontend simples renderizado pelo servidor (Flask/Jinja2) com **HTML, CSS e JavaScript**.

---

## 🚀 Funcionalidades Implementadas

### Backend (API)
* **Autenticação:** Cadastro (`/api/auth/register`) e Login (`/api/auth/login`) com tokens **JWT**.
* **Senhas:** Armazenadas com segurança usando **bcrypt**.
* **Tarefas (CRUD):**
    * `POST /api/tasks` (Criar)
    * `GET /api/tasks` (Listar)
    * `GET /api/tasks/:id` (Ver detalhes)
    * `PUT /api/tasks/:id` (Atualizar status)
    * `DELETE /api/tasks/:id` (Deletar)
* **Segurança:** Rotas de tarefas protegidas, permitindo que usuários acessem apenas suas próprias tarefas.
* **Dashboard:** Rota `/api/dashboard` que conta tarefas por status.
* **Filtros:** A rota `GET /api/tasks` aceita filtros por `?status=` e `?prioridade=`.
* **Ordenação:** A rota `GET /api/tasks` ordena por data de criação (mais novas primeiro).

### Frontend
* Página de **Login** (`/login`)
* Página de **Cadastro** (`/register`)
* Página de **Dashboard** (`/dashboard`)
* Funcionalidade de **Criar** novas tarefas (com Status e Prioridade).
* Funcionalidade de **Atualizar Status** de tarefas (via dropdown).
* Funcionalidade de **Deletar** tarefas.
* Funcionalidade de **Filtrar** tarefas por Status e Prioridade.
* Exibição do **Nome do Criador** e **Data de Criação** em cada tarefa.
* Design responsivo (funciona em mobile).

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Python 3, Flask, Flask-SQLAlchemy
* **Banco de Dados:** SQLite
* **Autenticação:** Flask-JWT-Extended, Flask-Bcrypt
* **Frontend:** HTML5, CSS3, JavaScript (Fetch API)
* **Testes:** Pytest, Pytest-Flask
* **Container:** Docker, Docker Compose

---

## 🏁 Como Rodar o Projeto

Existem duas formas de rodar este projeto: (1) Usando Docker (Recomendado) ou (2) Manualmente com um ambiente virtual Python.

### Método 1: Docker (Recomendado)

Este é o método preferido e mais simples.

**Pré-requisitos:**
* [Docker](https://www.docker.com/products/docker-desktop/) instalado e rodando.

**Instruções:**
1.  Clone este repositório.
2.  Abra um terminal na pasta raiz do projeto.
3.  Execute o comando:
    ```bash
    docker-compose up --build
    ```
4.  O Docker irá construir a imagem, baixar as dependências e iniciar o servidor. **Nota:** O banco de dados estará vazio.
5.  Para popular o banco com dados de teste (usuários e tarefas), abra **outro terminal** e execute:
    ```bash
    # (Windows)
    docker-compose exec web python seed.py
    # (Mac/Linux)
    # docker-compose exec web python3 seed.py
    ```
6.  Acesse **`http://127.0.0.1:5000`** no seu navegador (você será redirecionado para `/login`).

### Método 2: Manualmente (Python venv)

**Pré-requisitos:**
* Python 3.10+ instalado.

**Instruções:**
1.  Clone este repositório e abra um terminal na pasta raiz.
2.  Crie e ative um ambiente virtual:
    ```bash
    # Criar o venv
    python -m venv venv
    # Ativar (Windows)
    .\venv\Scripts\activate
    # Ativar (Mac/Linux)
    # source venv/bin/activate
    ```
3.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
4.  Crie e popule o banco de dados com dados de teste (usuários e tarefas):
    ```bash
    python seed.py
    ```
5.  Inicie o servidor Flask:
    ```bash
    python app.py
    ```
6.  Acesse **`http://127.0.0.1:5000`** no seu navegador.

**Usuário de Teste (criado pelo `seed.py`):**
* **Email:** `admin@teste.com`
* **Senha:** `Teste@123`

---

## 🧪 Como Rodar os Testes

Os testes unitários foram escritos com `pytest` para validar as rotas da API.

1.  Certifique-se de que o ambiente virtual está ativo (`.\venv\Scripts\activate`).
2.  (Opcional) Instale as dependências de teste (já inclusas no `requirements.txt`):
    ```bash
    pip install pytest pytest-flask
    ```
3.  Execute o Pytest na pasta raiz:
    ```bash
    pytest
    ```