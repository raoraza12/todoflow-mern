require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const todoRoutes = require("./routes/todos");
const pushRoutes = require("./routes/push");
const app = express();
const WebSocket = require("ws");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(process.env.SUPABASE_URL, SUPABASE_KEY, { db: { schema: "public" }, auth: { persistSession: false }, realtime: { transport: WebSocket } });
app.locals.supabase = supabase;
app.use(cors());
app.use(express.json());
app.use("/api/todos", todoRoutes);
app.use("/api/push", pushRoutes);
app.get("/api/health", async (_req, res) => { try { const { count, error } = await supabase.from("todos").select("*", { count: "exact", head: true }); res.json({ status: error ? "error" : "ok", db: error ? error.message : `connected (${count ?? "?"} todos)`, timestamp: new Date().toISOString() }); } catch (e) { res.json({ status: "error", db: e.message, timestamp: new Date().toISOString() }); } });
if (process.env.NODE_ENV === "production") { const path = require("path"); app.use(express.static(path.join(__dirname, "..", "client", "build"))); app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"))); }
async function ensureTables() {
  try {
    const { error: terr } = await supabase.from("todos").select("id", { count: "exact", head: true });
    if (terr && terr.code === "PGRST205") console.log("✌️ Todos table not found. Run supabase-setup/schema.sql in Supabase SQL Editor.");
    else console.log("✅ Todos table exists");
    const { error: perr } = await supabase.from("push_subscriptions").select("id", { count: "exact", head: true });
    if (perr && perr.code === "PGRST205") console.log("✌️ Push Subscriptions table not found. Run supabase-setup/schema.sql.");
    else console.log("✅ Push Subscriptions table exists");
  } catch (err) { console.log("⚀️ Auto table creation:", err.message); }
}
const PORT = process.env.PORT || 5000;
ensureTables().then(() => app.listen(PORT, () => console.log(`🚀 TodoFlow http://localhost:${PORT}`))).catch(err => { console.error("Startup error:", err.message); app.listen(PORT, () => console.log(`⚠️ Server port ${PORT} `)); });