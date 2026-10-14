
const readline = require("node:readline");
const fs = require("node:fs");

// Configurar o terminal
const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ficheiro onde as tarefas ficam guardadas
const ficheiro = "./tasks.json";

// Carregar tarefas guardadas
function carregartarefas() {
    try {
        if (!fs.existsSync(ficheiro)) {
            fs.writeFileSync(ficheiro, "[]");
        }
        const dados = fs.readFileSync(ficheiro, "utf8");
        return JSON.parse(dados);
    } catch (erro) {
        console.log("Erro ao carregar tarefas.");
        return [];
    }
}

let tarefas = carregartarefas();

// Guardar tarefas no ficheiro
function guardarTarefas() {
    fs.writeFileSync(
        ficheiro,
        JSON.stringify(tarefas, null, 2)
    );
}
function menu() {
    console.log("\n====== TASK MANAGER ======");
    console.log("[1] Adicionar tarefa");
    console.log("[2] Listar tarefas");
    console.log("[3] Concluir tarefa");
    console.log("[4] Remover tarefa");
    console.log("[0] Sair");

    terminal.question("\nEscolhe uma opcao: ", (opcao) => {
        switch (opcao) {
            case "1":
                adicionartarefa();
                break;
            case "2":
                listartarefas();
                break;
            case "3":
                concluirtarefa();
                break;
            case "4":
                removertarefa();
                break;
            case "0":
                console.log("A sair do Task Manager...");
                terminal.close();
                break;
            default:
                console.log("Opcao invalida!");
                menu();
        }
    });
}

// Adicionar uma tarefa
function adicionartarefa() {
    terminal.question("Titulo da tarefa: ", (titulo) => {
        titulo = titulo.trim();

        if (titulo === "") {
            console.log("O titulo nao pode estar vazio.");
            return menu();
        }

        const novaTarefa = {
            id: tarefas.length > 0
                ? Math.max(...tarefas.map(t => t.id)) + 1
                : 1,
            titulo: titulo,
            concluida: false
        };

        tarefas.push(novaTarefa);
        guardarTarefas();

        console.log("Tarefa adicionada com sucesso!");
        menu();
    });
}

// Listar todas as tarefas
function listartarefas() {
    console.log("\n====== AS TUAS TAREFAS ======");

    if (tarefas.length === 0) {
        console.log("Ainda nao tens tarefas.");
    } else {
        tarefas.forEach((tarefa) => {
            const estado = tarefa.concluida
                ? "Concluida"
                : "Pendente";

            console.log(
                `[${tarefa.id}] ${tarefa.titulo} - ${estado}`
            );
        });
    }

    menu();
}
// Concluir uma tarefa
function concluirtarefa() {
    if (tarefas.length === 0) {
        console.log("Nao existem tarefas para concluir.");
        return menu();
    }
    listarTarefasSemMenu();
    terminal.question(
        "\nID da tarefa a concluir: ",
        (resposta) => {
            const id = Number(resposta);
            const tarefa = tarefas.find(
                (tarefa) => tarefa.id === id
            );
            if (!tarefa) {
                console.log("Tarefa nao encontrada.");
            } else if (tarefa.concluida) {
                console.log("Essa tarefa ja esta concluida.");
            } else {
                tarefa.concluida = true;
                guardarTarefas();
                console.log("Tarefa concluida com sucesso!");
            }

            menu();
        }
    );
}
// Listar tarefas 
function listarTarefasSemMenu() {
    console.log("\n====== AS TUAS TAREFAS ======");

    tarefas.forEach((tarefa) => {
        const estado = tarefa.concluida
            ? "Concluida"
            : "Pendente";

        console.log(
            `[${tarefa.id}] ${tarefa.titulo} - ${estado}`
        );
    });
}
// Remover uma tarefa
function removertarefa() {
    if (tarefas.length === 0) {
        console.log("Nao existem tarefas para remover.");
        return menu();
    }
    listarTarefasSemMenu();
    terminal.question(
        "\nID da tarefa a remover: ",
        (resposta) => {
            const id = Number(resposta);
            const indice = tarefas.findIndex(
                (tarefa) => tarefa.id === id
            );
            if (indice === -1) {
                console.log("Tarefa nao encontrada.");
            } else {
                const removida = tarefas.splice(indice, 1);
                guardarTarefas();
                console.log(
                    `Tarefa "${removida[0].titulo}" removida.`
                );
            }
            menu();
        }
    );
}

menu();
