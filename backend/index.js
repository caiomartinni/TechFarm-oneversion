const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Carrega usuários
const USERS_FILE = "./users.json";
let users = [];
if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE));
}

// Rota de login
app.post("/api/login", (req, res) => {
  const { username, password, tipo } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password && u.tipo === tipo
  );
  if (!user)
    return res.status(401).json({ error: "Usuário ou senha inválidos" });
  res.json({ message: "Login realizado", tipo: user.tipo });
});

// Exemplo de rota protegida para farmacêutico
app.get("/api/farmaceutico-area", (req, res) => {
  // Aqui você pode implementar autenticação real (token/jwt)
  res.json({ message: "Área do farmacêutico" });
});

// Exemplo de rota protegida para cliente
app.get("/api/cliente-area", (req, res) => {
  res.json({ message: "Área do cliente" });
});

const DATA_FILE = "./medicamentos.json";
let medicamentos = [];
if (fs.existsSync(DATA_FILE)) {
  medicamentos = JSON.parse(fs.readFileSync(DATA_FILE));
}

// Adiciona
app.post("/api/products", (req, res) => {
  const novo = req.body;
  novo.id = Date.now().toString();
  medicamentos.push(novo);
  fs.writeFileSync(DATA_FILE, JSON.stringify(medicamentos, null, 2));
  res.status(201).json(novo);
});

// procura
app.get("/api/products", (req, res) => {
  res.json(medicamentos);
});

// Atualiza
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const idx = medicamentos.findIndex((m) => m.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  medicamentos[idx] = { ...medicamentos[idx], ...req.body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(medicamentos, null, 2));
  res.json(medicamentos[idx]);
});

// Remove
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  medicamentos = medicamentos.filter((m) => m.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(medicamentos, null, 2));
  res.status(204).end();
});

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
