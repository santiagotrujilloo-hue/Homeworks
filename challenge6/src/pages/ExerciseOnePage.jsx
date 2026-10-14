function ExerciseOnePage() {
  const books = [
    {
      name: "Código limpio",
      author: "Robert C. Martin",
      isbn: "9780132350884",
    },
    {
      name: "El programador pragmático",
      author: "Andrew Hunt",
      isbn: "9780135957059",
    },
    {
      name: "Refactorización",
      author: "Martin Fowler",
      isbn: "9780134757599",
    },
  ];

  return (
    <div>
      <div className="page-title">
        <div>
          <span>EJERCICIO 01</span>

          <h2>Pila de libros</h2>

          <p>
            Ejemplo de una estructura de datos
            LIFO implementada mediante una pila
            de libros.
          </p>
        </div>

        <div className="exercise-type">
          <strong>LIFO</strong>
          <span>Pila</span>
        </div>
      </div>

      <div className="exercise-card">
        <div className="exercise-card-header">
          <span>
            CIMA DE LA PILA
          </span>

          <strong>
            {books.length} libros
          </strong>
        </div>

        <div className="book-demo-list">
          {books.map((book, index) => (
            <div
              className="book-demo"
              key={book.isbn}
            >
              <div className="book-position">
                {String(
                  books.length - index
                ).padStart(2, "0")}
              </div>

              <div className="book-symbol">
                L
              </div>

              <div>
                <h3>{book.name}</h3>

                <p>
                  {book.author}
                </p>

                <small>
                  ISBN {book.isbn}
                </small>
              </div>

              {index === 0 && (
                <span className="top-label">
                  CIMA
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExerciseOnePage;