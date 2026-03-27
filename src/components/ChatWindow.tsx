import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useChats } from '@/context/ChatContext';

const EMOJI_REACTIONS = ['❤️', '🔥', '👍', '😂', '😮', '👏', '🎉', '💯'];
const STICKER_PACK = ['😎', '🥳', '😂', '🤩', '😍', '🤔', '😅', '🙈', '🚀', '💎', '🦊', '🌟', '🎯', '💪', '🥰', '😤'];

interface ChatInfo {
  name: string;
  avatar: string;
  online: boolean;
  username?: string;
}

const CHAT_INFO: Record<number, ChatInfo> = {
  1: { name: 'Алексей Волков', avatar: '🦊', online: true, username: 'alex_volkov' },
  2: { name: 'Команда Frase', avatar: '🚀', online: true, username: 'frase_team' },
  3: { name: 'Мария Светлова', avatar: '🌸', online: false, username: 'masha_svет' },
  4: { name: 'Дизайн-студия', avatar: '🎨', online: true, username: 'design_studio' },
  5: { name: 'Денис Краснов', avatar: '🏄', online: false, username: 'denis_k' },
  6: { name: 'Катя М.', avatar: '🦋', online: true, username: 'katya_m' },
  7: { name: 'Техподдержка', avatar: '🛠️', online: false, username: 'support_frase' },
};

