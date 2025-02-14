// services/userService.js

/**
 * User Service
 * Este serviço implementa as regras de negócio para a entidade "Usuário".
 * Utiliza o modelo User (por exemplo, um modelo Mongoose) para interagir com o banco de dados.
 */

const User = require('../models/User');  // Modelo do usuário
const bcrypt = require('bcrypt');          // Para hash de senhas
const jwt = require('jsonwebtoken');       // Para geração de tokens JWT

/**
 * Cria um novo usuário.
 * - Recebe um objeto com os dados do usuário (name, email, password, role, etc.).
 * - Realiza o hash da senha e cria o usuário no banco de dados.
 * - Retorna os dados do usuário criado (excluindo a senha).
 */
exports.createUser = async (userData) => {
  if (!userData.password) throw new Error("Senha é obrigatória.");
  
  // Gera o hash da senha com um salt de 10 rounds
  userData.password = await bcrypt.hash(userData.password, 10);
  
  // Cria o usuário no banco
  const newUser = await User.create(userData);
  
  // Exclui o campo de senha antes de retornar os dados
  const { password, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword;
};

/**
 * Obtém um usuário pelo ID.
 * - Lança um erro se o usuário não for encontrado.
 */
exports.getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Usuário não encontrado");
  
  // Remove a senha dos dados retornados
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

/**
 * Atualiza os dados de um usuário.
 * - Se a senha for atualizada, realiza o hash antes de salvar.
 */
exports.updateUser = async (userId, updateData) => {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!updatedUser) throw new Error("Usuário não encontrado");
  
  const { password, ...userWithoutPassword } = updatedUser.toObject();
  return userWithoutPassword;
};

/**
 * Remove um usuário pelo ID.
 * - Retorna um valor booleano indicando se a remoção foi bem-sucedida.
 */
exports.deleteUser = async (userId) => {
  const deleted = await User.findByIdAndDelete(userId);
  return !!deleted;
};

/**
 * Autentica um usuário.
 * - Verifica se o usuário existe e se a senha informada corresponde ao hash armazenado.
 * - Retorna um token JWT com validade de 1 hora.
 */
exports.authenticate = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Usuário não encontrado");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Senha inválida");

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'chaveSecreta',
    { expiresIn: '1h' }
  );
  return token;
};
