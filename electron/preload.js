const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Aqui você pode expor APIs do Electron para o frontend
});
