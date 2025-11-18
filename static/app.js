document.addEventListener("DOMContentLoaded", function () {
    
    const loginForm = document.getElementById("login-form");
    const errorMessageElement = document.getElementById("error-message");

    if (loginForm) {
        
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
<<<<<<< HEAD

=======
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925
            errorMessageElement.style.display = "none";
            errorMessageElement.textContent = "";

            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: email, senha: senha }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("access_token", data.access_token);
                    window.location.href = "/dashboard";
                } else {
                    errorMessageElement.textContent = data.erro || "Ocorreu um erro.";
                    errorMessageElement.style.display = "block";
                }

            } catch (error) {
                console.error("ERRO NO CATCH DO LOGIN:", error);
                errorMessageElement.textContent = `Erro de conexão (catch): ${error.message}`;
                errorMessageElement.style.display = "block";
            }
        });
    }

    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const regErrorElement = document.getElementById("error-message"); 
            regErrorElement.style.display = "none";
            regErrorElement.textContent = "";

            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            if (nome.length < 3) {
                regErrorElement.textContent = "Nome deve ter pelo menos 3 caracteres.";
                regErrorElement.style.display = "block";
                return;
            }
            if (senha.length < 8) {
                regErrorElement.textContent = "Senha deve ter pelo menos 8 caracteres.";
                regErrorElement.style.display = "block";
                return;
            }
            
            const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            if (!emailRegex.test(email)) {
                regErrorElement.textContent = "Formato de email inválido.";
                regErrorElement.style.display = "block";
                return;
            }

            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ nome: nome, email: email, senha: senha }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Cadastro realizado com sucesso! Você será redirecionado para o login.");
                    window.location.href = "/login"; 

                } else {
                    regErrorElement.textContent = data.erro || "Ocorreu um erro no cadastro.";
                    regErrorElement.style.display = "block";
                }

            } catch (error) {
                console.error("ERRO NO CATCH DO CADASTRO:", error);
                regErrorElement.textContent = `Erro de conexão (catch): ${error.message}`;
                regErrorElement.style.display = "block";
            }
        });
    }
    
<<<<<<< HEAD
=======
    
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925
    const taskListContainer = document.getElementById("task-list-container");
    
    if (taskListContainer) {
        
        const token = localStorage.getItem("access_token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                localStorage.removeItem("access_token");
                window.location.href = "/login";
            });
        }

        const filterStatus = document.getElementById("filter-status");
        const filterPriority = document.getElementById("filter-prioridade");
        const filterSearch = document.getElementById("filter-search");
        const filterDate = document.getElementById("filter-date");
        const filterFavoritesBtn = document.getElementById("filter-favorites");
<<<<<<< HEAD
        let favoritesOnly = false;
=======
        let favoritesOnly = false; 
       
        
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925
        let searchTimeout;
        
        filterSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                fetchTasks();
            }, 500);
        });
        filterDate.addEventListener('change', fetchTasks);
        filterStatus.addEventListener('change', fetchTasks);
        filterPriority.addEventListener('change', fetchTasks);
        
