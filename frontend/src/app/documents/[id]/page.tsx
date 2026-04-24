// Author: Adesina Mark Omoniyi
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Send, FileText, AlertTriangle, User, Sparkles, MessageSquare, Info, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

type DocumentDetail = {
  id: string;
  fileName: string;
  status: string;
  summary: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const token = useAuthStore((state) => state.token);

  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I've analyzed your document. What would you like to know?" }
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    let intervalId: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const res = await api.get(`/documents/${id}/status`);
        setDocument(res.data);
        setLoading(false);
        
        if (res.data.status === 'Completed' || res.data.status === 'Failed') {
          clearInterval(intervalId);
        }
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) router.push("/login");
        setLoading(false);
      }
    };

    fetchStatus();
    
    intervalId = setInterval(fetchStatus, 3000);

    return () => clearInterval(intervalId);
  }, [id, token, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || chatLoading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setChatLoading(true);

    try {
      const res = await api.post(`/documents/${id}/chat`, {
        question: userMsg
      });

      setMessages(prev => [...prev, { role: "assistant", content: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I ran into an error getting the answer." }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-white/40 animate-pulse font-medium">Analyzing document structures...</p>
      </div>
    );
  }

  if (!document) return <div className="text-center text-red-400 mt-20">Document not found.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] gap-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link href="/documents" className="p-2 hover:bg-white/5 rounded-xl transition-colors group">
            <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white" />
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                <FileText className="w-5 h-5" />
             </div>
             <div>
                <h2 className="font-bold text-lg line-clamp-1">{document.fileName || "Document Analysis"}</h2>
                <div className="flex items-center gap-2">
                   <span className={`w-2 h-2 rounded-full ${document.status === 'Completed' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                   <span className="text-xs text-white/40 font-medium uppercase tracking-wider">{document.status}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Left: Summary Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-[32px] flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/60">Executive Summary</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {document.status === "Processing" && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex gap-4 text-blue-400">
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                <p className="text-sm font-medium leading-relaxed">System is extracting key entities and summarizing content. This will take a moment...</p>
              </div>
            )}

            {document.status === "Failed" && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex gap-4 text-red-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium leading-relaxed">Processing pipeline encountered an error. Please re-upload the document.</p>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <p className="text-white/60 leading-relaxed text-sm whitespace-pre-wrap">
                {document.summary || (document.status === "Processing" ? "Generating deep insights... Please wait while our AI models parse the contents." : "AI Summary is unavailable for this document.")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right: Chat Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-white/[0.03] border border-white/10 rounded-[32px] flex flex-col overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
               <MessageSquare className="w-5 h-5 text-purple-400" />
               <h3 className="font-bold text-sm uppercase tracking-widest text-white/60">Semantic Q&A</h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
              Grounded Response Mode
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={i} 
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === "user" ? "bg-blue-600" : "bg-purple-600/20 border border-purple-500/30"}`}>
                    {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div className={`max-w-[85%] px-6 py-4 rounded-[24px] ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/5 text-white/90 rounded-tl-none border border-white/10"}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {chatLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="px-6 py-4 rounded-[24px] rounded-tl-none bg-white/5 border border-white/10 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <p className="text-sm font-medium text-white/40 italic">Synthesizing answer...</p>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 bg-white/[0.02] border-t border-white/10">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
              className="flex items-center gap-4 relative"
            >
              <div className="relative flex-1 group">
                 <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Query your document..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                  disabled={document.status !== "Completed" || chatLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                   <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/30">
                    <span className="text-xs">↵</span>
                  </kbd>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={!input.trim() || document.status !== "Completed" || chatLoading}
                className="w-14 h-14 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:bg-white/5 flex items-center justify-center text-white transition-all shadow-lg shadow-purple-600/20 active:scale-95 shrink-0"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
