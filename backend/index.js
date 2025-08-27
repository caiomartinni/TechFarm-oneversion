const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Carrega medicamentos no json
const DATA_FILE = './medicamentos.json';
let medicamentos = [];
if (fs.existsSync(DATA_FILE)) {
  medicamentos = JSON.parse(fs.readFileSync(DATA_FILE));
}

// Adiciona medicamento
app.post('/api/products', (req, res) => {
  const novo = req.body;
  novo.id = Date.now().toString();
  medicamentos.push(novo);
  fs.writeFileSync(DATA_FILE, JSON.stringify(medicamentos, null, 2));
  res.status(201).json(novo);
});

// Lista medicamentos
app.get('/api/products', (req, res) => {
  res.json(medicamentos);
});

// Atualiza medicamento
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const idx = medicamentos.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  medicamentos[idx] = { ...medicamentos[idx], ...req.body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(medicamentos, null, 2));
  res.json(medicamentos[idx]);
});

// Remove medicamento
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  medicamentos = medicamentos.filter(m => m.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(medicamentos, null, 2));
  res.status(204).end();
});

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));