import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Subject } from '../src/types';
import { contentData } from '../src/contentData';

interface SubjectContentProps {
  subject: Subject;
  onBack: () => void;
  onTopicSelect: (topicId: string) => void;
}

export const SubjectContent: React.FC<SubjectContentProps> = ({ subject, onBack, onTopicSelect }) => {
  const subjectData = contentData.find(s => s.subject === subject);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="btn btn-icon btn-secondary"
          style={{ borderRadius: '50%', width: '40px', height: '40px' }}
        >
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-xl font-semibold">{subject}</h2>
      </div>

      <div className="card">
        <h3 className="card-title">Argomenti</h3>
        <div className="space-y-2">
          {subjectData?.topics.map(topic => (
            <div
              key={topic.id}
              onClick={() => onTopicSelect(topic.id)}
              className="cursor-pointer p-4 border border-border rounded-lg hover:bg-surface transition-colors flex justify-between items-center"
            >
              <span>{topic.title}</span>
              <ChevronRight size={16} />
            </div>
          )) || (
            <p className="text-secondary">Nessun argomento disponibile per questa materia.</p>
          )}
        </div>
      </div>
    </div>
  );
};