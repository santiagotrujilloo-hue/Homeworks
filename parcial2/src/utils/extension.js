// "notas.txt" → "txt"
export const extension = (nombre) => {
  const i = nombre.lastIndexOf(".");
  return i > 0 ? nombre.slice(i + 1).toLowerCase() : "";
};
