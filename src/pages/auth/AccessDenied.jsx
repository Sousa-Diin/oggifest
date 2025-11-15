import React from "react";
import { Lock } from "lucide-react"; // Ícone moderno (pode trocar se quiser)
import { Home } from "lucide-react";

function AccessDenied({ admins = [], onBackToHome }) {
  return (
    <div className="flex items-center justify-center h-[96dvh] bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg text-center">
        
        <div className="flex justify-center mb-5">
          <div className="bg-red-100 text-red-600 p-4 rounded-full">
            <Lock className="w-10 h-10" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-red-600 mb-3">
          Atenção!
        </h1>

        <p className="text-gray-700 font-medium text-lg mb-4">
          Seu perfil não tem acesso a essa página
        </p>

        <p className="text-gray-600 mb-6">
          Se necessário, solicite acesso ao(s) administrador(es) da sua empresa:
        </p>

        <div className="space-y-3 mb-6">
          {admins.length > 0 ? (
            admins.map((email, index) => (
              <div 
                key={index}
                className="bg-gray-50 border border-gray-200 py-2 px-4 rounded-lg text-gray-800 font-medium text-sm"
              >
                {email}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Nenhum administrador cadastrado</p>
          )}
        </div>

        <button
          onClick={() => onBackToHome('oggifest')}
          className="flex gap-2 items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
        >
          <Home className="w-5 h-5" />
          Voltar para Página Inicial
        </button>
      </div>
    </div>
  );
}

export default AccessDenied;

