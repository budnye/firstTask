const express = require('express');
const server = express();

const projects = [];
let count = 0;
server.use(express.json());

//Middleware to count requests
server.use((req, res, next) => {
  count++;
  console.log(`Number of requests: ${count}`);
  return next();
});

//Check if project exists
function checkProject(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({ error: 'Project does not exist' });
  }
  return next();
};

//Create a project
server.post('/projects', (req, res) => {
  const { id, title, } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

//Get all projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//Update project
server.put('/projects/:id', checkProject, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  project.title = title;
  return res.json(project);
});

//Delete project
server.delete('/projects/:id', checkProject, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id === id);
  projects.splice(index, 1);
  return res.json(projects);
});


//Create a task for a project
server.post('/projects/:id/task', checkProject, (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  const { task } = req.body;
  project.tasks.push(task);
  return res.json(project);
});

server.listen(3000);


