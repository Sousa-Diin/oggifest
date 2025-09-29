function handleCreate (e){

    const data = e.parameter;
   // Validação básica
    const requiredFields = ['telefone','cliente', 'pedido', 'saida', 'horario', 'entrega', 'status', 'quantidade', 'valor'];
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


    // Atualiza apenas a data do item recém-adicionado
    const repoRent = new RentalCountPerDayRepository();
    const findExistente = repoRent.getAllAsObject()
    const existente = findExistente.find(find => toDateString(find.saida) === toDateString(data.saida));

        // se data.saida já vem "2026-01-21", salve exatamente assim:
    if (existente) {
      existente.quantidade++;
      repoRent.update(existente.id, existente); // corrige incremento também
      return response({
        status: 201,
        messagem: `Item atualizado in TABLE[RENTS].`,
        data: existente
      });
    } else {
      repoRent.create({
        ...data,
        quantidade: 1
      });

      return response({
        status: 200,
        message: "Produto adicionado com sucesso.",
        data: appointmentCreated
      });
    }    
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
    }else if(found === 403){
      return response({
        status: 403,
        message: "Acesso Negado"        
      });
    }else{
      return response({
        status: 200,
        message: 'Item deletado com sucesso.',
        id
      });

    }

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

class AppointmentsController {
  constructor(appointmentsService){
    this.appointmentsService = appointmentsService;
  }

  handleCreate (e){
     
    const data = e.parameter;
  /*   // Validação básica
    const requiredFields = ['telefone','cliente', 'pedido', 'saida', 'horario', 'entrega', 'status', 'quantidade','valor'];
    const missing = requiredFields.filter(key => !data[key]);
    if (missing.length > 0) {
      return response({
        status: 400,
        message: `Campos obrigatórios faltando: ${missing.join(', ')}`
      });
    } */
    
    const appointmentCreated = this.appointmentsService.createAppointment(data);
    if(!appointmentCreated){
       return response({
        status: 409,
        message: `Limite de agendamentos por dia atingido para o dia - "${toDateString(data.saida)}".` 
      });
    }
    return response({
      status: 200,
      message: "Item adicionado com sucesso.",
      data: appointmentCreated
    });
  
  }

  handleUpdate(e) {
    try {
      const id = e.parameter.id;
      const data = e.parameter; //25/09/2025

      if (!id) {
        return response({
          status: 400,
          message: 'Parâmetro "id" é obrigatório.'
        });
      }

      const updatedAppointment = this.appointmentsService.updateAppointment(id, data);

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

  handleDelete(e) {
    try {
      const id = e.parameter.id;
      let found = false;

      found = this.appointmentsService.deleteAppointment(id);

      if (!found) {
        return response({
          status: 404,
          message: 'ID não encontrado.',
          id
        });
      }else if(found === 403){
        return response({
          status: 403,
          message: "Acesso Negado"        
        });
      }else{
        return response({
          status: 200,
          message: 'Item deletado com sucesso.',
          id
        });

      }

    } catch (error) {
      return response({
        status: 500,
        message: 'Erro interno: ' + error.message
      });
    }
  }
   


}
