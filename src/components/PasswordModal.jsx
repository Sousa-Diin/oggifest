import { useState } from "react";

const PasswordModal = ({ onClose, onConfirm }) => {
  const [senha, setSenha] = useState("");

  const handleConfirm = () => {
    onConfirm(senha);
    setSenha(""); // limpa depois
  };

  return (
    <div style={{backgroundColor:"rgba(0,0,0,.4)"}} 
    className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-bold mb-4">Digite a senha para editar</h2>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Senha"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-400 text-white rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-1 bg-[#37A2C2] text-white rounded"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
