import { Spinner } from "react-bootstrap";

function FullScreenLoader({ label = "Abriendo la bitácora…" }) {
  return (
    <div className="screen-loader">
      <Spinner animation="border" variant="primary" role="status" />
      <span>{label}</span>
    </div>
  );
}

export default FullScreenLoader;
