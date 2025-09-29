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

function toKey(date) {
  return date.toISOString().split("T")[0]; // yyyy-mm-dd
}

function toDateString(date) {
  return String(date).split("T")[0]; 
}

function token(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function ajustarHora(dateInput) {
  const d = new Date(dateInput);

  // Pega hora e minuto no fuso local
  const horas = String(d.getHours()).padStart(2, "0");
  const minutos = String(d.getMinutes()).padStart(2, "0");

  return `${horas}:${minutos}`;
}

// Agrupa por data (saida)
function agruparPorSaida(dados) {
  const mapa = {};

  for (const item of dados) {
    if (!mapa[item.saida]) {
      mapa[item.saida] = { ...item, quantidade: 1 }; // primeira vez que aparece
    } else {
      mapa[item.saida].quantidade += 1; // só conta mais 1
    }
  }

  return Object.values(mapa);
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
  //const spreadsheetID = getProperKey('OF_DATABASE_ID');
  //const sheet = SpreadsheetApp.openById(spreadsheetID);
  //const allSheets = sheet.getSheets();
  /* 
  setProperKey('OGGI_FEST_ID',spreadsheetID );
  Logger.log(getProperKey('OGGI_FEST_ID')); */
  //Logger.log('Tabelas: \n');


  //const sheetList = allSheets.filter(name => name.getName().toString());
 // Logger.log(allSheets.map(n => n.getName().toString().toUpperCase()));

  const appointment = new AppointmentRepository();

  const pedido = {
   "Telefone": "35988888888",
   "Cliente": "Teste #115 nova base",
   "Pedido": 10,
   "Saida": "2025-09-23T03:00:00.000Z",
   "Horario": "13:00:00",
   "Entrega": "2025-09-23T03:00:00.000Z",
   "Status": "Entrada",
   "Quantidade": 150,
   "Valor": 355.95
  };

  const updateOrder = {
   "telefone": "12945657813",
   "cliente": "Wildes Sousa",
   "pedido": 10,
   "saida": new Date().toISOString().split('T')[0],
   "horario": "12:00:00",
   "entrega": "2024-06-21",
   "status": "Agendado",
   "quantidade": 1,
   "valor": 0
  };

  //const testCoWork = new CoWorkRepository();
  //Logger.log(testCoWork.getSheetTableName());

  //const testClient = new ClientsRepository();
  //Logger.log(testClient.getById());

  appointment.create(pedido);

  /* const currentApp = appointment.getById("16aa114c-93f4-4f53-884b-d597bd05f");//16aa114c-93f4-4f53-884b-d597bd05f314
  Logger.log("Util[Element]: " + JSON.stringify(currentApp));
  Logger.log("GET (Util) - [Appointment]: " + currentApp.status); */
   


 /*  const allAppointments = appointment.update('eaefe4d5-102a-439d-b947-8cede1b5476b',updateOrder);
  Logger.log('ById.: %s', JSON.stringify(allAppointments, null, 2)); */

  Logger.log('ById.: %s', JSON.stringify(appointment.getAll()[5], null, 2));

};

function createRental() {
  const appointment = new AppointmentRepository();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = "RENTS";

  // Se a aba já existe, deleta
  const existing = ss.getSheetByName(sheetName);

  if (existing) {
    ss.deleteSheet(existing);
  } 

  const rent = new RentalCountPerDayRepository();
  const dados = appointment.getAllAsObject();
  const agrupados = agruparPorSaida(dados);
  
  for (const appoint of agrupados) {
    rent.create(appoint); // sem await
  }
  
  Logger.log('Appointments populados com sucesso!');

  //Logger.log('ById.: %s', JSON.stringify(appointment.getAllAsObject()[5], null, 2));
  //Logger.log('ById.: %s', JSON.stringify(rent.getAllAsObject()[5], null, 2));

}

function findElementByfield(){
  const repoRent = new RentalCountPerDayRepository();
  const search = repoRent.getByCod("2025-10-12T03:00:00.000Z");
  Logger.log("Elemento encontrado.: " + JSON.stringify(search,null,2));
  search.quantidade += 1;

  const result = repoRent.update(search.id,{...search,quantidade:3});
  Logger.log("Elemento encontrado.: " + JSON.stringify(result,null,2));
 // Logger.log("Elemento encontrado.: " + JSON.stringify(repoRent.getAllAsObject()[29],null,2));
}

function pegarObjPelaChaveData(){
  const my_data = '2025-10-12T03:00:00.000Z';
  const allAgendamentos = new RentalCountPerDayRepository();
  const objAgendamentos = allAgendamentos.getAllAsObject();
  const chaveValorProcurado = objAgendamentos.find((search) => search.saida === my_data);

  var procurado = allAgendamentos.getByDate(my_data);

  if(!procurado){
    console.log("item não encontrado! ", procurado);

  }

  //Logger.log("Searched: " + JSON.stringify(procurado, null, 2));
  console.log("Chave-valor: ", chaveValorProcurado);
  //chaveValorProcurado.quantidade += 1;
  allAgendamentos.update(chaveValorProcurado.id, chaveValorProcurado);

  console.log("Chave-valor: ", chaveValorProcurado);
 // let finderByKey = {};
 // for(let increment = 0; increment < objAgendamentos.length; increment++){
 //   if (objAgendamentos[increment].saida === my_data){
 //     finderByKey = objAgendamentos[increment];

 //   }
 // }
 // console.log("[objProcurado]: ", finderByKey);
}

function newController(){
   const data = {
   "telefone": 35988451220,
   "cliente": "Teste #1290 nova base",
   "Pedido": 10,
   "saida": "2025-10-08T03:00:00.000Z",
   "horario": "13:00:00",
   "entrega": "2025-09-30T03:00:00.000Z",
   "status": "Agendado",
   "quantidade": 750,
   "valor": 355.95
  };

  const updateOrder = {
   "telefone": "12945657813",
   "cliente": "Wildes Sousa",
   "pedido": 10,
   "saida": new Date(),
   "horario": '12:00:00',
   "entrega": "2025-09-26",
   "status": "Agendado",
   "quantidade": 1,
   "valor": 0
  };

  const repo = new AppointmentRepository();
  const rentalCount = new RentalCountPerDayRepository();
  const service = new AppointmentsService(repo,rentalCount);
  const controller = new AppointmentsController(service);

  controller.handleCreate(data);
  //controller.handleUpdate('bde2be28-77cc-4964-871e-68e022e00294',updateOrder);
  //controller.handleDelete('bde2be28-77cc-4964-871e-68e022e00294');
}

const arredondaCount = (count) => {
   // calcula quantos carrinhos precisa
    const r = Math.min(Math.floor((count/ CART_CAPACITY) < 1 
      ? 1 
      : (count/ CART_CAPACITY)), ICE_CREAM_CART);

  if( r < 1){
    console.info('menor que um -> ' + r);
    return;
  }
  console.warn('Resultado.: ' + r);
}

function testCount(){
  arredondaCount(650);
}