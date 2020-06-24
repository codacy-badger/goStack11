const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const { response, request } = require('express');

const app = express();

app.use(express.json());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();
}

function validaterepositoryId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  return next();
}

app.use(logRequests);
app.use('repositories/:id', validaterepositoryId);

app.get('/repositories', (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter((repository) => repository.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs, likes } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.post(
  '/repositories/:id/like',
  validaterepositoryId,
  (request, response) => {
    const { id } = request.params;
    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'repository not found.' });
    }

    repositories[repositoryIndex].likes =
      repositories[repositoryIndex].likes + 1;
    return response.status(204).send();
  }
);

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs,  } = request.body;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found.' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found.' });
  }
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});
app.listen(3333, () => {
  console.log('⏳ Starting...');
  console.log('🚀 Back-end started !');
});
