from flask import Flask, request, jsonify, render_template, redirect, url_for
from config import Config
from extensions import db, bcrypt, jwt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import Usuario, Tarefa
from sqlalchemy import func, desc
from sqlalchemy.orm import joinedload 

app = Flask(__name__)
app.config.from_object(Config)


app.config["JWT_SECRET_KEY"] = "uma-chave-secreta-muito-dificil-de-adivinhar"
app.config["JWT_CSRF_PROTECTION"] = False


db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)



@app.route('/')
def index():
    return redirect(url_for('login_page'))

@app.route('/login')
def login_page():
    return render_template("login.html")

@app.route('/register')
def register_page():
    return render_template("register.html")

@app.route('/dashboard')
def dashboard_page():
    return render_template("dashboard.html")



@app.route('/api/auth/register', methods=['POST'])
def register():
    dados = request.get_json()

    if not dados:
        return jsonify({"error": "Nenhum dado fornecido"}), 400
    
    nome = dados.get('nome')
    email = dados.get('email')
    senha = dados.get('senha')

    if not nome or not email or not senha:
        return jsonify({"erro": "Campos obrigatórios ausentes"}), 400
    
    if len(nome) < 3:
        return jsonify({"erro": "Nome deve ter pelo menos 3 caracteres"}), 400
    
    if len(senha) < 8:
        return jsonify({"erro": "Senha deve ter pelo menos 8 caracteres"}), 400

    usuario_existente = Usuario.query.filter_by(email=email).first()
    
    if usuario_existente:
        return jsonify({"erro":"Já possui uma conta associada a esse email"}), 409

    novo_usuario = Usuario(nome=nome, email=email)
    novo_usuario.set_senha(senha)
    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({
        "mensagem": "Usuário cadastrado com sucesso!",
        "usuario":{
            "id": novo_usuario.id,
            "nome": novo_usuario.nome,
            "email": novo_usuario.email
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    dados = request.get_json()

    if not dados:
        return jsonify({"erro": "Nenhum dado fornecido"}), 400

    email = dados.get('email')
    senha = dados.get('senha')

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not usuario.check_senha(senha):
        return jsonify({"erro": "Email ou senha inválidos"}), 401 

    access_token = create_access_token(identity=str(usuario.id))
    
    return jsonify({
        "mensagem": "Login bem-sucedido!",
        "access_token": access_token
    }), 200

@app.route('/api/tasks', methods=['POST'])
@jwt_required()
def create_task():
    id_usuario_logado = int(get_jwt_identity())
    usuario_logado = Usuario.query.get(id_usuario_logado)
    
    dados = request.get_json()

    if not dados:
        return jsonify({"erro": "Nenhum dado fornecido"}), 400
    
    titulo = dados.get('titulo')
    descricao = dados.get('descricao')
    prioridade = dados.get('prioridade', 'Média') 
    status = dados.get('status', 'Pendente')

    if not titulo or not descricao:
        return jsonify({"erro": "Título e descrição são obrigatórios"}), 400
    
    if len(titulo) < 3:
        return jsonify({"erro": "Título deve ter pelo menos 3 caracteres"}), 400
    if len(titulo) > 100:
        return jsonify({"erro": "Título deve ter no máximo 100 caracteres"}), 400
    

    if len(descricao) < 10:
        return jsonify({"erro": "Descrição deve ter pelo menos 10 caracteres"}), 400
    if len(descricao) > 500:
        return jsonify({"erro": "Descrição deve ter no máximo 500 caracteres"}), 400
    
    nova_tarefa = Tarefa(
        titulo=titulo,
        descricao=descricao,
        criador_id=id_usuario_logado,
        prioridade=prioridade,
        status=status
    )
    db.session.add(nova_tarefa)
    db.session.commit()

    return jsonify({
        "mensagem": "Tarefa criada com sucesso!",
        "tarefa": {
            "id": nova_tarefa.id,
            "titulo": nova_tarefa.titulo,
            "status": nova_tarefa.status,
            "prioridade": nova_tarefa.prioridade, 
            "criador_id": nova_tarefa.criador_id,
            "criador_nome": usuario_logado.nome
        }
    }), 201

@app.route('/api/tasks', methods=['GET'])
@jwt_required()
def list_tasks():
    id_usuario_logado = int(get_jwt_identity())

   
    query = Tarefa.query.options(joinedload(Tarefa.criador)).filter_by(criador_id=id_usuario_logado)

    filtro_status = request.args.get('status')
    filtro_prioridade = request.args.get('prioridade')
    

    if filtro_status:
        query = query.filter_by(status=filtro_status)
    
    if filtro_prioridade:
        query = query.filter_by(prioridade=filtro_prioridade)

   
    query = query.order_by(desc(Tarefa.created_at))
    
    tarefas = query.all()

    lista_de_tarefas_serializadas = []
    for tarefa in tarefas:
        lista_de_tarefas_serializadas.append({
            "id": tarefa.id,
            "titulo": tarefa.titulo,
            "descricao": tarefa.descricao,
            "status": tarefa.status,
            "prioridade": tarefa.prioridade,
            "created_at": tarefa.created_at.isoformat() if tarefa.created_at else None,
            "criador_nome": tarefa.criador.nome,
            
        })

    return jsonify({
        "tarefas": lista_de_tarefas_serializadas
    }), 200

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task_detail(task_id):
    id_usuario_logado = int(get_jwt_identity())
    

    tarefa = Tarefa.query.options(joinedload(Tarefa.criador)).get_or_404(task_id)

    if tarefa.criador_id != id_usuario_logado:
        return jsonify({"erro": "Acesso não autorizado"}), 403
    
    return jsonify({
        "tarefa":{
            "id": tarefa.id,
            "titulo": tarefa.titulo,
            "descricao": tarefa.descricao,
            "status": tarefa.status,
            "prioridade": tarefa.prioridade,
            "created_at": tarefa.created_at.isoformat() if tarefa.created_at else None,
            "updated_at": tarefa.updated_at.isoformat() if tarefa.updated_at else None,
            "criador_nome": tarefa.criador.nome
            
        }
    }), 200

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    id_usuario_logado = int(get_jwt_identity())
    tarefa = Tarefa.query.get_or_404(task_id)
    
    if tarefa.criador_id != id_usuario_logado:
        return jsonify({"erro": "Acesso não autorizado"}), 403
    
    dados = request.get_json()
    

    
    if 'status' in dados:
        novo_status = dados.get('status')
        status_permitidos = ['Pendente', 'Em Progresso', 'Concluída']
        if not novo_status or novo_status not in status_permitidos:
            return jsonify({"erro": "Status inválido"}), 400
        
        status_atual = tarefa.status
        if status_atual == 'Concluída':
            return jsonify({"erro": "Não é permitido alterar tarefas concluídas"}), 403
        if status_atual == 'Em Progresso' and novo_status == 'Pendente':
            return jsonify({"erro":"Tarefas 'Em Progresso' não podem voltar para 'Pendente'"}), 400
        
        tarefa.status = novo_status

    db.session.commit()
    db.session.refresh(tarefa)

    return jsonify({
        "mensagem":"Tarefa atualizada com sucesso!",
        "tarefa":{
            "id": tarefa.id,
            "titulo": tarefa.titulo,
            "status": tarefa.status,
            "updated_at": tarefa.updated_at.isoformat() if tarefa.updated_at else None
        }
    }), 200

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    id_usuario_logado = int(get_jwt_identity())
    tarefa = Tarefa.query.get_or_404(task_id)

    if tarefa.criador_id != id_usuario_logado:
        return jsonify({"erro": "Acesso não autorizado"}), 403

    db.session.delete(tarefa)
    db.session.commit()
    
    return jsonify({"mensagem": "Tarefa deletada com sucesso"}), 200

@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    id_usuario_logado = int(get_jwt_identity())

    contagem_status = db.session.query(
        Tarefa.status, func.count(Tarefa.status)
    ).filter_by(
        criador_id=id_usuario_logado
    ).group_by(
        Tarefa.status
    ).all()

    resumo_status = {
        'Pendente': 0,
        'Em Progresso': 0,
        'Concluída': 0
    }
    for status, contagem in contagem_status:
        resumo_status[status] = contagem

    return jsonify({
        "status_counts": resumo_status
    }), 200


if __name__ == '__main__':
    app.run(debug=True)