class CoWorkRepository extends BaseRepository {
  constructor(){
    super('CoWorks',
    ['id','cod','telefone','nome','email','password','permision','adress','criacao']);
  }

  create(data){
    return super.create(data,'cod');
  }
}

