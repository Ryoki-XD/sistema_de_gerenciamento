document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("login-form");
    const errorMessageElement = document.getElementById("error-message");

    if (loginForm) {
        
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
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
                errorMessageElement.textContent = "Não foi possível conectar ao servidor.";
                errorMessageElement.style.display = "block";
            }
        });
    }

    
    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const errorMessageElement = document.getElementById("error-message"); 
            errorMessageElement.style.display = "none";
            errorMessageElement.textContent = "";

            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            if (nome.length < 3) {
                errorMessageElement.textContent = "Nome deve ter pelo menos 3 caracteres.";
                errorMessageElement.style.display = "block";
                return;
            }
            if (senha.length < 8) {
                errorMessageElement.textContent = "Senha deve ter pelo menos 8 caracteres.";
                errorMessageElement.style.display = "block";
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
                    errorMessageElement.textContent = data.erro || "Ocorreu um erro no cadastro.";
                    errorMessageElement.style.display = "block";
                }

            } catch (error) {
                errorMessageElement.textContent = "Não foi possível conectar ao servidor.";
                errorMessageElement.style.display = "block";
            }
        });
    }
    
   
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
        

        filterStatus.addEventListener('change', fetchTasks);
        filterPriority.addEventListener('change', fetchTasks);


        async function fetchTasks() {
            try {
                
                const status = filterStatus.value;
                const prioridade = filterPriority.value;
                
                let apiUrl = "/api/tasks?";
                if (status) {
                    apiUrl += `status=${status}&`;
                }
                if (prioridade) {
                    apiUrl += `prioridade=${prioridade}&`;
                }
               

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
                    throw new Error("Falha ao buscar tarefas.");
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
                    
                    <div class="task-actions">
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
                    createErrorMessage.textContent = "Título deve ter pelo menos 3 caracteres.";
                    createErrorMessage.style.display = "block";
                    return;
                }
                if (descricao.length < 10 || descricao.length > 500) {
                    createErrorMessage.textContent = "Descrição deve ter pelo menos 10 caracteres.";
                    createErrorMessage.style.display = "block";
                    return;
                }
                
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