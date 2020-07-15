const express = require("express");
const cors = require("cors");

 const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoriesId(request, response, next) {
  const {id} = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({error: "Invalid repository id"});
  }
  return next();
}

app.use('/repositories/:id', validateRepositoriesId);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  
  const repository =  {
    id:uuid(),
    title,
    url,
    techs,
    likes:0
  }

  repositories.push(repository);
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(repositoryIndex < 0) {
    return response.status(400).json({error: "Repository does not exist"});
  }
  const repository = {
    id,
    title: title ? title : repositories[repositoryIndex].title,
    url: url ? url : repositories[repositoryIndex].url,
    techs: techs ? techs : repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(repositoryIndex < 0) {
    return response.status(400).json({error: "Repository does not exist"})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repository = repositories.find(repository => repository.id == id)
  if(!repository) {
    return response.status(400).json({error: "Repository does not exist"})
  }
  repository.likes++

  return response.json(repository);
});

module.exports = app;
