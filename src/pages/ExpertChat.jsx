import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getSmartAnswer } from '@/lib/smart_answers';
import { useLanguage } from '@/contexts/LanguageContext';

const ExpertChat = () => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState([
        { id: 1, text: "Namaste! I am Kisan Sahayak. How can I assist you today?", sender: "bot", timestamp: new Date() }
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const callAI = async (text) => {
        try {
            const res = await fetch('/api/ai/chat', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            return data.reply || getSmartAnswer(text) || t('ai_connection_fail');
        } catch {
            return getSmartAnswer(text) || "I can help with weather, prices, diseases, and schemes.";
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), text: inputText, sender: "user", timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);

        const reply = await callAI(userMsg.text);
        setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: "bot", timestamp: new Date() }]);
        setIsTyping(false);
    };

    return (
        <div className="h-[calc(100vh-6rem)] max-w-4xl mx-auto p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Bot className="w-8 h-8 text-green-600" />
                        {t('kisan_sahayak')}
                    </h1>
                    <p className="text-sm text-muted-foreground">{t('ai_expert')}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" /> AI Powered
                </div>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden shadow-md">
                <ScrollArea className="flex-1 p-4 bg-slate-50 dark:bg-slate-950/30">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("flex w-max max-w-[80%]", msg.sender === "user" ? "ml-auto" : "mr-auto")}>
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm shadow-sm",
                                    msg.sender === "user"
                                        ? "bg-green-600 text-white rounded-br-none"
                                        : "bg-white dark:bg-secondary border rounded-bl-none"
                                )}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                    <p className={cn("text-[10px] mt-1 text-right opacity-70", msg.sender === "user" ? "text-green-100" : "text-muted-foreground")}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex w-max mr-auto">
                                <div className="bg-white dark:bg-secondary p-3 rounded-2xl border flex gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <CardFooter className="p-3 bg-background border-t">
                    <form onSubmit={handleSend} className="flex gap-2 w-full">
                        <Input
                            placeholder={t('ask_ai') || "Ask me anything about farming..."}
                            className="flex-1"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={isTyping}
                        />
                        <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700" disabled={!inputText.trim() || isTyping}>
                            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ExpertChat;
