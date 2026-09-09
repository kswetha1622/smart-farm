import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useVoice } from '../../hooks/useVoice';
import { Mic, Send, Trash2, StopCircle, CheckCircle, MoreHorizontal, Copy, RefreshCw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../../context/LocationContext';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Silence timeout configuration (milliseconds)
//  0 â€“ SILENCE_WARN_MS  â†’ "Listeningâ€¦"
//  SILENCE_WARN_MS â€“ SILENCE_STOP_MS â†’ "Still listeningâ€¦" (farmer thinking)
//  > SILENCE_STOP_MS    â†’ auto-stop and submit
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SILENCE_WARN_MS = 3000;  // 3 s â†’ warn
const SILENCE_STOP_MS = 8000;  // 8 s â†’ auto stop

export const VoiceAssistant = () => {
  const { t, i18n } = useTranslation();

  // â”€â”€ Chat state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€  // 🎙️ Chat state 🎙️
  const [messages,   setMessages]   = useState([]);
  const [history,    setHistory]    = useState([]);
  const [processing, setProcessing] = useState(false);
  const [textInput,  setTextInput]  = useState('');
  const [errorMsg,   setErrorMsg]   = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [lastQuestion, setLastQuestion] = useState(null);

  // â”€â”€ Recording state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [isListening,     setIsListening]     = useState(false);
  const [listeningStatus, setListeningStatus] = useState('idle'); // idle | active | still
  const [interimText,     setInterimText]     = useState('');    // live partial transcript

  const { speak, stop: stopSpeaking, isSpeaking } = useVoice();
  const { locationState } = useLocation();

  // â”€â”€ Refs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const recognitionRef     = useRef(null);
  const chatEndRef         = useRef(null);
  const finalTranscriptRef = useRef('');    // accumulated final text across pauses
  const silenceWarnRef     = useRef(null);  // warn timer handle
  const silenceStopRef     = useRef(null);  // auto-stop timer handle
  const isStoppingRef      = useRef(false); // prevents double-stop

  const langMap = { en:'en-IN', hi:'hi-IN', te:'te-IN', ta:'ta-IN', kn:'kn-IN', mr:'mr-IN' };

  // â”€â”€ Welcome message â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    setMessages([{
      sender: 'assistant',
      text: 'Hello! I am your Smart Farm AI Assistant. Speak or type anything about farming, crops, weather, or fertilizers!'
    }]);
  }, []);

  // â”€â”€ Auto-scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, processing, interimText]);

  // â”€â”€ Silence timers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const clearSilenceTimers = useCallback(() => {
    if (silenceWarnRef.current) { clearTimeout(silenceWarnRef.current); silenceWarnRef.current = null; }
    if (silenceStopRef.current) { clearTimeout(silenceStopRef.current); silenceStopRef.current = null; }
  }, []);

  const resetSilenceTimers = useCallback(() => {
    clearSilenceTimers();
    // Warn timer
    silenceWarnRef.current = setTimeout(() => {
      setListeningStatus('still');
    }, SILENCE_WARN_MS);
    // Auto-stop timer
    silenceStopRef.current = setTimeout(() => {
      if (!isStoppingRef.current) finalizeSpeech();
    }, SILENCE_STOP_MS);
  }, [clearSilenceTimers]);

  // â”€â”€ Finalize: stop mic and submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const finalizeSpeech = useCallback(() => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;
    clearSilenceTimers();

    try { recognitionRef.current?.stop(); } catch (_) {}
    setIsListening(false);
    setListeningStatus('idle');

    const fullText = finalTranscriptRef.current.trim();
    setInterimText('');
    finalTranscriptRef.current = '';

    if (fullText) {
      handleUserSubmit(fullText);
    } else {
      setErrorMsg('No speech detected. Please try again.');
    }
  }, [clearSilenceTimers]);

  // â”€â”€ Build SpeechRecognition instance â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const buildRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;

    const r = new SR();
    r.continuous     = true;   // KEY: do NOT stop on silence
    r.interimResults = true;   // show live transcript
    r.lang           = langMap[i18n.language] || 'en-IN';
    r.maxAlternatives = 1;

    r.onstart = () => {
      setIsListening(true);
      setListeningStatus('active');
      setErrorMsg('');
      stopSpeaking();
    };

    r.onresult = (event) => {
      // Any speech â†’ reset silence timers
      clearSilenceTimers();
      setListeningStatus('active');

      let interim = '';
      let newFinal = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) newFinal += chunk + ' ';
        else interim += chunk;
      }

      if (newFinal) finalTranscriptRef.current += newFinal;

      // Show combined live text
      setInterimText((finalTranscriptRef.current + interim).trim());

      // Restart silence countdown after each word
      resetSilenceTimers();
    };

    r.onerror = (event) => {
      console.warn('SpeechRecognition error:', event.error);
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone access denied. Please allow microphone permissions.');
        isStoppingRef.current = true;
        setIsListening(false);
        setListeningStatus('idle');
      } else if (event.error === 'no-speech') {
        // Browser fires no-speech during silence â€” we handle it via our own timer, just ignore
      } else if (event.error !== 'aborted') {
        console.warn('Transient recognition error, continuing:', event.error);
      }
    };

    r.onend = () => {
      // If we did NOT intentionally stop, restart to maintain continuous listening
      if (!isStoppingRef.current) {
        try { r.start(); } catch (_) {}
      }
    };

    return r;
  }, [i18n.language, clearSilenceTimers, resetSilenceTimers, stopSpeaking]);

  // â”€â”€ Start recording â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const startRecording = useCallback(() => {
    if (isListening) return;
    isStoppingRef.current      = false;
    finalTranscriptRef.current = '';
    setInterimText('');

    const r = buildRecognition();
    if (!r) {
      setErrorMsg('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }
    recognitionRef.current = r;
    try {
      r.start();
      resetSilenceTimers(); // start initial silence countdown
    } catch (err) {
      console.error('Failed to start recognition:', err);
    }
  }, [isListening, buildRecognition, resetSilenceTimers]);

  // â”€â”€ Toggle mic button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const toggleListening = () => {
    if (isListening) {
      finalizeSpeech();
    } else {
      startRecording();
    }
  };

  // â”€â”€ Done button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleDoneRecording = () => {
    finalizeSpeech();
  };

  // â”€â”€ Rebuild when language changes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    return () => {
      isStoppingRef.current = true;
      clearSilenceTimers();
      try { recognitionRef.current?.stop(); } catch (_) {}
    };
  }, [i18n.language, clearSilenceTimers]);

  // ——————————————————————————————————————————————————————————————————————————  // 🎙️ Submit to AI 🎙️
  const handleUserSubmit = async (text) => {
    if (!text.trim() || processing) return;
    setProcessing(true);
    setErrorMsg('');
    setLastQuestion(text);
    setMessages(prev => [...prev, { sender: 'farmer', text }]);
    setTextInput('');

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      // Limit history to the last 6 messages to prevent context overflow and repetition
      const limitedHistory = history.slice(-6);
      
      const payload = {
        text,
        language: i18n.language,
        location: {
          lat: locationState.lat,
          lng: locationState.lon,
          displayString: locationState.displayString
        },
        history: limitedHistory
      };

      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${BACKEND_URL}/api/voice/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to get response');
      }

      const aiResponse = data.data?.answer || data.data?.text || 'No response received.';
      setMessages(prev => [...prev, { sender: 'assistant', text: aiResponse }]);
      
      setHistory(prev => {
        const newHistory = [
          ...prev,
          { role: 'user', content: text },
          { role: 'assistant', content: aiResponse }
        ];
        // Keep max 10 messages in total history state
        return newHistory.slice(-10);
      });

      if (data.data?.speakable) speak(aiResponse);

    } catch (err) {
      console.error('Voice/AI Error:', err);
      setErrorMsg('Could not reach the AI service. Please try again.');
      // Remove the last user message from UI since it failed, or let it stay and show error
    } finally {
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    if (lastQuestion) {
      // Remove the failed user message from UI if we want a clean retry
      setMessages(prev => prev.filter((m, i) => i !== prev.length - 1 || m.sender !== 'farmer'));
      handleUserSubmit(lastQuestion);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([{
      sender: 'assistant',
      text: 'Hello! I am your Smart Farm AI Assistant. Speak or type anything about farming, crops, weather, or fertilizers!'
    }]);
    setHistory([]);
    setErrorMsg('');
    stopSpeaking();
    if (isListening) finalizeSpeech();
  };

  // â”€â”€ Status helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const statusLabel = () => {
    if (!isListening) return 'Tap to speak';
    if (listeningStatus === 'still') return 'ðŸ”´ Still listeningâ€¦';
    return 'ðŸ”´ Listeningâ€¦';
  };
  const statusColor = () => {
    if (!isListening) return 'text-gray-500';
    if (listeningStatus === 'still') return 'text-orange-500 animate-pulse';
    return 'text-danger-red animate-pulse';
  };

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="flex flex-col h-[700px] max-h-[85vh] card p-0 overflow-hidden border-2 border-primary-green/20 bg-white">

      {/* Header */}
      <div className="bg-light-green p-4 flex justify-between items-center border-b border-green-100 shrink-0">
        <div>
          <h2 className="font-bold text-dark-green text-lg">AI Agriculture Assistant</h2>
          <p className="text-xs text-primary-green flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse"></span>
            Online &amp; Ready
          </p>
        </div>
        <div className="flex gap-2">
          {isSpeaking && (
            <button onClick={stopSpeaking} className="text-orange-500 hover:text-orange-700 p-2 bg-orange-50 rounded-full" title="Stop Speaking">
              <StopCircle size={18} />
            </button>
          )}
          <button onClick={clearChat} className="text-gray-400 hover:text-danger-red p-2 bg-white rounded-full shadow-sm" title="Clear Conversation">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`max-w-[85%] p-4 rounded-2xl relative group ${
              msg.sender === 'farmer'
                ? 'bg-primary-green text-white self-end rounded-tr-sm shadow-sm'
                : 'bg-white shadow-sm border border-gray-100 text-gray-800 self-start rounded-tl-sm'
            }`}
          >
            <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            {msg.sender === 'assistant' && (
              <button 
                onClick={() => handleCopy(msg.text, i)}
                className="absolute top-2 right-2 p-1.5 bg-gray-50 text-gray-400 hover:text-primary-green rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-gray-100"
                title="Copy text"
              >
                {copiedIndex === i ? <Check size={14} className="text-primary-green" /> : <Copy size={14} />}
              </button>
            )}
          </motion.div>
        ))}

        {/* Live interim transcript bubble */}
        <AnimatePresence>
          {isListening && interimText && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-[85%] p-4 rounded-2xl bg-green-50 border border-green-200 text-gray-700 self-end rounded-tr-sm shadow-sm"
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap italic">{interimText}</p>
              <p className="text-xs text-primary-green mt-1">Recordingâ€¦ press <strong>Done</strong> when finished</p>
            </motion.div>
          )}
        </AnimatePresence>

        {processing && (
          <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-2xl self-start rounded-tl-sm flex gap-2 items-center text-gray-500">
            <MoreHorizontal size={20} className="animate-pulse" />
            <span className="text-sm">AI is thinkingâ€¦</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 flex flex-col items-center gap-2">
            <p>{errorMsg}</p>
            <button 
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-md text-red-700 font-medium transition-colors"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">

        {/* Voice controls */}
        <div className="flex flex-col items-center justify-center mb-4">

          {/* Waveform */}
          {isListening && (
            <div className="flex gap-1.5 mb-3 h-6 items-end">
              {[1, 2, 3, 4, 5].map((bar) => (
                <motion.div
                  key={bar}
                  className={`w-1.5 rounded-full ${listeningStatus === 'still' ? 'bg-orange-400' : 'bg-danger-red'}`}
                  animate={{ height: [6, Math.random() * 20 + 6, 6] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: bar * 0.1 }}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            {/* Mic button */}
            <button
              onClick={toggleListening}
              disabled={processing}
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                isListening
                  ? 'w-16 h-16 bg-danger-red shadow-lg scale-110'
                  : 'w-14 h-14 bg-primary-green shadow-green hover:scale-105 active:scale-95'
              } disabled:opacity-50`}
              title={isListening ? 'Tap to stop' : 'Tap to speak'}
            >
              {isListening && (
                <div className="absolute inset-0 bg-danger-red rounded-full animate-ping opacity-30"></div>
              )}
              <Mic size={isListening ? 28 : 24} className="text-white relative z-10" />
            </button>

            {/* Done button â€” only visible while recording */}
            <AnimatePresence>
              {isListening && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={handleDoneRecording}
                  className="flex items-center gap-2 bg-primary-green text-white px-5 py-3 rounded-full font-semibold shadow-md hover:bg-dark-green transition-colors"
                  title="Done â€” Send question to AI"
                >
                  <CheckCircle size={18} />
                  Done
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <p className={`mt-2 font-medium text-sm ${statusColor()}`}>
            {statusLabel()}
          </p>

          {isListening && (
            <p className="text-xs text-gray-400 mt-1 text-center">
              Speak slowly â€” pauses are OK. Press <strong>Done</strong> when you finish your question.
            </p>
          )}
        </div>

        {/* Text fallback */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleUserSubmit(textInput); }}
          className="relative flex items-center w-full"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type your question hereâ€¦"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
            disabled={isListening || processing}
          />
          <button
            type="submit"
            disabled={!textInput.trim() || processing || isListening}
            className="absolute right-2 p-2 text-primary-green disabled:text-gray-300 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Send size={20} />
          </button>
        </form>

      </div>
    </div>
  );
};

