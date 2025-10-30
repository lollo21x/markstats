import React, { useEffect } from 'react';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { WillChat } from './WillChat';
import { Vote } from '../src/types';
import { contentData, getRelativeDate } from '../src/contentData';

interface TopicContentProps {
  topicId: string;
  onBack: () => void;
  votes: Vote[];
}

const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  useEffect(() => {
    // Add Plyr CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdn.plyr.io/3.5.6/plyr.css';
    document.head.appendChild(cssLink);

    // Add custom CSS for Plyr colors
    const customCss = document.createElement('style');
    customCss.innerHTML = `
      .plyr {
        --plyr-color-main: var(--accent);
        --plyr-video-control-color: var(--text-primary);
        --plyr-video-control-background: var(--surface);
        --plyr-menu-background: var(--surface);
        --plyr-menu-color: var(--text-primary);
        --plyr-tooltip-background: var(--surface);
        --plyr-tooltip-color: var(--text-primary);
      }
      .plyr__control--overlaid {
        background: var(--accent);
      }
      .plyr__control:hover {
        background: var(--accent);
        color: var(--bg);
      }
      .plyr__menu__container {
        background: var(--surface);
        border: 1px solid var(--border);
      }
      .plyr__menu__value {
        color: var(--text-primary);
      }
      .plyr__menu__value:hover {
        background: var(--accent);
        color: var(--bg);
      }
    `;
    document.head.appendChild(customCss);

    // Add Plyr JS
    const script = document.createElement('script');
    script.src = 'https://cdn.plyr.io/3.5.6/plyr.js';
    script.onload = () => {
      // @ts-ignore
      const player = Plyr.setup('.js-player', {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
        settings: ['quality', 'speed', 'loop']
      });
    };
    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (document.head.contains(cssLink)) document.head.removeChild(cssLink);
      if (document.head.contains(customCss)) document.head.removeChild(customCss);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  return (
    <video
      src={src}
      className="js-player w-full"
      style={{ borderRadius: '0', border: 'none' }}
    />
  );
};

export const TopicContent: React.FC<TopicContentProps> = ({ topicId, onBack, votes }) => {
  // Find the topic
  let topic: any = null;
  for (const subj of contentData) {
    topic = subj.topics.find(t => t.id === topicId);
    if (topic) break;
  }

  if (!topic) {
    return (
      <div>
        <button onClick={onBack} className="btn btn-icon btn-secondary mb-4">
          <ArrowLeft size={16} />
        </button>
        <p>Argomento non trovato.</p>
      </div>
    );
  }

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
        <h2 className="text-xl font-semibold">{topic.title}</h2>
      </div>

      {/* Video */}
      {topic.videoUrl && (
        <div className="card mb-6">
          <h3 className="card-title">Video</h3>
          <VideoPlayer src={topic.videoUrl} />
        </div>
      )}

      {/* Files */}
      {topic.files.length > 0 && (
        <div className="card mb-6">
          <h3 className="card-title">File</h3>
          <div className="space-y-2">
            {topic.files.map((file: { name: string; url: string }, index: number) => (
              <a
                key={index}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-surface transition-colors"
              >
                <FileText size={16} />
                <span>{file.name}</span>
                <ExternalLink size={14} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Chatbot and Test Date side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <WillChat votes={votes} topicId={topicId} />
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-secondary">Data verifica/interrogazione</p>
            <p className="text-lg font-semibold">{getRelativeDate(topic.testDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};