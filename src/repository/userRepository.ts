import User, { UserCreationAttributes, UserAttributes } from "../models/user";

/**
 * Repository de Usuário.
 * Responsável pelas operações CRUD da entidade User.
 */
class UserRepository {
  /**
   * Cria um novo usuário.
   * @param userData Dados do usuário a ser criado.
   * @returns O usuário criado.
   */
  async create(userData: UserCreationAttributes): Promise<User> {
    return await User.create(userData);
  }

  /**
   * Encontra um usuário pelo ID.
   * @param id Identificador do usuário.
   * @returns O usuário encontrado ou null.
   */
  async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  /**
   * Encontra um usuário pelo email.
   * @param email Email do usuário.
   * @returns O usuário encontrado ou null.
   */
  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  /**
   * Retorna todos os usuários.
   * @returns Lista de usuários.
   */
  async findAll(): Promise<User[]> {
    return await User.findAll();
  }

  /**
   * Atualiza os dados de um usuário.
   * @param id Identificador do usuário.
   * @param updateData Dados para atualização.
   * @returns Um array com o número de registros afetados e os registros atualizados.
   */
  async update(id: number, updateData: Partial<UserAttributes>): Promise<[number, User[]]> {
    return await User.update(updateData, { where: { id }, returning: true });
  }

  /**
   * Remove um usuário.
   * @param id Identificador do usuário.
   * @returns O número de registros removidos.
   */
  async delete(id: number): Promise<number> {
    return await User.destroy({ where: { id } });
  }
}

export default new UserRepository();
