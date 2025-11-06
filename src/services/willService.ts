// OpenRouter Configuration for Will (Mistral Small)
export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const OPENROUTER_API_KEY = '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';
export const MODEL = 'mistralai/mistral-small-3.2-24b-instruct:free';

import { contentData } from '../contentData';

export interface Vote {
  id: string;
  value: number;
  type: string;
  weight: number;
  includeInAverage: boolean;
  date: string;
}

export async function* askWill(question: string, votes: Vote[], topicId?: string, apiKey?: string, preferences?: { name?: string; surname?: string; chatPreference?: string }): AsyncGenerator<string, void, undefined> {
  const votesContext = votes.length > 0
    ? `Here are the user's current votes:\n${votes.map(v => `- ${v.type}: ${v.value} (weight: ${v.weight}, included: ${v.includeInAverage})`).join('\n')}\n\n`
    : 'The user has no votes recorded yet.\n\n';

  // Universal knowledge: subjects and their topics titles
  const subjectsKnowledge = contentData.map((subj: any) => {
    const topicsTitles = subj.topics.map((t: any) => t.title).join(', ');
    return `${subj.subject}: ${topicsTitles}`;
  }).join('\n');

  const universalContext = `You are Will, a helpful AI assistant for students in class 4D managing their grades and study materials. You have knowledge of the following study topics by subject:\n${subjectsKnowledge}\n\nYou can discuss these topics, provide explanations, or help with study questions.\n\n`;

  let topicContext = '';
  if (topicId) {
    // Find the topic and add its specific context
    for (const subj of contentData) {
      const topic = subj.topics.find((t: any) => t.id === topicId);
      if (topic?.context) {
        topicContext = `Additional detailed context for the current topic "${topic.title}":\n${topic.context}\n\n`;
        break;
      }
    }
  }

  let preferenceInstructions = '';
  if (preferences?.chatPreference) {
    const prefMap: { [key: string]: string } = {
      'incoraggiante': 'Usa un tono incoraggiante.',
      'genz': 'Parla come un membro della Gen Z.',
      'scherzoso': 'Fai lo sciocco e il giocherellone.',
      'pragmatico': 'Sii soprattutto pratico.',
      'empatico': 'Sii empatico e comprensivo nelle tue risposte.'
    };
    preferenceInstructions = prefMap[preferences.chatPreference] || '';
  }

  const prompt = `${votesContext}${universalContext}${topicContext}${preferenceInstructions ? `Inoltre, ${preferenceInstructions} ` : ''}Answer the user's question about their grades, study topics, or any study-related questions. Be friendly, encouraging, and provide specific, actionable advice. Keep responses concise but helpful.

Question: ${question}`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey ? apiKey : OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Could not get response body reader.');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6);
          if (jsonStr === '[DONE]') {
            return;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            console.error('Failed to parse stream chunk:', jsonStr, e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error streaming from OpenRouter:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
     yield `Si è riscontrato un errore. ${errorMessage}`;
  }
}