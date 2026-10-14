import { useContext } from "react";
import TasksContext from "../context/TasksContext";

const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) throw new Error("useTasks debe usarse dentro de <TasksProvider>");
  return context;
};

export default useTasks;
