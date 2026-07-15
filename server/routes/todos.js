const express = require("express");
const router = express.Router();

// ── GET all todos (with filters) ──────────────────────
router.get("/", async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { status, priority, search, sort = "created_at", order = "desc", category } = req.query;

    let query = supabase.from("todos").select("*");

    if (status && status !== "all") query = query.eq("status", status);
    if (priority && priority !== "all") query = query.eq("priority", priority);
    if (category) query = query.eq("category", category);
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const sortMap = {
      "-createdAt": { column: "created_at", ascending: false },
      "createdAt": { column: "created_at", ascending: true },
      "-priority": { column: "priority", ascending: true },
      "dueDate": { column: "due_date", ascending: true },
    };

    const sortConfig = sortMap[sort] || sortMap["-createdAt"];
    query = query.order(sortConfig.column, { ascending: sortConfig.ascending });

    const { data, error } = await query;

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET single todo ───────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { data, error } = await supabase.from("todos").select("*").eq("id", req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Todo not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST create todo ───────────────────────────────────
outer.post("/", async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { title, description, priority, dueDate, category } = req.body;

    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          title,
          description: description || "",
          priority: priority || "medium",
          category: category || "General",
          due_date: dueDate || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── PUT update todo ──────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const updates = {};

    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.priority !== undefined) updates.priority = req.body.priority;
    if (req.body.category !== undefined) updates.category = req.body.category;
    if (req.body.dueDate !== undefined) updates.due_date = req.body.dueDate;

    const { data, error } = await supabase
      .from("todos")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Todo not found" });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── DELETE todo ────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { error } = await supabase.from("todos").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: "Todo deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET stats ───────────────────────────────────────────────────
router.get("/meta/stats", async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;

    const { count: total } = await supabase.from("todos").select("*", { count: "exact", head: true });
    const { count: todo } = await supabase.from("todos").select("*", { count: "exact", head: true }).eq("status", "todo");
    const { count: inProgress } = await supabase.from("todos").select("*", { count: "exact", head: true }).eq("status", "in-progress");
    const { count: done } = await supabase.from("todos").select("*", { count: "exact", head: true }).eq("status", "done");
    const { count: highPriority } = await supabase.from("todos").select("*", { count: "exact", head: true }).eq("priority", "high").neq("status", "done");

    res.json({ total: total || 0, todo: todo || 0, inProgress: inProgress || 0, done: done || 0, highPriority: highPriority || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;