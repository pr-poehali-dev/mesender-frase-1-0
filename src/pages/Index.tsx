import { useState } from 'react';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import ProfilePanel from '@/components/ProfilePanel';
import SettingsPanel from '@/components/SettingsPanel';
import SearchPanel from '@/components/SearchPanel';
import BottomNav from '@/components/BottomNav';
import { ChatProvider } from '@/context/ChatContext';

export type Tab = 'chats' | 'search' | 'profile' | 'settings';

export default function Index() {
  return (
    <ChatProvider>
      <MessengerApp />
    </ChatProvider>
  );
}

function MessengerApp() {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [activeChat, setActiveChat] = useState<number | null>(1);

  const handleTabChange = (t: Tab) => {
    setActiveTab(t);
    if (t !== 'chats') setActiveChat(null);
  };

  return (
    <div className="h-screen w-screen bg-background bg-mesh overflow-hidden flex flex-col font-golos">
      {/* Desktop */}
      <div className="hidden md:flex h-full">
        <aside className="w-80 flex flex-col glass border-r border-white/5 shrink-0">
          <SidebarHeader activeTab={activeTab} setActiveTab={handleTabChange} />
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chats' && <ChatList activeChat={activeChat} setActiveChat={setActiveChat} />}
            {activeTab === 'search' && <SearchPanel />}
            {activeTab === 'profile' && <ProfilePanel />}
            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'chats' && activeChat !== null
            ? <ChatWindow chatId={activeChat} />
            : <EmptyState />
          }
        </main>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden flex-col h-full">
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chats' && activeChat === null && (
            <div className="flex flex-col h-full">
              <MobileHeader title="Чаты" />
              <ChatList activeChat={activeChat} setActiveChat={setActiveChat} />
            </div>
          )}
          {activeTab === 'chats' && activeChat !== null && (
            <ChatWindow chatId={activeChat} onBack={() => setActiveChat(null)} />
          )}
          {activeTab === 'search' && <div className="flex flex-col h-full"><MobileHeader title="Поиск" /><SearchPanel /></div>}
          {activeTab === 'profile' && <div className="flex flex-col h-full"><MobileHeader title="Профиль" /><ProfilePanel /></div>}
          {activeTab === 'settings' && <div className="flex flex-col h-full"><MobileHeader title="Настройки" /><SettingsPanel /></div>}
        </div>
        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>
    </div>
  );
}

function MobileHeader({ title }: { title: string }) {
  return (
    <div className="px-4 py-3 glass border-b border-white/5 flex items-center gap-3">
      <div className="w-7 h-7 gradient-bg rounded-xl flex items-center justify-center text-white text-xs font-bold">F</div>
      <span className="font-rubik font-bold text-base gradient-text">{title}</span>
    </div>
  );
}

function SidebarHeader({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (t: Tab) => void }) {
  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'chats', icon: '💬', label: 'Чаты' },
    { id: 'search', icon: '🔍', label: 'Поиск' },
    { id: 'profile', icon: '👤', label: 'Профиль' },
    { id: 'settings', icon: '⚙️', label: 'Настройки' },
  ];

  return (
    <div className="p-4 border-b border-white/5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 gradient-bg rounded-xl flex items-center justify-center text-white text-sm font-bold neon-glow animate-float">
          F
        </div>
        <span className="font-rubik font-bold text-lg gradient-text">Mesender Frase</span>
      </div>
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-xs transition-all duration-200 ${
              activeTab === tab.id
                ? 'gradient-bg text-white shadow-lg scale-[1.02]'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center p-8">
      <div className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center text-4xl animate-pulse-glow animate-float shadow-2xl">
        💬
      </div>
      <div>
        <h2 className="text-2xl font-rubik font-bold gradient-text mb-2">Mesender Frase</h2>
        <p className="text-muted-foreground text-sm">Выберите чат, чтобы начать общение</p>
      </div>
      <div className="flex gap-2 text-xs text-muted-foreground/50">
        <span>🔒 Сквозное шифрование</span>
        <span>•</span>
        <span>⚡ Быстрая доставка</span>
      </div>
    </div>
  );
}