import { useState } from 'react';
import { ALL_USERS } from '@/data/users';

const TAGS = ['Все', 'Люди', 'Группы'];

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('Все');

  const q = query.trim().toLowerCase();

  const results = ALL_USERS.filter(u => {
    const matchQuery = !q
      || u.name.toLowerCase().includes(q)
      || u.username.toLowerCase().includes(q)
      || ('@' + u.username).toLowerCase().includes(q)
      || u.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''));
    const matchTag =
      tag === 'Все'
      || (tag === 'Группы' && u.isGroup)
      || (tag === 'Люди' && !u.isGroup);
    return matchQuery && matchTag;
  });

  const searchMode = q.startsWith('@') ? 'username' : /^\+?[\d\s\-()]{3,}$/.test(q) ? 'phone' : 'name';

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 space-y-3">
        {/* Search input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none">
            {searchMode === 'username' ? '🪪' : searchMode === 'phone' ? '📞' : '🔍'}
          </span>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Имя, @username или номер телефона..."
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground/50 outline-none focus:border-frase-purple/50 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg leading-none"
            >×</button>
          )}
        </div>

        {/* Search hints */}
        {!query && (
          <div className="flex gap-1.5 flex-wrap">
            {['@username', '+7 900...', 'Имя'].map(hint => (
              <button
                key={hint}
                onClick={() => setQuery(hint === 'Имя' ? '' : hint === '@username' ? '@' : '+')}
                className="px-2.5 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground hover:bg-white/8 transition-all"
              >
                {hint}
              </button>
            ))}
          </div>
        )}

        {/* Tags */}
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
        {/* Search mode label */}
        {q && (
          <div className="px-2 pb-2">
            <p className="text-[10px] text-muted-foreground/60">
              {searchMode === 'username' && 'Поиск по @username'}
              {searchMode === 'phone' && 'Поиск по номеру телефона'}
              {searchMode === 'name' && 'Поиск по имени'}
              {results.length > 0 && ` · ${results.length} результатов`}
            </p>
          </div>
        )}

        {q && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <div className="text-4xl mb-3">🔎</div>
            <p className="font-medium mb-1">Никого не найдено</p>
            <p className="text-xs text-muted-foreground/60">
              Попробуйте @username или номер телефона
            </p>
          </div>
        )}

        {!q && (
          <div className="px-2 py-1 mb-1">
            <p className="text-xs text-muted-foreground">Все контакты</p>
          </div>
        )}

        {results.map((user, i) => (
          <div
            key={user.id}
            className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-all animate-fade-in"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-white/7 flex items-center justify-center text-xl">
                {user.avatar}
              </div>
              {user.online && !user.isGroup && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm truncate">{user.name}</span>
                {user.online && !user.isGroup && (
                  <span className="text-[9px] text-emerald-400 font-medium shrink-0">● онлайн</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {user.username && (
                  <span className="text-[11px] text-frase-purple truncate">@{user.username}</span>
                )}
                {user.phone && !user.isGroup && (
                  <span className="text-[11px] text-muted-foreground truncate">{user.phone}</span>
                )}
                {user.isGroup && (
                  <span className="text-[11px] text-muted-foreground">{user.memberCount} участников</span>
                )}
              </div>
              {!user.online && !user.isGroup && user.lastSeen && (
                <div className="text-[10px] text-muted-foreground/50">был(а) {user.lastSeen}</div>
              )}
              {user.mutual && user.mutual > 0 ? (
                <div className="text-[10px] text-frase-purple/70">{user.mutual} общих контактов</div>
              ) : null}
            </div>

            {/* Action */}
            <button className="shrink-0 text-xs gradient-bg text-white px-3 py-1.5 rounded-xl font-medium hover:opacity-90 transition-opacity neon-glow">
              Написать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
