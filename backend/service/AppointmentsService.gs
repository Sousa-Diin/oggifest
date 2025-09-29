class AppointmentsService {
  constructor(appointmentsRepository,rentalCountPerDayRepository){
    this.appointmentsRepository = appointmentsRepository;
    this.rentalCountPerDayRepository = rentalCountPerDayRepository;
    this.MAX_PER_DAY = ICE_CREAM_CART;
  }

  __searchAppointments(day) {
    const getAllRents =  this.rentalCountPerDayRepository.getAllAsObject(); // Retorna todos os agendamento(RENTS)
    const objProcurado = getAllRents.find(find => toDateString(find.saida) === toDateString(day)); //retorna obj(agendamento) do dia solicitado
    return objProcurado;
  }

  __getCarQuantity(day) {
    const objAppointment = this.__searchAppointments(day);
    return objAppointment?.quantidade ?? 0;
  }

  __scheduleAppointments(data) {
    const day = data.saida;  // normaliza data principal

    const prevDay = new Date(day);
    prevDay.setUTCDate(prevDay.getUTCDate() - 1);

    // cria cópia
    const nextDay = new Date(day);
    // soma +1 dia (mantendo UTC)
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    //👉 Para forçar o formato 2025-09-30T03:00:00.000Z (UTC ISO), basta usar .toISOString() na hora de comparar.

    console.log("nextDay: ", nextDay);
    console.log("nextDay[toISOString]: ", nextDay.toISOString());
    console.log("prevDay[toISOString]: ", prevDay.toISOString());

    // Buscar registros existentes
    let currentDay = this.__searchAppointments(day); 
    let tomorrow = this.__searchAppointments(nextDay.toISOString()); 

    let created = {};

    console.log("currentDay Obj: ", currentDay);
    console.log("nextDay OBJ: ", tomorrow);

    if (!day || !nextDay) {
      console.error("Data inválida:", day);
      return null;
    }

    // calcula quantos carrinhos precisa
    const r = Math.min(Math.floor((data.quantidade/ CART_CAPACITY) < 1 
      ? 1 
      : (data.quantidade/ CART_CAPACITY)), ICE_CREAM_CART);

    // quantidade de carrinhos já ocupados no dia anterior
    const b = parseInt(this.__getCarQuantity(prevDay.toISOString()));
    const c = parseInt(this.__getCarQuantity(day));
    const p = parseInt(this.__getCarQuantity(nextDay.toISOString()));//👉 Para forçar o formato 2025-09-30T03:00:00.000Z (UTC ISO), basta usar .toISOString() na hora de comparar.
    const k = ICE_CREAM_CART;

    console.log("Dia:", day,"A: ",b, "| C:", c,  "| P:", p,"| R:", r, "| K:", k);
  

    // agora considera anterior + atual + próximo
    const available = (b + r <= k) && (c + r <= k) && (p + r <= k);

    if (available) {
      // 🔹 Se não existir registro para o dia → cria
      if (!currentDay) {
        currentDay = this.rentalCountPerDayRepository.create({
          saida: day,
          quantidade: r
        });
      }
      else{ 
        if (currentDay.quantidade < ICE_CREAM_CART) {// 🔹 Atualiza ou cria dependendo da quantidade
          currentDay.quantidade++;
          this.rentalCountPerDayRepository.update(currentDay.id, currentDay);
        } else {
          this.rentalCountPerDayRepository.create({ ...data, quantidade: r });
        }
      } 
      // Cria o agendamento
      created = this.appointmentsRepository.create(data);
      console.log("Agendamento realizado para", day);
      return created;

    } else {
      console.log("Dia indisponível:", day);
      return null;
    }
  }

  createAppointment(data){
    return this.__scheduleAppointments(data);
    
  }

  updateAppointment(id, data){
    return this.appointmentsRepository.update(id, data);
  }

  removeAppointment(){}

  deleteAppointment(id){
    
    return this.appointmentsRepository.delete(id);
  }
}