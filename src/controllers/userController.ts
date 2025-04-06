import { Request, Response, NextFunction } from "express";
import User, { UserRole } from "../models/user";

// Registra um novo usuário
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validação simples para campos obrigatórios
    if (!name || !email || !password) {
      res.status(400).json({ error: "Campos obrigatórios ausentes" });
      return;
    }

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Usuário já existe" });
      return;
    }


    // Cria o usuário
    const user = await User.create({ name, email, password, role: role || UserRole.CLIENT });
    res.status(201).json(user);
  } catch (error) {
    console.error("Erro no registro de usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Autentica usuário e retorna token JWT (exemplo simplificado)
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Campos obrigatórios ausentes" });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado" });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ error: "Senha incorreta" });
      return;
    }

    
    const token = "dummy-jwt-token";
    const id = user.id;


    // Retornamos token E id do usuário
    res.status(200).json({
      "token": token,
      "id": id,
    });
  } catch (error) {
    console.error("Erro no login do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Obtém os detalhes de um usuário existente
export const getUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar detalhes do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Atualiza os dados de um usuário existente
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    await user.update({ name, email, password, role });
    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Exclui um usuário existente
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    await user.destroy();
    res.status(200).json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Função para obter todos os usuários
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Função para obter um usuário pelo ID
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
