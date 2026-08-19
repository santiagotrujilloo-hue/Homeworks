/* ============================================================
   TAREA 
   Investigar y usar todas las funciones de Arrays
   Autor: Santiago Trujillo Ortiz
   ============================================================ */

const numbers = [5, 12, 8, 3, 20, 1];
const fruits = ['manzana', 'pera', 'uva'];

console.log('Array original:', numbers);
console.log('---------------------------------------------');

// 1. push() -> agrega un elemento al FINAL del array
const arrPush = [1, 2, 3];
arrPush.push(4);
console.log('push():', arrPush); // [1, 2, 3, 4]

// 2. pop() -> elimina y devuelve el ÚLTIMO elemento
const arrPop = [1, 2, 3];
const lastRemoved = arrPop.pop();
console.log('pop():', arrPop, '| eliminado:', lastRemoved); // [1,2] | 3

// 3. unshift() -> agrega un elemento al INICIO del array
const arrUnshift = [2, 3, 4];
arrUnshift.unshift(1);
console.log('unshift():', arrUnshift); // [1, 2, 3, 4]

// 4. shift() -> elimina y devuelve el PRIMER elemento
const arrShift = [1, 2, 3];
const firstRemoved = arrShift.shift();
console.log('shift():', arrShift, '| eliminado:', firstRemoved); // [2,3] | 1

// 5. splice() -> agrega, elimina o reemplaza elementos en cualquier posición
const arrSplice = [1, 2, 3, 4, 5];
const removed = arrSplice.splice(1, 2, 'a', 'b', 'c');
console.log('splice():', arrSplice, '| eliminados:', removed);

// 6. fill() -> rellena posiciones del array con un valor fijo
const arrFill = [1, 2, 3, 4];
arrFill.fill(0, 1, 3);
console.log('fill():', arrFill); // [1, 0, 0, 4]

// 7. copyWithin() -> copia una parte del array dentro de sí mismo
const arrCopyWithin = [1, 2, 3, 4, 5];
arrCopyWithin.copyWithin(0, 3);
console.log('copyWithin():', arrCopyWithin); // [4, 5, 3, 4, 5]

console.log('---------------------------------------------');

// 8. at() -> devuelve el elemento en un índice (acepta negativos)
console.log('at(-1):', numbers.at(-1)); // último elemento
console.log('at(0):', numbers.at(0));   // primer elemento

// 9. indexOf() -> índice de la primera aparición de un valor
console.log('indexOf(8):', numbers.indexOf(8));

// 10. lastIndexOf() -> índice de la última aparición de un valor
console.log('lastIndexOf(2):', [1, 2, 3, 2, 1].lastIndexOf(2));

// 11. includes() -> true/false si el array contiene ese valor
console.log('includes(8):', numbers.includes(8));

// 12. find() -> primer elemento que cumple una condición
console.log('find() > 10:', numbers.find(n => n > 10));

// 13. findIndex() -> índice del primer elemento que cumple la condición
console.log('findIndex() > 10:', numbers.findIndex(n => n > 10));

// 14. findLast() -> último elemento que cumple una condición
console.log('findLast() < 10:', numbers.findLast(n => n < 10));

// 15. findLastIndex() -> índice del último elemento que cumple la condición
console.log('findLastIndex() < 10:', numbers.findLastIndex(n => n < 10));

console.log('---------------------------------------------');

// 16. map() -> crea un array nuevo transformando cada elemento
console.log('map() x2:', numbers.map(n => n * 2));

// 17. filter() -> crea un array nuevo solo con los que cumplen la condición
console.log('filter() pares:', numbers.filter(n => n % 2 === 0));

// 18. flat() -> aplana arrays anidados
console.log('flat():', [1, [2, 3], [4, [5, 6]]].flat());
console.log('flat(2):', [1, [2, 3], [4, [5, 6]]].flat(2));

// 19. flatMap() -> hace map() y flat(1) en un solo paso
console.log('flatMap():', [1, 2, 3].flatMap(n => [n, n * 2]));

// 20. slice() -> extrae una parte del array sin modificar el original
console.log('slice(1,3):', numbers.slice(1, 3));

// 21. concat() -> une dos arrays en uno nuevo
console.log('concat():', [1, 2].concat([3, 4]));

console.log('---------------------------------------------');

// 22. reduce() -> reduce el array a un solo valor (de izquierda a derecha)
console.log('reduce() suma:', numbers.reduce((acc, n) => acc + n, 0));

// 23. reduceRight() -> igual que reduce() pero de derecha a izquierda
console.log('reduceRight():', ['a', 'b', 'c'].reduceRight((acc, n) => acc + n, ''));

console.log('---------------------------------------------');

// 24. every() -> true si TODOS los elementos cumplen la condición
console.log('every() > 0:', numbers.every(n => n > 0));

// 25. some() -> true si AL MENOS UNO cumple la condición
console.log('some() > 15:', numbers.some(n => n > 15));

console.log('---------------------------------------------');

// 26. forEach() -> ejecuta una función por cada elemento (no retorna nada)
console.log('forEach():');
fruits.forEach(fruit => console.log(' -', fruit));

// 27. entries() -> iterador de pares [índice, valor]
console.log('entries():');
for (const [index, value] of fruits.entries()) {
  console.log(' ', index, ':', value);
}

// 28. keys() -> iterador con los índices del array
console.log('keys():', [...fruits.keys()]);

// 29. values() -> iterador con los valores del array
console.log('values():', [...fruits.values()]);

console.log('---------------------------------------------');

// 30. sort() -> ordena el array (modifica el original)
console.log('sort() asc:', [...numbers].sort((a, b) => a - b));
console.log('sort() desc:', [...numbers].sort((a, b) => b - a));

// 31. reverse() -> invierte el orden del array
console.log('reverse():', [...numbers].reverse());

console.log('---------------------------------------------');

// 32. join() -> une los elementos en un string con un separador
console.log('join(" - "):', fruits.join(' - '));

// 33. toString() -> convierte el array a texto simple
console.log('toString():', numbers.toString());

// 34. toLocaleString() -> convierte el array a texto (formato regional)
console.log('toLocaleString():', numbers.toLocaleString());

console.log('===============================================');
console.log('BONUS: Shallow Copy vs Deep Copy');
console.log('===============================================');

// Shallow copy: el spread (...) solo copia el primer nivel
const original1 = { name: 'Jonathan', address: { city: 'Cali' } };
const shallow = { ...original1 };
shallow.address.city = 'Bogotá';
console.log('Original antes de cambiar shallow: Cali');
console.log('Original después de cambiar shallow:', original1.address.city);
console.log('-> El shallow copy SÍ afectó al original');

console.log('');

// Deep copy: con JSON.parse(JSON.stringify()) se crea una copia 100% independiente
const original2 = { name: 'Jonathan', address: { city: 'Cali' } };
const deep = JSON.parse(JSON.stringify(original2));
deep.address.city = 'Medellín';
console.log('Original antes de cambiar deep: Cali');
console.log('Original después de cambiar deep:', original2.address.city);
console.log('-> El deep copy NO afectó al original');
