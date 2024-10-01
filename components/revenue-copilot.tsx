'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SendIcon, MenuIcon, TrendingUp, Loader2, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function RevenueCopilot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm Revaic, your Revenue AI Copilot. How can I help you increase your revenue today?" }
  ]);
  const [input, setInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    "Why we lose deals?",
    "Tell me bottom-3 sales reps?",
    "How many contracts we will sign in this month?"
  ];

  useEffect(() => {
    // Add custom fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      body {
        font-family: 'Poppins', sans-serif;
      }
    `;
    document.head.appendChild(style);

    // Set main content top padding based on header height
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSend = async (question: string = input) => {
    if (question.trim() && !isLoading) {
      setMessages([...messages, { role: 'user', content: question }]);
      setInput('');
      setIsLoading(true);
      try {
        const response = await fetch('/api/get_answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: question }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(prev => [...prev, { role: 'assistant', content: data.completion }]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Error fetching response from AI.' }]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
      } finally {
        setIsLoading(false);
      }
      
    }
  }

  const MarkdownComponents = {
    table: ({ children }: { children?: React.ReactNode }) => (
      <Table>{children}</Table>
    ),
    thead: ({ children }: { children?: React.ReactNode }) => (
      <TableHeader>{children}</TableHeader>
    ),
    tbody: ({ children }: { children?: React.ReactNode }) => (
      <TableBody>{children}</TableBody>
    ),
    tr: ({ children }: { children?: React.ReactNode }) => (
      <TableRow>{children}</TableRow>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
      <TableHead>{children}</TableHead>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
      <TableCell>{children}</TableCell>
    ),
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <header ref={headerRef} className="bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-purple-500 ring-offset-2 bg-white">
              <AvatarFallback>
                <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                  <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 6H23V12" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Revaic</h1>
              <p className="text-sm sm:text-base font-medium text-gray-500">Revenue AI Copilot</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>

      <nav className={`sm:hidden bg-white shadow-md ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="max-w-7xl mx-auto py-2 px-4">
          <ul className="space-y-2">
            <li><a href="#" className="block py-2 text-base text-gray-700 hover:text-purple-600">Dashboard</a></li>
            <li><a href="#" className="block py-2 text-base text-gray-700 hover:text-purple-600">Analytics</a></li>
            <li><a href="#" className="block py-2 text-base text-gray-700 hover:text-purple-600">Settings</a></li>
          </ul>
        </div>
      </nav>

      <main className="flex-grow flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-2xl p-3 sm:p-4 max-w-[80%] shadow-md ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-white text-gray-800'
                }`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-purple-500 text-base sm:text-lg">Revaic</span>
                    </div>
                  )}
                  <ReactMarkdown 
                    className={`text-sm sm:text-base prose prose-sm max-w-none ${message.role === 'user' ? 'text-white' : ''}`}
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponents}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
                    <AvatarFallback className="bg-gray-300">
                      <User className="w-5 h-5 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start justify-start">
                <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl p-3 sm:p-4 bg-white text-gray-800 shadow-md">
                  <div className="flex items-center">
                    <Loader2 className="w-5 h-5 mr-2 text-purple-500 animate-spin" />
                    <span className="font-semibold text-purple-500 text-base sm:text-lg">Revaic is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {presetQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSend(question)}
                className="text-sm sm:text-base"
              >
                {question}
              </Button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full space-x-2">
            <Input 
              placeholder="Ask about revenue strategies..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-white shadow-inner text-base"
              disabled={isLoading}
            />
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300" disabled={isLoading}>
              <SendIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}