import { useCallback, useEffect, useMemo } from "react";
import TasksContext from "./TasksContext";
import useAuth from "../hooks/useAuth";
import useCollection from "../hooks/useCollection";

const toMillis = (t) => (t?.toMillis ? t.toMillis() : Date.now());

function TasksProvider({ children }) {
  const { user } = useAuth();
  const { results, isPending, error, getAll, add, update, remove, reset } =
    useCollection("tasks");

  // Cada usuario solo ve sus propias tareas
  const refresh = useCallback(() => {
    if (!user) return Promise.resolve([]);
    return getAll([["uid", "==", user.uid]]);
  }, [user, getAll]);

  useEffect(() => {
    if (user) refresh();
    else reset();
  }, [user, refresh, reset]);

  // Más recientes primero
  const tasks = useMemo(
    () => [...results].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt)),
    [results]
  );

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.done).length;
    return {
      total: tasks.length,
      done,
      pending: tasks.length - done,
      percent: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
    };
  }, [tasks]);

  const createTask = async ({ title, notes, priority }) => {
    const id = await add({
      title: title.trim(),
      notes: notes.trim(),
      priority,
      done: false,
      uid: user.uid,
    });
    await refresh();
    return id;
  };

  const editTask = async (id, { title, notes, priority }) => {
    const ok = await update(id, { title: title.trim(), notes: notes.trim(), priority });
    await refresh();
    return ok;
  };

  const toggleTask = async (task) => {
    const ok = await update(task.id, { done: !task.done });
    await refresh();
    return ok;
  };

  const deleteTask = async (id) => {
    const ok = await remove(id);
    await refresh();
    return ok;
  };

  return (
    <TasksContext.Provider
      value={{ tasks, stats, isPending, error, createTask, editTask, toggleTask, deleteTask }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export default TasksProvider;
