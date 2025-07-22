import React, { useEffect, useRef } from 'react';
import Cleave from 'cleave.js';

export default function TelefoneInput({ value, onChange }) {
  const inputRef = useRef(null);
  const cleaveRef = useRef(null);
  const STORAGE_KEY = 'telefoneInput';

  // Salva no localStorage ao alterar
  const handleValueChange = (rawValue) => {
    localStorage.setItem(STORAGE_KEY, rawValue);
    onChange(rawValue);
  };

  useEffect(() => {
    if (inputRef.current) {
      cleaveRef.current = new Cleave(inputRef.current, {
        delimiters: ['(', ') ', '-'],
        blocks: [0, 2, 5, 4],
        numericOnly: true,
        onValueChanged: (e) => {
          handleValueChange(e.target.rawValue); // valor limpo
        }
      });

      // Carrega valor salvo se o `value` estiver vazio
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!value && saved) {
        cleaveRef.current.setRawValue(saved);
        onChange(saved);
      }
    }

    return () => {
      cleaveRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (cleaveRef.current && value !== cleaveRef.current.getRawValue()) {
      cleaveRef.current.setRawValue(value);
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="(00) 00000-0000"
      className="w-full p-1 bg-gray-100 rounded shadow"
      required
    />
  );
}

