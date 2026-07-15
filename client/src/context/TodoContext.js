import React { createContext, useContext, useState, useCallback, useEffect } from "react";
import { fetchTodos, createTodo, updateTodo, deleteTodo, fetchStats } from "../api";
const TodoContext = createContext();

function mapTodo(t) {
  if (!t) return t;
  return { ...t, _id: t.id, dueDate: t.due_date, createdAt: t.created_at, updatedAt: t.updated_at };
}

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0, highPriority: 0 });
  const [filters, setFilters] = useState({ status: "all", priority: "all", search: "", sort: "-createdAt" });

  const loadTodos = useCallback(async () => {
    try { setLoading(true); const { status, priority, search, sort } = filters;
      const params = { status, priority, sort }; if (search) params.search = search;
      const { data } = await fetchTodos(params); setTodos((data || []).map(mapTodo));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [filters]);

  const loadStats = useCallback(async () => { try { const { data } = await fetchStats(); setStats(data); } catch (e) { } }, []);

  useEffect(() => { loadTodos(); loadStats(); }, [loadTodos, loadStats]);

  const addTodo = async (d) => { const { data } = await createTodo(d); setTodos(p => [mapTodo(data), ...p]); loadStats(); };
  const editTodo = async (id, updates) => { const { data } = await updateTodo(id, updates); setTodos(p => p.map(t => (t._id === id || t.id === id ? mapTodo(data) : t))); loadStats(); };
  const removeTodo = async (id) => { await deleteTodo(id); setTodos(p => p.filter(t => t._id !== id && t.id !== id)); loadStats(); };
  const toggleStatus = async (t) => { const id = t._id || t.id; const next = t.status === "todo" ? "in-progress" : t.status === "in-progress" ? "done" : "todo"; await editTodo(id, { status: next }); };
  const setFilter = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  return (
    <TodoContext.Provider value={{ todos, loading, stats, filters, addTodo, editTodo, removeTodo, toggleStatus, setFilter, loadStats }}>
      {children}
    </TodoContext.Provider>
  );
}

export const useToDos = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) throw Error("useToDos must be used within TodoProvider");
  return ctx;
};

export function Toaster() { return null; }