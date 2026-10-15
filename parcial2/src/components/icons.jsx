export function FolderIcon({ open = false, className = "" }) {
  return (
    <svg className={`icon icon--folder ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      {open ? (
        <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4.2l1.8 2h8a1.5 1.5 0 0 1 1.5 1.5V10H7.2a1.5 1.5 0 0 0-1.4 1L3.6 17.6A1 1 0 0 1 3 17zM6.6 11.4A1 1 0 0 1 7.5 11H21a.8.8 0 0 1 .8 1l-2.1 6.3a1 1 0 0 1-1 .7H4.3a.6.6 0 0 1-.6-.8z" />
      ) : (
        <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.7l2 2.2h8.3A1.5 1.5 0 0 1 21 8.7v9.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" />
      )}
    </svg>
  );
}

export function FileIcon({ className = "" }) {
  return (
    <svg className={`icon icon--file ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 3h7.4L19 8.1v11.4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3z" />
      <path className="icon__fold" d="M13.5 3.2V8a.8.8 0 0 0 .8.8h4.5" />
    </svg>
  );
}

export function NodeIcon({ nodo, open }) {
  return nodo.esCarpeta() ? <FolderIcon open={open} /> : <FileIcon />;
}

