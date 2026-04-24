// Author: Adesina Mark Omoniyi
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileText, 
  Search, 
  MessageSquare, 
  Shield, 
  Zap, 
  ArrowRight,
  Database,
  ChevronRight,
  Sparkles,
  Upload,
  Cpu,
  CheckCircle
} from "lucide-react";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/" 
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">DocMind AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white/90 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-32 overflow-hidden">
          {/* Animated Background Gradients */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[160px] opacity-50 pointer-events-none" />
          <div className="absolute top-[20%] left-1/4 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] opacity-30 pointer-events-none" />

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>The future of document intelligence is here</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
            >
              Chat with your <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent">
                Documents in Seconds
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Upload PDF, DOCX, or TXT files and use our advanced RAG pipeline to extract insights, 
              summarize content, and answer complex questions instantly.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                href="/register" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-2xl shadow-blue-600/30 group active:scale-95"
              >
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#features" 
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95"
              >
                Watch Demo
              </Link>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-24 relative"
            >
              <div className="absolute inset-0 bg-blue-600/20 blur-[100px] -z-10" />
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-4 backdrop-blur-sm overflow-hidden">
                <div className="bg-[#050505] rounded-2xl aspect-video w-full overflow-hidden border border-white/5 flex items-center justify-center relative">
                   <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                   <div className="flex flex-col items-center gap-4 text-white/20">
                      <Database className="w-16 h-16" />
                      <span className="text-sm font-mono tracking-widest uppercase">System Interface Preview</span>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: "Documents Processed", value: "10M+" },
                { label: "Questions Answered", value: "50M+" },
                { label: "Avg Response Time", value: "< 2s" },
                { label: "Accuracy Rate", value: "99.9%" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-white/40 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Powerful Capabilities</h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg">
                Built on an enterprise-grade stack including Azure OpenAI, pgvector, and .NET Core.
              </p>
            </div>

            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <Search className="w-6 h-6" />,
                  title: "Semantic Search",
                  desc: "Go beyond keyword matching. Our system understands the meaning behind your queries.",
                  color: "blue"
                },
                {
                  icon: <MessageSquare className="w-6 h-6" />,
                  title: "Natural Q&A",
                  desc: "Ask questions in plain English and get precise answers grounded in your document data.",
                  color: "purple"
                },
                {
                  icon: <FileText className="w-6 h-6" />,
                  title: "Auto-Summarization",
                  desc: "Instantly get the key takeaways and insights from long documents without reading every page.",
                  color: "indigo"
                },
                {
                  icon: <Database className="w-6 h-6" />,
                  title: "Vector Storage",
                  desc: "High-performance vector retrieval using pgvector for industry-leading speed and scale.",
                  color: "blue"
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "Private & Secure",
                  desc: "Your data is isolated and protected with enterprise-grade JWT and Azure security.",
                  color: "purple"
                },
                {
                  icon: <ArrowRight className="w-6 h-6" />,
                  title: "API First",
                  desc: "Integrate our document processing capabilities directly into your existing workflows.",
                  color: "indigo"
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  variants={item}
                  className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-600/20 flex items-center justify-center text-${feature.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 px-6 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg">
                Three simple steps to unlock the full potential of your documents.
              </p>
            </div>

            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent hidden lg:block -translate-y-1/2" />
              
              <div className="grid lg:grid-cols-3 gap-12 relative z-10">
                {[
                  {
                    step: "01",
                    title: "Upload Documents",
                    desc: "Securely upload your PDF, Word, or Text files. We support files up to 100MB with end-to-end encryption.",
                    icon: <Upload className="w-8 h-8" />,
                    color: "from-blue-600 to-blue-400"
                  },
                  {
                    step: "02",
                    title: "AI Processing",
                    desc: "Our pipeline chunks text and generates high-dimensional embeddings using Azure OpenAI for semantic understanding.",
                    icon: <Cpu className="w-8 h-8" />,
                    color: "from-purple-600 to-purple-400"
                  },
                  {
                    step: "03",
                    title: "Instant Q&A",
                    desc: "Start chatting! Ask complex questions and get precise answers with source citations from your documents.",
                    icon: <MessageSquare className="w-8 h-8" />,
                    color: "from-indigo-600 to-indigo-400"
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className={`w-24 h-24 rounded-[32px] bg-gradient-to-br ${item.color} p-0.5 mb-8 shadow-xl shadow-blue-900/20 group-hover:scale-110 transition-transform duration-500`}>
                      <div className="w-full h-full bg-[#050505] rounded-[30px] flex items-center justify-center relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        <span className="absolute top-2 right-3 text-[10px] font-bold opacity-30 tracking-tighter">STEP {item.step}</span>
                        <div className="relative text-white">
                          {item.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-white/40 leading-relaxed max-w-xs">{item.desc}</p>
                    
                    {i < 2 && (
                      <div className="lg:hidden w-px h-12 bg-gradient-to-b from-blue-500/20 to-transparent mt-8" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-[48px] p-8 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
              
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Enterprise-Grade Security</span>
                  </motion.div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                    Your data is <span className="text-blue-400">private</span>, <br /> 
                    secure, and isolated.
                  </h2>
                  
                  <div className="space-y-8">
                    {[
                      {
                        title: "End-to-End Encryption",
                        desc: "All files are encrypted at rest and in transit using industry-standard AES-256 and TLS 1.3 protocols."
                      },
                      {
                        title: "Multi-tenant Isolation",
                        desc: "Our architecture ensures that your data is logically separated and never accessible by other users."
                      },
                      {
                        title: "JWT Authorization",
                        desc: "Secure session management using JSON Web Tokens ensures only authenticated users can access the API."
                      }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">{item.title}</h4>
                          <p className="text-white/40 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-1 backdrop-blur-3xl border border-white/10">
                    <div className="bg-[#050505] rounded-[22px] p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/20" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                          <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                        <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Security Protocol</div>
                      </div>
                      
                      <div className="space-y-4 font-mono text-xs">
                        <div className="flex justify-between text-emerald-400/60">
                          <span>&gt; system_check</span>
                          <span className="text-emerald-400">SECURE</span>
                        </div>
                        <div className="text-white/20">Initializing multi-tenant isolation...</div>
                        <div className="text-white/20">Checking JWT integrity...</div>
                        <div className="text-white/40 border-l-2 border-blue-500 pl-4 py-2 bg-blue-500/5">
                          "claims": &#123; <br />
                          &nbsp;&nbsp;"sub": "user_74829", <br />
                          &nbsp;&nbsp;"role": "authenticated", <br />
                          &nbsp;&nbsp;"scope": "document.read" <br />
                          &#125;
                        </div>
                        <div className="text-blue-400/60">&gt; encryption_status: ACTIVE</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-600/20">
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to unlock <br /> document insights?</h2>
                <p className="text-white/80 text-lg mb-12 max-w-xl mx-auto">
                  Join thousands of users who trust DocMind AI to process their most important information.
                </p>
                <Link 
                  href="/register" 
                  className="inline-flex items-center gap-2 bg-white text-black px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white/90 transition-all active:scale-95 shadow-xl"
                >
                  Create Your Account
                  <ChevronRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-8 text-sm text-white/40">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="font-bold">DocMind AI</span>
          </div>
          <div className="flex items-center gap-12">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p>© 2026 DocMind AI. Built with precision.</p>
        </div>
      </footer>
    </div>
  );
}
