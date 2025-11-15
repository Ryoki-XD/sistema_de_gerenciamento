from app import app
from extensions import db
from models import Usuario, Tarefa

SENHA_PADRAO = "Teste@123"

def seed_data():
    print("Iniciando o seeding do banco de dados...")

    db.create_all()

    Tarefa.query.delete()
    Usuario.query.delete()
    print("Dados antigos limpos.")
    
    u1 = Usuario(nome= 'Admin Teste', email='admin@teste.com')
    u1.set_senha(SENHA_PADRAO)
    u2 = Usuario(nome= 'João Silva', email='joao@teste.com')
    u2.set_senha(SENHA_PADRAO)
    u3 = Usuario(nome= 'Maria Santos', email='maria@teste.com')
    u3.set_senha(SENHA_PADRAO)

    db.session.add_all([u1, u2, u3])
    db.session.commit()
    print("Usuários de teste criados.")

    t1 = Tarefa(titulo='Configurar projeto', descricao='Criar estrutura inicial do projeto', status='Concluída', prioridade='Alta', criador_id=u1.id)
    t2 = Tarefa(titulo='Implementar autenticação', descricao='Criar sistema de login e registro', status='Em Progresso', prioridade='Alta', criador_id=u1.id)
    t3 = Tarefa(titulo='Criar dashboard', descricao='Página principal com lista de tarefas', status='Pendente', prioridade='Média', criador_id=u1.id)
    
    t4 = Tarefa(titulo='Adicionar filtros', descricao='Filtrar tarefas por status e prioridade', status='Pendente', prioridade='Baixa', criador_id=u2.id)
    t5 = Tarefa(titulo='Escrever testes', descricao='Testes unitários do backend', status='Pendente', prioridade='Alta', criador_id=u2.id)
    t6 = Tarefa(titulo='Dockerizar aplicação', descricao='Criar Docker Compose', status='Pendente', prioridade='Média', criador_id=u2.id)
    
    t7 = Tarefa(titulo='Documentar API', descricao='Escrever README completo', status='Pendente', prioridade='Alta', criador_id=u3.id)
    t8 = Tarefa(titulo='Corrigir bugs', descricao='Revisar e corrigir problemas encontrados', status='Pendente', prioridade='Baixa', criador_id=u3.id)

    db.session.add_all([t1,t2,t3,t4,t5,t6,t7,t8])
    db.session.commit()
    
    print("Tarefas de exemplo criadas.")
    print("Seeding concluído com sucesso!")
    

if __name__ == '__main__':
    with app.app_context():
        seed_data()