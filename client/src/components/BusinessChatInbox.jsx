import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function BusinessChatInbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const load = () => api.get('/business-chat/owner/conversations').then(({ data }) => {
    setConversations(data.data);
    setSelectedId((current) => current || data.data[0]?._id || '');
  }).catch((err) => setError(err.message));

  useEffect(() => { load(); }, []);

  const selected = conversations.find((conversation) => conversation._id === selectedId);
  const reply = async (event) => {
    event.preventDefault();
    if (!selected || !text.trim()) return;
    try {
      const { data } = await api.post(`/business-chat/owner/${selected.businessId._id}/conversations/${selected._id}/messages`, { text });
      setConversations((current) => current.map((item) => item._id === data.data._id ? data.data : item));
      setText('');
    } catch (err) { setError(err.message); }
  };

  const toggleStatus = async () => {
    if (!selected) return;
    try {
      const { data } = await api.patch(`/business-chat/owner/${selected.businessId._id}/conversations/${selected._id}`, { status: selected.status === 'closed' ? 'active' : 'closed', read: true });
      setConversations((current) => current.map((item) => item._id === data.data._id ? data.data : item));
    } catch (err) { setError(err.message); }
  };

  return <section className="mt-10 rounded-xl border border-line bg-white/70 p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-lg font-semibold text-ink">Chat / Messages</h2><p className="mt-1 text-sm text-ink/50">Only conversations belonging to your businesses appear here.</p></div><button type="button" onClick={load} className="rounded border border-line px-3 py-1.5 text-xs text-ink/70">Refresh</button></div>{error && <p className="mt-3 text-sm text-vermilion">{error}</p>}<div className="mt-4 grid min-h-64 gap-4 lg:grid-cols-[260px_1fr]"><div className="divide-y divide-line overflow-hidden rounded border border-line">{conversations.map((conversation) => <button type="button" key={conversation._id} onClick={() => setSelectedId(conversation._id)} className={`block w-full p-3 text-left ${selectedId === conversation._id ? 'bg-cyan-50' : 'bg-white hover:bg-paper'}`}><div className="truncate text-sm font-medium text-ink">{conversation.businessId?.name}</div><div className="mt-1 text-xs text-ink/50">{conversation.visitorName || 'Visitor'} · {conversation.unreadCount} unread</div></button>)}{!conversations.length && <p className="p-4 text-sm text-ink/45">No conversations yet.</p>}</div>{selected ? <div className="flex min-h-64 flex-col rounded border border-line"><div className="flex items-center justify-between border-b border-line p-3"><div><div className="text-sm font-medium text-ink">{selected.visitorName || 'Visitor'}</div><div className="text-xs text-ink/50">{selected.visitorEmail || selected.businessId?.name}</div></div><button type="button" onClick={toggleStatus} className="text-xs text-vermilion underline underline-offset-2">{selected.status === 'closed' ? 'Reopen' : 'Close'}</button></div><div className="flex-1 space-y-2 overflow-y-auto bg-paper/50 p-3">{selected.messages.map((message) => <div key={message._id} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.senderType === 'business' ? 'ml-auto bg-[#082f49] text-white' : 'bg-white text-ink/70'}`}>{message.text}<div className="mt-1 text-[10px] opacity-60">{new Date(message.createdAt).toLocaleString()}</div></div>)}</div><form onSubmit={reply} className="flex gap-2 border-t border-line p-3"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Reply to visitor..." className="min-w-0 flex-1 rounded border border-line px-3 py-2 text-sm" /><button className="rounded bg-ink px-3 py-2 text-sm text-white">Reply</button></form></div> : <div className="flex items-center justify-center rounded border border-dashed border-line text-sm text-ink/45">Select a conversation</div>}</div></section>;
}