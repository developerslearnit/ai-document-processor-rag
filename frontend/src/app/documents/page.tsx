// Author: Adesina Mark Omoniyi
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, ArrowRight, Clock, CheckCircle, Loader2, AlertTriangle, Search, Filter, Plus } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

type DocumentStatus = {
  id: string;
  fileName: string;
  status: string;
  uploadedAt: string;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    let intervalId: NodeJS.Timeout;

    const fetchDocuments = async () => {
      try {
        const res = await api.get("/documents");
        setDocuments(res.data);
        setLoading(false);
        
        // Stop polling if all documents are either Completed or Failed
        const allFinished = res.data.every((doc: any) => 
          doc.status === 'Completed' || doc.status === 'Failed'
        );
        if (allFinished) {
          clearInterval(intervalId);
        }
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) {
          router.push("/login");
        }
        setLoading(false);
      }
    };

    fetchDocuments();
    intervalId = setInterval(fetchDocuments, 5000);

    return () => clearInterval(intervalId);
  }, [token, router]);

  const filteredDocuments = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-white/40 animate-pulse font-medium">Loading your documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">My Documents</h1>
          <p className="text-white/40 font-medium">Manage and chat with your uploaded knowledge base</p>
        </div>
        
        <Link href="/upload" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2 w-full md:w-auto justify-center">
          <Plus className="w-5 h-5" />
          Upload New
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search documents by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
          />
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl hover:bg-white/10 transition-colors text-white/60">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {filteredDocuments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/[0.02] border border-dashed border-white/10 rounded-[32px] p-24 text-center"
        >
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-xl font-bold mb-2">No documents found</h3>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">
            {searchQuery ? `No results for "${searchQuery}". Try a different search term.` : "Your document library is empty. Start by uploading your first document."}
          </p>
          {!searchQuery && (
            <Link href="/upload" className="text-blue-400 font-bold hover:text-blue-300 transition-colors inline-flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={doc.id} 
              className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.08] hover:border-blue-500/30 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <StatusBadge status={doc.status} />
              </div>
              
              <h3 className="font-bold text-xl mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors" title={doc.fileName}>
                {doc.fileName}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-white/30 mb-8">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </div>
              </div>
              
              <Link href={`/documents/${doc.id}`} className="flex items-center justify-between py-4 border-t border-white/5 text-sm font-bold text-white/60 group-hover:text-white transition-colors">
                Open Analysis
                <ArrowRight className="w-5 h-5 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string, color: string, icon: any }> = {
    Completed: { label: "Ready", color: "emerald", icon: CheckCircle },
    Processing: { label: "Processing", color: "blue", icon: Loader2 },
    Failed: { label: "Error", color: "red", icon: AlertTriangle },
    Uploaded: { label: "Uploaded", color: "orange", icon: Clock },
  };

  const config = configs[status] || { label: status, color: "gray", icon: FileText };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-${config.color}-500/10 text-${config.color}-400 border border-${config.color}-500/20`}>
      <Icon className={`w-3.5 h-3.5 ${status === 'Processing' ? 'animate-spin' : ''}`} />
      {config.label}
    </span>
  );
}
