import React, { useState } from 'react';
import { Sparkles, Send, Camera, ChefHat, Bot, User, Loader2 } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { findSmartSubstitute } from '../utils/vectorSearch';

interface Message {
  id: string;
  sender: 'user' | 'chef';
  text: string;
  timestamp: string; 
}

export const AIChefPage: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'chef',
      text: 'Hello! I am Chef Dinerforged. Ask me about ingredient substitutions, food science troubleshooting, or upload a photo to scan your pantry.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    // Offline Fallback using Vector Search Engine
    if (!isOnline) {
      setTimeout(() => {
        const subResult = findSmartSubstitute(query);
        let fallbackReply = 'You are currently offline. Running local flavor vector search engine...';
        if (subResult) {
          fallbackReply = `[Offline Mode] Best Substitute for "${query}": ${subResult.substitute}. (${subResult.reasoning})`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'chef',
            text: fallbackReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // Cloud Hybrid Endpoint Call
    try {
      const res = await fetch('/.netlify/functions/ai-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'chef',
          text: data.reply || 'Chef is resting right now.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'chef',
          text: 'Sorry, I encountered an error communicating with the serverless function.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-24 flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-culinary-500 text-slate-950 font-bold">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Chef Companion</h1>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isOnline ? 'Hybrid Cloud (OpenRouter Llama 3.3)' : 'Offline Local Vector Engine'}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white dark:bg-slate-700'
                  : 'bg-culinary-500 text-slate-950 font-bold'
              }`}
            >
              {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white dark:bg-slate-800'
                  : 'border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className="mt-1 block text-[10px] opacity-60 text-right">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin text-culinary-500" />
            <span>Chef is thinking...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 mb-2">
        {['Heavy cream substitute', 'How to fix broken mayonnaise', 'Wine pairing for steak'].map((chip) => (
          <button
            key={chip}
            onClick={() => handleSendMessage(chip)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isOnline ? 'Ask Chef anything...' : 'Ask for substitutions (Offline)...'}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-xl bg-culinary-500 p-3 text-slate-950 disabled:opacity-50 hover:bg-culinary-400 transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};