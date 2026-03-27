import { useState, useEffect } from 'react';

interface Toggle {
  id: string;
  label: string;
  desc: string;
  icon: string;
  value: boolean;
}

interface ChatSettings {
  fontSize: 'small' | 'medium' | 'large';
  bubbleStyle: 'rounded' | 'sharp' | 'classic';
  enterToSend: boolean;
  showTimestamps: boolean;
  compactMode: boolean;
  mediaAutoDownload: boolean;
  linkPreview: boolean;
  messageSound: 'default' | 'pop' | 'bubble' | 'none';
}

const DEFAULTS: { toggles: Toggle[]; chat: ChatSettings } = {
  toggles: [
    { id: 'notif', label: 'Уведомления', desc: 'Звук и вибрация', icon: '🔔', value: true },
    { id: 'read', label: 'Прочитано', desc: 'Показывать галочки прочтения', icon: '✓✓', value: true },
    { id: 'online', label: 'Статус онлайн', desc: 'Показывать когда в сети', icon: '🟢', value: true },
    { id: 'backup', label: 'Резервная копия', desc: 'Авто-бэкап чатов', icon: '☁️', value: false },
    { id: 'dark', label: 'Тёмная тема', desc: 'Текущая тема оформления', icon: '🌙', value: true },
    { id: 'encrypt', label: 'Сквозное шифрование', desc: 'E2E для всех чатов', icon: '🔒', value: true },
  ],
  chat: {
    fontSize: 'medium',
    bubbleStyle: 'rounded',
    enterToSend: true,
    showTimestamps: true,
    compactMode: false,
    mediaAutoDownload: true,
    linkPreview: true,
    messageSound: 'default',
  }
};

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

