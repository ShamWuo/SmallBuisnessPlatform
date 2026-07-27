import React, { useState, useRef, useEffect } from 'react';
import { useSalon } from '../context/SalonContext';
import { Send, MessageSquare, ShieldAlert } from 'lucide-react';

export const CopilotChat: React.FC = () => {
  const { chatMessages, sendCopilotMessage, triggerDraftAction } = useSalon();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendCopilotMessage(inputText.trim());
    setInputText('');
  };

  const handlePresetClick = (prompt: string) => {
    sendCopilotMessage(prompt);
  };

  return (
    <div className="clean-chat-shell">
      <div style={{ padding: '0.85rem 1.1rem', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Front Desk Assistant</div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Ask questions or draft client communications</div>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 600 }}>Active</span>
      </div>

      <div style={{ padding: '0.5rem 0.85rem', display: 'flex', gap: '0.35rem', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.1)' }}>
        <button className="weather-chip" onClick={() => handlePresetClick("Why is Jessica Miller's appointment high risk?")}>
          "Why is Jessica high risk?"
        </button>
        <button className="weather-chip" onClick={() => handlePresetClick("Are we compliant right now?")}>
          "Are we compliant right now?"
        </button>
        <button className="weather-chip" onClick={() => handlePresetClick("Show all upcoming at-risk appointments")}>
          "Show at-risk appointments"
        </button>
        <button className="weather-chip" onClick={() => handlePresetClick("Draft a deposit request for Jessica Miller")}>
          "Draft deposit request"
        </button>
      </div>

      <div className="chat-messages-area">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
            <div className="chat-bubble">
              <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
                {msg.sender === 'copilot' ? 'Front Desk Assistant' : 'You'} • {msg.timestamp}
              </div>

              <div>
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx} style={{ marginBottom: '0.25rem' }}>{line}</p>
                ))}
              </div>

              {msg.actionCard && (
                <div style={{ marginTop: '0.5rem', background: 'var(--bg-dark)', padding: '0.5rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.775rem' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{msg.actionCard.title}</div>

                  {msg.actionCard.type === 'appointment_risk' && (
                    <div>
                      <div>Client: {msg.actionCard.payload.appointment.clientName}</div>
                      <div>Risk Score: <strong>{msg.actionCard.payload.result.score}/100</strong></div>
                      <button
                        className="btn-blue"
                        style={{ marginTop: '0.4rem', width: '100%', justifyContent: 'center', fontSize: '0.725rem', padding: '0.25rem' }}
                        onClick={() => triggerDraftAction('appointment', msg.actionCard?.payload.appointment.id)}
                      >
                        <MessageSquare size={12} /> Execute Action ({msg.actionCard.payload.result.suggestedActionLabel})
                      </button>
                    </div>
                  )}

                  {msg.actionCard.type === 'compliance_alert' && (
                    <div>
                      <div>Compliance Index: <strong>{msg.actionCard.payload.healthIndex}%</strong></div>
                      <button
                        className="btn-ghost"
                        style={{ marginTop: '0.4rem', width: '100%', justifyContent: 'center', fontSize: '0.725rem', padding: '0.25rem', color: 'var(--status-red)' }}
                        onClick={() => triggerDraftAction('compliance', 'LIC-101')}
                      >
                        <ShieldAlert size={12} /> Draft Warning Email
                      </button>
                    </div>
                  )}

                  {msg.actionCard.type === 'draft_preview' && (
                    <div>
                      <div style={{ color: 'var(--accent-blue)' }}>To: {msg.actionCard.payload.recipient}</div>
                      <div style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>{msg.actionCard.payload.text}</div>
                      <button
                        className="btn-blue"
                        style={{ marginTop: '0.4rem', width: '100%', justifyContent: 'center', fontSize: '0.725rem', padding: '0.25rem' }}
                        onClick={() => triggerDraftAction('appointment', msg.actionCard?.payload.targetId || 'APT-101')}
                      >
                        Open Draft Editor
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-bar">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask a question or request a draft..."
          className="chat-input-field"
        />
        <button type="submit" className="btn-blue" disabled={!inputText.trim()}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
