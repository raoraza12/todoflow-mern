import React { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getVapidPublicKey, subscribePush, unsubscribePush } from "../api";

const PushContext = createContext();

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export function PushProvider({ children }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  const togglePush = useCallback(async () => {
    if (!Notification || Notification.permission === "denied") return;
    try {
      if (subscribed) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) { await sub.unsubscribe(); await unsubscribePush(sub.endpoint); }
        setSubscribed(false);
      } else {
        const { data } = await getVapidPublicKey();
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(data.publicKey),
        });
        await subscribePush({ endpoint: sub.endpoint, keys: { p256dh: arrayBufferToBase64(sub.getKey("p256dh")), auth: arrayBufferToBase64(sub.getKey("auth")) } });
        setSubscribed(true);
      }
    } catch (e) { console.error(e); }
  }, [subscribed]);

  useEffect(() => { const check = async () => {
      try { if ("serviceWorker" in navigator && "pushManager" in window && Notification.permission === "granted") {
            const reg = await navigator.serviceWorker.ready; const sub = await reg.pushManager.getSubscription();
            setSubscribed(!!sub);
          }
      } catch (e) { } finally { setLoading(false); }
    }; check(); }, []);

  return ( <PushContext.Provider value={{ subscribed, loading, togglePush }}>{children}</PushContext.Provider> );
}

export const usePush = () => useContext(PushContext);

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return window.btoa(binary);
}