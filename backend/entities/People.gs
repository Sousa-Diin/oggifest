/**
 * Classe base People representa uma pessoa com dados comuns a clientes e funcionários.
 */
class People {
  /**
   * Construtor da classe People
   * @param {Object} param0
   * @param {string} param0.id - Identificador único da pessoa
   * @param {string} param0.telefone - Número de telefone
   * @param {string} param0.nome - Nome completo
   * @param {string} param0.email - Endereço de e-mail
   * @param {string} param0.adress - Endereço físico
   * @param {string} param0.type - Tipo da pessoa: "client" ou "employee"
   * @param {string|Date} param0.criacao - Data de criação do cadastro
   */
  constructor({ id, telefone, nome, email, adress, type= "cosumer", criacao, companyCode= '000646' }) {
    this._id = id ?? null;
    this._telefone = telefone ?? '';
    this._nome = nome ?? '';
    this._email = email ?? '';
    this._adress = adress ?? '';
    this._type = type;
    this._companyCode = companyCode ?? '';
    this._criacao = criacao ?? '';
  }

  // ================== GETTERS ==================

  /** @returns {string} ID da pessoa */
  get id() {
    return this._id;
  }

  /** @returns {string} Telefone da pessoa */
  get telefone() {
    return this._telefone;
  }

  /** @returns {string} Nome da pessoa */
  get nome() {
    return this._nome;
  }

  /** @returns {string} Email da pessoa */
  get email() {
    return this._email;
  }

  /** @returns {string} Endereço da pessoa */
  get adress() {
    return this._adress;
  }

  /** @returns {string} Tipo da pessoa ("client" ou "employee") */
  get type() {
    return this._type;
  }

  /** @returns {string} Data de criação no formato ISO */
  get criacao() {
    return this._criacao;
  }

  /** @returns {string} Data de companyCode no formato ISO */
  get companyCode() {
    return this._companyCode;
  }

  // ================== SETTERS ==================

  /** @param {string} value - Define o ID da pessoa */
  set id(value) {
    if (!value) throw new Error("ID não pode ser vazio.");
    this._id = value;
  }

  /** @param {string} value - Define e valida o telefone */
  set telefone(value) {
    if (typeof value !== 'string' || value.length < 8) {
      throw new Error("Telefone inválido.");
    }
    this._telefone = value.trim();
  }

  /** @param {string} value - Define e valida o nome */
  set nome(value) {
    if (!value || value.length < 2) {
      throw new Error("Nome muito curto.");
    }
    this._nome = value.trim();
  }

  /** @param {string} value - Define e valida o email */
  set email(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      throw new Error("E-mail inválido.");
    }
    this._email = value.trim().toLowerCase();
  }

  /** @param {string} value - Define o endereço (opcional) */
  set adress(value) {
    this._adress = value?.trim() ?? '';
  }

  /** @param {string} value - Define e valida o tipo da pessoa */
  set type(value) {
    const validTypes = ['client', 'employee'];
    if (!validTypes.includes(value)) {
      throw new Error(`Tipo inválido. Aceitos: ${validTypes.join(', ')}`);
    }
    this._type = value;
  }

  /** @param {string|Date} value - Define e valida a data de criação */
  set criacao(value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error("Data de criação inválida.");
    }
    this._criacao = date.toISOString();
  }

  /**
   * Serializa o objeto People para um objeto plano
   * @returns {Object} Objeto com os dados públicos da pessoa
   */
  toObject() {
    return {
      id: this._id,
      telefone: this._telefone,
      nome: this._nome,
      email: this._email,
      adress: this._adress,
      type: this._type,
      companyCode: this.companyCode,
      criacao: this._criacao
    };
  }
}