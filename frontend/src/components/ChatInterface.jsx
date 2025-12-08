import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../api';
import { Send, User, Bot, AlertCircle, Loader2, Sparkles, PhoneCall, ShieldCheck, ChevronRight, LayoutGrid, Receipt, Wifi, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STATES = [
    "Analyzing your request...",
    "Routing to the correct department...",
    "Consulting with specialized agents...",
    "Formulating response..."
];

const SUGGESTIONS = [
    { icon: Receipt, label: "Check Invoice Status", query: "Can you check the status of invoice INV-123?" },
    { icon: Wifi, label: "Technical Support", query: "My router is blinking red, what should I do?" },
    { icon: HelpCircle, label: "General Inquiry", query: "How do I upgrade my subscription plan?" },
];

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState(LOADING_STATES[0]);
    const [threadId, setThreadId] = useState(() => 'SES-' + Math.random().toString(36).substr(2, 9).toUpperCase());
    const messagesEndRef = useRef(null);

    // Cycle loading text
    useEffect(() => {
        if (!isLoading) return;
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % LOADING_STATES.length;
            setLoadingText(LOADING_STATES[i]);
        }, 1500);
        return () => clearInterval(interval);
    }, [isLoading]);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);

    const handleReset = () => {
        setMessages([]);
        setInput('');
        setThreadId('SES-' + Math.random().toString(36).substr(2, 9).toUpperCase());
    };

    const handleSend = async (e, textOverride = null) => {
        if (e) e.preventDefault();
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        const userMsg = { role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);
        setLoadingText(LOADING_STATES[0]);

        try {
            const data = await sendMessage(userMsg.content, threadId);

            if (data.response.includes("[SYSTEM] The conversation has been escalated")) {
                setMessages(prev => [...prev, {
                    role: 'escalated',
                    content: 'I am connecting you with a human specialist who can better assist you. Please stand by...'
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                role: 'error',
                content: 'System is currently at capacity (Google API Rate Limit). Please wait 1 minute and try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 font-sans">
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col h-[85vh] sm:h-[800px]"
            >
                {/* Header */}
                <header className="bg-white/50 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        {messages.length > 0 && (
                            <button
                                onClick={handleReset}
                                className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                                title="Back to Home / New Session"
                            >
                                <ChevronRight className="w-6 h-6 rotate-180" />
                            </button>
                        )}
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Premier Support AI</h1>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <ShieldCheck className="w-3 h-3 text-indigo-500" />
                                <span>Verified Agent • Session: {threadId}</span>
                            </div>
                        </div>
                    </div>
                    {messages.length > 0 && (
                        <button
                            onClick={handleReset}
                            className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                        >
                            End Session
                        </button>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gradient-to-b from-white/50 to-transparent relative">

                    {/* Welcome Hero State */}
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-4"
                            >
                                <LayoutGrid className="w-10 h-10 text-indigo-600" />
                            </motion.div>
                            <div className="space-y-2 max-w-md">
                                <h2 className="text-2xl font-bold text-slate-800">How can we help today?</h2>
                                <p className="text-slate-500 leading-relaxed">
                                    Our multi-agent system routes your request to specialized billing, technical, or support agents instantly.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                                {SUGGESTIONS.map((suggestion, idx) => (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + (idx * 0.1) }}
                                        onClick={() => handleSend(null, suggestion.query)}
                                        className="flex flex-col items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100 transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                            <suggestion.icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-700">{suggestion.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
                            >
                                <div className={`flex items-end gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {msg.role !== 'user' && (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mb-1 ${msg.role === 'escalated' ? 'bg-orange-100 text-orange-600' :
                                            msg.role === 'error' ? 'bg-red-100 text-red-600' :
                                                'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {msg.role === 'escalated' ? <PhoneCall size={14} /> :
                                                msg.role === 'error' ? <AlertCircle size={14} /> :
                                                    <Bot size={14} />}
                                        </div>
                                    )}

                                    <div className={`group relative px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-2xl rounded-br-sm' :
                                        msg.role === 'escalated' ? 'bg-orange-50/80 backdrop-blur-sm border border-orange-100 text-slate-800 rounded-2xl rounded-bl-sm' :
                                            msg.role === 'error' ? 'bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-800 rounded-2xl rounded-bl-sm' :
                                                'bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-bl-sm shadow-slate-100'
                                        }`}>
                                        {msg.content}
                                        {msg.role === 'escalated' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                className="mt-4 pt-3 border-t border-orange-200/50"
                                            >
                                                <button className="w-full flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-orange-200 transition-all hover:translate-y-[-1px]">
                                                    <span>Connect Now</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start pl-11 mb-6"
                        >
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-3">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium min-w-[150px]">{loadingText}</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer Input */}
                <div className="p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 space-y-3">
                    <form
                        onSubmit={handleSend}
                        className="relative flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all placeholder:text-slate-400 text-slate-700"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 p-2.5 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all hover:scale-105 active:scale-95 shadow-md"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                    <div className="flex justify-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-500">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest cursor-default">
                            Multi-Agent Powered
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ChatInterface;