export default function ChatWindow({ chatId, onBack }: { chatId: number; onBack?: () => void }) {
  const { chats, messages: allMessages, sendMessage, sendSticker, deleteMessage, editMessage, toggleReaction } = useChats();

  const chatData = chats.find(c => c.id === chatId);
  const info: ChatInfo = CHAT_INFO[chatId] || {
    name: chatData?.name || 'Чат',
    avatar: chatData?.avatar || '💬',
    online: chatData?.online || false,
    username: chatData?.username,
  };

  const messages = allMessages[chatId] || [];

  const [input, setInput] = useState('');
  const [showReactionFor, setShowReactionFor] = useState<number | null>(null);
  const [showStickers, setShowStickers] = useState(false);
  const [msgMenu, setMsgMenu] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [confirmDeleteMsg, setConfirmDeleteMsg] = useState<number | null>(null);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInput('');
    setShowStickers(false);
    setMsgMenu(null);
    setEditingId(null);
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (editingId !== null) editRef.current?.focus();
  }, [editingId]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(chatId, input);
    setInput('');
  };

  const startEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
    setMsgMenu(null);
  };

  const commitEdit = () => {
    if (editingId !== null && editText.trim()) {
      editMessage(chatId, editingId, editText.trim());
    }
    setEditingId(null);
    setEditText('');
  };

  const handleLongPress = (id: number) => {
    longPressTimer.current = setTimeout(() => setMsgMenu(id), 500);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const closeAll = () => {
    setShowReactionFor(null);
    setShowStickers(false);
    setMsgMenu(null);
    setShowChatMenu(false);
  };

  return (
    <div className="flex flex-col h-full" onClick={closeAll}>
      {/* Header */}
      <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 shrink-0">
        {onBack && (
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="ArrowLeft" size={18} />
          </button>
        )}
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-xl">{info.avatar}</div>
          {info.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-background" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{info.name}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            {info.online
              ? <><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" /> онлайн</>
              : 'был(а) недавно'}
            {info.username && <span className="text-frase-purple/60 ml-1">@{info.username}</span>}
          </div>
        </div>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Phone" size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Video" size={16} />
          </button>
          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setShowChatMenu(!showChatMenu); }}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
            >
              <Icon name="MoreVertical" size={16} />
            </button>
            {showChatMenu && (
              <div className="absolute right-0 top-full mt-1 z-30 glass-strong rounded-2xl overflow-hidden shadow-2xl border border-white/10 min-w-[160px] animate-pop"
                onClick={e => e.stopPropagation()}
              >
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/8 transition-colors text-left">
                  <span>👤</span> Профиль
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/8 transition-colors text-left">
                  <span>🔍</span> Поиск
                </button>
                <div className="border-t border-white/8" />
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/8 transition-colors text-left text-muted-foreground">
                  <span>🔕</span> Отключить звук
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 gap-3">
            <div className="text-5xl animate-float">{info.avatar}</div>
            <p className="text-sm text-muted-foreground">Начните переписку с {info.name}</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex ${msg.mine ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{ animationDelay: `${i * 20}ms` }}
          >
            <div className="relative max-w-[75%] group">
              {/* Reaction trigger */}
              <button
                onClick={e => { e.stopPropagation(); setShowReactionFor(showReactionFor === msg.id ? null : msg.id); setMsgMenu(null); }}
                className={`absolute ${msg.mine ? '-left-8' : '-right-8'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-sm`}
              >
                😊
              </button>

              {/* Reaction popup */}
              {showReactionFor === msg.id && (
                <div className={`absolute ${msg.mine ? 'right-0' : 'left-0'} -top-12 z-20 glass-strong rounded-2xl px-2 py-1.5 flex gap-1 animate-pop shadow-2xl`}
                  onClick={e => e.stopPropagation()}
                >
                  {EMOJI_REACTIONS.map(emoji => (
                    <button key={emoji} onClick={() => { toggleReaction(chatId, msg.id, emoji); setShowReactionFor(null); }}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/15 text-lg transition-all hover:scale-125"
                    >{emoji}</button>
                  ))}
                </div>
              )}

              {/* Message bubble */}
              <div
                onMouseDown={() => handleLongPress(msg.id)}
                onMouseUp={cancelLongPress}
                onMouseLeave={cancelLongPress}
                onTouchStart={() => handleLongPress(msg.id)}
                onTouchEnd={cancelLongPress}
                onContextMenu={e => { e.preventDefault(); setMsgMenu(msg.id); }}
                onClick={e => e.stopPropagation()}
              >
                {editingId === msg.id ? (
                  <div className="flex items-center gap-2 min-w-[200px]">
                    <input
                      ref={editRef}
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') { setEditingId(null); } }}
                      className="flex-1 gradient-bg text-white px-3.5 py-2 rounded-2xl rounded-br-md text-sm outline-none bg-opacity-80"
                    />
                    <button onClick={commitEdit} className="text-lg hover:scale-110 transition-transform">✓</button>
                  </div>
                ) : msg.type === 'sticker' ? (
                  <div className="text-6xl p-2 animate-pop select-none">{msg.sticker}</div>
                ) : (
                  <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed select-text cursor-default ${
                    msg.mine ? 'gradient-bg text-white rounded-br-md' : 'glass text-foreground rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                )}
              </div>

              {/* Time & edited */}
              <div className={`text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 ${msg.mine ? 'justify-end' : 'justify-start'}`}>
                {msg.edited && <span className="italic">изменено ·</span>}
                <span>{msg.time}</span>
                {msg.mine && <span className="text-frase-purple/70">✓✓</span>}
              </div>

              {/* Reactions */}
              {msg.reactions.length > 0 && (
                <div className={`flex flex-wrap gap-1 mt-1 ${msg.mine ? 'justify-end' : 'justify-start'}`}>
                  {msg.reactions.map(r => (
                    <button key={r.emoji}
                      onClick={e => { e.stopPropagation(); toggleReaction(chatId, msg.id, r.emoji); }}
                      className={`flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border transition-all hover:scale-105 ${
                        r.byMe ? 'bg-frase-purple/20 border-frase-purple/40' : 'glass border-white/10 text-muted-foreground'
                      }`}
                    >
                      {r.emoji} <span className="font-medium">{r.count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Message context menu */}
              {msgMenu === msg.id && (
                <div
                  className={`absolute ${msg.mine ? 'right-0' : 'left-0'} top-full mt-1 z-30 glass-strong rounded-2xl overflow-hidden shadow-2xl border border-white/10 min-w-[170px] animate-pop`}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setShowReactionFor(msg.id); setMsgMenu(null); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/8 transition-colors text-left"
                  >
                    <span>😊</span> Реакция
                  </button>
                  {msg.mine && msg.type === 'text' && (
                    <button
                      onClick={() => startEdit(msg.id, msg.text)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/8 transition-colors text-left"
                    >
                      <span>✏️</span> Изменить
                    </button>
                  )}
                  <button
                    onClick={() => { navigator.clipboard?.writeText(msg.text || msg.sticker || ''); setMsgMenu(null); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/8 transition-colors text-left text-muted-foreground"
                  >
                    <span>📋</span> Копировать
                  </button>
                  <div className="border-t border-white/8" />
                  <button
                    onClick={() => { setConfirmDeleteMsg(msg.id); setMsgMenu(null); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-red-500/15 transition-colors text-left text-red-400"
                  >
                    <span>🗑️</span> Удалить
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Sticker panel */}
      {showStickers && (
        <div className="glass border-t border-white/5 p-3 animate-fade-in" onClick={e => e.stopPropagation()}>
          <div className="text-xs text-muted-foreground mb-2 px-1">Стикеры</div>
          <div className="grid grid-cols-8 gap-1">
            {STICKER_PACK.map(s => (
              <button key={s} onClick={() => { sendSticker(chatId, s); setShowStickers(false); }}
                className="w-10 h-10 flex items-center justify-center text-2xl rounded-xl hover:bg-white/10 transition-all hover:scale-125"
              >{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass border-t border-white/5 p-3 shrink-0" onClick={e => e.stopPropagation()}>
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowStickers(!showStickers)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all text-lg shrink-0 ${showStickers ? 'gradient-bg neon-glow' : 'hover:bg-white/10 text-muted-foreground'}`}
          >🎭</button>
          <div className="flex-1">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Написать сообщение..."
              rows={1}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-sm placeholder:text-muted-foreground/50 outline-none focus:border-frase-purple/50 resize-none transition-all"
              style={{ maxHeight: '120px' }}
            />
          </div>
          {input.trim() ? (
            <button onClick={handleSend}
              className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center neon-glow shrink-0 hover:opacity-90 transition-opacity">
              <Icon name="Send" size={16} className="text-white" />
            </button>
          ) : (
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 text-muted-foreground transition-colors shrink-0">
              <Icon name="Mic" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Delete message confirm */}
      {confirmDeleteMsg !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setConfirmDeleteMsg(null)}
        >
          <div className="glass-strong rounded-3xl p-6 max-w-xs w-full text-center animate-scale-in border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-rubik font-bold text-base mb-1">Удалить сообщение?</h3>
            <p className="text-sm text-muted-foreground mb-5">Сообщение будет удалено навсегда</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDeleteMsg(null)}
                className="flex-1 glass rounded-xl py-2.5 text-sm font-medium hover:bg-white/10 transition-colors">
                Отмена
              </button>
              <button
                onClick={() => { deleteMessage(chatId, confirmDeleteMsg); setConfirmDeleteMsg(null); }}
                className="flex-1 bg-red-500/80 hover:bg-red-500 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
