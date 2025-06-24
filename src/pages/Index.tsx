import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, MessageSquare, Bot, User, FileText, Sparkles, Menu, X, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  model?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  system_prompt: string;
  model: string;
  document?: {
    name: string;
    uploaded_at: string;
    size: number;
  };
  created_at: Date;
}

const API_BASE_URL = 'https://chatbot-backend-jc8m.onrender.com/api';

const Index = () => {
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load sessions from backend on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const loadSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`);
      if (response.ok) {
        const sessionsData = await response.json();
        const parsedSessions = sessionsData.map((session: any) => ({
          ...session,
          created_at: new Date(session.created_at),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(parsedSessions);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const handleNewChat = () => {
    setShowSystemPrompt(true);
    setSystemPrompt('');
  };

  const createNewSession = async () => {
    if (!systemPrompt.trim()) {
      toast({
        title: "System prompt required",
        description: "Please enter a system prompt to start the chat",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Chat ${sessions.length + 1}`,
          system_prompt: systemPrompt,
          model: selectedModel
        })
      });

      if (response.ok) {
        const newSession = await response.json();
        const sessionWithDates = {
          ...newSession,
          created_at: new Date(newSession.created_at),
          messages: []
        };
        
        setSessions(prev => [sessionWithDates, ...prev]);
        setCurrentSession(sessionWithDates);
        setShowSystemPrompt(false);
        setUploadedDocument(null);
        
        toast({
          title: "Chat started",
          description: `New session with ${selectedModel.toUpperCase()}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new session",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      type: 'user',
      timestamp: new Date()
    };

    // Update UI immediately with user message
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage]
    };
    
    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: inputMessage,
          model: selectedModel,
          system_prompt: currentSession.system_prompt,
          session_id: currentSession.id,
          document_context: uploadedDocument ? 'true' : null
        })
      });

      if (response.ok) {
        const botMessage = await response.json();
        const botMessageWithDate = {
          ...botMessage,
          timestamp: new Date(botMessage.timestamp)
        };

        const finalSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, botMessageWithDate]
        };

        setCurrentSession(finalSession);
        setSessions(prev => prev.map(s => s.id === currentSession.id ? finalSession : s));
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentSession) {
      const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, TXT, or DOCX files only",
          variant: "destructive"
        });
        return;
      }
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/documents/upload?session_id=${currentSession.id}`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          setUploadedDocument(file);
          toast({
            title: "Document uploaded",
            description: result.message,
          });
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload document",
          variant: "destructive"
        });
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-full md:w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col h-64 md:h-screen flex-shrink-0`}>
        {/* Sidebar Header and Model Selector (not scrollable) */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Agentic Chat</h2>
                <p className="text-xs text-slate-500">AI Assistant</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleNewChat} 
            className="w-full mb-6 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Gemini Pro
                  </div>
                </SelectItem>
                <SelectItem value="groq">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-green-500" />
                    Groq Mixtral
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Sidebar Chat List (scrollable) */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {sessions.map((session) => (
                <Card 
                  key={session.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    currentSession?.id === session.id 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 shadow-md' 
                      : 'bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800'
                  } rounded-xl border backdrop-blur-sm`}
                  onClick={() => setCurrentSession(session)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium truncate text-slate-800 dark:text-slate-200">{session.title}</h3>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg"
                      >
                        {session.model.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-2">
                      {session.system_prompt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">
                        {formatDate(session.created_at)}
                      </span>
                      {session.document && (
                        <FileText className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[60vh] md:h-screen">
        {/* Modern Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-700/50 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-xl h-10 w-10 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              {currentSession && (
                <div>
                  <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{currentSession.title}</h1>
                  <p className="text-sm text-slate-500">
                    {currentSession.model.toUpperCase()} • {currentSession.messages.length} messages
                  </p>
                </div>
              )}
            </div>
            {currentSession && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
              >
                {selectedModel === 'gemini' ? 
                  <Sparkles className="w-3 h-3 text-amber-500" /> : 
                  <Bot className="w-3 h-3 text-green-500" />
                }
                {selectedModel.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>

        {/* System Prompt Input */}
        {showSystemPrompt && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Configure Your AI Assistant</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Define how the AI should behave and respond</p>
              </div>
              <div className="space-y-3">
                <Textarea
                  placeholder="You are a helpful assistant that provides clear, concise explanations..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={3}
                  className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
                />
                <div className="flex justify-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSystemPrompt(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={createNewSession} 
                    disabled={!systemPrompt.trim()}
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages (scrollable) */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full p-6">
            {!currentSession ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/25">
                  <Bot className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to Agentic Chat
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md leading-relaxed">
                  Experience intelligent conversations with advanced AI models. Start by creating a new chat session.
                </p>
                <Button 
                  onClick={handleNewChat}
                  className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                {currentSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[75%] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <div className={`rounded-2xl p-4 shadow-sm backdrop-blur-sm ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                          : 'bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <div className={`flex items-center gap-2 mt-3 text-xs ${
                          message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.model && (
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-white/20 text-current border-0"
                            >
                              {message.model.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 justify-start animate-fade-in">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Input (fixed at bottom, not scrollable) */}
        {currentSession && (
          <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex-shrink-0">
            {uploadedDocument && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center gap-3 border border-blue-200 dark:border-blue-800">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 dark:text-blue-200">{uploadedDocument.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadedDocument(null)}
                  className="ml-auto h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="h-12 w-12 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Upload className="w-4 h-4" />
              </Button>
              <div className="flex-1 flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:shadow-none"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
