// Author: Adesina Mark Omoniyi
"use client";

import { useState, useEffect } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, File, X, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/documents/upload", formData);
      router.push(`/documents/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred during upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Ingestion</span>
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-gradient">Upload Document</h1>
          <p className="text-white/40 text-lg">Securely process your PDF, DOCX, or TXT files</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-black/50">
          <div 
            className={`relative border-2 border-dashed rounded-[32px] p-16 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer group
              ${dragActive ? 'border-blue-500 bg-blue-500/5 scale-[1.02]' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}
              ${file ? 'border-blue-500/50 bg-blue-500/5' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !file && document.getElementById('file-upload')?.click()}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept=".pdf,.docx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-10 h-10 text-white/40 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-xl font-bold mb-2">Choose a file</p>
                  <p className="text-white/30">Drag and drop or click to browse</p>
                </motion.div>
              ) : (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center w-full"
                >
                  <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center mb-6 relative">
                    <File className="w-10 h-10 text-blue-400" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xl font-bold mb-2 truncate max-w-xs">{file.name}</p>
                  <p className="text-blue-400/60 font-mono text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex items-center gap-3 text-red-400 bg-red-400/10 p-5 rounded-2xl border border-red-400/20"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 disabled:text-white/50 disabled:cursor-not-allowed text-white px-8 py-5 rounded-[24px] text-lg font-bold transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Start Analysis
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>

        <p className="mt-8 text-center text-white/20 text-sm">
          Protected by enterprise-grade encryption. Data is never used for training.
        </p>
      </motion.div>
    </div>
  );
}
