/**
 * Endpoint GET da Web API.
 * 
 * Este método é usado para buscar todos os agendaentos ou apenas um agendamento específico
 * com base no nome (Cliente) passado como parâmetro na URL.
 * 
 * Exemplo de chamada:
 *   GET https://script.google.com/macros/s/SEU_SCRIPT_ID/exec?client=bruno
 * 
 * @param {Object} e - Objeto do evento HTTP GET com os parâmetros da URL.
 * @returns {TextOutput} - Um JSON com os dados do(s) agendamento(s).
 */
function doGet(e) {

  if (e.parameter.route !== 'appointments') {
    return response({
      status: 400,
      message: 'Rota inválida ou não especificada.'
    });
  }
  const client = e.parameter.client; // Recebe o código via URL
  Logger.log('Cliente.: ' + client);

  const repoClient = new AppointmentRepository() 

  // Se foi passado um cliente, retorna apenas o client correspondente
  if (client) {
    const finderClientByCod = repoClient.getByCod(client);

    if (!finderClientByCod) {
      return response({
        status: 404,
        message: 'Código não encontrado.'
      });
    }

    return response({
      status: 200,
      message: 'Agendamento encontrado com sucesso.',
      finderClientByCod
    });
  }
  const allAppointments = repoClient.getAllAsObject();
  // Caso nenhum código tenha sido passado, retorna todos os produtos
  return response({
    status: 200,
    message: 'Agendamentos recuperados com sucesso.',
    allAppointments
  });
}

/**
 * Endpoint POST da Web API.
 * 
 * Permite criar, atualizar ou deletar agendamentos na aba "Appointments" da planilha.
 * A ação é definida por meio do parâmetro `method` enviado via POST.
 * 
 * Exemplo de chamada:
 *   POST https://script.google.com/macros/s/SEU_SCRIPT_ID/exec
 *   Body: method=CREATE&client=pedro&order=15&...
 * 
 * @param {Object} e - Objeto do evento HTTP POST, contendo os parâmetros enviados.
 * @returns {TextOutput} - Um JSON com status e mensagem do resultado da operação.
 */
function doPost(e) {
  const lock = LockService.getScriptLock(); // Garante execução única por vez

  try {
    lock.waitLock(10000); // Espera até 10s para obter o lock

    const method = (e.parameter.method || '').toUpperCase(); // Normaliza o método para upper case

    switch (method) {
      case 'CREATE':
        return handleCreate(e); // Chama a função para criar item

      case 'UPDATE':
        return handleUpdate(e); // Chama a função para atualizar item

      case 'DELETE':
        return handleDelete(e); // Chama a função para deletar item

      default:
        return response({
          status: 400,
          message: 'Método inválido. Use method=DELETE, CREATE, etc.'
        });
    }

  } catch (error) {
    // Retorna erro interno em caso de exceção
    return response({
      status: 500,
      message: 'Erro interno: ' + error.message
    });

  } finally {
    lock.releaseLock(); // Libera o lock para outras execuções
  }
}
 