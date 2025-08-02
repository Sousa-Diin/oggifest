class ClientsRepository extends BaseRepository{
  constructor(){ 
    super('Clients',
    ['id','telefone','nome','email','adress','pedidos','criacao']);
  }

  create(data){
    return super.create(data, 'telefone');
  }
}