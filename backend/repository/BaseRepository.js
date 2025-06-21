/**
 * Classe base para manipulação de dados em planilhas do Google Sheets.
 * Abstrai operações comuns como criação da sheet, inserção e consulta de dados.
 *
 * @class
 */
class BaseRepository {
  /**
   * Cria uma nova instância de BaseRepository.
   *
   * @param {string} sheetTableName - O nome da aba (sheet) da planilha.
   * @param {string[]} tableHeaderArray - Os cabeçalhos da tabela, utilizados para criar a sheet, se necessário.
   */
  constructor(sheetTableName, tableHeaderArray) {
    try{
      if (new.target === BaseRepository) {
      throw new Error("A classe BaseRepository é abstrata e não pode ser instanciada diretamente.");
      }
      Logger.log("Classe herdada corretamente.");
       
      /**
       * Nome da tabela (aba da planilha).
       * @private
       * @type {string}
       */
      this.__sheetTableName = sheetTableName;
  
      /**
       * Objeto da planilha associada.
       * @private
       * @type {GoogleAppsScript.Spreadsheet.Sheet}
       */
      this.__sheetTable = this.__createSheetIfNotExists(sheetTableName, tableHeaderArray);
  
      /**
       * Data de criação da instância do repositório.
       * @private
       * @type {Date}
       */
      this.__createdDate = new Date();
  
      /**
       * Cabeçalhos da planilha.
       * @private
       * @type {string[]}
       */
      this.__headers = this.getHeader();
      
    }catch(error){
      Logger.log(error)
    }
  }

  /**
   * Cria a planilha se ela ainda não existir no banco de dados (Spreadsheet).
   *
   * @private
   * @params {string} sheetTableName - Nome da aba.
   * @params {string[]} tableHeaderArray - Cabeçalhos da tabela.
   * @returns {GoogleAppsScript.Spreadsheet.Sheet} A aba existente ou recém-criada.
   */
  __createSheetIfNotExists(sheetTableName, tableHeaderArray) {
    const sheetTableId = getProperKey('OF_DATABASE_ID');
    const dataBaseSpreadSheet = SpreadsheetApp.openById(sheetTableId);
    let sheetTable = dataBaseSpreadSheet.getSheetByName(sheetTableName);

    if (!sheetTable) {
      sheetTable = dataBaseSpreadSheet.insertSheet(sheetTableName);
      Logger.log('success, ' + sheetTable + ' created.');
      sheetTable.appendRow(tableHeaderArray);
    }

    Logger.log('Exists, ' + sheetTable);
    return sheetTable;
  }

  /**
   * Retorna o número total de linhas da tabela (incluindo cabeçalho).
   *
   * @private
   * @returns {number} Número de linhas.
   */
  __getSize() {
    const data = this.__sheetTable.getDataRange().getValues();
    return data.length;
  }

  /**
   * Verifica se a tabela está vazia (apenas cabeçalho).
   *
   * @returns {boolean} True se vazia, false caso contrário.
   */
  isEmpyt() {
    return this.__getSize() === 1;
  }

  /**
   * Retorna o ID da aba da planilha.
   *
   * @returns {number} ID da sheet.
   */
  getSheetTableId() {
    return this.__sheetTable.getSheetId();
  }

  /**
   * Retorna o nome da aba da planilha.
   *
   * @returns {string} Nome da sheet.
   */
  getSheetTableName() {
    return this.__sheetTable.getSheetName();
  }

  /**
   * Retorna a data de criação da instância da tabela.
   *
   * @returns {Date} Data de criação.
   */
  getSheetTableCreatedAt() {
    return this.__createdDate;
  }

