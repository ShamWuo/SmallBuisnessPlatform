import React, { useState, useRef, useEffect } from 'react';
import { useSalon } from '../context/SalonContext';
import { Send, Bot, User, ShieldAlert, MessageSquare, Terminal } from 'lucide-react';

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
    <div className="copilot-chat-container">
      <div className="chat-header">
        <div className="flex items-center gap-2">
          <Bot className="icon-bot" size={20} />
          <div>
            <div className="chat-title">Front Desk Copilot Agent</div>
            <div className="chat-subtitle">Shared Context • Direct Tool Calling Engine</div>
          </div>
        </div>
        <span className="badge-agent-tools">4 Tools Active</span>
      </div>

      {/* Preset Suggestion Chips */}
      <div className="preset-chips">
        <button className="chip-btn" onClick={() => handlePresetClick("Why is Jessica Miller's appointment high risk?")}>
          ⚡ "Why is Jessica high risk?"
        </button>
        <button className="chip-btn" onClick={() => handlePresetClick("Are we compliant right now?")}>
          🛡️ "Are we compliant right now?"
        </button>
        <button className="chip-btn" onClick={() => handlePresetClick("Show all upcoming at-risk appointments")}>
          🔥 "Show at-risk appointments"
        </button>
        <button className="chip-btn" onClick={() => handlePresetClick("Draft a deposit request for Jessica Miller")}>
          📩 "Draft deposit request"
        </button>
      </div>

      {/* Messages List */}
      <div className="messages-list">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
            <div className="avatar-circle">
              {msg.sender === 'copilot' ? <Bot size={16} /> : <User size={16} />}
            </div>

            <div className="bubble-content">
              <div className="bubble-meta">
                <span className="sender-name">{msg.sender === 'copilot' ? 'Front Desk Copilot' : 'You'}</span>
                <span className="time-stamp">{msg.timestamp}</span>
              </div>

              {msg.toolCallName && (
                <div className="tool-call-badge">
                  <Terminal size={12} /> Tool Executed: <code>{msg.toolCallName}</code>
                </div>
              )}

              <div className="message-text">
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              {/* Action Cards Embedded in Chat */}
              {msg.actionCard && (
                <div className="chat-action-card">
                  <div className="card-header">
                    <strong>{msg.actionCard.title}</strong>
                  </div>

                  {msg.actionCard.type === 'appointment_risk' && (
                    <div className="card-body">
                      <div>Client: {msg.actionCard.payload.appointment.clientName}</div>
                      <div>Service: {msg.actionCard.payload.appointment.serviceName}</div>
                      <div>Risk Score: <strong>{msg.actionCard.payload.result.score}/100</strong></div>
                      <button
                        className="btn-card-action"
                        onClick={() => triggerDraftAction('appointment', msg.actionCard?.payload.appointment.id)}
                      >
                        <MessageSquare size={13} /> Execute Suggested Action ({msg.actionCard.payload.result.suggestedActionLabel})
                      </button>
                    </div>
                  )}

                  {msg.actionCard.type === 'compliance_alert' && (
                    <div className="card-body">
                      <div>Compliance Index: <strong>{msg.actionCard.payload.healthIndex}%</strong></div>
                      <div>Expired Items: {msg.actionCard.payload.expiredCount}</div>
                      <button
                        className="btn-card-action"
                        onClick={() => triggerDraftAction('compliance', 'LIC-101')}
                      >
                        <ShieldAlert size={13} /> Draft Owner Alert Email
                      </button>
                    </div>
                  )}

                  {msg.actionCard.type === 'draft_preview' && (
                    <div className="card-body">
                      <div className="draft-recipient">To: {msg.actionCard.payload.recipient}</div>
                      <div className="draft-box-preview">{msg.actionCard.payload.text}</div>
                      <button
                        className="btn-card-action"
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

      {/* Chat Input Bar */}
      <form onSubmit={handleSend} className="chat-input-form">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask Copilot about appointment risks, compliance status, or draft messages..."
          className="chat-input"
        />
        <button type="submit" className="btn-send" disabled={!inputText.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
