import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Key, Loader2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getSmartAnswer } from '@/lib/smart_answers';
import { useLanguage } from '@/contexts/LanguageContext';

const ExpertChat = () => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Namaste! I am Kisan Sahayak. I can help you with crop advice, weather updates, or market prices. How can I assist you today?",
            sender: "bot",
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_HF_TOKEN || "");
    const [showKeyInput, setShowKeyInput] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    const generateResponse = (text) => {
        // Try to find a smart match from our local expert database
        const smartMatch = getSmartAnswer(text);
        if (smartMatch) return smartMatch;

        // Default fallback if no keywords match
        return "I can help with Weather, Crop Prices, Diseases, and Schemes. Try asking: 'How to grow wheat?' or 'Treatment for rust'. (For full AI, add a Hugging Face Key)";
    };

    const callHuggingFaceAI = async (text) => {
        try {
            // Use local proxy to avoid CORS
            const response = await fetch(
                "/api/hf/google/gemma-2-9b-it",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        inputs: `<start_of_turn>user\nYou are an agricultural expert assistant for Indian farmers. Keep answers short, practical, and helpful.\nQuestion: ${text}<end_of_turn>\n<start_of_turn>model`,
                        parameters: { max_new_tokens: 250, temperature: 0.7 }
                    }),
                }
            );

            if (response.status === 410) {
                throw new Error("Model endpoint is retired. Please update to a supported Hugging Face model.");
            }

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const result = await response.json();
            // Gemma format parsing
            const generated = result[0]?.generated_text || "";
            const responseParts = generated.split("<start_of_turn>model");
            return responseParts.length > 1 ? responseParts[1].trim() : generated;
        } catch (error) {
            console.error("AI Error:", error);
            return t('ai_connection_fail');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), text: inputText, sender: "user", timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);

        // Decide Key vs Mock
        let botResponseText = "";

        // Check if key is present (either from env or input)
        if (apiKey && apiKey.trim().startsWith("hf_")) {
            botResponseText = await callHuggingFaceAI(userMsg.text);
        } else {
            // Simulate network delay for realism
            await new Promise(r => setTimeout(r, 600)); // Faster response for local
            botResponseText = generateResponse(userMsg.text);
        }

        const botMsg = { id: Date.now() + 1, text: botResponseText, sender: "bot", timestamp: new Date() };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
    };

    return (
        <div className="h-[calc(100vh-6rem)] max-w-4xl mx-auto p-4 flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header / Config */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Bot className="w-8 h-8 text-green-600" />
                        {t('kisan_sahayak')}
                    </h1>
                    <p className="text-sm text-muted-foreground">{t('ai_expert')}</p>
                </div>
                {!import.meta.env.VITE_HF_TOKEN && (
                    <Button variant="ghost" size="sm" onClick={() => setShowKeyInput(!showKeyInput)} className={cn("text-xs gap-1", apiKey ? "text-green-600 bg-green-50" : "text-muted-foreground")}>
                        <Key className="w-3 h-3" /> {apiKey ? t('ai_active') : t('add_ai_key')}
                    </Button>
                )}
            </div>

            {showKeyInput && !import.meta.env.VITE_HF_TOKEN && (
                <Alert className="mb-2 bg-muted/50 border-dashed">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <AlertDescription className="flex items-center gap-2 w-full">
                        <Input
                            type="password"
                            placeholder="Paste Hugging Face Token (starts with hf_...)"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="h-8 text-xs bg-background"
                        />
                        <Button size="sm" variant="outline" className="h-8" onClick={() => setShowKeyInput(false)}>{t('save') || "Done"}</Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden shadow-md border-border/60">
                <ScrollArea className="flex-1 p-4 bg-slate-50 dark:bg-slate-950/30">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-max max-w-[85%] md:max-w-[70%]",
                                    msg.sender === "user" ? "ml-auto" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm shadow-sm",
                                    msg.sender === "user"
                                        ? "bg-green-600 text-white rounded-br-none"
                                        : "bg-white dark:bg-secondary text-foreground border border-border rounded-bl-none"
                                )}>
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    <p className={cn(
                                        "text-[10px] mt-1 text-right opacity-70",
                                        msg.sender === "user" ? "text-green-100" : "text-muted-foreground"
                                    )}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex w-max mr-auto">
                                <div className="bg-white dark:bg-secondary p-3 rounded-2xl rounded-bl-none border border-border flex gap-1 items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <CardFooter className="p-3 bg-background border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2 w-full items-center relative">
                        <Input
                            placeholder={apiKey ? t('ask_ai') : "Ask about 'weather', 'prices', or 'schemes'..."}
                            className="flex-1 pr-10"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={isTyping}
                        />
                        <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700 shrink-0" disabled={!inputText.trim() || isTyping}>
                            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}

export default ExpertChat;
