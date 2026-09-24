import React, { useEffect, useState } from 'react';
import api from '../services/api';

const visitorKey = () => {
  const storageKey = 'gpages-business-visitor';
  let value = window.localStorage.getItem(storageKey);
  if (!value) {
    value = crypto.randomUUID();
    window.localStorage.setItem(storageKey, value);
  }
  return value;
};

export default function BusinessChat({ place }) {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || conversation) return;
    const key = visitorKey();
    api.post(`/business-chat/${place._id}/conversations`, { visitorKey: key })
      .then(({ data }) => setConversation(data.data))
      .catch((err) => setError(err.message));
  }, [open, conversation, place._id]);

  const send = async (event) => {
    event.preventDefault();
    if (!text.trim() || !conversation) return;
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post(`/business-chat/${place._id}/conversations/${conversation._id}/messages`, { visitorKey: visitorKey(), text });
      setConversation(data.data);
      setText('');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && <div className="mb-3 flex h-[min(34rem,calc(100vh-7rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#b8e7e5] bg-white shadow-[0_20px_60px_rgba(8,47,73,.2)]">
        <div className="bg-[#082f49] p-4 text-white"><div className="text-xs uppercase tracking-[.16em] text-cyan-200">Business chat</div><div className="mt-1 font-display text-lg font-semibold">{place.name}</div><div className="mt-1 text-xs text-white/65">Your message goes directly to this business.</div></div>
        <div className="flex-1 space-y-2 overflow-y-auto bg-[#f5fbfb] p-3">
          {!conversation && !error && <p className="text-sm text-ink/50">Starting conversation...</p>}
          {conversation?.messages?.length === 0 && <p className="text-sm text-ink/50">Ask about services, availability, or pricing.</p>}
          {conversation?.messages?.map((message) => <div key={message._id} className={`max-w-[88%] rounded-xl px-3 py-2 text-sm ${message.senderType === 'visitor' ? 'ml-auto bg-[#082f49] text-white' : 'bg-white text-ink/75'}`}>{message.text}<div className="mt-1 text-[10px] opacity-60">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></div>)}
          {error && <p className="text-sm text-vermilion">{error}</p>}
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-line p-3"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a message..." className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-cyan-600" /><button disabled={busy || !conversation} className="rounded-lg bg-[#082f49] px-3 py-2 text-sm font-medium text-white disabled:opacity-50">Send</button></form>
      </div>}
      <button type="button" onClick={() => setOpen((value) => !value)} className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0b7285] text-white shadow-lg transition hover:scale-105" aria-label={`Chat with ${place.name}`} title={`Chat with ${place.name}`}>{open ? '×' : '↗'}</button>
    </div>
  );
}