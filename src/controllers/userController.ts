// src/controllers/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../models/user';

/**
 * Registra um novo usuário.
 * Valida os dados, verifica se o email já está em uso e cria o usuário com a senha criptografada.
 * Retorna os dados do usuário e um token JWT.
 */
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, role } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    // Verifica se já existe um usuário com o mesmo email
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria o novo usuário
    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.CLIENT,
    });
    await userRepository.save(newUser);

    // Gera um token JWT para autenticação imediata
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    return res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Autentica um usuário.
 * Verifica se o email existe e se a senha confere. Retorna um token JWT.
 */
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Lista todos os usuários.
 */
export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Atualiza as informações de um usuário.
 */
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    await userRepository.save(user);
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Remove um usuário.
 */
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    await userRepository.remove(user);
    return res.status(200).json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
