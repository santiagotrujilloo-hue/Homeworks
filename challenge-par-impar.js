/* ============================================================
   CHALLENGE - REFUERZO JAVASCRIPT
   Diferencia entre Arrow Functions y Regular Functions +
   Función que indica si un número es par o impar
   Autor: (tu nombre aquí)
   ============================================================ */

/* ------------------------------------------------------------
   DIFERENCIA ENTRE ARROW FUNCTIONS Y REGULAR FUNCTIONS

   - Sintaxis: la regular usa la palabra "function", la arrow
     usa "=>".
   - this: la función regular tiene su propio "this". La arrow
     function NO tiene su propio "this", usa el del contexto
     donde fue creada.
   - arguments: la función regular tiene el objeto "arguments"
     disponible. La arrow function no lo tiene.
   - Constructor: la función regular se puede usar con "new".
     La arrow function no se puede usar como constructor.
   - Uso típico: la arrow function es ideal para funciones
     cortas y callbacks (map, filter, forEach, etc.)
   ------------------------------------------------------------ */

// 1. Función REGULAR
function esParOImparRegular(numero) {
  if (numero % 2 === 0) {
    console.log(`${numero} es PAR (función regular)`);
  } else {
    console.log(`${numero} es IMPAR (función regular)`);
  }
}

// 2. Arrow Function
const esParOImparArrow = (numero) => {
  if (numero % 2 === 0) {
    console.log(`${numero} es PAR (arrow function)`);
  } else {
    console.log(`${numero} es IMPAR (arrow function)`);
  }
};

// --- Pruebas ---
esParOImparRegular(10); // 10 es PAR (función regular)
esParOImparRegular(7);  // 7 es IMPAR (función regular)

esParOImparArrow(4);    // 4 es PAR (arrow function)
esParOImparArrow(15);   // 15 es IMPAR (arrow function)
