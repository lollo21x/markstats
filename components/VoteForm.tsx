import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { VoteType, Subject, subjects } from '../src/types';

interface VoteFormProps {
  onAddVote: (vote: { value: number; type: VoteType; subject: Subject; weight: number; includeInAverage: boolean }) => void;
}

export const VoteForm: React.FC<VoteFormProps> = ({ onAddVote }) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState<VoteType>('scritto');
  const [subject, setSubject] = useState<Subject>('Matematica');
  const [weight, setWeight] = useState('1');
  const [includeInAverage, setIncludeInAverage] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(value);
    const numWeight = parseFloat(weight);

    if (isNaN(numValue) || numValue < 0 || numValue > 10) {
      alert('Please enter a valid vote between 0 and 10');
      return;
    }

    if (isNaN(numWeight) || numWeight <= 0) {
      alert('Please enter a valid weight greater than 0');
      return;
    }

    onAddVote({
      value: numValue,
      type,
      subject,
      weight: numWeight,
      includeInAverage
    });

    // Reset form
    setValue('');
    setWeight('1');
    setIncludeInAverage(true);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Aggiungi nuovo voto</h3>
      <form onSubmit={handleSubmit} className="form">
        <div className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Valore Voto</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 8.5"
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Weight (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 25"
              className="input"
              required
            />
          </div>
        </div>

        <div className="form-group">
            <label className="form-label">Materia</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            className="select"
          >
            {subjects.map((subj) => (
              <option key={subj.name} value={subj.name}>
                {subj.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
            <label className="form-label">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as VoteType)}
            className="select"
          >
            <option value="scritto">Scritto</option>
            <option value="orale">Orale</option>
            <option value="altro">Altro</option>
          </select>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="includeAverage"
            checked={includeInAverage}
            onChange={(e) => setIncludeInAverage(e.target.checked)}
            className="checkbox"
          />
          <label htmlFor="includeAverage" className="text-sm">Includi nel calcolo della media</label>
        </div>

        <button type="submit" className="btn btn-primary btn-medium flex items-center justify-center gap-2">
          <Plus size={16} />
          Aggiungi Voto
        </button>
      </form>
    </div>
  );
};