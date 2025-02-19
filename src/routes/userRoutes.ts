import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Cria um novo usuário e retorna os dados do usuário com token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, organizer, client]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Email já cadastrado ou dados inválidos.
 */
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autentica um usuário
 *     description: Valida as credenciais do usuário e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso.
 *       400:
 *         description: Credenciais inválidas.
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista de todos os usuários registrados.
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtém um usuário pelo ID
 *     description: Retorna os detalhes de um usuário específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Detalhes do usuário retornados com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     description: Atualiza os detalhes de um usuário específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, organizer, client]
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Usuário não encontrado.
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     description: Exclui um usuário específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
router.delete('/:id', userController.deleteUser);

export default router;
