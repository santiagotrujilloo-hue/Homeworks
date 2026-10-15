import useFileSystem from "../hooks/useFileSystem";
import TreeView from "../components/TreeView";
import PathBar from "../components/PathBar";
import CreatePanel from "../components/CreatePanel";
import FolderContents from "../components/FolderContents";
import DetailsPanel from "../components/DetailsPanel";
import TraversalPanel from "../components/TraversalPanel";
import SearchBox from "../components/SearchBox";

function ExplorerPage() {
  const { seleccionado, error } = useFileSystem();

  return (
    <div className="explorer">
      <aside className="explorer__tree">
        <SearchBox />
        <TreeView />
      </aside>

      <main className="explorer__main">
        <PathBar />
        {error && <p className="alert">No se pudo hablar con Firestore: {error}</p>}
        <CreatePanel key={`c-${seleccionado.id}`} />
        <FolderContents />
      </main>

      <aside className="explorer__side">
        <DetailsPanel key={seleccionado.id} />
        <TraversalPanel />
      </aside>
    </div>
  );
}

export default ExplorerPage;
