import { useState } from 'react';

const ALL_USERS = [
  { id: 1, name: 'Алексей Волков', avatar: '🦊', status: 'Онлайн', mutual: 12 },
  { id: 2, name: 'Мария Светлова', avatar: '🌸', status: 'Был(а) 1ч назад', mutual: 5 },
  { id: 3, name: 'Команда Frase', avatar: '🚀', status: 'Группа · 24 участника', mutual: 0 },
  { id: 4, name: 'Денис Краснов', avatar: '🏄', status: 'Онлайн', mutual: 3 },
  { id: 5, name: 'Дизайн-студия', avatar: '🎨', status: 'Группа · 8 участников', mutual: 2 },
  { id: 6, name: 'Катя М.', avatar: '🦋', status: 'Онлайн', mutual: 7 },
];

const TAGS = ['Все', 'Люди', 'Группы', 'Сообщения'];

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('Все');

  const results = ALL_USERS.filter(u => {
    const matchQuery = u.name.toLowerCase().includes(query.toLowerCase()) || !query;
    const matchTag = tag === 'Все' || (tag === 'Группы' && u.status.includes('участник')) || (tag === 'Люди' && !u.status.includes('участник'));
    return matchQuery && matchTag;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 space-y-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск людей и групп..."
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground/50 outline-none focus:border-frase-purple/50 transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {TAGS.map(t => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                tag === t ? 'gradient-bg text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/8'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {query && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <div className="text-4xl mb-3">🔎</div>
            Ничего не найдено
          </div>
        )}
        {!query && (
          <div className="px-2 py-2">
            <p className="text-xs text-muted-foreground mb-3">Популярные</p>
          </div>
        )}
        {results.map((user, i) => (
          <button
            key={user.id}
            className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-all animate-fade-in text-left"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="w-11 h-11 rounded-2xl bg-white/7 flex items-center justify-center text-xl shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.status}</div>
              {user.mutual > 0 && (
                <div className="text-[10px] text-frase-purple mt-0.5">{user.mutual} общих контактов</div>
              )}
            </div>
            <button className="shrink-0 text-xs gradient-bg text-white px-3 py-1 rounded-lg font-medium">
              Написать
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}
