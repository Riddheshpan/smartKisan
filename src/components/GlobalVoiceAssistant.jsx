import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const GlobalVoiceAssistant = () => {
    const { language, t } = useLanguage();
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            // Allow matching both languages for navigation
            recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

            recognitionRef.current.onresult = async (event) => {
                const transcript = event.results[0][0].transcript;
                setIsListening(false);
                await handleCommand(transcript);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, [language]);

    const speak = (text) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleCommand = async (cmd) => {
        const lowerCmd = cmd.toLowerCase();
        console.log('Voice Command:', cmd);

        // Navigation Commands
        if (lowerCmd.includes('weather') || lowerCmd.includes('mausam') || lowerCmd.includes('mosam')) {
            speak(language === 'hi' ? 'Mausam ki jankari khul rahi hai' : 'Opening weather information');
            navigate('/weather');
        } else if (lowerCmd.includes('mandi') || lowerCmd.includes('market') || lowerCmd.includes('price') || lowerCmd.includes('rate') || lowerCmd.includes('bhura')) {
            speak(language === 'hi' ? 'Mandi ke bhav khul rahe hain' : 'Opening market rates');
            navigate('/market');
        } else if (lowerCmd.includes('doctor') || lowerCmd.includes('health') || lowerCmd.includes('fasal') || lowerCmd.includes('bimari')) {
            speak(language === 'hi' ? 'Fasal doctor khul raha hai' : 'Opening crop health doctor');
            navigate('/crop-health');
        } else if (lowerCmd.includes('chat') || lowerCmd.includes('sahayak') || lowerCmd.includes('help')) {
            speak(language === 'hi' ? 'Kisan sahayak khul raha hai' : 'Opening kisan assistant');
            navigate('/expert-chat');
        } else if (lowerCmd.includes('scheme') || lowerCmd.includes('yojana') || lowerCmd.includes('sarkari')) {
            speak(language === 'hi' ? 'Sarkari yojanaein khul rahi hain' : 'Opening government schemes');
            navigate('/schemes');
        } else if (lowerCmd.includes('home') || lowerCmd.includes('dashboard') || lowerCmd.includes('shuruat')) {
            speak(language === 'hi' ? 'Dashboard par jaa rahe hain' : 'Going to dashboard');
            navigate('/');
        } else if (lowerCmd.includes('profile') || lowerCmd.includes('meri profile')) {
            speak(language === 'hi' ? 'Aapki profile khul rahi hai' : 'Opening your profile');
            navigate('/profile');
        } else {
            // General AI Query
            setIsProcessing(true);
            try {
                const res = await fetch('/api/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: cmd }),
                });
                const data = await res.json();
                const reply = data.reply || (language === 'hi' ? 'Maaf kijiye, main abhi madad nahi kar sakta.' : 'Sorry, I cannot help right now.');
                speak(reply);
            } catch (e) {
                speak(language === 'hi' ? 'Net ki samasya hai' : 'There is a network issue');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
            setShowTip(true);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {showTip && (isListening || isProcessing) && (
                <div
                    className={cn(
                        "bg-white dark:bg-slate-900 border shadow-xl rounded-2xl p-4 mb-2 max-w-[280px] animate-in fade-in slide-in-from-bottom-2 duration-300",
                        isProcessing ? "border-green-500" : ""
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-sm text-green-600 flex items-center gap-1">
                            <Volume2 className="w-3 h-3" /> {language === 'hi' ? 'Kisan Voice AI' : 'Kisan Voice AI'}
                        </p>
                        <button onClick={() => setShowTip(false)}>
                            <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                    </div>
                    {isProcessing ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin text-green-600" />
                            <p className="text-xs font-medium">{language === 'hi' ? 'Soch raha hoon...' : 'Thinking...'}</p>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">
                            {language === 'hi'
                                ? 'Boliye: "Mausam", "Price of Wheat", ya koi bhi sawal.'
                                : 'Say: "Weather", "Price of Wheat", or ask any question.'}
                        </p>
                    )}
                </div>
            )}

            <Button
                size="icon"
                className={cn(
                    "w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform border-4",
                    isListening
                        ? "bg-red-500 hover:bg-red-600 scale-110 border-red-200 animate-pulse"
                        : isProcessing
                            ? "bg-blue-600 border-blue-200"
                            : "bg-green-600 hover:bg-green-700 hover:scale-105 border-white dark:border-slate-800"
                )}
                onClick={toggleListening}
                disabled={isProcessing}
            >
                {isProcessing ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}

                {/* Voice quality ring */}
                {isListening && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-20" />
                )}
            </Button>
        </div>
    );
};

export default GlobalVoiceAssistant;
