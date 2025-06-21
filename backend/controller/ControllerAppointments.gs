function handleCreate (e){

    const data = e.parameter;
   // Validação básica
    const requiredFields = ['Telefone','Cliente', 'Pedido', 'Saida', 'Horario', 'Entrega', 'Status', 'Quantidade', 'Valor'];
    const missing = requiredFields.filter(key => !data[key]);

    if (missing.length > 0) {
      return response({
        status: 400,
        message: `Campos obrigatórios faltando: ${missing.join(', ')}`
      });
    }

    const repoAppointment = new AppointmentRepository();
    const appointmentCreated = repoAppointment.create(data);

    if(!appointmentCreated){
       return response({
        status: 409,
        message: `Produto com código "${data.Id}" já existe.`
      });
    }
    
    return response({
      status: 200,
      message: "Produto adicionado com sucesso.",
      data: appointmentCreated
    });
}


function handleDelete(e) {
  try {
    const id = e.parameter.id;
    let found = false;

    const repoAppointment = new AppointmentRepository();
    found = repoAppointment.delete(id);     

    if (!found) {
      return response({
        status: 404,
        message: 'ID não encontrado.',
        id
      });
    }
    return response({
      status: 200,
      message: 'Item deletado com sucesso.',
      id
    });

  } catch (error) {
    return response({
      status: 500,
      message: 'Erro interno: ' + error.message
    });
  }
}


function handleUpdate(e) {
  try {
    const id = e.parameter.id;
    if (!id) {
      return response({
        status: 400,
        message: 'Parâmetro "id" é obrigatório.'
      });
    }

    const repoAppointment = new AppointmentRepository();
    const updatedAppointment = repoAppointment.update(id, e.parameter);

    if (!updatedAppointment) {
      return response({
        status: 404,
        message: 'ID não encontrado.',
        id
      });
    }

    const { route, method, ...cleanedAppointment } = updatedAppointment;

    return response({
      status: 201,
      message: 'Item atualizado com sucesso.',
      id,
      updated: cleanedAppointment
    });

  } catch (error) {
    return response({
      status: 500,
      message: 'Erro interno: ' + error.message
    });
  }
}

