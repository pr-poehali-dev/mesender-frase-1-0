import { useState } from 'react';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  pinned?: boolean;
}

const CHATS: Chat[] = [
  { id: 1, name: 'Алексей Волков', avatar: '🦊', lastMessage: 'Окей, буду в 18:00!', time: '18:42', unread: 2, online: true, pinned: true },
  { id: 2, name: 'Команда Frase', avatar: '🚀', lastMessage: 'Новая версия готова к деплою', time: '17:30', unread: 5, online: true },
  { id: 3, name: 'Мария Светлова', avatar: '🌸', lastMessage: 'Спасибо за помощь!', time: '16:15', unread: 0, online: false },
  { id: 4, name: 'Дизайн-студия', avatar: '🎨', lastMessage: 'Макеты обновлены в Figma', time: '14:00', unread: 1, online: true },
  { id: 5, name: 'Денис Краснов', avatar: '🏄', lastMessage: 'Ты видел этот стикер? 😂', time: 'вчера', unread: 0, online: false },
  { id: 6, name: 'Катя М.', avatar: '🦋', lastMessage: 'Завтра встреча в 10:00', time: 'вчера', unread: 0, online: true },
  { id: 7, name: 'Техподдержка', avatar: '🛠️', lastMessage: 'Ваша заявка решена', time: 'вт', unread: 0, online: false },
];

interface Props {
  activeChat: number | null;
  setActiveChat: (id: number) => void;
}

export default function ChatList({ activeChat, setActiveChat }: Props) {
  const [filter, setFilter] = useState('');

  const filtered = CHATS.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/5">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Поиск в чатах..."
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/50 outline-none focus:border-frase-purple/50 focus:bg-white/8 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {filtered.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl transition-all duration-200 text-left animate-fade-in hover:bg-white/5 ${
              activeChat === chat.id ? 'bg-white/8 gradient-border' : ''
            }`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="relative shrink-0">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg transition-transform ${
                activeChat === chat.id ? 'scale-105' : ''
              }`}
                style={{
                  background: activeChat === chat.id
                    ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                    : 'rgba(255,255,255,0.07)'
                }}
              >
                {chat.avatar}
              </div>
              {chat.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse-glow" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  {chat.pinned && <span className="text-xs text-frase-purple">📌</span>}
                  <span className="font-semibold text-sm truncate">{chat.name}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate">{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <span className="ml-2 shrink-0 min-w-[20px] h-5 gradient-bg rounded-full text-white text-[11px] font-bold flex items-center justify-center px-1.5 animate-pop">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-white/5">
        <button className="w-full gradient-bg text-white rounded-xl py-2.5 text-sm font-semibold neon-glow hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <span>✏️</span> Новый чат
        </button>
      </div>
    </div>
  );
}
