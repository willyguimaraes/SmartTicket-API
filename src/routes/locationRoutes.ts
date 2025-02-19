import express from 'express';
import * as locationController from '../controllers/locationController';

const router = express.Router();

/**
 * @swagger
 * /locations:
 *   post:
 *     summary: Cria um novo local
 *     description: Cria um local para a realização de eventos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               capacity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Local criado com sucesso.
 */
router.post('/', locationController.createLocation);

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Lista todos os locais
 *     responses:
 *       200:
 *         description: Retorna a lista de locais.
 */
router.get('/', locationController.getLocations);

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Obtém um local pelo ID
 *     description: Retorna os detalhes de um local específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do local
 *     responses:
 *       200:
 *         description: Detalhes do local.
 *       404:
 *         description: Local não encontrado.
 */
router.get('/:id', locationController.getLocationById);

/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     summary: Atualiza um local existente
 *     description: Atualiza os detalhes de um local específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do local
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               capacity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Local atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Local não encontrado.
 */
router.put('/:id', locationController.updateLocation);

/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     summary: Remove um local
 *     description: Exclui um local específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do local
 *     responses:
 *       200:
 *         description: Local removido com sucesso.
 *       404:
 *         description: Local não encontrado.
 */
router.delete('/:id', locationController.deleteLocation);

export default router;
