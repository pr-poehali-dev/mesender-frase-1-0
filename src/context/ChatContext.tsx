import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const LS_CHATS = 'frase_chats';
const LS_MESSAGES = 'frase_messages';

function loadLS<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) { void e; return fallback; }
}

function saveLS(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { void e; }
}

export interface Message {
  id: number;
  text: string;
  time: string;
  mine: boolean;
  reactions: { emoji: string; count: number; byMe: boolean }[];
  sticker?: string;
  type: 'text' | 'sticker';
  edited?: boolean;
}

export interface Chat {
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

const INIT_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, text: 'Привет! Как дела?', time: '18:10', mine: false, reactions: [{ emoji: '👋', count: 1, byMe: false }], type: 'text' },
    { id: 2, text: 'Отлично! Работаю над новым проектом', time: '18:12', mine: true, reactions: [], type: 'text' },
    { id: 3, text: '', time: '18:15', mine: false, sticker: '😎', reactions: [], type: 'sticker' },
    { id: 4, text: 'Звучит круто! Расскажи подробнее', time: '18:18', mine: false, reactions: [{ emoji: '❤️', count: 2, byMe: true }], type: 'text' },
    { id: 5, text: 'Создаём мессенджер нового поколения 🚀', time: '18:20', mine: true, reactions: [{ emoji: '🔥', count: 3, byMe: false }, { emoji: '👏', count: 1, byMe: false }], type: 'text' },
    { id: 6, text: 'Вау! Это звучит невероятно!', time: '18:35', mine: false, reactions: [], type: 'text' },
    { id: 7, text: 'Окей, буду в 18:00!', time: '18:42', mine: false, reactions: [], type: 'text' },
  ],
  2: [
    { id: 1, text: 'Всем привет! Дейли-стендап через 5 минут', time: '09:55', mine: false, reactions: [{ emoji: '👍', count: 4, byMe: true }], type: 'text' },
    { id: 2, text: 'Буду!', time: '09:57', mine: true, reactions: [], type: 'text' },
    { id: 3, text: 'Новая версия готова к деплою', time: '17:30', mine: false, reactions: [{ emoji: '🎉', count: 5, byMe: true }], type: 'text' },
  ],
  3: [
    { id: 1, text: 'Привет, спасибо за помощь на прошлой неделе!', time: '16:00', mine: false, reactions: [], type: 'text' },
    { id: 2, text: 'Всегда пожалуйста 🌸', time: '16:10', mine: true, reactions: [], type: 'text' },
    { id: 3, text: 'Спасибо за помощь!', time: '16:15', mine: false, reactions: [], type: 'text' },
  ],
};

const INIT_CHATS: Chat[] = [
  { id: 1, name: 'Алексей Волков', username: 'alex_volkov', avatar: '🦊', lastMessage: 'Окей, буду в 18:00!', time: '18:42', unread: 2, online: true, pinned: true },
  { id: 2, name: 'Команда Frase', username: 'frase_team', avatar: '🚀', lastMessage: 'Новая версия готова к деплою', time: '17:30', unread: 5, online: true },
  { id: 3, name: 'Мария Светлова', username: 'masha_svет', avatar: '🌸', lastMessage: 'Спасибо за помощь!', time: '16:15', unread: 0, online: false },
  { id: 4, name: 'Дизайн-студия', username: 'design_studio', avatar: '🎨', lastMessage: 'Макеты обновлены в Figma', time: '14:00', unread: 1, online: true },
  { id: 5, name: 'Денис Краснов', username: 'denis_k', avatar: '🏄', lastMessage: 'Ты видел этот стикер? 😂', time: 'вчера', unread: 0, online: false },
  { id: 6, name: 'Катя М.', username: 'katya_m', avatar: '🦋', lastMessage: 'Завтра встреча в 10:00', time: 'вчера', unread: 0, online: true },
  { id: 7, name: 'Техподдержка', username: 'support_frase', avatar: '🛠️', lastMessage: 'Ваша заявка решена', time: 'вт', unread: 0, online: false },
];

interface ChatContextValue {
  chats: Chat[];
  messages: Record<number, Message[]>;
  addChat: (chat: Chat) => void;
  deleteChat: (id: number) => void;
  pinChat: (id: number) => void;
  clearChat: (id: number) => void;
  sendMessage: (chatId: number, text: string) => void;
  sendSticker: (chatId: number, sticker: string) => void;
  deleteMessage: (chatId: number, msgId: number) => void;
  editMessage: (chatId: number, msgId: number, text: string) => void;
  toggleReaction: (chatId: number, msgId: number, emoji: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(() => loadLS(LS_CHATS, INIT_CHATS));
  const [messages, setMessages] = useState<Record<number, Message[]>>(() => loadLS(LS_MESSAGES, INIT_MESSAGES));

  useEffect(() => { saveLS(LS_CHATS, chats); }, [chats]);
  useEffect(() => { saveLS(LS_MESSAGES, messages); }, [messages]);

  const now = () => new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

  const updateLastMsg = (chatId: number, text: string) => {
    setChats(prev => prev.map(c =>
      c.id === chatId ? { ...c, lastMessage: text, time: now() } : c
    ));
  };

  const addChat = (chat: Chat) => {
    setChats(prev => [chat, ...prev]);
    setMessages(prev => ({ ...prev, [chat.id]: [] }));
  };

  const deleteChat = (id: number) => {
    setChats(prev => prev.filter(c => c.id !== id));
    setMessages(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const pinChat = (id: number) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  const clearChat = (id: number) => {
    setMessages(prev => ({ ...prev, [id]: [] }));
    setChats(prev => prev.map(c => c.id === id ? { ...c, lastMessage: '', time: now() } : c));
  };

  const sendMessage = (chatId: number, text: string) => {
    if (!text.trim()) return;
    const msg: Message = { id: Date.now(), text, time: now(), mine: true, reactions: [], type: 'text' };
    setMessages(prev => ({ ...prev, [chatId]: [...(prev[chatId] || []), msg] }));
    updateLastMsg(chatId, text);
  };

  const sendSticker = (chatId: number, sticker: string) => {
    const msg: Message = { id: Date.now(), text: '', time: now(), mine: true, sticker, reactions: [], type: 'sticker' };
    setMessages(prev => ({ ...prev, [chatId]: [...(prev[chatId] || []), msg] }));
    updateLastMsg(chatId, sticker);
  };

  const deleteMessage = (chatId: number, msgId: number) => {
    setMessages(prev => {
      const updated = (prev[chatId] || []).filter(m => m.id !== msgId);
      const last = updated[updated.length - 1];
      updateLastMsg(chatId, last?.text || last?.sticker || '');
      return { ...prev, [chatId]: updated };
    });
  };

  const editMessage = (chatId: number, msgId: number, text: string) => {
    setMessages(prev => {
      const updated = (prev[chatId] || []).map(m =>
        m.id === msgId ? { ...m, text, edited: true } : m
      );
      const editedMsg = updated.find(m => m.id === msgId);
      if (editedMsg) updateLastMsg(chatId, text);
      return { ...prev, [chatId]: updated };
    });
  };

  const toggleReaction = (chatId: number, msgId: number, emoji: string) => {
    setMessages(prev => {
      const updated = (prev[chatId] || []).map(m => {
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
      });
      return { ...prev, [chatId]: updated };
    });
  };

  return (
    <ChatContext.Provider value={{
      chats, messages, addChat, deleteChat, pinChat, clearChat,
      sendMessage, sendSticker, deleteMessage, editMessage, toggleReaction
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChats must be used within ChatProvider');
  return ctx;
}