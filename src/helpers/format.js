export const formatCOP = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);

export const STATUS = {
  pendiente: 'Pendiente',
  preparando: 'Preparando',
  en_camino: 'En camino',
  entregado: 'Entregado',
};

export const authErrorMessage = (code) =>
  ({
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/email-already-in-use': 'Ese correo ya tiene una cuenta. Inicia sesión.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email': 'Escribe un correo válido.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
  })[code] ?? 'No pudimos completar la acción. Intenta de nuevo.';

export const seconds = (order) => order.createdAt?.seconds ?? Date.now() / 1000;
