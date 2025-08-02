/**
 * Classe Client
 * 
 * Representa um cliente no sistema, estendendo a classe People.
 * Inclui informações adicionais como o total de locações realizadas e a data da última locação.
 * 
 * @extends People
 */
class Client extends People {
  /**
   * Construtor da classe Client.
   * 
   * @param {Object} data - Dados do cliente.
   * @param {number} [data.totRent=0] - Total de locações feitas pelo cliente.
   * @param {Date|null} [data.lastRental=null] - Data da última locação do cliente.
   */
  constructor(data) {
    super({ ...data });

    /**
     * @private
     * @type {number}
     */
    this._totRent = data?.totRent ?? 0;

    /**
     * @private
     * @type {Date|null}
     */
    this._lastRental = data?.lastRental ?? null;
  }

  /**
   * Retorna o total de locações feitas pelo cliente.
   * @returns {number}
   */
  get totRent() {
    return this._totRent;
  }

  /**
   * Retorna a data da última locação.
   * @returns {Date|null}
   */
  get lastRental() {
    return this._lastRental;
  }

  /**
   * Define o total de locações feitas pelo cliente.
   * @param {number} value
   */
  set totRent(value) {
    this._totRent = value;
  }

  /**
   * Define a data da última locação.
   * @param {Date|null} value
   */
  set lastRental(value) {
    this._lastRental = value;
  }

  /**
   * Serializa os dados do cliente em um objeto simples.
   * @returns {Object}
   */
  toObject() {
    const base = super.toObject();

    return {
      ...base,
      totRent: this._totRent,
      lastRental: this._lastRental
    };
  }
}