import { useState } from "react";
import { NavLink } from "react-router-dom";

function MenuItem({ item, level = 0 }) {
  const [open, setOpen] = useState(true);

  const hasChildren =
    item.children && item.children.length > 0;

  const handleToggle = () => {
    if (hasChildren) {
      setOpen(!open);
    }
  };

  return (
    <div className="menu-node">
      {hasChildren ? (
        <button
          className="menu-parent"
          style={{
            paddingLeft: `${16 + level * 16}px`,
          }}
          onClick={handleToggle}
        >
          <span className="menu-dot"></span>

          <span className="menu-title">
            {item.title}
          </span>

          <span
            className={`menu-arrow ${
              open ? "open" : ""
            }`}
          >
            ▾
          </span>
        </button>
      ) : (
        <NavLink
          to={item.link}
          end={item.link === "/"}
          className={({ isActive }) =>
            isActive
              ? "menu-link active"
              : "menu-link"
          }
          style={{
            paddingLeft: `${16 + level * 16}px`,
          }}
        >
          <span className="menu-dot"></span>

          <span>{item.title}</span>
        </NavLink>
      )}

      {hasChildren && open && (
        <div className="submenu">
          {item.children.map((child) => (
            <MenuItem
              key={`${item.title}-${child.title}`}
              item={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuItem;