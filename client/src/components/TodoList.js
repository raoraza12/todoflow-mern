import React from "react";
import TodoCard from "./TodoCard";

export default function TodoList({ todos, toggleStatus, onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
      {todos.map((t, i) => (
        <TodoCard key={t._id || t.id} todo={t} toggleStatus={toggleStatus} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}