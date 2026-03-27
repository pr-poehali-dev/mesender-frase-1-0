import { useState } from 'react';
import { ALL_USERS } from '@/data/users';

interface Chat {
  id: number;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  pinned?: boolean;
}

const INITIAL_CHATS: Chat[] = [
  { id: 1, name: 'Алексей Волков', username: 'alex_volkov', avatar: '🦊', lastMessage: 'Окей, буду в 18:00!', time: '18:42', unread: 2, online: true, pinned: true },
  { id: 2, name: 'Команда Frase', username: 'frase_team', avatar: '🚀', lastMessage: 'Новая версия готова к деплою', time: '17:30', unread: 5, online: true },
  { id: 3, name: 'Мария Светлова', username: 'masha_svет', avatar: '🌸', lastMessage: 'Спасибо за помощь!', time: '16:15', unread: 0, online: false },
  { id: 4, name: 'Дизайн-студия', username: 'design_studio', avatar: '🎨', lastMessage: 'Макеты обновлены в Figma', time: '14:00', unread: 1, online: true },
  { id: 5, name: 'Денис Краснов', username: 'denis_k', avatar: '🏄', lastMessage: 'Ты видел этот стикер? 😂', time: 'вчера', unread: 0, online: false },
  { id: 6, name: 'Катя М.', username: 'katya_m', avatar: '🦋', lastMessage: 'Завтра встреча в 10:00', time: 'вчера', unread: 0, online: true },
  { id: 7, name: 'Техподдержка', username: 'support_frase', avatar: '🛠️', lastMessage: 'Ваша заявка решена', time: 'вт', unread: 0, online: false },
];

interface Props {
  activeChat: number | null;
  setActiveChat: (id: number) => void;
}

const AVATARS = ['😎', '🦁', '🐯', '🦄', '🐸', '🦉', '🐺', '🦊', '🐻', '🦋', '🌟', '🚀'];

