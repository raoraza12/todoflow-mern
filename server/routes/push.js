const express = require("express");
const router = express.Router();
const webpush = require("web-push");

webpush.setVapidDetails(process.env.VAPID_MAILTO, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

router.post("/subscribe", async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { endpoint, keys } = req.body;
    const userAgent = req.headers["user-agent"] || "";
    const { data, error } = await supabase.from("push_subscriptions").upsert({ endpoint, p256dh: keys.p256dh, auth: keys.auth, user_agent: userAgent }, { onConflict: "endpoint" }).select().single();
    if (error) throw error;
    res.status(201).json({ message: "Subscribed", id: data.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/unsubscribe", async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    await supabase.from("push_subscriptions").delete().eq("endpoint", req.body.endpoint);
    res.json({ message: "Unsubscribed" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/vapid-public-key", (_req, res) => { res.json({ publicKey: process.env.VAPID_PUBLIC_KEY }); });

router.post("/notify-all", async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;
    const { title, body, icon, url } = req.body;
    const { data: subs } = await supabase.from("push_subscriptions").select("*");
    if (!subs || subs.length === 0) return res.json({ sent: 0, message: "No subscribers" });
    const payload = JSON.stringify({ title: title || "Todo App", body: body || "You have a new notification!", icon: icon || "/logo192.png", badge: "/logo192.png", vibrate: [200, 100, 200], data: { url: url || "/" }, actions: [{ action: "open", title: "Open App" }, { action: "dismiss", title: "Dismiss" }] });
    const results = await Promise.allSettled(subs.map(s => webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload)));
    const sent = results.filter(r => r.status === "fulfilled").length;
    results.forEach(async (r, i) => { if (r.status === "rejected" && r.reason?.statusCode === 410) await supabase.from("push_subscriptions").delete().eq("id", subs[i].id); });
    res.json({ sent, total: subs.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;