class AppointmentRepository extends BaseRepository {
  constructor(){
    super(
      'Appointments',
      ['id', 'telefone',	'cliente',	'pedido',	'saida',	'horario',	'entrega',	'status',	'quantidade',	'valor','criacao']
    );
  }

  create(data){
    return super.create(data, 'id');
  }

  /**
   * Retorna um produto com o cod especificado.
   *
   * @param {string|number} cod - Código do produto.
   * @returns {Object|null} Produto correspondente ou null se não encontrado.
   */
  getByCod(id) {
    const allAppointments = this.getAllAsObject();
  
    const found = allAppointments.find(prod => String(prod.Id) === String(id));
  
    return found || null;
  }
  
  /**
   * Só é permitido excluir os dados de usuários com permissão de superusuário -> [sudo].
   * Caso contrário, usuários não autorizados devem apenas trocar o status para "Cancelado",
   * a fim de manter os registros para futura prospecção de clientes.
   */
  delete(id) {
    const appointment = super.getById(id); // Busca o agendamento pelo ID

    if (!appointment) {
      return null; // Agendamento não encontrado
    }

    const allowedUser = false; // Exemplo: getPermission(userID) === 'sudo'

    if (allowedUser) {
      super.delete(id); // Exclusão real permitida
      return true;
    }

    // Usuário não é sudo: tentar cancelamento
    if (appointment.status === "Agendado") {
      appointment.status = "Cancelado"; // Altera o status
      super.update(id, appointment);     // Atualiza o registro
      return true; // Sucesso na mudança de status
    }

    return 403; // Acesso negado: não tem permissão e o status não é "Agendado"
  }

}