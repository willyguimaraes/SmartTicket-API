// controllers/userController.js

/**
 * User Controller
 * Responsável por controlar as operações relacionadas aos usuários,
 * como registro, login, consulta, atualização e remoção.
 */

const userService = require('../services/userService');

/**
 * Registra um novo usuário.
 * Requer: { name, email, password, role }
 */
exports.register = async (req, res) => {
  try {
    // Cria um novo usuário usando os dados do corpo da requisição
    const newUser = await userService.createUser(req.body);
    // Retorna o usuário criado com status HTTP 201 (Created)
    return res.status(201).json(newUser);
  } catch (error) {
    // Em caso de erro, retorna status 400 e a mensagem do erro
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Realiza o login do usuário.
 * Requer: { email, password }
 * Retorna um token JWT caso a autenticação seja bem-sucedida.
 */
exports.login = async (req, res) => {
  try {
    const token = await userService.authenticate(req.body);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

/**
 * Obtém os detalhes de um usuário pelo ID.
 * Rota protegida; exige autenticação.
 */
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Atualiza os dados de um usuário pelo ID.
 */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await userService.updateUser(userId, req.body);
    if (!updatedUser) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Remove um usuário pelo ID.
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await userService.deleteUser(userId);
    if (!deleted) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.status(200).json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
