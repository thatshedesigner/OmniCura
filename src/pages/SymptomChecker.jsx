import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SymptomChecker = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: "Hello! I'm Omnicura AI. Please describe your symptoms in detail so I can help you understand what might be happening." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response Logic
    setTimeout(() => {
      let aiResponse = { id: Date.now() + 1, type: 'ai', text: "" };
      const query = input.toLowerCase();

      if (query.includes('headache')) {
        aiResponse.text = "A headache can be caused by many factors including stress, dehydration, or tension. It's often helpful to rest in a dark, quiet room and stay hydrated.";
        aiResponse.urgency = "low";
        aiResponse.condition = "Tension Headache / Migraine";
      } else if (query.includes('chest pain')) {
        aiResponse.text = "Chest pain can be serious. If you feel pressure, squeezing, or fullness in the center of your chest, you should seek immediate medical attention.";
        aiResponse.urgency = "high";
        aiResponse.condition = "Acute Cardiac Condition / Angina";
      } else if (query.includes('fever') || query.includes('cough')) {
        aiResponse.text = "A fever and cough are common symptoms of viral infections like the cold or flu. Monitor your temperature and rest.";
        aiResponse.urgency = "medium";
        aiResponse.condition = "Viral Infection / Common Flu";
      } else {
        aiResponse.text = "I understand you're experiencing some discomfort. Could you specify where it hurts or if you have other symptoms like fever or nausea?";
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px' }}>AI Symptom Checker</h2>
        <p style={{ color: 'var(--text-muted)' }}>Get instant guidance from our intelligent health assistant.</p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`message ${msg.type}`}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  {msg.type === 'ai' ? <MessageCircle size={18} style={{ marginTop: '2px' }} /> : <User size={18} style={{ marginTop: '2px' }} />}
                  <div>
                    {msg.text}
                    {msg.urgency && (
                      <div className={`urgency-badge urgency-${msg.urgency}`}>
                        {msg.urgency === 'high' ? <AlertCircle size={14} /> : <Info size={14} />}
                        Urgency: {msg.urgency.charAt(0).toUpperCase() + msg.urgency.slice(1)}
                      </div>
                    )}
                    {msg.condition && (
                      <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Possible Condition:</span>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>{msg.condition}</div>
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
                          Next Steps: Book Consultation <ArrowRight size={14} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="message ai">
              <div style={{ display: 'flex', gap: '4px' }}>
                <div className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1s infinite' }}></div>
                <div className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1s infinite 0.2s' }}></div>
                <div className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1s infinite 0.4s' }}></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Type your symptoms (e.g. I have a headache...)" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-send">
            <Send size={20} />
          </button>
        </form>
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', maxWidth: '600px', marginInline: 'auto' }}>
        <strong>Disclaimer:</strong> This AI tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician for any medical condition.
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default SymptomChecker;
