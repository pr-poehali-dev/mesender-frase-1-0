import type { Tab } from '@/pages/Index';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'chats', icon: '💬', label: 'Чаты' },
  { id: 'search', icon: '🔍', label: 'Поиск' },
  { id: 'profile', icon: '👤', label: 'Профиль' },
  { id: 'settings', icon: '⚙️', label: 'Настройки' },
];

export default function BottomNav({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (t: Tab) => void }) {
  return (
    <nav className="glass border-t border-white/5 px-2 py-1.5 flex items-center shrink-0 safe-area-bottom">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all duration-200 ${
            activeTab === tab.id
              ? 'text-white'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 ${
            activeTab === tab.id ? 'gradient-bg neon-glow scale-110' : ''
          }`}>
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.id === 'chats' && activeTab !== 'chats' && (
              <span className="absolute -top-1 -right-1 w-4 h-4 gradient-bg rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                7
              </span>
            )}
          </div>
          <span className={`text-[10px] font-medium transition-all ${activeTab === tab.id ? 'gradient-text' : ''}`}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
