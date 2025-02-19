import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../models/user';

/**
 * Registra um novo usuário.
 * Valida os dados, verifica se o email já está em uso e cria o usuário com a senha criptografada.
 * Retorna os dados do usuário e um token JWT.
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email já cadastrado.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.CLIENT,
    });
    await userRepository.save(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    next(error);
  }
};

/**
 * Autentica um usuário.
 * Verifica se o email existe e se a senha confere. Retorna um token JWT.
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      res.status(400).json({ message: 'Credenciais inválidas.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Credenciais inválidas.' });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    next(error);
  }
};

/**
 * Obtém um usuário pelo ID.
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    
    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    next(error);
  }
};


/**
 * Lista todos os usuários.
 */
export const getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    next(error);
  }
};

/**
 * Atualiza as informações de um usuário.
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: Number(id) });
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    await userRepository.save(user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    next(error);
  }
};

/**
 * Remove um usuário.
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: Number(id) });
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }
    await userRepository.remove(user);
    res.status(200).json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    next(error);
  }
};
