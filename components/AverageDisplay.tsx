import React from 'react';
import { Vote, subjects } from '../src/types';

interface AverageDisplayProps {
  votes: Vote[];
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const lightenColor = (hex: string, percent: number) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const { r, g, b } = rgb;
  const newR = Math.min(255, Math.floor(r + (255 - r) * percent / 100));
  const newG = Math.min(255, Math.floor(g + (255 - g) * percent / 100));
  const newB = Math.min(255, Math.floor(b + (255 - b) * percent / 100));
  return `rgb(${newR}, ${newG}, ${newB})`;
};



export const AverageDisplay: React.FC<AverageDisplayProps> = ({ votes }) => {
  const calculateSubjectAverages = () => {
    const subjectAverages: { [key: string]: { arithmetic: number; oralWritten: number; count: number } } = {};

    subjects.forEach(subj => {
      const subjectVotes = votes.filter(v => v.subject === subj.name && v.includeInAverage);
      if (subjectVotes.length === 0) return;

      // Arithmetic average
      const totalWeighted = subjectVotes.reduce((sum, vote) => sum + (vote.value * vote.weight), 0);
      const totalWeight = subjectVotes.reduce((sum, vote) => sum + vote.weight, 0);
      const arithmeticAvg = totalWeighted / totalWeight;

      // Oral-Written average
      const oralVotes = subjectVotes.filter(v => v.type === 'orale');
      const writtenVotes = subjectVotes.filter(v => v.type === 'scritto');

      const calculateTypeAverage = (typeVotes: Vote[]) => {
        if (typeVotes.length === 0) return 0;
        const tw = typeVotes.reduce((sum, vote) => sum + (vote.value * vote.weight), 0);
        const twt = typeVotes.reduce((sum, vote) => sum + vote.weight, 0);
        return tw / twt;
      };

      const oralAvg = calculateTypeAverage(oralVotes);
      const writtenAvg = calculateTypeAverage(writtenVotes);

      let oralWrittenAvg = 0;
      if (oralAvg === 0 && writtenAvg === 0) oralWrittenAvg = 0;
      else if (oralAvg === 0) oralWrittenAvg = writtenAvg;
      else if (writtenAvg === 0) oralWrittenAvg = oralAvg;
      else oralWrittenAvg = (oralAvg + writtenAvg) / 2;

      subjectAverages[subj.name] = {
        arithmetic: arithmeticAvg,
        oralWritten: oralWrittenAvg,
        count: subjectVotes.length
      };
    });

    return subjectAverages;
  };

  const calculateTotalAverages = () => {
    const includedVotes = votes.filter(v => v.includeInAverage);
    if (includedVotes.length === 0) return { arithmetic: 0, oralWritten: 0 };

    // Arithmetic average
    const totalWeighted = includedVotes.reduce((sum, vote) => sum + (vote.value * vote.weight), 0);
    const totalWeight = includedVotes.reduce((sum, vote) => sum + vote.weight, 0);
    const arithmeticAvg = totalWeighted / totalWeight;

    // Oral-Written average
    const oralVotes = includedVotes.filter(v => v.type === 'orale');
    const writtenVotes = includedVotes.filter(v => v.type === 'scritto');

    const calculateTypeAverage = (typeVotes: Vote[]) => {
      if (typeVotes.length === 0) return 0;
      const tw = typeVotes.reduce((sum, vote) => sum + (vote.value * vote.weight), 0);
      const twt = typeVotes.reduce((sum, vote) => sum + vote.weight, 0);
      return tw / twt;
    };

    const oralAvg = calculateTypeAverage(oralVotes);
    const writtenAvg = calculateTypeAverage(writtenVotes);

    let oralWrittenAvg = 0;
    if (oralAvg === 0 && writtenAvg === 0) oralWrittenAvg = 0;
    else if (oralAvg === 0) oralWrittenAvg = writtenAvg;
    else if (writtenAvg === 0) oralWrittenAvg = oralAvg;
    else oralWrittenAvg = (oralAvg + writtenAvg) / 2;

    return { arithmetic: arithmeticAvg, oralWritten: oralWrittenAvg };
  };

  const subjectAverages = calculateSubjectAverages();
  const totalAverages = calculateTotalAverages();

  return (
    <div className="mb-6">
      {/* Total Averages */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card text-center">
          <h3 className="card-subtitle">Media aritmetica totale</h3>
          <div className={`text-3xl font-bold ${totalAverages.arithmetic < 6 ? 'text-accent-red' : 'text-accent-green'}`}>
            {totalAverages.arithmetic.toFixed(2)}
          </div>
          <div className="text-xs text-secondary mt-2">
            {votes.filter(v => v.includeInAverage).length} votes
          </div>
        </div>

        <div className="card text-center">
          <h3 className="card-subtitle">Media orale-scritta totale</h3>
          <div className={`text-3xl font-bold ${totalAverages.oralWritten < 6 ? 'text-accent-red' : 'text-accent-green'}`}>
            {totalAverages.oralWritten.toFixed(2)}
          </div>
          <div className="text-xs text-secondary mt-2">
            Oral: {votes.filter(v => v.includeInAverage && v.type === 'orale').length} | Written: {votes.filter(v => v.includeInAverage && v.type === 'scritto').length}
          </div>
        </div>
      </div>

      {/* Subject Averages */}
      <div className="card">
        <h3 className="card-title mb-6">Medie per materia</h3>
        <div className="grid grid-cols-auto-fit gap-4">
          {subjects.map(subj => {
            const avg = subjectAverages[subj.name];
            if (!avg) return null;

            const gradient = `linear-gradient(to bottom right, ${subj.color}, ${lightenColor(subj.color, 30)})`;

            return (
              <div
                key={subj.name}
                className="text-center"
                style={{
                  background: gradient,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  color: 'white',
                  border: '1px solid transparent'
                }}
              >
                <h4
                  className="font-semibold mb-2"
                  style={{ fontSize: '1rem', margin: '0.5rem 0' }}
                >
                  {subj.name}
                </h4>
                <div className="flex justify-between mb-2" style={{ opacity: 0.9 }}>
                  <span style={{ fontSize: '0.875rem' }}>Aritmetica:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{avg.arithmetic.toFixed(2)}</span>
                </div>
                <div className="flex justify-between" style={{ opacity: 0.9 }}>
                  <span style={{ fontSize: '0.875rem' }}>Orale-Scritta:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{avg.oralWritten.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.8 }}>
                  {avg.count} votes
                </div>
              </div>
            );
          })}
        </div>
        {Object.keys(subjectAverages).length === 0 && (
          <p className="text-center text-secondary my-8">
            Nessuna media per materia da mostrare ancora. Aggiungi alcuni voti per vedere le medie per materia.
          </p>
        )}
      </div>
    </div>
  );
};