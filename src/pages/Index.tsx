import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, MessageSquare, Bot, User, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
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

  const createNewSession = async () => {
    if (!systemPrompt.trim()) {
      setIsPromptModalOpen(true);
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
        setIsPromptModalOpen(false);
        setUploadedDocument(null);
        
        toast({
          title: "New chat session created",
          description: `Using ${selectedModel.toUpperCase()} model`,
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
    <div className="min-h-screen flex bg-background text-foreground">
      <div className="flex w-full">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-border bg-card`}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                Agentic Chatbot
              </h2>
            </div>
            
            <Button 
              onClick={() => setIsPromptModalOpen(true)} 
              className="w-full mb-4"
              variant="default"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              New Chat
            </Button>

            <div className="space-y-2">
              <Label htmlFor="model-select">AI Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Gemini
                    </div>
                  </SelectItem>
                  <SelectItem value="groq">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      Groq
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {sessions.map((session) => (
                <Card 
                  key={session.id} 
                  className={`cursor-pointer transition-all hover:bg-accent ${
                    currentSession?.id === session.id ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => setCurrentSession(session)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium truncate">{session.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {session.model.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-1">
                      {session.system_prompt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(session.created_at)}
                      </span>
                      {session.document && (
                        <FileText className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                {currentSession && (
                  <div>
                    <h1 className="font-semibold">{currentSession.title}</h1>
                    <p className="text-sm text-muted-foreground">
                      {currentSession.model.toUpperCase()} • {currentSession.messages.length} messages
                    </p>
                  </div>
                )}
              </div>
              
              {currentSession && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {selectedModel === 'gemini' ? <Sparkles className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  {selectedModel.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {!currentSession ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Welcome to Agentic Chatbot</h2>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Start a new conversation by setting up your system prompt and selecting an AI model.
                </p>
                <Button onClick={() => setIsPromptModalOpen(true)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                {currentSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <Card className={`${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                        <CardContent className="p-3">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                            <span>{formatTime(message.timestamp)}</span>
                            {message.model && (
                              <Badge variant="secondary" className="text-xs">
                                {message.model.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <Card className="bg-card">
                      <CardContent className="p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          {currentSession && (
            <div className="border-t border-border p-4 bg-card">
              {uploadedDocument && (
                <div className="mb-3 p-2 bg-accent rounded-lg flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{uploadedDocument.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedDocument(null)}
                    className="ml-auto h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              )}
              
              <div className="flex gap-2">
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
                >
                  <Upload className="w-4 h-4" />
                </Button>

                <div className="flex-1 flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    className="flex-1"
                  />
                  
                  <Button 
                    onClick={sendMessage} 
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System Prompt Modal */}
        <Dialog open={isPromptModalOpen} onOpenChange={setIsPromptModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configure Your AI Assistant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="Define how the AI should behave (e.g., 'You are a helpful coding assistant that provides clear, concise explanations...')"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>AI Model</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedModel === 'gemini' ? 'default' : 'outline'}
                    onClick={() => setSelectedModel('gemini')}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Gemini
                  </Button>
                  <Button
                    variant={selectedModel === 'groq' ? 'default' : 'outline'}
                    onClick={() => setSelectedModel('groq')}
                    className="flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    Groq
                  </Button>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsPromptModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createNewSession} disabled={!systemPrompt.trim()}>
                  Start Chat
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
