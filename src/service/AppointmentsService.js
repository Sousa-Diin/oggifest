import { googleScriptClient } from "../api/googleScriptClient.js";

export const getAllAppointments = () => googleScriptClient('appointments', 'GET');

export const getAppointmentByCod = (cod) => googleScriptClient('appointments', 'GET', { cod });

export const createAppointment = (dados) => googleScriptClient('appointments', 'POST', {
  method: 'CREATE',
  ...dados
});


export const updateAppointment = (dados) => googleScriptClient('appointments', 'POST', {
  method: 'UPDATE',
  ...dados
});

export const deleteAppointment = (id) => googleScriptClient('appointments', 'POST', {
  method: 'DELETE',
  id
});