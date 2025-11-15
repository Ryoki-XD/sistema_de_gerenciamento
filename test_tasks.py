import json
from models import Tarefa

def get_auth_token(client):
    """
    Função auxiliar para fazer login e obter um token JWT.
    Requer que o 'init_database' tenha sido executado.
    """
    login_data = {
        "email": "teste@email.com",
        "senha": "Senha@123"
    }
    response = client.post('/api/auth/login',
                           data=json.dumps(login_data),
                           content_type='application/json')
    
    assert response.status_code == 200 
    data = response.get_json()
    return data['access_token']


def test_create_task_success(client, init_database):
    """
    Testa se um usuário logado pode criar uma tarefa (deve retornar 201).
    """
    
    token = get_auth_token(client)
    
    task_data = {
        "titulo": "Minha Tarefa de Teste",
        "descricao": "Esta é uma descrição longa o suficiente."
    }
    
    response = client.post('/api/tasks',
                           data=json.dumps(task_data),
                           content_type='application/json',
                           headers={'Authorization': f'Bearer {token}'}) # Cabeçalho de Auth
    
    
    assert response.status_code == 201
    data = response.get_json()
    assert data['mensagem'] == "Tarefa criada com sucesso!"
    assert data['tarefa']['titulo'] == "Minha Tarefa de Teste"

def test_list_tasks_success(client, init_database):
    """
    Testa se um usuário logado pode listar SUAS próprias tarefas (deve retornar 200).
    'init_database' criou 2 tarefas para o 'teste@email.com'.
    """
  
    token = get_auth_token(client)
    
    response = client.get('/api/tasks',
                          headers={'Authorization': f'Bearer {token}'})
    
    
    assert response.status_code == 200
    data = response.get_json()
    
    assert len(data['tarefas']) == 2
    assert data['tarefas'][0]['titulo'] == "Tarefa Teste 2" 
    assert data['tarefas'][1]['titulo'] == "Tarefa Teste 1"

def test_delete_task_unauthorized(client, init_database):
    """
    Testa se um usuário NÃO PODE deletar a tarefa de outro usuário.
    (Neste teste, não criamos um segundo usuário, apenas simulamos
    a tentativa de acessar uma tarefa que não é nossa - o que o
    'init_database' faz).
    
    A lógica aqui é um pouco diferente: vamos tentar deletar a tarefa de
    um usuário que não existe, mas o teste principal é
    verificar se um usuário não logado é bloqueado.
    """
   
    response = client.delete('/api/tasks/1')
    
  
    assert response.status_code == 401 

def test_delete_task_success(client, init_database, app):
    """
    Testa se um usuário logado PODE deletar sua própria tarefa.
    """
    token = get_auth_token(client)
    
    with app.app_context():
        tarefa = Tarefa.query.filter_by(titulo="Tarefa Teste 1").first()
        assert tarefa is not None
        task_id = tarefa.id

    
    response = client.delete(f'/api/tasks/{task_id}',
                             headers={'Authorization': f'Bearer {token}'})
    
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['mensagem'] == "Tarefa deletada com sucesso"

    
    response_lista = client.get('/api/tasks',
                                headers={'Authorization': f'Bearer {token}'})
    data_lista = response_lista.get_json()
    assert len(data_lista['tarefas']) == 1 