export default function ChatList({ activeChat, setActiveChat }: Props) {
  const [filter, setFilter] = useState('');
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [showNewChat, setShowNewChat] = useState(false);

  const filtered = chats.filter(c => {
    const q = filter.toLowerCase();
    return c.name.toLowerCase().includes(q)
      || c.username.toLowerCase().includes(q)
      || ('@' + c.username).toLowerCase().includes(q)
      || c.lastMessage.toLowerCase().includes(q);
  });

  const addChat = (chat: Chat) => {
    setChats(prev => [chat, ...prev]);
    setShowNewChat(false);
    setActiveChat(chat.id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-white/5">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none">🔍</span>
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Поиск: имя, @username..."
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-8 py-2 text-sm placeholder:text-muted-foreground/50 outline-none focus:border-frase-purple/50 transition-all"
          />
          {filter && (
            <button onClick={() => setFilter('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            <div className="text-3xl mb-2">🔎</div>
            Ничего не найдено
          </div>
        )}
        {filtered.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl transition-all duration-200 text-left animate-fade-in hover:bg-white/5 ${
              activeChat === chat.id ? 'bg-white/8 gradient-border' : ''
            }`}
            style={{ animationDelay: `${i * 40}ms`, width: 'calc(100% - 8px)' }}
          >
            <div className="relative shrink-0">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg transition-transform ${
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
                <div className="flex items-center gap-1.5 min-w-0">
                  {chat.pinned && <span className="text-xs text-frase-purple shrink-0">📌</span>}
                  <span className="font-semibold text-sm truncate">{chat.name}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] text-frase-purple/70 shrink-0 truncate">@{chat.username}</span>
                  <span className="text-muted-foreground/30 shrink-0">·</span>
                  <span className="text-xs text-muted-foreground truncate">{chat.lastMessage}</span>
                </div>
                {chat.unread > 0 && (
                  <span className="shrink-0 min-w-[20px] h-5 gradient-bg rounded-full text-white text-[11px] font-bold flex items-center justify-center px-1.5 animate-pop">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* New chat button */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => setShowNewChat(true)}
          className="w-full gradient-bg text-white rounded-xl py-2.5 text-sm font-semibold neon-glow hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <span>✏️</span> Новый чат
        </button>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onAdd={addChat}
          existingIds={chats.map(c => c.id)}
          avatars={AVATARS}
        />
      )}
    </div>
  );
}

function NewChatModal({
  onClose,
  onAdd,
  existingIds,
  avatars,
}: {
  onClose: () => void;
  onAdd: (chat: Chat) => void;
  existingIds: number[];
  avatars: string[];
}) {
  const [step, setStep] = useState<'search' | 'confirm'>('search');
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof ALL_USERS[0] | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(avatars[0]);
  const [mode, setMode] = useState<'contact' | 'manual'>('contact');
  const [error, setError] = useState('');

  const q = query.trim().toLowerCase();
  const suggestions = q.length >= 1
    ? ALL_USERS.filter(u =>
        !existingIds.includes(u.id) && (
          u.name.toLowerCase().includes(q)
          || u.username.toLowerCase().includes(q)
          || ('@' + u.username).includes(q)
          || u.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
        )
      )
    : [];

  const selectUser = (u: typeof ALL_USERS[0]) => {
    setSelectedUser(u);
    setName(u.name);
    setPhone(u.phone);
    setUsername(u.username);
    setAvatar(u.avatar);
    setStep('confirm');
  };

  const handleCreate = () => {
    if (!name.trim()) { setError('Введите имя'); return; }
    if (!phone.trim() && !username.trim()) { setError('Введите телефон или @username'); return; }

    const newChat: Chat = {
      id: Date.now(),
      name: name.trim(),
      username: username.replace('@', '').trim() || 'user' + Date.now(),
      avatar,
      lastMessage: 'Начните переписку',
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      online: selectedUser?.online ?? false,
    };
    onAdd(newChat);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm glass-strong rounded-3xl overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step === 'confirm' && (
              <button
                onClick={() => { setStep('search'); setSelectedUser(null); }}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground text-lg"
              >‹</button>
            )}
            <span className="font-rubik font-bold text-base gradient-text">
              {step === 'search' ? 'Новый чат' : 'Подтверждение'}
            </span>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground">
            ×
          </button>
        </div>

        {step === 'search' && (
          <div className="p-4 space-y-3">
            {/* Mode tabs */}
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
              {(['contact', 'manual'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    mode === m ? 'gradient-bg text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m === 'contact' ? '👥 Из контактов' : '✏️ Вручную'}
                </button>
              ))}
            </div>

            {mode === 'contact' && (
              <>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
                  <input
                    autoFocus
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Имя, @username или +7..."
                    className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground/50 outline-none focus:border-frase-purple/50 transition-all"
                  />
                </div>

                {suggestions.length > 0 && (
                  <div className="space-y-1 max-h-56 overflow-y-auto">
                    {suggestions.map(u => (
                      <button
                        key={u.id}
                        onClick={() => selectUser(u)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-all text-left"
                      >
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-2xl bg-white/7 flex items-center justify-center text-xl">{u.avatar}</div>
                          {u.online && !u.isGroup && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm truncate">{u.name}</span>
                            {u.online && !u.isGroup && (
                              <span className="text-[9px] text-emerald-400 shrink-0">● онлайн</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-frase-purple">@{u.username}</span>
                            {u.phone && <span className="text-[11px] text-muted-foreground">{u.phone}</span>}
                          </div>
                        </div>
                        <span className="text-muted-foreground text-sm shrink-0">›</span>
                      </button>
                    ))}
                  </div>
                )}

                {query && suggestions.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    Не найдено среди контактов
                    <br/>
                    <button onClick={() => setMode('manual')} className="text-frase-purple text-xs mt-1 hover:underline">
                      Добавить вручную →
                    </button>
                  </p>
                )}

                {!query && (
                  <p className="text-xs text-muted-foreground/50 text-center py-2">
                    Начните вводить имя, @username или номер
                  </p>
                )}
              </>
            )}

            {mode === 'manual' && (
              <ManualForm
                name={name} setName={setName}
                phone={phone} setPhone={setPhone}
                username={username} setUsername={setUsername}
                avatar={avatar} setAvatar={setAvatar}
                avatars={avatars}
                error={error}
                onSubmit={handleCreate}
              />
            )}
          </div>
        )}

        {step === 'confirm' && selectedUser && (
          <div className="p-4 space-y-4">
            {/* User card */}
            <div className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-3xl neon-glow">
                  {selectedUser.avatar}
                </div>
                {selectedUser.online && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <div className="font-semibold">{selectedUser.name}</div>
                <div className="text-sm text-frase-purple">@{selectedUser.username}</div>
                {selectedUser.phone && (
                  <div className="text-xs text-muted-foreground">{selectedUser.phone}</div>
                )}
                <div className={`text-xs mt-0.5 ${selectedUser.online ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                  {selectedUser.online ? '🟢 Онлайн' : `Был(а) ${selectedUser.lastSeen || 'недавно'}`}
                </div>
              </div>
            </div>

            <button
              onClick={handleCreate}
              className="w-full gradient-bg text-white rounded-xl py-3 text-sm font-semibold neon-glow hover:opacity-90 transition-opacity"
            >
              Начать переписку 💬
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ManualForm({
  name, setName, phone, setPhone, username, setUsername,
  avatar, setAvatar, avatars, error, onSubmit
}: {
  name: string; setName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  username: string; setUsername: (v: string) => void;
  avatar: string; setAvatar: (v: string) => void;
  avatars: string[];
  error: string;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-3">
      {/* Avatar picker */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Аватар</p>
        <div className="grid grid-cols-6 gap-1.5">
          {avatars.map(a => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`w-full aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${
                avatar === a ? 'gradient-bg scale-110 neon-glow' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Имя *</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Иван Иванов"
          className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 outline-none focus:border-frase-purple/50 transition-all"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Номер телефона</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">📞</span>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+7 (900) 000-00-00"
            type="tel"
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground/40 outline-none focus:border-frase-purple/50 transition-all"
          />
        </div>
      </div>

      {/* Username */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Username</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-frase-purple font-bold">@</span>
          <input
            value={username}
            onChange={e => setUsername(e.target.value.replace('@', ''))}
            placeholder="username"
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-8 pr-3 py-2.5 text-sm placeholder:text-muted-foreground/40 outline-none focus:border-frase-purple/50 transition-all"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 animate-fade-in">{error}</p>
      )}

      <button
        onClick={onSubmit}
        className="w-full gradient-bg text-white rounded-xl py-3 text-sm font-semibold neon-glow hover:opacity-90 transition-opacity"
      >
        Создать чат 💬
      </button>
    </div>
  );
}
