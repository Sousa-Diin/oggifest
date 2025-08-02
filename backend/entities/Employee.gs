/**
 * Classe Employee
 * Representa um funcionário da empresa com permissões, páginas permitidas e credenciais.
 * Estende a classe People, herdando propriedades básicas como nome, telefone, e e-mail.
 */
class Employee extends People {
  /**
   * Construtor do Employee
   * @param {Object} data - Objeto com os dados do funcionário
   */


  constructor(data) {
    // Define role e companyCode fixos ao criar um funcionário
    super({ ...data, type: 'operator'});

    this._cod = data?.cod ?? null; // Código de acesso ou matrícula
    this._role = data?.role ?? 'viewer'; // papel
    this._passwd = data?.passwd ?? null; // Senha do funcionário
    this._permissions = data?.permissions ?? []; // Permissões do usuário (ex: ["read", "write"])
    this._allowedPages = data?.allowedPages ?? []; // Páginas permitidas no sistema
  }

  // === GETTERS ===

  /** @returns {string|null} Código do funcionário */
  get cod() {
    return this._cod;
  }

  /** @returns {string|null} Senha do funcionário */
  get passwd() {
    return this._passwd;
  }

  /** @returns {Array} Permissões do funcionário */
  get permissions() {
    return this._permissions;
  }

  /** @returns {Array} Lista de páginas acessíveis pelo funcionário */
  get allowedPages() {
    return this._allowedPages;
  }

  /** @returns {string|null} papel do funcionário */
  get role() {
    return this._role;
  }

  // === SETTERS COM VALIDAÇÃO ===

  /**
   * Define o código do funcionário
   * @param {string} value
   */
  set cod(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('Código deve ser uma string válida.');
    }
    this._cod = value.trim();
  }

  /**
   * Define a senha do funcionário
   * @param {string} value
   */
  set passwd(value) {
    if (!value || typeof value !== 'string' || value.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres.');
    }
    this._passwd = value;
  }

  /**
   * Define as permissões do funcionário
   * @param {Array} value
   */
  set permissions(value) {
    if (!Array.isArray(value)) {
      throw new Error('Permissões devem ser uma lista.');
    }
    this._permissions = value;
  }

  /**
   * Define as páginas permitidas ao funcionário
   * @param {Array} value
   */
  set allowedPages(value) {
    if (!Array.isArray(value)) {
      throw new Error('AllowedPages deve ser uma lista.');
    }
    this._allowedPages = value;
  }

  /**
   * Define o papel do funcionário
   * @param {string} value
   */
  set _role(value) {
    if (this._role !== 'sudo') {
      throw new Error('Acesso negado, privilégio de superusuário.');
    }
    if (!value || typeof value !== 'string' || value.length < 6) {
      throw new Error('O role deve ser uma string com pelo menos 6 caracteres.');
    }
    this._role = value;
  }


  /**
   * 
   */

  /**
   * Serializa o objeto Employee para um objeto plano (ex: para salvar em banco de dados ou enviar por API)
   * @returns {Object}
   */
  toObject() {
    const base = super.toObject(); // Pega dados da classe People
    return {
      ...base,
      cod: this._cod,
      passwd: this._passwd,
      permissions: this._permissions,
      allowedPages: this._allowedPages,
      role:this._role
    };
  }
}
