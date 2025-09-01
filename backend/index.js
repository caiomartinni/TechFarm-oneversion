const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;
const SECRET_KEY = 'sua_chave_secreta'; // Troque por uma chave forte

app.use(cors());
app.use(bodyParser.json());

//usuários
const USERS_FILE = "./users.json";
let users = [];
if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE));
}

//login usuario
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

const USER_FILE = "./user.json";

// Função para ler usuários
function readUsers() {
  if (fs.existsSync(USER_FILE)) {
    return JSON.parse(fs.readFileSync(USER_FILE));
  }
  return { farmacelticos: [], pacientes: [] };
}

// Função para salvar usuários
function saveUsers(users) {
  fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2));
}

// Cadastro farmacêutico
app.post("/api/register/farmaceltico", (req, res) => {
  const { nome, email, senha } = req.body;
  const users = readUsers();
  if (users.farmacelticos.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email já cadastrado" });
  }
  users.farmacelticos.push({ nome, email, senha });
  saveUsers(users);
  res.status(201).json({ message: "Cadastro realizado com sucesso" });
});

// Cadastro paciente
app.post("/api/register/paciente", (req, res) => {
  const { nome, email, senha } = req.body;
  const users = readUsers();
  if (users.pacientes.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email já cadastrado" });
  }
  users.pacientes.push({ nome, email, senha });
  saveUsers(users);
  res.status(201).json({ message: "Cadastro realizado com sucesso" });
});

// Login farmacêutico com JWT
app.post("/api/login/farmaceltico", (req, res) => {
  const { email, senha } = req.body;
  const users = readUsers();
  const user = users.farmacelticos.find(
    (u) => u.email === email && u.senha === senha
  );
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  // Gera token
  const token = jwt.sign({ email: user.email, tipo: 'farmaceutico' }, SECRET_KEY, { expiresIn: '2h' });
  res.json({
    message: "Login realizado com sucesso",
    user: { nome: user.nome, email: user.email },
    token
  });
});

// Login paciente
app.post("/api/login/paciente", (req, res) => {
  const { email, senha } = req.body;
  const users = readUsers();
  const user = users.pacientes.find(
    (u) => u.email === email && u.senha === senha
  );
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
  res.json({
    message: "Login realizado com sucesso",
    user: { nome: user.nome, email: user.email },
  });
});

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
