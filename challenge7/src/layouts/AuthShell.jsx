import { Alert } from "react-bootstrap";
import { isFirebaseConfigured } from "../firebase/config";

function AuthShell({ stamp, title, subtitle, children }) {
  return (
    <main className="auth-shell">
      <header className="auth-shell__bar">
        <span className="brand-mark">
          Bitácora<em>·07</em>
        </span>
        <span className="mono">Estructuras de Datos II</span>
      </header>

      <section className="auth-shell__body">
        <div className="auth-shell__intro">
          <span className="stamp">{stamp}</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="ticket">
          {!isFirebaseConfigured && (
            <Alert variant="warning" className="mb-4 small">
              Falta pegar la configuración de Firebase en
              <code className="ms-1">src/firebase/config.js</code>.
            </Alert>
          )}
          {children}
        </div>
      </section>

      <footer className="auth-shell__foot mono">
        Firebase Auth · Cloud Firestore · React Bootstrap + Sass
      </footer>
    </main>
  );
}

export default AuthShell;
