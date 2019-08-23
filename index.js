const express = require("express");

//inicia o express
const index = express();

// avisar express do uso de json
index.use(express.json());

const projects = [];
let cont = 0; //contador de requisições

index.use((req, res, next) => {
  cont++; //middleware global para contagem de requisições
  console.log(`Requisição: ${cont}`);

  return next();
});

//index.use(Contador);

//middleware local pra ver se o projeto não existe retornando um erro 400
function check(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  //const check = projects.find(function(element))
  //  if(element.id===id){
  //   return id;
  //}

  if (!project) {
    return res.status(400).json({ message: "Não existe" });
  }
  return next();
}

//middleware local pra n deixar duplicar o mesmo id no body
function IdExistir(req, res, next) {
  const { id } = req.body;

  const project = projects.find(p => p.id === id);
  if (project) {
    return res.status(400).json({ error: "ID ja existe, tente outro." });
  }
  next();
}

index.get("/projects", (req, res) => {
  return res.json(projects);
});

// cria um objeto que é adicionado ao vetor de projetos
index.post("/projects", IdExistir, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    task: []
  };

  projects.push(project);

  return res.json(projects);
});

index.put("/projects/:id", check, (req, res) => {
  //pega o nome que ta recebendo do body
  const { title } = req.body;

  //pega o índice do vetor que ta recebendo do params
  const { id } = req.params;

  //ele vai  procurar o projeto que tiver o id igual ao id que você recebeu como parâmetro
  const project = projects.find(p => p.id == id);
  // project[id].title = title;
  //Acessa o objeto encontra o title ai muda o title de acordo com o id
  project.title = title;

  return res.json(project);
});

index.delete("/projects/:id", check, (req, res) => {
  const { id } = req.params;

  const project = projects.findIndex(p => p.id == id);
  // tira uma posição do vetor de acordo com o id do parametro
  projects.splice(project, 1);

  return res.send();
});

index.post("/projects/:id/tasks", check, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.task.push(title);

  return res.json(project);
});

index.listen(3007);
