import menuTree from "../data/menuTree";
import MenuItem from "./MenuItem";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-symbol">N</div>

        <div>
          <span>CHALLENGE 09</span>
          <h2>Menú N-ario</h2>
        </div>
      </div>

      <div className="sidebar-section-title">
        NAVEGACIÓN
      </div>

      <nav className="menu">
        {menuTree.map((item) => (
          <MenuItem
            key={item.title}
            item={item}
          />
        ))}
      </nav>

      <div className="tree-info">
        <span>ÁRBOL N-ARIO</span>

        <p>
          El menú de navegación se genera dinámicamente
          a partir de la estructura del árbol.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;