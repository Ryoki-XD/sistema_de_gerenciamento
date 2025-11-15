import json

def test_register_success(client, app):
    """
    Testa se o registro de um NOVO usuário funciona (deve retornar 201).
    """
  
    new_user_data = {
        "nome": "Novo Usuario",
        "email": "novo@email.com",
        "senha": "SenhaForte123"
    }
    
    response = client.post('/api/auth/register',
                           data=json.dumps(new_user_data),
                           content_type='application/json')
    
    
    assert response.status_code == 201 
    data = response.get_json()
    assert data['mensagem'] == "Usuário cadastrado com sucesso!"
    assert data['usuario']['email'] == "novo@email.com"

def test_register_duplicate(client, init_database):
    """
    Testa se o registro de um usuário DUPLICADO falha (deve retornar 409).
    'init_database' garante que o usuário 'teste@email.com' já existe.
    """
    
    duplicate_user_data = {
        "nome": "Outro Usuario",
        "email": "teste@email.com",
        "senha": "SenhaQualquer123"
    }
    
    
    response = client.post('/api/auth/register',
                           data=json.dumps(duplicate_user_data),
                           content_type='application/json')
    
    
    assert response.status_code == 409  
    data = response.get_json()
    assert data['erro'] == "Já possui uma conta associada a esse email"

def test_login_success(client, init_database):
    """
    Testa se o login com credenciais VÁLIDAS funciona (deve retornar 200).
    'init_database' garante que o usuário 'teste@email.com' existe.
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
    assert data['mensagem'] == "Login bem-sucedido!"
    assert 'access_token' in data 

def test_login_failed(client, init_database):
    """
    Testa se o login com senha INCORRETA falha (deve retornar 401).
    """
   
    login_data = {
        "email": "teste@email.com",
        "senha": "SENHA-ERRADA"
    }
    
    
    response = client.post('/api/auth/login',
                           data=json.dumps(login_data),
                           content_type='application/json')
    
    
    assert response.status_code == 401  
    data = response.get_json()
    assert data['erro'] == "Email ou senha inválidos"