  /**
   * Recupera os cabeçalhos da planilha.
   *
   * @returns {string[]} Lista de cabeçalhos.
   */
  getHeader() {
    const lastCol = this.__sheetTable.getLastColumn();

    if (lastCol === 0) {
      Logger.log('Error: a planilha não contém coluna.');
      return [];
    }

    const allHeaders = this.__sheetTable.getRange(1, 1, 1, lastCol).getValues()[0];

    if (allHeaders.every(cell => !cell || cell.toString().trim() === '')) {
      Logger.log('Error: cabeçalho vazio ou não definido: ' + JSON.stringify(allHeaders));
    }
    const headers = allHeaders.map(columnsName => {
      const lowerHeader = columnsName.toLowerCase();
      return lowerHeader;
    });

    return headers;
  }

/**
 * Converte um objeto de dados em um array ordenado conforme os cabeçalhos da planilha.
 * @private
 * @param {Object} data - Objeto com os dados a serem formatados.
 * @returns {Array} Array representando a linha a ser inserida na planilha.
 */
__convertObjToRow(data) {
  const headers = this.getHeader();

  const newObjRow = headers.map(columnsName => {
    const lowerHeader = columnsName.toLowerCase();

    if (lowerHeader === 'id') {
      // Usa o ID existente, ou cria um novo se não tiver
      const idKey = Object.keys(data).find(k => k.toLowerCase() === 'id');
      return idKey && data[idKey] ? data[idKey] : Utilities.getUuid();
    }

    if (lowerHeader === 'criacao') {
      // Usa data existente ou gera nova se não tiver
      const dateKey = Object.keys(data).find(k => k.toLowerCase() === 'criacao');
      return dateKey && data[dateKey] ? new Date(data[dateKey]) : new Date();
    }

    const key = Object.keys(data).find(k => k.toLowerCase() === lowerHeader.toLowerCase());
    return key ? data[key] : '';
  });

  Logger.log('Nova linha formatada: ' + JSON.stringify(newObjRow));
  return newObjRow;
}



