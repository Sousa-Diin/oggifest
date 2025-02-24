import React from "react";

const StatusCheckpoint = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <label className="text-gray-700 font-medium">Status:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 border rounded-md bg-white shadow-sm text-gray-700"
      >
        <option value="Pago">Pago</option>
        <option value="Entrada">Entrada</option>
        <option value="Agendado">Agendado</option>
      </select>
    </div>
  );
};

export default StatusCheckpoint;

