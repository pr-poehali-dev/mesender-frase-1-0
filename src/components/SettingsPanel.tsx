import { useState } from 'react';

interface Toggle {
  id: string;
  label: string;
  desc: string;
  icon: string;
  value: boolean;
}

export default function SettingsPanel() {
  const [toggles, setToggles] = useState<Toggle[]>([
    { id: 'notif', label: 'Уведомления', desc: 'Звук и вибрация', icon: '🔔', value: true },
    { id: 'read', label: 'Прочитано', desc: 'Показывать галочки прочтения', icon: '✓✓', value: true },
    { id: 'online', label: 'Статус онлайн', desc: 'Показывать когда в сети', icon: '🟢', value: true },
    { id: 'backup', label: 'Резервная копия', desc: 'Авто-бэкап чатов', icon: '☁️', value: false },
    { id: 'dark', label: 'Тёмная тема', desc: 'Текущая тема оформления', icon: '🌙', value: true },
    { id: 'encrypt', label: 'Сквозное шифрование', desc: 'E2E для всех чатов', icon: '🔒', value: true },
  ]);

  const toggle = (id: string) => {
    setToggles(prev => prev.map(t => t.id === id ? { ...t, value: !t.value } : t));
  };

  const SECTIONS = [
    {
      title: 'Аккаунт',
      items: [
        { icon: '👤', label: 'Личные данные', desc: 'Имя, фото, статус' },
        { icon: '🔐', label: 'Безопасность', desc: 'Пароль, 2FA' },
        { icon: '📱', label: 'Устройства', desc: '3 активных сессии' },
      ]
    },
    {
      title: 'Стикеры',
      items: [
        { icon: '🎭', label: 'Мои стикеры', desc: '3 набора установлено' },
        { icon: '➕', label: 'Добавить набор', desc: 'Каталог стикеров' },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-3 space-y-4">
        {/* Profile quick card */}
        <div className="glass-strong rounded-2xl p-4 flex items-center gap-3 gradient-border">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-3xl neon-glow">
            🧑‍🚀
          </div>
          <div className="flex-1">
            <div className="font-semibold">Юрий Космонавт</div>
            <div className="text-xs text-muted-foreground">@yura_kosmonavt</div>
            <div className="text-xs text-emerald-400 mt-0.5">🟢 Онлайн</div>
          </div>
          <button className="text-muted-foreground hover:text-foreground">›</button>
        </div>

        {/* Toggles */}
        <div>
          <p className="text-xs text-muted-foreground px-1 mb-2">Настройки</p>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
            {toggles.map((t, i) => (
              <div
                key={t.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <span className="text-lg w-6 text-center">{t.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                </div>
                <button
                  onClick={() => toggle(t.id)}
                  className={`relative w-10 h-5.5 rounded-full transition-all duration-300 ${t.value ? 'neon-glow' : ''}`}
                  style={{
                    background: t.value
                      ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                      : 'rgba(255,255,255,0.1)',
                    height: '22px',
                    width: '40px'
                  }}
                >
                  <span
                    className="absolute top-0.5 bg-white rounded-full shadow-md transition-all duration-300"
                    style={{
                      width: '18px',
                      height: '18px',
                      left: t.value ? '20px' : '2px',
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p className="text-xs text-muted-foreground px-1 mb-2">{section.title}</p>
            <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left animate-fade-in"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <span className="text-lg w-6 text-center">{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <span className="text-muted-foreground text-sm">›</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Danger zone */}
        <button className="w-full glass rounded-2xl px-4 py-3 text-left flex items-center gap-3 hover:bg-red-500/10 transition-colors border border-red-500/20">
          <span className="text-lg">🚪</span>
          <div>
            <div className="text-sm font-medium text-red-400">Выйти из аккаунта</div>
            <div className="text-xs text-muted-foreground">Завершить сессию</div>
          </div>
        </button>

        <p className="text-center text-xs text-muted-foreground/40 pb-2">
          Mesender Frase v1.0.0 · 2026
        </p>
      </div>
    </div>
  );
}
