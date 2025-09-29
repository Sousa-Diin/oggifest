class RentalCountPerDayRepository extends BaseRepository {//tabela/cache
  constructor(){
    super(
      'RENTS',
      ['id','saida',	'quantidade','criacao'] //tabela/resumo de quantidade por dia
    );
  }

  create(data){
    return super.create(data, 'saida');
  }

   /**
   * Retorna um produto com o cod especificado.
   *
   * @param {string|number} cod - Código do produto.
   * @returns {Object|null} Produto correspondente ou null se não encontrado.
   */
  getByCod(saida) {
    const allAppointments = super.getAllAsObject();
  
    const found = allAppointments.find(prod => String(prod.saida) === String(saida));
  
    return found || null;
  }
  getByDate(saida) {
    const allAppointments = super.getAllAsObject();
  
    const found = allAppointments.find(prod => String(prod.saida) === String(saida));
  
    return found || null;
  }

   
}
