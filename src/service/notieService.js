// src/services/notieService.js
import notie from 'notie';
import 'notie/dist/notie.css';

const Notie = {
  alert(type = 'success', text = 'Mensagem padrão', time = 3) {
    notie.alert({ type, text, time });
  },

  success(text) {
    this.alert('success', text);
  },

  error(text) {
    this.alert('error', text);
  },

  info(text) {
    this.alert('info', text);
  },

  warning(text) {
    this.alert('warning', text);
  },

  confirm(text = 'Tem certeza?', yesCallback = () => {}, noCallback = () => {}) {
    notie.confirm({
      text,
      submitText: 'Sim',
      cancelText: 'Cancelar',
      submitCallback: yesCallback,
      cancelCallback: noCallback
    });
  },

  input(labelText = 'Digite algo:', submitCallback = () => {}, type = 'text', placeholder = '', prefilledValue = '') {
    notie.input({
      text: labelText,
      type,
      placeholder,
      prefilledValue,
      submitText: 'Enviar',
      cancelText: 'Cancelar',
      submitCallback,
      cancelCallback: () => {}
    });
  },

  select(text = 'Escolha uma opção:', options = []) {
    notie.select({
      text,
      cancelText: 'Cancelar',
      choices: options.map(opt => ({
        text: opt.label,
        handler: opt.onClick
      }))
    });
  }
};

export default Notie;