<<<<<<< HEAD
        filterFavoritesBtn.addEventListener('click', function() {
            favoritesOnly = !favoritesOnly;
=======
        
        filterFavoritesBtn.addEventListener('click', function() {
            
            favoritesOnly = !favoritesOnly;
            
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925
            filterFavoritesBtn.classList.toggle('active', favoritesOnly);
            if (favoritesOnly) {
                filterFavoritesBtn.textContent = "★ Mostrando Apenas Favoritos";
            } else {
                filterFavoritesBtn.textContent = "★ Mostrar Apenas Favoritos";
            }
<<<<<<< HEAD
            fetchTasks();
        });
=======
            
            fetchTasks();
        });
       
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925


        async function fetchTasks() {
            try {
                const status = filterStatus.value;
                const prioridade = filterPriority.value;
                const search = filterSearch.value;
                const date = filterDate.value;

                let apiUrl = "/api/tasks?";
                if (status) {
                    apiUrl += `status=${status}&`;
                }
                if (prioridade) {
                    apiUrl += `prioridade=${prioridade}&`;
                }
                if (search && search.trim() !== '') {
                    apiUrl += `search=${search}&`;
                }
                if (date) {
                    apiUrl += `date=${date}&`;
                }
<<<<<<< HEAD
                if (favoritesOnly) {
                    apiUrl += `favoritos=true&`;
                }
=======
                
                if (favoritesOnly) {
                    apiUrl += `favoritos=true&`;
                }
                
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem("access_token");
                    window.location.href = "/login";
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Falha ao buscar tarefas. Status: ${response.status}`);
                }

                const data = await response.json();
                renderTasks(data.tarefas);

            } catch (error) {
                console.error("ERRO NO CATCH DO FETCHTASKS:", error);
                taskListContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
            }
        }

        function renderTasks(tarefas) {
            taskListContainer.innerHTML = "";

            if (tarefas.length === 0) {
                taskListContainer.innerHTML = "<p>Nenhuma tarefa encontrada com esses filtros.</p>";
                return;
            }

            tarefas.forEach(tarefa => {
                const taskElement = document.createElement("div");
                taskElement.className = "task-item";
                taskElement.setAttribute('data-id', tarefa.id);
                
                const statusClass = `status-${tarefa.status.replace(' ', '-')}`;
                const priorityClass = `priority-${tarefa.prioridade.replace('é', 'e')}`;
                
                const dataFormatada = new Date(tarefa.created_at).toLocaleString('pt-BR');
                
                const criadorNome = tarefa.criador_nome || 'Desconhecido';
                
                taskElement.innerHTML = `
                    <div class="task-info">
                        <h4>${tarefa.titulo}</h4>
                        <p>${tarefa.descricao || 'Sem descrição.'}</p>
                        <p class="task-creator">Criada por: ${criadorNome}</p>
                        <p class="task-date">Em: ${dataFormatada}</p> 
                        <div>
                            <span class="status ${statusClass}">${tarefa.status}</span>
                            <span class="priority ${priorityClass}">${tarefa.prioridade}</span>
                        </div>
                    </div>
                    
                    <div class="task-edit-form">
                        <div class="form-group">
                            <label>Título:</label>
                            <input type="text" class="edit-titulo" value="${tarefa.titulo}">
                        </div>
                        <div class="form-group">
                            <label>Descrição:</label>
                            <textarea class="edit-descricao">${tarefa.descricao}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Prioridade:</label>
                            <select class="edit-prioridade">
                                <option value="Baixa" ${tarefa.prioridade === 'Baixa' ? 'selected' : ''}>Baixa</option>
                                <option value="Média" ${tarefa.prioridade === 'Média' ? 'selected' : ''}>Média</option>
                                <option value="Alta" ${tarefa.prioridade === 'Alta' ? 'selected' : ''}>Alta</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="task-actions">
                        <span 
                            class="btn-favorite ${tarefa.favorita ? 'favorited' : ''}" 
                            title="Marcar como favorita"
                        >★</span>
<<<<<<< HEAD
                        
=======
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925
                        <button class="btn-edit">Editar</button>
                        <button class="btn-save">Salvar</button>
                        
                        <select class="status-select" ${tarefa.status === 'Concluída' ? 'disabled' : ''}>
                            <option value="Pendente" ${tarefa.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                            <option value="Em Progresso" ${tarefa.status === 'Em Progresso' ? 'selected' : ''}>Em Progresso</option>
                            <option value="Concluída" ${tarefa.status === 'Concluída' ? 'selected' : ''}>Concluída</option>
                        </select>
                        
                        <button class="btn-delete">Deletar</button>
                    </div>
                `;
                
                taskListContainer.appendChild(taskElement);
            });
        }
        
        taskListContainer.addEventListener('click', async function(event) {
            
            const taskElement = event.target.closest('.task-item');
            if (!taskElement) return;

            const taskId = taskElement.getAttribute('data-id');

            if (event.target.classList.contains('btn-delete')) {
                if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
                    try {
                        const response = await fetch(`/api/tasks/${taskId}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (response.ok) {
                            fetchTasks();
                        } else {
                            alert('Falha ao deletar tarefa.');
                        }
                    } catch (err) {
                        alert('Erro ao conectar ao servidor.');
                    }
                }
            }
            
            if (event.target.classList.contains('btn-edit')) {
                taskElement.classList.add('is-editing');
            }

            if (event.target.classList.contains('btn-save')) {
                const novoTitulo = taskElement.querySelector('.edit-titulo').value;
                const novaDescricao = taskElement.querySelector('.edit-descricao').value;
                const novaPrioridade = taskElement.querySelector('.edit-prioridade').value;

                const updateData = {
                    titulo: novoTitulo,
                    descricao: novaDescricao,
                    prioridade: novaPrioridade
                };

                try {
                    const response = await fetch(`/api/tasks/${taskId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(updateData) 
                    });

                    const data = await response.json();

                    if (response.ok) {
                        taskElement.classList.remove('is-editing');
                        fetchTasks(); 
                    } else {
                        alert(`Erro ao salvar: ${data.erro}`);
                    }
                } catch (err) {
                    alert('Erro ao conectar ao servidor.');
                }
            }

<<<<<<< HEAD
            if (event.target.classList.contains('btn-favorite')) {
                const isFavorited = event.target.classList.contains('favorited');
                const novoFavorito = !isFavorited;
=======
            
            if (event.target.classList.contains('btn-favorite')) {
                
                const isFavorited = event.target.classList.contains('favorited');
                const novoFavorito = !isFavorited; 
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925

                try {
                    const response = await fetch(`/api/tasks/${taskId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
<<<<<<< HEAD
=======
                        
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925
                        body: JSON.stringify({ favorita: novoFavorito }) 
                    });

                    if (response.ok) {
<<<<<<< HEAD
=======
                        
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925
                        event.target.classList.toggle('favorited', novoFavorito);
                    } else {
                        alert('Falha ao atualizar favorito.');
                    }
                } catch (err) {
                    alert('Erro ao conectar ao servidor.');
                }
            }
