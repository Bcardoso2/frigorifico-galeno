const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Usuario = require("../models/Usuario");

dotenv.config(); // 🔹 Garante que as variáveis do .env sejam carregadas

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "chavesecreta123456"; // 🔹 Garante que sempre tenha uma chave

// 🔹 Registrar usuário
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    // Verifica se o email já existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: "E-mail já cadastrado!" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ nome, email, senha: senhaCriptografada });

    res.status(201).json({ message: "Usuário cadastrado com sucesso!", usuario });
  } catch (error) {
    console.error("❌ Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro ao registrar usuário", error });
  }
});

// 🔹 Login do usuário
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    console.log("📢 Tentando login com:", email);

    // 🔹 Verifica se o usuário existe
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      console.log("❌ Usuário não encontrado!");
      return res.status(401).json({ message: "Usuário não encontrado!" });
    }
    console.log("✅ Usuário encontrado:", usuario.nome);

    // 🔹 Compara a senha com o hash armazenado
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      console.log("❌ Senha incorreta!");
      return res.status(401).json({ message: "Senha incorreta!" });
    }
    console.log("✅ Senha correta!");

    // 🔹 Garante que a SECRET_KEY está definida corretamente
    if (!SECRET_KEY) {
      console.error("❌ Erro: SECRET_KEY não definida!");
      return res.status(500).json({ message: "Erro interno: chave de autenticação não definida" });
    }

    // 🔹 Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("✅ Token gerado com sucesso:", token);

    res.json({ message: "Login realizado!", token, usuario });
  } catch (error) {
    console.error("❌ Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
});

module.exports = router;
