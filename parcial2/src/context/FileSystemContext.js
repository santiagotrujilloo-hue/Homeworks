import { createContext } from "react";

// Contexto del sistema de archivos: comparte el árbol n-ario entre componentes
const FileSystemContext = createContext(null);

export default FileSystemContext;
