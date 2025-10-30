import React, { useState, useEffect } from 'react';
import { Vote, Subject, subjects } from '../src/types';

interface VoteChartProps {
  votes: Vote[];
}

export const VoteChart: React.FC<VoteChartProps> = ({ votes }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [chartWidth, setChartWidth] = useState(600);

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth < 768 ? Math.min(window.innerWidth - 40, 600) : 600;
      setChartWidth(width);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Filtra i voti per materia selezionata
  const filteredVotes = selectedSubject === 'all'
    ? votes
    : votes.filter(vote => vote.subject === selectedSubject);

  // Ordina per data e limita per mobile
  const sortedVotes = filteredVotes
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(window.innerWidth < 768 ? -3 : 0); // Ultimi 3 su mobile

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Andamento voti</h3>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value as Subject | 'all')}
          className="select"
          style={{ width: 'auto', minWidth: '120px' }}
        >
          <option value="all">Tutte le materie</option>
          {subjects.map(subject => (
            <option key={subject.name} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {sortedVotes.length < 2 ? (
        <div className="text-center p-8 text-secondary">
          <p>Nessun voto disponibile per il grafico.</p>
        </div>
       ) : (
         <div style={{ overflowX: 'auto' }}>
           {/* Dimensioni del grafico */}
           {(() => {
             const width = chartWidth;
             const height = 300;
            const padding = 40;

            // Trova min e max valori
            const values = sortedVotes.map(v => v.value);
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);

            // Scala per x e y
            const xScale = (index: number) => (index / (sortedVotes.length - 1)) * (width - 2 * padding) + padding;
            const yScale = (value: number) => height - padding - ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding);

            // Crea il path per la linea
            const pathData = sortedVotes.map((vote, index) =>
              `${index === 0 ? 'M' : 'L'} ${xScale(index)} ${yScale(vote.value)}`
            ).join(' ');

            return (
              <svg width={width} height={height} className="border border-border rounded">
                {/* Griglia verticale */}
                {sortedVotes.map((_, index) => (
                  <line
                    key={index}
                    x1={xScale(index)}
                    y1={padding}
                    x2={xScale(index)}
                    y2={height - padding}
                    stroke="var(--border)"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                ))}

                {/* Griglia orizzontale */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                  <line
                    key={value}
                    x1={padding}
                    y1={yScale(value)}
                    x2={width - padding}
                    y2={yScale(value)}
                    stroke="var(--border)"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                ))}

                {/* Linea del grafico */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Punti */}
                {sortedVotes.map((vote, index) => (
                  <circle
                    key={vote.id}
                    cx={xScale(index)}
                    cy={yScale(vote.value)}
                    r="4"
                    fill="var(--accent)"
                    stroke="var(--bg)"
                    strokeWidth="2"
                  />
                ))}

                {/* Etichette assi */}
                <text x={width / 2} y={height - 10} textAnchor="middle" className="text-secondary" fontSize="12">
                  Tempo
                </text>
                <text x={15} y={height / 2} textAnchor="middle" className="text-secondary" fontSize="12" transform={`rotate(-90 15 ${height / 2})`}>
                  Voto
                </text>

                {/* Valori sui punti */}
                {sortedVotes.map((vote, index) => (
                  <text
                    key={vote.id}
                    x={xScale(index)}
                    y={yScale(vote.value) - 10}
                    textAnchor="middle"
                    className="text-primary"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {vote.value}
                  </text>
                ))}
              </svg>
             );
           })()}
         </div>
       )}
    </div>
  );
};