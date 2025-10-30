import React from 'react';
import { Trash2 } from 'lucide-react';
import { Vote, subjects } from '../src/types';

interface VoteListProps {
  votes: Vote[];
  onDeleteVote: (id: string) => void;
}

export const VoteList: React.FC<VoteListProps> = ({ votes, onDeleteVote }) => {
  if (votes.length === 0) {
    return (
      <div className="card text-center p-8 text-secondary">
        <p>Nessun voto aggiunto ancora. Aggiungi il tuo primo voto sopra!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="card-title">I tuoi voti</h3>
      <div className="flex flex-col gap-2">
        {votes.map((vote) => (
           <div
             key={vote.id}
             className="flex items-center justify-between p-3"
           >
            <div className="flex items-center gap-4">
              <span className={`text-lg font-semibold ${parseFloat(vote.value.toString()) < 6 ? 'text-accent-red' : 'text-accent-green'}`}>
                {vote.value}
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: subjects.find(s => s.name === vote.subject)?.color }}
              >
                {vote.subject}
              </span>
              <span className="text-sm text-secondary">
                {vote.type.charAt(0).toUpperCase() + vote.type.slice(1)}
              </span>
              <span className="text-xs text-secondary">
                Weight: {vote.weight}
              </span>
              {!vote.includeInAverage && (
                <span className="badge badge-excluded">
                  Excluded
                </span>
              )}
            </div>
            <button
              onClick={() => onDeleteVote(vote.id)}
              className="btn btn-icon btn-secondary"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('btn-primary');
                e.currentTarget.style.backgroundColor = 'var(--accent-red)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('btn-primary');
                e.currentTarget.classList.add('btn-secondary');
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = '';
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};