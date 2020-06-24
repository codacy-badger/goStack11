const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const { response, request } = require('express');

const app = express();

app.use(express.json());

const repositories = { items: [] };

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  return next();
}

function validaterepositoryId(request, response, next) {
  const id = request.params;
  console.log(id);
  //   if (!isUuid(id)) {
  //     return response.status(400).json({ error: 'Invalid repository ID.' });
  //   }

  return next();
}

app.use(logRequests);
app.use('repositories/:id', validaterepositoryId);

app.get('/repositories', (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.items.filter((repository) =>
        repository.title.includes(title)
      )
    : repositories.items;

  return response.json(results);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs, likes } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: [0] };
  repositories.items.push(repository);
  return response.json(repository);
});

app.post(
  '/repositories/:id/like',
  validaterepositoryId,
  (request, response) => {
      const {id} = request.params;
    const repositoryIndex = repositories.items.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'repository not found.' });
    }
    console.log(repositories.items[repositoryIndex].likes[0].valueOf());
    if (repositories.items[repositoryIndex].likes[0].valueOf() === 0){
        
        repositories.items[repositoryIndex].likes.splice([0],1)
    }
    
    repositories.items[repositoryIndex].likes.push('👍');
    return response.status(204).send();
  }
);

app.put('/repositories/:id', validaterepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;
  const repositoryIndex = repositories.items.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found.' });
  }

  const repository = {
    id,
    title,
    owner,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', validaterepositoryId, (request, response) => {
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
