import React, { useEffect, useRef } from 'react';
import Cleave from 'cleave.js';

export default function TelefoneInput({ value = '', onChange }) {
  const inputRef = useRef(null);
  const cleaveRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      cleaveRef.current = new Cleave(inputRef.current, {
        delimiters: ['(', ') ', '-'],
        blocks: [0, 2, 5, 4],
        numericOnly: true,
        onValueChanged: (e) => {
          onChange(e.target.rawValue); // chama apenas o valor limpo
        }
      });
    }

    return () => {
      cleaveRef.current?.destroy();
    };
  }, []); // <-- só monta uma vez (sem dependências)

  useEffect(() => {
    // Atualiza o valor se mudar externamente
    if (cleaveRef.current && value !== cleaveRef.current.getRawValue()) {
      cleaveRef.current.setRawValue(value);
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      defaultValue={value}
      type="text"
      placeholder="(00) 00000-0000"
      className="w-full p-1 bg-gray-100 rounded shadow"
      required
    />
  );
}
