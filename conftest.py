import pytest
from app import app as flask_app  
from extensions import db
from models import Usuario, Tarefa


TEST_DATABASE_URI = 'sqlite:///:memory:' 

@pytest.fixture(scope='session')
def app():
    """
    Configura o aplicativo Flask para testes.
    Isso roda UMA VEZ por sessão de teste.
    """
    
    flask_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": TEST_DATABASE_URI,
        "JWT_SECRET_KEY": "test-secret-key",
        "JWT_CSRF_PROTECTION": False, 
    })

    
    with flask_app.app_context():
        db.create_all() 

    yield flask_app  
    with flask_app.app_context():
        db.drop_all()

@pytest.fixture()
def client(app):
    """
    Cria um "navegador falso" (cliente de teste) para cada teste.
    Isso roda ANTES de cada função de teste.
    """
    return app.test_client()

@pytest.fixture()
def runner(app):
    """
    Um runner para testar comandos de CLI (não vamos usar, mas é bom ter).
    """
    return app.test_cli_runner()

@pytest.fixture(scope='function')
def init_database(app):
    """
    Um fixture que limpa o banco e adiciona dados de teste ANTES de cada teste.
    Garante que cada teste comece com um banco limpo.
    """
    with app.app_context():
      
        db.drop_all()
        db.create_all()

        u1 = Usuario(nome='Usuario de Teste', email='teste@email.com')
        u1.set_senha('Senha@123')
        
        db.session.add(u1)
        db.session.commit()
        
    
        t1 = Tarefa(titulo='Tarefa Teste 1', descricao='Desc 1', criador_id=u1.id)
        t2 = Tarefa(titulo='Tarefa Teste 2', descricao='Desc 2', status='Concluída', criador_id=u1.id)
        
        db.session.add_all([t1, t2])
        db.session.commit()

    yield db 
    with app.app_context():
        db.drop_all()