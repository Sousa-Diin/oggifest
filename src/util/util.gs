/**
 * Função de resposta padronizada para todas as operações.
 * @param {Object} res - Parâmetros da resposta.
 * @returns {ContentService.TextOutput} Resposta formatada.
 */
function response (res){
  return ContentService
    .createTextOutput(JSON.stringify(res))
    .setMimeType(ContentService.MimeType.JSON);


}


function setProperKey(key, value){
  const proper = PropertiesService.getScriptProperties();
  proper.setProperty(key,value);
  Logger.log('Success [' + key + '], stored');
}

function getProperKey(key){
  const proper = PropertiesService.getScriptProperties();
  Logger.log('Success [' + key + '], recovered');
  return proper.getProperty(key);
}

function converterParaMaiusculaInicial(nome) {
  const preposicoes = ["de", "da", "do", "das", "dos"];
  const palavras = nome.toLowerCase().split(" ");

  const nomeFormatado = palavras.map((palavra, index) => {
    if (preposicoes.includes(palavra) && index !== 0) {
      return palavra; // mantém em minúsculo se for preposição e não for a primeira palavra
    }
    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
  }).join(" ");

  return nomeFormatado;
}


function testStorage (){
  const spreadsheetID = getProperKey('OF_DATABASE_ID');
  const sheet = SpreadsheetApp.openById(spreadsheetID);
  const allSheets = sheet.getSheets();/* 
  setProperKey('OGGI_FEST_ID',spreadsheetID );
  Logger.log(getProperKey('OGGI_FEST_ID')); */
  Logger.log('Tabelas: \n');


  const sheetList = allSheets.filter(name => name.getName().toString());
  Logger.log(allSheets.map(n => n.getName().toString().toUpperCase()));

  const appointment = new AppointmentRepository();

  const pedido = {
   "Telefone": "35988888888",
   "Cliente": "Carol",
   "Pedido": 10,
   "Saida": "2024-07-20",
   "Horario": "13:00:00",
   "Entrega": "2024-07-21",
   "Status": "Entrada",
   "Quantidade": 150,
   "Valor": 355.95
  };

  const updateOrder = {
   "Cliente": "Wildes Sousa",
   "Pedido": 10,
   "Saida": "2024-06-20",
   "Horario": "12:00:00",
   "Entrega": "2024-06-21",
   "Status": "Agendado",
   "Quantidade": 1,
   "Valor": 0
  };

  //const testCoWork = new CoWorkRepository();
  //Logger.log(testCoWork.getSheetTableName());

  //const testClient = new ClientsRepository();
  //Logger.log(testClient.getById());

  //appointment.create(pedido);
  const currentApp = appointment.getById("16aa114c-93f4-4f53-884b-d597bd05f");//16aa114c-93f4-4f53-884b-d597bd05f314
  Logger.log("Util[Element]: " + JSON.stringify(currentApp));
  Logger.log("GET (Util) - [Appointment]: " + currentApp.status);
   


  /* const allAppointments = appointment.update('8a14a0be-5026-4e25-bbc3-6d0364ead36c',updateOrder);
  Logger.log('ById.: %s', JSON.stringify(allAppointments, null, 2)); */


}
