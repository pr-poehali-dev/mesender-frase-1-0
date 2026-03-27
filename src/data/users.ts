export interface User {
  id: number;
  name: string;
  username: string;
  phone: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
  mutual?: number;
  isGroup?: boolean;
  memberCount?: number;
}

export const ALL_USERS: User[] = [
  { id: 1, name: 'Алексей Волков', username: 'alex_volkov', phone: '+7 (900) 111-22-33', avatar: '🦊', online: true, mutual: 12 },
  { id: 2, name: 'Мария Светлова', username: 'masha_svет', phone: '+7 (900) 444-55-66', avatar: '🌸', online: false, lastSeen: '1ч назад', mutual: 5 },
  { id: 3, name: 'Команда Frase', username: 'frase_team', phone: '', avatar: '🚀', online: true, isGroup: true, memberCount: 24, mutual: 0 },
  { id: 4, name: 'Денис Краснов', username: 'denis_k', phone: '+7 (910) 777-88-99', avatar: '🏄', online: true, mutual: 3 },
  { id: 5, name: 'Дизайн-студия', username: 'design_studio', phone: '', avatar: '🎨', online: false, isGroup: true, memberCount: 8, mutual: 2 },
  { id: 6, name: 'Катя М.', username: 'katya_m', phone: '+7 (920) 333-11-22', avatar: '🦋', online: true, mutual: 7 },
  { id: 7, name: 'Техподдержка', username: 'support_frase', phone: '+7 (800) 200-00-00', avatar: '🛠️', online: false, lastSeen: '2д назад', mutual: 0 },
];
