class AppointmentRepository extends BaseRepository {
  constructor(){
    super(
      'Appointments',
      ['Id', 'Telefone',	'Cliente',	'Pedido',	'Saida',	'Horario',	'Entrega',	'Status',	'Quantidade',	'Valor','Criacao']
    );
  }

  create(data){
    return super.create(data, 'Id');
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
  
}