  /**
   * Converte uma linha de dados em um objeto com base nos headers.
   *
   * @params {Array<string>} headers - Lista de nomes das colunas (cabeçalhos).
   * @params {Array<any>} row - Linha de dados da planilha.
   * @returns {Object} Objeto representando a linha.
   */
  convertRowToObject(row) {
    const headers = this.getHeader();
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx];
    });

    return obj;
  }

  /**
  * Cria uma nova linha na planilha com os dados fornecidos,
  * apenas se o ID e outro campo único ainda não existirem.
  *
  * @param {Object} data - Dados a serem inseridos.
  * @param {string} uniqueField - Nome de um segundo campo que também deve ser único.
  * @returns {Object|null} Objeto inserido ou null se já existir.
  */
  create(data, uniqueField) {
    const idKey = Object.keys(data).find(k => k.toLowerCase() === 'Id');
    const idValue = idKey && data[idKey];
  
    // 1. Verifica se o ID já existe
    if (idValue && this.getById && typeof this.getById === 'function') {
      const existingById = this.getById(idValue);
      if (existingById) {
        Logger.log(`[CREATE_ROW] ID já existe (${idValue}), nada foi inserido.`);
        return null;
      }
    }
  
    // 2. Verifica se o valor do campo único já existe
    if (uniqueField) {
      const uniqueKey = Object.keys(data).find(k => k.toLowerCase() === uniqueField.toLowerCase());
      const uniqueValue = uniqueKey && data[uniqueKey];
  
      if (uniqueValue && this.__findElementInFieldByRow(uniqueValue, uniqueField)) {
        Logger.log(`[CREATE_ROW] Valor único já existe no campo "${uniqueField}" (${uniqueValue}), nada foi inserido.`);
        return null;
      }
    }
  
    // 3. Insere nova linha
    const reqData = this.__convertObjToRow(data);
    this.__sheetTable.appendRow(reqData);
    Logger.log('[CREATE_ROW] ' + `[${this.getSheetTableName()}]: ` + JSON.stringify(reqData));
    return this.convertRowToObject(reqData);
  }


  /**
   * Procura uma linha na planilha onde o valor de um campo seja igual ao elemento fornecido.
   *
   * @private
   * @params {*} element - Valor a ser procurado.
   * @params {string} field - Nome do campo (coluna).
   * @returns {Array|null} Linha correspondente, se encontrada; caso contrário, null.
   */
  __findElementInFieldByRow(element, field) {
    const data = this.__sheetTable.getDataRange().getValues();
    const headers = this.getHeader();

    // 🛠️ Match case-insensitive
    const fieldIndex = headers.findIndex(h => h.toLowerCase() === field.toLowerCase());

    if (fieldIndex === -1) {
      Logger.log(`O campo "${field}" não existe.`);
      return null;
    }

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (String(row[fieldIndex]) === String(element)) {
        return row;
      }

    }

    Logger.log(`Elemento "${element}" não encontrado no campo "${field}".`);
    return null;
  }


  /**
   * Retorna todos os dados da tabela, incluindo o cabeçalho.
   *
   * @returns {Array[]} Matriz de dados da planilha.
   */
  getAll() {
    const table = this.__sheetTable;
    const data = table.getDataRange().getValues();
    //return JSON.parse(JSON.stringify(data)); // Deep clone
    return JSON.parse(JSON.stringify(data)); // Deep clone
  }

  /**
   * Retorna todos os registros como objetos, ignorando o cabeçalho.
   *
   * @returns {Array<Object>} Lista de registros.
   */
  getAllAsObject() {
    const data = this.getAll();
    const objects = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      objects.push(this.convertRowToObject(row));
    }

    return objects;
  }

  /**
   * Conta quantas vezes cada valor aparece em um campo específico.
   *
   * @params {string} fieldName - Nome do campo.
   * @returns {Object} Objeto com contagem por valor.
   */
  countByField(fieldName) {
    const headers = this.getHeader();
    const fieldIndex = headers.indexOf(fieldName);
    const data = this.getAll();
    const counts = {};
    if (fieldIndex === -1) return null;
    for (let i = 1; i < data.length; i++) {
      const value = data[i][fieldIndex];
      counts[value] = (counts[value] || 0) + 1;
    }

    return counts;
    }


  /**
   * Retorna o registro solicitado através do id
   * 
   * @params { String } ID
   * @returns { Object|null } payload
   */
  getById(id){
    const searched = this.__findElementInFieldByRow(id, 'id');
    return searched;
  }

  /**
   * Retorna todos os registros onde o campo especificado é igual ao valor fornecido.
   *
   * @private
   * @param {string} field - Nome do campo (coluna).
   * @param {string} value - Valor que deve ser comparado.
   * @returns {Array<Object>|null} Lista de objetos com os registros filtrados ou null se o campo não existir.
   */
  __getAllByFieldName(field, value) {
    if (this.isEmpyt()) {
      Logger.log('A planilha está vazia.');
      return [];
    }

    const headers = this.getHeader();
    const fieldIndex = headers.indexOf(field);

    if (fieldIndex === -1) {
      Logger.log(`O campo "${field}" não existe.`);
      return null;
    }

    const data = this.getAll();
    const result = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[fieldIndex] === value) {
        result.push(this.convertRowToObject(row));
      }
    }

    return JSON.stringify(result);
  }

  
   /**
   * Atualiza um registro com base no ID.
   *
   * @param {string} id - Identificador único do registro.
   * @param {Object} newData - Objeto com os novos dados a atualizar.
   * @returns {Object|null} Registro atualizado ou null se não encontrado.
   */
  update(id, newData) {
    const headers = this.getHeader();
    const fieldIndex = headers.indexOf('id');
    const data = this.__sheetTable.getDataRange().getValues();

    if (fieldIndex === -1) {
      Logger.log(`Campo "id" não encontrado.`);
      return null;
    }
    
    const newDataNormalized = {};
    for (let key in newData) {
      newDataNormalized[key.toLowerCase()] = newData[key];
    }



    for (let i = 1; i < data.length; i++) {
      if (data[i][fieldIndex] === id) {
        // Mantém o id original, mesmo se vier no newData
        const currentRowAsObject = this.convertRowToObject(data[i]);
        const mergedData = { ...currentRowAsObject, ...newDataNormalized, id }; // Garante o id
        const updatedRow = this.__convertObjToRow(mergedData);

        this.__sheetTable.getRange(i + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
        Logger.log(`Registro com ID ${id} atualizado com sucesso.`);
        Logger.log(JSON.stringify(mergedData, null, 2));


        return mergedData;
      }
    }

    Logger.log(`ID ${id} não encontrado.`);
    return null;
  }


  /**
   * Remove um registro com base no ID.
   *
   * @params {string} id - Identificador único do registro.
   * @returns {boolean} True se removido com sucesso, false se não encontrado.
   */
  delete(id) {
    const headers = this.getHeader();
    const fieldIndex = headers.indexOf('id');
    const data = this.__sheetTable.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][fieldIndex] === id) {
        this.__sheetTable.deleteRow(i + 1); // +1 porque os dados começam da linha 2
        Logger.log(`Registro com ID ${id} removido com sucesso.`);
        return true;
      }
    }

    Logger.log(`Registro com ID ${id} não encontrado para exclusão.`);
    return false;
  }


}
