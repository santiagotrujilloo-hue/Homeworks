import { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function Avatar({ usuario }) {
  const [archivo, setArchivo] = useState(null);
  const [rutaAvatar, setRutaAvatar] = useState(
    usuario.user_metadata?.avatar_path || ""
  );

  const [subiendo, setSubiendo] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const inputRef = useRef(null);

  const procesando = subiendo || eliminando;

  const urlAvatar = rutaAvatar
    ? supabase.storage
        .from("avatars")
        .getPublicUrl(rutaAvatar).data.publicUrl
    : null;

  const seleccionarImagen = (e) => {
    const imagen = e.target.files?.[0];

    setError("");
    setMensaje("");
    setArchivo(null);

    if (!imagen) return;

    const formatosPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!formatosPermitidos.includes(imagen.type)) {
      setError("Solo se permiten imágenes JPG, PNG o WEBP.");
      e.target.value = "";
      return;
    }

    if (imagen.size > 2 * 1024 * 1024) {
      setError("La imagen no puede superar los 2 MB.");
      e.target.value = "";
      return;
    }

    setArchivo(imagen);
  };

  const subirAvatar = async (e) => {
    e.preventDefault();

    if (!archivo || procesando) return;

    setSubiendo(true);
    setError("");
    setMensaje("");

    const extensiones = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    const extension = extensiones[archivo.type];

    const nuevaRuta =
      `${usuario.id}/avatar-${Date.now()}.${extension}`;

    try {
      const { error: errorSubida } = await supabase.storage
        .from("avatars")
        .upload(nuevaRuta, archivo, {
          cacheControl: "3600",
          upsert: false,
          contentType: archivo.type,
        });

      if (errorSubida) throw errorSubida;

      const { error: errorPerfil } =
        await supabase.auth.updateUser({
          data: {
            avatar_path: nuevaRuta,
          },
        });

      if (errorPerfil) {
        await supabase.storage
          .from("avatars")
          .remove([nuevaRuta]);

        throw errorPerfil;
      }

      const rutaAnterior = rutaAvatar;

      setRutaAvatar(nuevaRuta);
      setArchivo(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setMensaje("Foto de perfil actualizada correctamente.");

      if (
        rutaAnterior &&
        rutaAnterior !== nuevaRuta &&
        rutaAnterior.startsWith(`${usuario.id}/`)
      ) {
        const { error: errorLimpieza } =
          await supabase.storage
            .from("avatars")
            .remove([rutaAnterior]);

        if (errorLimpieza) {
          console.warn(errorLimpieza.message);
        }
      }
    } catch (err) {
      setError(err.message || "No se pudo subir la imagen.");
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarAvatar = async () => {
    if (!rutaAvatar || procesando) return;

    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar tu foto de perfil?"
    );

    if (!confirmar) return;

    if (!rutaAvatar.startsWith(`${usuario.id}/`)) {
      setError("La ruta de la fotografía no es válida.");
      return;
    }

    setEliminando(true);
    setError("");
    setMensaje("");

    const rutaAnterior = rutaAvatar;

    try {
      const { error: errorPerfil } =
        await supabase.auth.updateUser({
          data: {
            avatar_path: null,
          },
        });

      if (errorPerfil) throw errorPerfil;

      const { error: errorBorrado } = await supabase.storage
        .from("avatars")
        .remove([rutaAnterior]);

      if (errorBorrado) {
        const { error: errorRestauracion } =
          await supabase.auth.updateUser({
            data: {
              avatar_path: rutaAnterior,
            },
          });

        if (errorRestauracion) {
          throw new Error(
            "No se eliminó la foto y no fue posible restaurar los datos del perfil."
          );
        }

        throw errorBorrado;
      }

      setRutaAvatar("");
      setArchivo(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setMensaje("Foto de perfil eliminada correctamente.");
    } catch (err) {
      setError(err.message || "No se pudo eliminar la imagen.");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <section className="avatar-container">
      <h2>Mi foto de perfil</h2>

      <p>
        Personaliza tu cuenta con una fotografía.
      </p>

      <div className="avatar-preview">
        {urlAvatar ? (
          <img
            src={urlAvatar}
            alt="Foto de perfil del usuario"
            width="120"
            height="120"
          />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "#ccfbf1",
              color: "#0f766e",
              display: "grid",
              placeItems: "center",
              fontSize: 42,
              fontWeight: "bold",
            }}
          >
            {usuario.email?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <form onSubmit={subirAvatar}>
        <label htmlFor="archivo-avatar">
          Seleccionar foto de perfil
        </label>

        <input
          ref={inputRef}
          id="archivo-avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={seleccionarImagen}
          disabled={procesando}
        />

        <p>
          Formatos permitidos: JPG, PNG y WEBP.
          Máximo 2 MB.
        </p>

        <button
          type="submit"
          className="primary-button"
          disabled={!archivo || procesando}
        >
          {subiendo
            ? "Subiendo imagen..."
            : "Guardar foto de perfil"}
        </button>
      </form>

      {rutaAvatar && (
        <button
          type="button"
          className="eliminar-avatar-button"
          onClick={eliminarAvatar}
          disabled={procesando}
        >
          {eliminando
            ? "Eliminando foto..."
            : "Eliminar foto de perfil"}
        </button>
      )}

      {mensaje && (
        <p className="success-message" role="status">
          {mensaje}
        </p>
      )}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export default Avatar;