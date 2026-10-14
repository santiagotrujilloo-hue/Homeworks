function ExerciseTwoPage() {
  const people = [
    {
      name: "Santiago Ramírez",
      amount: "$250.000",
      time: "2:05 p. m.",
    },
    {
      name: "Laura Martínez",
      amount: "$480.000",
      time: "2:11 p. m.",
    },
    {
      name: "Andrés Gómez",
      amount: "$120.000",
      time: "2:18 p. m.",
    },
  ];

  return (
    <div>
      <div className="page-title">
        <div>
          <span>EJERCICIO 02</span>

          <h2>Cola del cajero</h2>

          <p>
            Cola de personas organizada según
            el orden de llegada utilizando el
            comportamiento FIFO.
          </p>
        </div>

        <div className="exercise-type">
          <strong>FIFO</strong>
          <span>Cola</span>
        </div>
      </div>

      <div className="exercise-card">
        <div className="exercise-card-header">
          <span>
            COLA DE ESPERA
          </span>

          <strong>
            {people.length} personas
          </strong>
        </div>

        <div className="queue-demo-header">
          <span>#</span>
          <span>Cliente</span>
          <span>Retiro</span>
          <span>Llegada</span>
        </div>

        {people.map((person, index) => (
          <div
            className="queue-demo-person"
            key={person.name}
          >
            <strong>
              {String(
                index + 1
              ).padStart(2, "0")}
            </strong>

            <div className="queue-person-name">
              <div>
                {person.name.charAt(0)}
              </div>

              <span>
                {person.name}
              </span>
            </div>

            <span>
              {person.amount}
            </span>

            <span>
              {person.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExerciseTwoPage;