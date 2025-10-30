export type VoteType = 'orale' | 'scritto' | 'altro';

export type Subject = 'Arte' | 'Ginnastica' | 'Fisica' | 'Informatica' | 'Inglese' | 'Italiano' | 'Matematica' | 'Storia' | 'Scienze' | 'Filosofia' | 'Religione';

export const subjects: { name: Subject; color: string }[] = [
  { name: 'Arte', color: '#D81B60' },
  { name: 'Ginnastica', color: '#995C43' },
  { name: 'Fisica', color: '#3CB040' },
  { name: 'Informatica', color: '#636363' },
  { name: 'Inglese', color: '#1E88E5' },
  { name: 'Italiano', color: '#0D47A1' },
  { name: 'Matematica', color: '#D32F2F' },
  { name: 'Storia', color: '#D6A127' },
  { name: 'Scienze', color: '#9824AD' },
  { name: 'Filosofia', color: '#007CBF' },
  { name: 'Religione', color: '#F9C025' }
];

export interface Vote {
  id: string;
  value: number;
  type: VoteType;
  subject: Subject;
  weight: number;
  includeInAverage: boolean;
  date: string;
}