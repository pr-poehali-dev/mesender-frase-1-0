import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  time: string;
  mine: boolean;
  reactions: { emoji: string; count: number; byMe: boolean }[];
  sticker?: string;
  type: 'text' | 'sticker';
}

const CHAT_DATA: Record<number, { name: string; avatar: string; online: boolean; messages: Message[] }> = {
  1: {
    name: 'Алексей Волков',
    avatar: '🦊',
    online: true,
    messages: [
      { id: 1, text: 'Привет! Как дела?', time: '18:10', mine: false, reactions: [{ emoji: '👋', count: 1, byMe: false }], type: 'text' },
      { id: 2, text: 'Отлично! Работаю над новым проектом', time: '18:12', mine: true, reactions: [], type: 'text' },
      { id: 3, text: '', time: '18:15', mine: false, sticker: '😎', reactions: [], type: 'sticker' },
      { id: 4, text: 'Звучит круто! Расскажи подробнее', time: '18:18', mine: false, reactions: [{ emoji: '❤️', count: 2, byMe: true }], type: 'text' },
      { id: 5, text: 'Создаём мессенджер нового поколения 🚀', time: '18:20', mine: true, reactions: [{ emoji: '🔥', count: 3, byMe: false }, { emoji: '👏', count: 1, byMe: false }], type: 'text' },
      { id: 6, text: 'Вау! Это звучит невероятно!', time: '18:35', mine: false, reactions: [], type: 'text' },
      { id: 7, text: 'Окей, буду в 18:00!', time: '18:42', mine: false, reactions: [], type: 'text' },
    ]
  },
  2: {
    name: 'Команда Frase',
    avatar: '🚀',
    online: true,
    messages: [
      { id: 1, text: 'Всем привет! Дейли-стендап через 5 минут', time: '09:55', mine: false, reactions: [{ emoji: '👍', count: 4, byMe: true }], type: 'text' },
      { id: 2, text: 'Буду!', time: '09:57', mine: true, reactions: [], type: 'text' },
      { id: 3, text: 'Новая версия готова к деплою', time: '17:30', mine: false, reactions: [{ emoji: '🎉', count: 5, byMe: true }], type: 'text' },
    ]
  }
};

const DEFAULT_CHAT = {
  name: 'Чат',
  avatar: '💬',
  online: false,
  messages: [] as Message[]
};

const EMOJI_REACTIONS = ['❤️', '🔥', '👍', '😂', '😮', '👏', '🎉', '💯'];
const STICKER_PACK = ['😎', '🥳', '😂', '🤩', '😍', '🤔', '😅', '🙈', '🚀', '💎', '🦊', '🌟', '🎯', '💪', '🥰', '😤'];

export default function ChatWindow({ chatId, onBack }: { chatId: number; onBack?: () => void }) {
  const chat = CHAT_DATA[chatId] || DEFAULT_CHAT;
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [input, setInput] = useState('');
  const [showReactionFor, setShowReactionFor] = useState<number | null>(null);
  const [showStickers, setShowStickers] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(CHAT_DATA[chatId]?.messages || []);
    setShowStickers(false);
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const msg: Message = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      mine: true,
      reactions: [],
      type: 'text'
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
  };

  const sendSticker = (sticker: string) => {
    const msg: Message = {
      id: Date.now(),
      text: '',
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      mine: true,
      sticker,
      reactions: [],
      type: 'sticker'
    };
    setMessages(prev => [...prev, msg]);
    setShowStickers(false);
  };

  const toggleReaction = (msgId: number, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const existing = m.reactions.find(r => r.emoji === emoji);
      if (existing) {
        return {
          ...m,
          reactions: existing.byMe
            ? m.reactions.filter(r => r.emoji !== emoji)
            : m.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, byMe: true } : r)
        };
      }
      return { ...m, reactions: [...m.reactions, { emoji, count: 1, byMe: true }] };
    }));
    setShowReactionFor(null);
  };

  return (
    <div className="flex flex-col h-full" onClick={() => { setShowReactionFor(null); setShowStickers(false); }}>
      {/* Header */}
      <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 shrink-0">
        {onBack && (
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="ArrowLeft" size={18} />
          </button>
        )}
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-xl">
            {chat.avatar}
          </div>
          {chat.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-background" />}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">{chat.name}</div>
          <div className="text-xs text-muted-foreground">{chat.online ? '🟢 онлайн' : 'был(а) недавно'}</div>
        </div>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Phone" size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Video" size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="MoreVertical" size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex ${msg.mine ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{ animationDelay: `${i * 20}ms` }}
          >
            <div className={`relative max-w-[75%] group`}>
              {/* Reaction picker trigger */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowReactionFor(showReactionFor === msg.id ? null : msg.id); }}
                className={`absolute ${msg.mine ? '-left-8' : '-right-8'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-sm`}
              >
                😊
              </button>

              {/* Reaction popup */}
              {showReactionFor === msg.id && (
                <div
                  className={`absolute ${msg.mine ? 'right-0' : 'left-0'} -top-12 z-20 glass-strong rounded-2xl px-2 py-1.5 flex gap-1 animate-pop shadow-2xl`}
                  onClick={e => e.stopPropagation()}
                >
                  {EMOJI_REACTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => toggleReaction(msg.id, emoji)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/15 text-lg transition-all hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Bubble */}
              {msg.type === 'sticker' ? (
                <div className="text-6xl p-2 animate-pop">{msg.sticker}</div>
              ) : (
                <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.mine
                    ? 'gradient-bg text-white rounded-br-md'
                    : 'glass text-foreground rounded-bl-md'
                }`}>
                  {msg.text}
                </div>
              )}

              {/* Time */}
              <div className={`text-[10px] text-muted-foreground mt-0.5 ${msg.mine ? 'text-right' : 'text-left'}`}>
                {msg.time} {msg.mine && <span className="text-frase-purple/70">✓✓</span>}
              </div>

              {/* Reactions */}
              {msg.reactions.length > 0 && (
                <div className={`flex flex-wrap gap-1 mt-1 ${msg.mine ? 'justify-end' : 'justify-start'}`}>
                  {msg.reactions.map(r => (
                    <button
                      key={r.emoji}
                      onClick={() => toggleReaction(msg.id, r.emoji)}
                      className={`flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border transition-all hover:scale-105 ${
                        r.byMe
                          ? 'bg-frase-purple/20 border-frase-purple/40 text-foreground'
                          : 'glass border-white/10 text-muted-foreground'
                      }`}
                    >
                      {r.emoji} <span className="font-medium">{r.count}</span>
                    </button>
                  ))}
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
              <button
                key={s}
                onClick={() => sendSticker(s)}
                className="w-10 h-10 flex items-center justify-center text-2xl rounded-xl hover:bg-white/10 transition-all hover:scale-125"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass border-t border-white/5 p-3 shrink-0" onClick={e => e.stopPropagation()}>
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowStickers(!showStickers)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all text-lg shrink-0 ${
              showStickers ? 'gradient-bg neon-glow' : 'hover:bg-white/10 text-muted-foreground'
            }`}
          >
            🎭
          </button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Написать сообщение..."
              rows={1}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-sm placeholder:text-muted-foreground/50 outline-none focus:border-frase-purple/50 resize-none transition-all"
              style={{ maxHeight: '120px' }}
            />
          </div>
          {input.trim() ? (
            <button
              onClick={() => sendMessage(input)}
              className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center neon-glow shrink-0 hover:opacity-90 transition-opacity"
            >
              <Icon name="Send" size={16} className="text-white" />
            </button>
          ) : (
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 text-muted-foreground transition-colors shrink-0">
              <Icon name="Mic" size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
