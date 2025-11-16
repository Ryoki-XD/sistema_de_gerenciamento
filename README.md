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
    * `PUT /api/tasks/:id` (Atualizar status, título, descrição e prioridade)
    * `DELETE /api/tasks/:id` (Deletar)
* **Segurança:** Rotas de tarefas protegidas, permitindo que usuários acessem apenas suas próprias tarefas.
* **Dashboard:** Rota `/api/dashboard` que conta tarefas por status.
* **Filtros e Busca:** A rota `GET /api/tasks` aceita filtros por:
    * `?status=`
    * `?prioridade=`
    * `?search=` (busca por título)
    * `?date=` (busca por data de criação)
    * `?order=` (asc/desc)

### Frontend
* Página de **Login** (`/login`)
* Página de **Cadastro** (`/register`) com validação de formato de email (Regex).
* Página de **Dashboard** (`/dashboard`)
* Funcionalidade de **Criar** novas tarefas (com Status e Prioridade).
* Funcionalidade de **Editar** Título, Descrição e Prioridade (em linha).
* Funcionalidade de **Atualizar Status** de tarefas (via dropdown).
* Funcionalidade de **Deletar** tarefas.
* **Filtro Dropdown** completo com busca por Título, Data, Status e Prioridade.
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
3.  Execute o comando para construir e iniciar o servidor:
    ```bash
    docker-compose up --build
    ```
4.  O Docker irá construir a imagem e iniciar o servidor. O banco de dados estará **vazio**.
5.  Para popular o banco com os dados de teste (como pedido no desafio), abra **outro terminal** e execute:
    ```bash
    # (No Windows)
    docker-compose exec web python seed.py
    
    # (No Mac/Linux)
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
4.  **Execute o script de seed** para criar e popular o banco de dados (`app.db`) com dados de teste:
    ```bash
    python seed.py
    ```
5.  Inicie o servidor Flask:
    ```bash
    python app.py
    ```
6.  Acesse **`http://127.0.0.1:5000`** no seu navegador.

---

### 👤 Usuário de Teste

O script `seed.py` (executado em qualquer um dos métodos acima) cria o seguinte usuário de teste:

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