<<<<<<< HEAD
=======
            
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925
        });

        taskListContainer.addEventListener('change', async function(event) {
            
            if (event.target.classList.contains('status-select')) {
                const taskElement = event.target.closest('.task-item');
                const taskId = taskElement.getAttribute('data-id');
                const novoStatus = event.target.value;

                try {
                    const response = await fetch(`/api/tasks/${taskId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ status: novoStatus })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        fetchTasks(); 
                    } else {
                        alert(`Erro: ${data.erro}`);
                        fetchTasks(); 
                    }
                } catch (err) {
                    alert('Erro ao conectar ao servidor.');
                }
            }
        });

        const createTaskForm = document.getElementById("create-task-form");
        const createErrorMessage = document.getElementById("create-error-message");

        if (createTaskForm) {
            createTaskForm.addEventListener("submit", async function (event) {
                event.preventDefault();
                createErrorMessage.style.display = "none";
                createErrorMessage.textContent = "";

                const titulo = document.getElementById("task-titulo").value;
                const descricao = document.getElementById("task-descricao").value;
                const prioridade = document.getElementById("task-prioridade").value;
                const status = document.getElementById("task-status").value;

                if (titulo.length < 3 || titulo.length > 100) {
<<<<<<< HEAD
                    createErrorMessage.textContent = "Título deve ter entre 3 e 100 caracteres.";
                    createErrorMessage.style.display = "block";
                    return;
                }
                
                if (descricao.length < 10) {
=======
                    createErrorMessage.textContent = "Título deve ter pelo menos 3 caracteres.";
                    createErrorMessage.style.display = "block";
                    return;
                }
                if (descricao.length < 10 || descricao.length > 500) {
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925
                    createErrorMessage.textContent = "Descrição deve ter pelo menos 10 caracteres.";
                    createErrorMessage.style.display = "block";
                    return;
                }
<<<<<<< HEAD
                if (descricao.length > 500) {
                    createErrorMessage.textContent = "Descrição deve ter no máximo 500 caracteres.";
                    createErrorMessage.style.display = "block";
                    return;
                }
=======
>>>>>>> f60c87ce5173feeb64ca047fa2c639070a77d925
                
                try {
                    const response = await fetch("/api/tasks", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ 
                            titulo: titulo, 
                            descricao: descricao,
                            prioridade: prioridade,
                            status: status 
                        }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        document.getElementById("task-titulo").value = "";
                        document.getElementById("task-descricao").value = "";
                        document.getElementById("task-prioridade").value = "Média";
                        document.getElementById("task-status").value = "Pendente";
                        
                        fetchTasks(); 
                    } else {
                        createErrorMessage.textContent = data.erro || "Ocorreu um erro.";
                        createErrorMessage.style.display = "block";
                    }

                } catch (error) {
                    console.error("ERRO NO CATCH DO CRIAR TAREFA:", error);
                    createErrorMessage.textContent = `Erro de conexão (catch): ${error.message}`;
                    createErrorMessage.style.display = "block";
                }
            });
        }
        
        fetchTasks();
    }
});