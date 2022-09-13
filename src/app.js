const express = require('express');

const app = express();

let nextId = 3;
const teams = [
  { id: 1, nome: 'São Paulo Futebol Clube', sigla: 'SPF' },
  { id: 2, nome: 'Sociedade Esportiva Palmeiras', sigla: 'PAL' },
];

app.use(express.json());

app.get('/teams', (req, res) => res.json(teams));

const existingId = (req, res, next) => {
  const id = Number(req.params.id);
  if (teams.some((t) => t.id === id)) {
      next();
  } else {
      res.sendStatus(404);
  }
}

app.get('/teams/:id', existingId, (req, res) => {
    const id = Number(req.params.id);
    const team = teams.find(t => t.id === id);
    res.json(team);
});

// MIDDLEWAREs post e put

const validateTeam = (req, res, next) => {
    const requiredProperties = ['nome', 'sigla'];
    if (requiredProperties.every((property) => property in req.body)) {
      next(); // Chama o próximo middleware
    } else {
      res.sendStatus(400); // Ou já responde avisando que deu errado
    }
  };

  // Arranja os middlewares para chamar validateTeam primeiro
  app.post('/teams', validateTeam, (req, res) => {
    const team = { id: nextId, ...req.body };
    teams.push(team);
    nextId += 1;
    res.status(201).json(team);
  });
  
  app.put('/teams/:id', validateTeam, existingId,(req, res) => {
    const id = Number(req.params.id);
    const team = teams.find(t => t.id === id);
    const index = teams.indexOf(team);
    const updated = { id, ...req.body };
    teams.splice(index, 1, updated);
    res.status(201).json(updated);
  });

app.delete('/teams/:id', (req, res) => {
  const id = Number(req.params.id);
  const team = teams.find(t => t.id === id);
  if (team) {
    const index = teams.indexOf(team);
    teams.splice(index, 1);
  }
  res.sendStatus(200);
});

module.exports = app;