const express = require("express");

const routes = express.Router();

const projects = [];
let logRequests = 1;

routes.use((req, res, next) => {
  console.log(`Count Requests ${logRequests++}`);

  next();
});

function checkProjectInArray(req, res, next) {
  const { id } = req.params;

  const isProject = projects.filter(
    project => parseInt(project.id) === parseInt(id)
  );

  if (isProject.length === 0) {
    return res.status(400).json({ error: "Project does not exists" });
  }
  return next();
}

routes.get("/", (req, res) => {
  return res.json({ message: "Welcome to app from project and tasks" });
});

routes.get("/projects", (req, res) => {
  return res.json(projects);
});

routes.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const newProject = {
    id,
    title,
    tasks: []
  };

  projects.push(newProject);

  return res.json({ ...newProject });
});

routes.put("/projects/:id", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let projectUpdated = null;

  projects.forEach(project => {
    if (parseInt(project.id) === parseInt(id)) {
      project.title = title;
      projectUpdated = project;
    }
  });

  return res.json({ ...projectUpdated });
});

routes.delete("/projects/:id", checkProjectInArray, (req, res) => {
  const { id } = req.params;

  projects.forEach((project, index) => {
    if (parseInt(project.id) === parseInt(id)) {
      projects.splice(index, 1);
    }
  });

  return res.send();
});

routes.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let projectTask = null;

  projects.forEach(project => {
    if (parseInt(project.id) === parseInt(id)) {
      project.tasks.push(title);
      projectTask = project;
    }
  });

  return res.json({ projectTask });
});

module.exports = routes;
