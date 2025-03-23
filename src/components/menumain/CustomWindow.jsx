import { useState } from "react";
import { X, Minus, Square } from "lucide-react";

export default function CustomWindow({open, handleClosenMenu}) {

  return (
    <div
      className='border rounded-lg shadow-lg bg-[--color-white] transition-all duration-300 w-[400px] h-[300px]'
    >
      <div className="flex  items-center justify-between px-3 py-2 bg-[--color-primary] text-[--color-white] rounded-t-lg">
        <span className="font-bold">Minha Janela</span>
        <div className="flex gap-2">
          <button className="hover:bg-[--color-orange] p-1 rounded">
            <Minus size={16} />
          </button>
          <button
            className="hover:bg-[--color-secondary] p-1 rounded"
            onClick={{}}
          >
            <Square size={16} />
          </button>
          <button className="hover:bg-[--color-purple] p-1 rounded">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="p-4 text-[--color-secondary]">Conteúdo da Janela...</div>
    </div>
  );
}
