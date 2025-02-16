// src/services/userService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../models/user';

export class UserService {
  /**
   * Registra um novo usuário.
   * @param name Nome do usuário.
   * @param email Email do usuário.
   * @param password Senha em texto plano.
   * @param role Papel do usuário (opcional, padrão: CLIENT).
   * @returns Objeto contendo o usuário criado e um token JWT.
   */
  static async registerUser(
    name: string,
    email: string,
    password: string,
    role?: UserRole
  ) {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      throw new Error('Email já cadastrado.');
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

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    return { user: newUser, token };
  }

  /**
   * Autentica um usuário.
   * @param email Email do usuário.
   * @param password Senha em texto plano.
   * @returns Objeto contendo o usuário autenticado e um token JWT.
   */
  static async loginUser(email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Credenciais inválidas.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    return { user, token };
  }

  /**
   * Retorna a lista de todos os usuários.
   */
  static async getAllUsers() {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.find();
  }

  /**
   * Atualiza os dados de um usuário.
   * @param id Identificador do usuário.
   * @param updateData Dados a serem atualizados.
   */
  static async updateUser(id: number, updateData: Partial<User>) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    Object.assign(user, updateData);
    await userRepository.save(user);
    return user;
  }

  /**
   * Remove um usuário.
   * @param id Identificador do usuário.
   */
  static async deleteUser(id: number) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    await userRepository.remove(user);
  }
}
