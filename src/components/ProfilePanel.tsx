import { useState } from 'react';

const MEDIA = ['🏖️', '🎸', '🍕', '🌊', '🎯', '🚀', '🦋', '🌟', '🎨', '🏔️', '🌈', '🎭'];

export default function ProfilePanel() {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('Юрий Космонавт');
  const [bio, setBio] = useState('🚀 Разрабатываю классные приложения');
  const [tempName, setTempName] = useState(name);
  const [tempBio, setTempBio] = useState(bio);

  const save = () => {
    setName(tempName);
    setBio(tempBio);
    setEditMode(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Cover */}
      <div className="relative h-32 shrink-0" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)' }}>
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}
        />
      </div>

      {/* Avatar & info */}
      <div className="px-4 pb-4 -mt-10 relative z-10">
        <div className="flex items-end justify-between mb-3">
          <div className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center text-4xl neon-glow border-4 border-background shadow-2xl">
            🧑‍🚀
          </div>
          <button
            onClick={() => { setEditMode(!editMode); setTempName(name); setTempBio(bio); }}
            className="glass border border-white/10 text-sm px-3 py-1.5 rounded-xl font-medium hover:bg-white/10 transition-all"
          >
            {editMode ? '✕ Отмена' : '✏️ Изменить'}
          </button>
        </div>

        {editMode ? (
          <div className="space-y-2 animate-fade-in">
            <input
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-base font-semibold outline-none focus:border-frase-purple/50 transition-all"
            />
            <textarea
              value={tempBio}
              onChange={e => setTempBio(e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-frase-purple/50 resize-none transition-all text-muted-foreground"
            />
            <button onClick={save} className="w-full gradient-bg text-white rounded-xl py-2 text-sm font-semibold neon-glow">
              Сохранить
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <h2 className="text-xl font-rubik font-bold">{name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">@yura_kosmonavt</p>
            <p className="text-sm mt-2 text-foreground/80">{bio}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: 'Сообщений', value: '1.2K', icon: '💬' },
            { label: 'Контактов', value: '48', icon: '👥' },
            { label: 'Стикеры', value: '24', icon: '🎭' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-3 text-center hover-lift cursor-pointer">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-base font-bold gradient-text">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Media grid */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Медиафайлы</span>
            <button className="text-xs text-frase-purple">Все</button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {MEDIA.map((m, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-white/5 flex items-center justify-center text-2xl hover:bg-white/10 transition-all hover:scale-105 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 glass rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">📱</span>
            <span className="text-xs font-medium text-muted-foreground">Телефон</span>
          </div>
          <p className="text-sm">+7 (900) 123-45-67</p>
        </div>
      </div>
    </div>
  );
}
