import React, { useEffect, useState } from 'react';
import { ArrowLeft, FileText, ExternalLink, X } from 'lucide-react';
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
  const [showAdditionalVideos, setShowAdditionalVideos] = useState(false);

  // Find the topic
  let topic: any = null;
  for (const subj of contentData) {
    topic = subj.topics.find(t => t.id === topicId);
    if (topic) break;
  }

  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  if (!topic) {
    return (
      <div className="animate-fade-in">
        <button onClick={onBack} className="btn btn-icon btn-secondary mb-4">
          <ArrowLeft size={16} />
        </button>
        <p>Argomento non trovato.</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      {showShareToast && (
        <div className="share-toast">
          Link copiato!
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="btn btn-icon btn-secondary"
            style={{ borderRadius: '50%', width: '40px', height: '40px' }}
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-xl font-semibold">{topic.title}</h2>
        </div>
        <button
          onClick={handleShare}
          className="btn btn-secondary flex items-center gap-2 btn-medium"
        >
          <ExternalLink size={16} />
          <span>Condividi</span>
        </button>
      </div>

      {/* Video */}
      {topic.videoUrl && (
        <div className="card mb-6">
          <h3 className="card-title">Video</h3>
          <VideoPlayer src={topic.videoUrl} />
          {topic.additionalVideos && topic.additionalVideos.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => setShowAdditionalVideos(true)}
                className="btn btn-secondary btn-medium"
                style={{ width: '100%' }}
              >
                Altri video
              </button>
            </div>
          )}
        </div>
      )}

      {/* Additional Videos Modal */}
      {showAdditionalVideos && topic.additionalVideos && topic.additionalVideos.length > 0 && (
        <div className="modal-backdrop" onClick={() => setShowAdditionalVideos(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.5rem', position: 'relative' }}>
              <button
                onClick={() => setShowAdditionalVideos(false)}
                className="btn btn-icon btn-secondary"
                style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1 }}
              >
                <X size={16} />
              </button>
              <h3 className="card-title" style={{ marginBottom: '1.5rem', paddingRight: '3rem' }}>Altri video</h3>
              <div className="flex flex-col gap-6">
                {topic.additionalVideos.map((video: { title: string; url: string }, index: number) => (
                  <div key={index} className="card">
                    <h4 className="card-title" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{video.title}</h4>
                    <VideoPlayer src={video.url} />
                  </div>
                ))}
              </div>
            </div>
          </div>
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

      {/* Bottom Share Button */}
      <div className="flex justify-end mt-8 mb-4">
        <button
          onClick={handleShare}
          className="btn btn-secondary flex items-center gap-2 btn-medium"
        >
          <ExternalLink size={16} />
          <span>Condividi questa sezione</span>
        </button>
      </div>

    </div>
  );
};