export default function SettingsPanel() {
  const [toggles, setToggles] = useState<Toggle[]>(() => load('frase_toggles', DEFAULTS.toggles));
  const [chat, setChat] = useState<ChatSettings>(() => load('frase_chat_settings', DEFAULTS.chat));
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'main' | 'chat'>('main');

  useEffect(() => {
    localStorage.setItem('frase_toggles', JSON.stringify(toggles));
  }, [toggles]);

  const saveChat = (updated: ChatSettings) => {
    setChat(updated);
    localStorage.setItem('frase_chat_settings', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetAll = () => {
    setToggles(DEFAULTS.toggles);
    setChat(DEFAULTS.chat);
    localStorage.removeItem('frase_toggles');
    localStorage.removeItem('frase_chat_settings');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggle = (id: string) => {
    setToggles(prev => prev.map(t => t.id === id ? { ...t, value: !t.value } : t));
  };

  if (activeSection === 'chat') {
    return <ChatSettingsSection chat={chat} onSave={saveChat} onBack={() => setActiveSection('main')} saved={saved} />;
  }

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
          <p className="text-xs text-muted-foreground px-1 mb-2">Общие</p>
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
                  className="relative rounded-full transition-all duration-300 shrink-0"
                  style={{
                    background: t.value
                      ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                      : 'rgba(255,255,255,0.1)',
                    height: '22px',
                    width: '40px',
                    boxShadow: t.value ? '0 0 10px rgba(139,92,246,0.4)' : 'none'
                  }}
                >
                  <span
                    className="absolute top-0.5 bg-white rounded-full shadow-md transition-all duration-300"
                    style={{ width: '18px', height: '18px', left: t.value ? '20px' : '2px' }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat settings */}
        <div>
          <p className="text-xs text-muted-foreground px-1 mb-2">Чаты</p>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
            <button
              onClick={() => setActiveSection('chat')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-lg w-6 text-center">💬</span>
              <div className="flex-1">
                <div className="text-sm font-medium">Настройки чатов</div>
                <div className="text-xs text-muted-foreground">
                  Шрифт, пузыри, звуки, медиа
                </div>
              </div>
              <span className="text-muted-foreground text-sm">›</span>
            </button>
            {[
              { icon: '🎭', label: 'Мои стикеры', desc: '3 набора установлено' },
              { icon: '➕', label: 'Добавить набор', desc: 'Каталог стикеров' },
            ].map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
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

        {/* Account */}
        <div>
          <p className="text-xs text-muted-foreground px-1 mb-2">Аккаунт</p>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
            {[
              { icon: '👤', label: 'Личные данные', desc: 'Имя, фото, статус' },
              { icon: '🔐', label: 'Безопасность', desc: 'Пароль, 2FA' },
              { icon: '📱', label: 'Устройства', desc: '3 активных сессии' },
            ].map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
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

        {/* Reset */}
        <button
          onClick={resetAll}
          className="w-full glass rounded-2xl px-4 py-3 text-left flex items-center gap-3 hover:bg-white/8 transition-colors border border-white/5"
        >
          <span className="text-lg">🔄</span>
          <div>
            <div className="text-sm font-medium">Сбросить настройки</div>
            <div className="text-xs text-muted-foreground">Вернуть всё по умолчанию</div>
          </div>
        </button>

        <button className="w-full glass rounded-2xl px-4 py-3 text-left flex items-center gap-3 hover:bg-red-500/10 transition-colors border border-red-500/20">
          <span className="text-lg">🚪</span>
          <div>
            <div className="text-sm font-medium text-red-400">Выйти из аккаунта</div>
            <div className="text-xs text-muted-foreground">Завершить сессию</div>
          </div>
        </button>

        <p className="text-center text-xs text-muted-foreground/40 pb-2">Mesender Frase v1.0.0 · 2026</p>
      </div>
    </div>
  );
}

function ChatSettingsSection({
  chat, onSave, onBack, saved
}: {
  chat: ChatSettings;
  onSave: (c: ChatSettings) => void;
  onBack: () => void;
  saved: boolean;
}) {
  const [local, setLocal] = useState<ChatSettings>(chat);

  const update = <K extends keyof ChatSettings>(key: K, value: ChatSettings[K]) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onSave(updated);
  };

  const FONT_SIZES: { value: ChatSettings['fontSize']; label: string; size: string }[] = [
    { value: 'small', label: 'Мелкий', size: 'text-xs' },
    { value: 'medium', label: 'Средний', size: 'text-sm' },
    { value: 'large', label: 'Крупный', size: 'text-base' },
  ];

  const BUBBLE_STYLES: { value: ChatSettings['bubbleStyle']; label: string; preview: string }[] = [
    { value: 'rounded', label: 'Округлый', preview: 'rounded-2xl' },
    { value: 'sharp', label: 'Острый', preview: 'rounded-md' },
    { value: 'classic', label: 'Классик', preview: 'rounded-lg' },
  ];

  const SOUNDS: { value: ChatSettings['messageSound']; label: string; icon: string }[] = [
    { value: 'default', label: 'Стандарт', icon: '🔔' },
    { value: 'pop', label: 'Хлопок', icon: '🫧' },
    { value: 'bubble', label: 'Пузырь', icon: '💬' },
    { value: 'none', label: 'Без звука', icon: '🔕' },
  ];

  const toggleItems: { key: keyof ChatSettings; label: string; desc: string; icon: string }[] = [
    { key: 'enterToSend', label: 'Enter для отправки', desc: 'Shift+Enter — перенос строки', icon: '⌨️' },
    { key: 'showTimestamps', label: 'Время сообщений', desc: 'Показывать время рядом с сообщением', icon: '🕐' },
    { key: 'compactMode', label: 'Компактный режим', desc: 'Уменьшить отступы в чате', icon: '📐' },
    { key: 'mediaAutoDownload', label: 'Авто-загрузка медиа', desc: 'Загружать фото и видео сразу', icon: '📥' },
    { key: 'linkPreview', label: 'Превью ссылок', desc: 'Показывать карточки для URL', icon: '🔗' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-3 py-3 border-b border-white/5 flex items-center gap-3 sticky top-0 glass z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground text-lg"
        >
          ‹
        </button>
        <span className="font-semibold text-sm flex-1">Настройки чатов</span>
        {saved && (
          <span className="text-xs text-emerald-400 animate-fade-in flex items-center gap-1">
            ✓ Сохранено
          </span>
        )}
      </div>

      <div className="p-3 space-y-4">
        {/* Font size */}
        <div>
          <p className="text-xs text-muted-foreground px-1 mb-2">Размер шрифта</p>
          <div className="glass rounded-2xl p-2 flex gap-2">
            {FONT_SIZES.map(f => (
              <button
                key={f.value}
                onClick={() => update('fontSize', f.value)}
                className={`flex-1 py-2.5 rounded-xl transition-all font-medium ${f.size} ${
                  local.fontSize === f.value
                    ? 'gradient-bg text-white shadow-lg scale-[1.02]'
                    : 'hover:bg-white/8 text-muted-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* Preview */}
          <div className="mt-2 glass rounded-2xl p-3">
            <p className="text-xs text-muted-foreground mb-2">Предпросмотр</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-start">
                <div className={`px-3.5 py-2 glass rounded-2xl rounded-bl-md ${
                  local.fontSize === 'small' ? 'text-xs' : local.fontSize === 'large' ? 'text-base' : 'text-sm'
                }`}>
                  Привет! Как дела? 👋
                </div>
              </div>
              <div className="flex justify-end">
                <div className={`px-3.5 py-2 gradient-bg text-white rounded-2xl rounded-br-md ${
                  local.fontSize === 'small' ? 'text-xs' : local.fontSize === 'large' ? 'text-base' : 'text-sm'
                }`}>
                  Отлично, спасибо! 🚀
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bubble style */}
        <div>
          <p className="text-xs text-muted-foreground px-1 mb-2">Стиль пузырей</p>
          <div className="glass rounded-2xl p-2 flex gap-2">
            {BUBBLE_STYLES.map(b => (
              <button
                key={b.value}
                onClick={() => update('bubbleStyle', b.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm transition-all font-medium ${
                  local.bubbleStyle === b.value
                    ? 'gradient-bg text-white shadow-lg scale-[1.02]'
                    : 'hover:bg-white/8 text-muted-foreground'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div>
          <p className="text-xs text-muted-foreground px-1 mb-2">Звук сообщений</p>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
            {SOUNDS.map(s => (
              <button
                key={s.value}
                onClick={() => update('messageSound', s.value)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-lg w-6 text-center">{s.icon}</span>
                <span className="flex-1 text-sm font-medium">{s.label}</span>
                <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                  local.messageSound === s.value
                    ? 'gradient-bg border-frase-purple'
                    : 'border-white/20'
                }`}>
                  {local.messageSound === s.value && (
                    <div className="w-full h-full rounded-full gradient-bg" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div>
          <p className="text-xs text-muted-foreground px-1 mb-2">Поведение</p>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
            {toggleItems.map(item => {
              const val = local[item.key] as boolean;
              return (
                <div key={item.key} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                  <span className="text-lg w-6 text-center">{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => update(item.key, !val as ChatSettings[typeof item.key])}
                    className="relative rounded-full transition-all duration-300 shrink-0"
                    style={{
                      background: val
                        ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                        : 'rgba(255,255,255,0.1)',
                      height: '22px',
                      width: '40px',
                      boxShadow: val ? '0 0 10px rgba(139,92,246,0.4)' : 'none'
                    }}
                  >
                    <span
                      className="absolute top-0.5 bg-white rounded-full shadow-md transition-all duration-300"
                      style={{ width: '18px', height: '18px', left: val ? '20px' : '2px' }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset section */}
        <button
          onClick={() => {
            const def = {
              fontSize: 'medium' as const,
              bubbleStyle: 'rounded' as const,
              enterToSend: true,
              showTimestamps: true,
              compactMode: false,
              mediaAutoDownload: true,
              linkPreview: true,
              messageSound: 'default' as const,
            };
            setLocal(def);
            onSave(def);
          }}
          className="w-full glass rounded-2xl px-4 py-3 text-left flex items-center gap-3 hover:bg-white/8 transition-colors border border-white/5"
        >
          <span className="text-lg">🔄</span>
          <div>
            <div className="text-sm font-medium">Сбросить настройки чатов</div>
            <div className="text-xs text-muted-foreground">Вернуть значения по умолчанию</div>
          </div>
        </button>
      </div>
    </div>
  );
}
