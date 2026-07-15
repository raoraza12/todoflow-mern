import React from "react";
import { Toaster, useToDos } from "./context/TodoContext";
import { usePush } from "./context/PushContext";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import FilterBar from "./components/FilterBar";
import TodoList from "./components/TodoList";
import EmptyState from "./components/EmptyState";
import TodoForm from "./components/TodoForm";

export default function App() {
  const { todos, loading, stats, filters, addTodo, editTodo, removeTodo, toggleStatus, setFilter } = useToDos();
  const { subscribed, togglePush } = usePush();
  const [showForm, setShowForm] = React.useState(false);
  const [editing, setEditing] = React.useState(null);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 100px' }}>
      <Header subscribed={subscribed} togglePush={togglePush} />
      <StatsBar stats={stats} filters={filters} setFilter={setFilter} />
      <FilterBar filters={filters} setFilter={setFilter} />
      {loading ? <div>{[1,2,3].map(i => <div key={i} style={{ height: 80, background: '#1a1a2e', borderRadius: 14, marginTop: 10 }} />)}</div> :
        todos.length == 0 ? <EmptyState onCreate={() => { setEditing(null); setShowForm(true); }} /> :
          <TodoList todos={todos} toggleStatus={toggleStatus} onEdit={((t) => { setEditing(t); setShowForm(true); })} onDelete={removeTodo} />
      }
      <button className="fab" onClick={() => { setEditing(null); setShowForm(true); }}>+</button>
      {showForm && <TodoForm todo={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSave={editing ? (d) => editTodo(editing._id || editing.id, d) : addTodo} />}
      <Toaster />
    </div>
  );
}