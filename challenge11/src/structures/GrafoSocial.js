class GrafoSocial {
  constructor(datos = {}) {
    this.personas = new Map();
    this.ciudades = new Map();
    this.amistades = new Set();

    for (const ciudad of datos.ciudades ?? []) {
      this.agregarCiudad(ciudad);
    }

    for (const persona of datos.personas ?? []) {
      this.agregarPersona(
        persona.nombre,
        persona.edad,
        persona.ciudad
      );
    }

    for (const [persona1, persona2] of datos.amistades ?? []) {
      this.agregarAmistad(persona1, persona2);
    }
  }

  normalizar(texto) {
    return String(texto ?? "").trim().toLowerCase();
  }

  agregarCiudad(nombre) {
    const nombreLimpio = String(nombre ?? "").trim();
    const id = this.normalizar(nombreLimpio);

    if (!id) {
      throw new Error("Debes escribir el nombre de la ciudad.");
    }

    if (this.ciudades.has(id)) {
      throw new Error("Esta ciudad ya está registrada.");
    }

    this.ciudades.set(id, {
      id,
      nombre: nombreLimpio,
    });
  }

  agregarPersona(nombre, edad, ciudad) {
    const nombreLimpio = String(nombre ?? "").trim();
    const id = this.normalizar(nombreLimpio);
    const ciudadId = this.normalizar(ciudad);
    const edadNumero = Number(edad);

    if (!id) {
      throw new Error("Debes escribir el nombre de la persona.");
    }

    if (this.personas.has(id)) {
      throw new Error("Esta persona ya está registrada.");
    }

    if (!Number.isInteger(edadNumero) ||
        edadNumero < 0 ||
        edadNumero > 120) {
      throw new Error("Ingresa una edad válida.");
    }

    if (!this.ciudades.has(ciudadId)) {
      throw new Error("La ciudad no está registrada.");
    }

    this.personas.set(id, {
      id,
      nombre: nombreLimpio,
      edad: edadNumero,
      ciudadId,
    });
  }

  agregarAmistad(nombre1, nombre2) {
    const id1 = this.normalizar(nombre1);
    const id2 = this.normalizar(nombre2);

    if (!this.personas.has(id1) ||
        !this.personas.has(id2)) {
      throw new Error("Ambas personas deben estar registradas.");
    }

    if (id1 === id2) {
      throw new Error("Una persona no puede ser amiga de sí misma.");
    }

    const relacion = [id1, id2].sort().join("|");

    if (this.amistades.has(relacion)) {
      throw new Error("Esta amistad ya existe.");
    }

    this.amistades.add(relacion);
  }

  eliminarAmistad(nombre1, nombre2) {
    const id1 = this.normalizar(nombre1);
    const id2 = this.normalizar(nombre2);
    const relacion = [id1, id2].sort().join("|");

    if (!this.amistades.delete(relacion)) {
      throw new Error("La amistad no existe.");
    }
  }

  eliminarPersona(nombre) {
    const id = this.normalizar(nombre);

    if (!this.personas.delete(id)) {
      throw new Error("La persona no existe.");
    }

    for (const relacion of this.amistades) {
      if (relacion.split("|").includes(id)) {
        this.amistades.delete(relacion);
      }
    }
  }

  eliminarCiudad(nombre) {
    const id = this.normalizar(nombre);

    if (!this.ciudades.has(id)) {
      throw new Error("La ciudad no existe.");
    }

    const tieneHabitantes = [...this.personas.values()]
      .some((persona) => persona.ciudadId === id);

    if (tieneHabitantes) {
      throw new Error(
        "No puedes eliminar una ciudad que tiene habitantes."
      );
    }

    this.ciudades.delete(id);
  }

  obtenerPersonasPorCiudad(nombreCiudad) {
    const ciudadId = this.normalizar(nombreCiudad);

    if (!this.ciudades.has(ciudadId)) {
      return [];
    }

    return [...this.personas.values()]
      .filter((persona) => persona.ciudadId === ciudadId)
      .map((persona) => ({
        nombre: persona.nombre,
        edad: persona.edad,
        ciudad: this.ciudades.get(ciudadId).nombre,
      }));
  }

  obtenerGrafo() {
    const nodes = [];
    const links = [];

    for (const ciudad of this.ciudades.values()) {
      nodes.push({
        id: `ciudad:${ciudad.id}`,
        name: ciudad.nombre,
        tipo: "ciudad",
      });
    }

    for (const persona of this.personas.values()) {
      nodes.push({
        id: `persona:${persona.id}`,
        name: `${persona.nombre} (${persona.edad})`,
        tipo: "persona",
      });

      links.push({
        source: `persona:${persona.id}`,
        target: `ciudad:${persona.ciudadId}`,
        tipo: "residencia",
      });
    }

    for (const relacion of this.amistades) {
      const [id1, id2] = relacion.split("|");

      links.push({
        source: `persona:${id1}`,
        target: `persona:${id2}`,
        tipo: "amistad",
      });
    }

    return { nodes, links };
  }

  exportarDatos() {
    return {
      ciudades: [...this.ciudades.values()].map(
        (ciudad) => ciudad.nombre
      ),

      personas: [...this.personas.values()].map(
        (persona) => ({
          nombre: persona.nombre,
          edad: persona.edad,
          ciudad: this.ciudades.get(persona.ciudadId).nombre,
        })
      ),

      amistades: [...this.amistades].map((relacion) => {
        const [id1, id2] = relacion.split("|");

        return [
          this.personas.get(id1).nombre,
          this.personas.get(id2).nombre,
        ];
      }),
    };
  }
}

export default GrafoSocial;