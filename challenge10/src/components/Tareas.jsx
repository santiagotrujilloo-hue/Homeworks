import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function Tareas({ usuario }) {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [procesandoId, setProcesandoId] = useState(null);

  const [editandoId, setEditandoId] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");
  const [error, setError] = useState("");
  const [realtimeActivo, setRealtimeActivo] = useState(false);

  // CARGAR TAREAS Y ESCUCHAR CAMBIOS EN TIEMPO REAL
  useEffect(() => {
    let activo = true;

    const cargarTareas = async (mostrarCarga = false) => {
      if (mostrarCarga) setCargando(true);

      try {
        const { data, error: consultaError } = await supabase
          .from("tasks")
          .select("id, title, completed, created_at")
          .eq("user_id", usuario.id)
          .order("created_at", { ascending: false })
          .order("id", { ascending: false });

        if (consultaError) throw consultaError;

        if (activo) {
          setTareas(data ?? []);
          setError("");
        }
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo && mostrarCarga) {
          setCargando(false);
        }
      }
    };

    // Consultar inicialmente
    cargarTareas(true);

    // Escuchar creaciones y modificaciones del usuario
    const canal = supabase
      .channel(`tareas-usuario-${usuario.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${usuario.id}`,
        },
        () => cargarTareas()
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${usuario.id}`,
        },
        () => cargarTareas()
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "tasks",
        },
        () => cargarTareas()
      )
      .subscribe((estado) => {
        if (!activo) return;

        setRealtimeActivo(estado === "SUBSCRIBED");
      });

    // Limpiar suscripción al salir
    return () => {
      activo = false;
      supabase.removeChannel(canal);
    };
  }, [usuario.id]);

  // CREAR UNA TAREA
  const agregarTarea = async (e) => {
    e.preventDefault();

    const texto = titulo.trim();
    if (!texto || guardando) return;

    setGuardando(true);
    setError("");

    try {
      const { data, error: insertarError } = await supabase
        .from("tasks")
        .insert({
          user_id: usuario.id,
          title: texto,
          completed: false,
        })
        .select()
        .single();

      if (insertarError) throw insertarError;

      setTareas((anteriores) =>
        anteriores.some((tarea) => tarea.id === data.id)
          ? anteriores
          : [data, ...anteriores]
      );

      setTitulo("");
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  // COMPLETAR O REABRIR UNA TAREA
  const cambiarEstado = async (tarea) => {
    setProcesandoId(tarea.id);
    setError("");

    try {
      const { data, error: actualizarError } = await supabase
        .from("tasks")
        .update({ completed: !tarea.completed })
        .eq("id", tarea.id)
        .eq("user_id", usuario.id)
        .select()
        .single();

      if (actualizarError) throw actualizarError;

      setTareas((anteriores) =>
        anteriores.map((item) =>
          item.id === tarea.id ? data : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesandoId(null);
    }
  };

  // PREPARAR LA EDICIÓN
  const iniciarEdicion = (tarea) => {
    setEditandoId(tarea.id);
    setTextoEditado(tarea.title);
    setError("");
  };

  // GUARDAR CAMBIOS
  const guardarEdicion = async (e, id) => {
    e.preventDefault();

    const texto = textoEditado.trim();

    if (!texto) {
      setError("El título no puede estar vacío.");
      return;
    }

    setProcesandoId(id);
    setError("");

    try {
      const { data, error: editarError } = await supabase
        .from("tasks")
        .update({ title: texto })
        .eq("id", id)
        .eq("user_id", usuario.id)
        .select()
        .single();

      if (editarError) throw editarError;

      setTareas((anteriores) =>
        anteriores.map((item) =>
          item.id === id ? data : item
        )
      );

      setEditandoId(null);
      setTextoEditado("");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesandoId(null);
    }
  };

  // ELIMINAR UNA TAREA
  const eliminarTarea = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta tarea?")) {
      return;
    }

    setProcesandoId(id);
    setError("");

    try {
      const { data, error: eliminarError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", usuario.id)
        .select("id");

      if (eliminarError) throw eliminarError;

      if (!data?.length) {
        throw new Error("No se pudo eliminar la tarea.");
      }

      setTareas((anteriores) =>
        anteriores.filter((tarea) => tarea.id !== id)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesandoId(null);
    }
  };

  const total = tareas.length;
  const completadas = tareas.filter(
    (tarea) => tarea.completed
  ).length;

  return (
    <section className="tareas-container">
      <div className="tareas-header">
        <div>
          <h2>Mis tareas</h2>
          <p>Administra tus actividades en Supabase.</p>
          <p>
            {realtimeActivo
              ? "● Conectado en tiempo real"
              : "○ Conectando con Realtime..."}
          </p>
        </div>

        <span className="task-count">
          {completadas} / {total} completadas
        </span>
      </div>

      {/* FORMULARIO PARA AGREGAR TAREAS */}
      <form className="tarea-form" onSubmit={agregarTarea}>
        <input
          type="text"
          placeholder="Escribe una nueva tarea..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          aria-label="Nueva tarea"
          required
        />

        <button
          type="submit"
          className="primary-button"
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Agregar tarea"}
        </button>
      </form>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {/* LISTADO DE TAREAS */}
      {cargando ? (
        <p className="loading-text">Cargando tareas...</p>
      ) : tareas.length === 0 ? (
        <div className="empty-state">
          <h3>No tienes tareas registradas</h3>
          <p>Agrega una tarea para comenzar.</p>
        </div>
      ) : (
        <ul className="lista-tareas">
          {tareas.map((tarea) => (
            <li
              key={tarea.id}
              className={
                tarea.completed ? "tarea-completada" : ""
              }
            >
              {editandoId === tarea.id ? (
                <form
                  className="editar-form"
                  onSubmit={(e) =>
                    guardarEdicion(e, tarea.id)
                  }
                >
                  <input
                    type="text"
                    value={textoEditado}
                    onChange={(e) =>
                      setTextoEditado(e.target.value)
                    }
                    autoFocus
                    required
                  />

                  <button
                    type="submit"
                    className="guardar-button"
                    disabled={procesandoId !== null}
                  >
                    Guardar
                  </button>

                  <button
                    type="button"
                    className="cancelar-button"
                    onClick={() => {
                      setEditandoId(null);
                      setTextoEditado("");
                    }}
                  >
                    Cancelar
                  </button>
                </form>
              ) : (
                <div className="tarea-item">
                  <div className="tarea-contenido">
                    <input
                      type="checkbox"
                      checked={tarea.completed}
                      disabled={procesandoId !== null}
                      onChange={() => cambiarEstado(tarea)}
                      aria-label={`Completar ${tarea.title}`}
                    />

                    <span>{tarea.title}</span>
                  </div>

                  <div className="tarea-acciones">
                    <button
                      type="button"
                      className="editar-button"
                      disabled={procesandoId !== null}
                      onClick={() => iniciarEdicion(tarea)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="eliminar-button"
                      disabled={procesandoId !== null}
                      onClick={() => eliminarTarea(tarea.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Tareas;