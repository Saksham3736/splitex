"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, ScanLine, FileText } from "lucide-react";
import { toast } from "sonner";

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (data: any) => void;
}

export const ScanModal = ({ isOpen, onClose, onScanComplete }: ScanModalProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const OCR_ENDPOINT = process.env.NEXT_PUBLIC_OCR_ENDPOINT ?? "http://localhost:8000/scan-receipt";
  const OCR_API_KEY = process.env.NEXT_PUBLIC_OCR_API_KEY ?? "K82235660888957";

  const applyFile = (incoming: File | null) => {
    if (!incoming) return;
    if (!incoming.type.startsWith("image/")) return;
    setFile(incoming);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    applyFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(OCR_ENDPOINT, {
        method: "POST",
        headers: {
          "x-api-key": OCR_API_KEY,
        },
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`OCR request failed with status ${res.status}`);
      }

      const data = await res.json();

      setTimeout(() => {
        setIsScanning(false);
        onScanComplete(data);
      }, 1000);
      
    } catch (error) {
      // Fallback to mock scan data if OCR service is unreachable
      toast.error("OCR service unreachable. Using demo scan output.");
      setTimeout(() => {
        setIsScanning(false);
        onScanComplete({
          method: "mock_frontend",
          items: [
            {"description": "Veg Supreme Pizza", "price": 550},
            {"description": "Cheese Dip", "price": 40},
            {"description": "Cold Coffee", "price": 180}
          ],
          total: 770
        });
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#ffffff] dark:bg-[#040F0F] border border-[#e2e8f0] dark:border-[#57737A]/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-[#64748b] dark:text-[#57737A] hover:text-[#0f172a] dark:hover:text-[#C2FCF7] z-10"
              disabled={isScanning}
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-[#0f172a] dark:text-[#C2FCF7] mb-6">Scan Receipt</h3>

            {!isScanning ? (
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDragOver
                      ? "border-[#6366f1] dark:border-[#C9BFFF] bg-[#e0e7ff] dark:bg-[#C9BFFF]/10"
                      : file
                      ? "border-[#6366f1] dark:border-[#C9BFFF] bg-[#e0e7ff] dark:bg-[#C9BFFF]/5"
                      : "border-[#cbd5e1] dark:border-[#57737A]/50 hover:border-[#6366f1] dark:hover:border-[#C9BFFF]"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
                  {file ? (
                    <>
                      <FileText className="text-[#6366f1] dark:text-[#C9BFFF] w-12 h-12 mb-3" />
                      <p className="text-sm font-medium text-[#0f172a] dark:text-[#C2FCF7] truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-[#64748b] dark:text-[#57737A] mt-1">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="text-[#64748b] dark:text-[#57737A] w-12 h-12 mb-3" />
                      <p className="text-sm font-medium text-[#0f172a] dark:text-[#C2FCF7]">Drag & drop receipt image</p>
                      <p className="text-xs text-[#64748b] dark:text-[#57737A] mt-1">or click to browse</p>
                    </>
                  )}
                </div>

                <button 
                  onClick={handleScan}
                  disabled={!file}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    file 
                      ? "bg-[#6366f1] dark:bg-[#C9BFFF] text-white dark:text-[#040F0F] hover:shadow-[0_0_15px_rgba(201,191,255,0.4)]" 
                      : "bg-[#e2e8f0] dark:bg-[#57737A]/20 text-[#64748b] dark:text-[#57737A] cursor-not-allowed"
                  }`}
                >
                  Start Scanning
                </button>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-24 h-24 rounded-full border-4 border-[#f1f5f9] dark:border-[#57737A]/20 border-t-[#6366f1] dark:border-t-[#C9BFFF] mb-6"
                />
                <ScanLine className="absolute text-[#6366f1] dark:text-[#C9BFFF] w-10 h-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+12px)]" />
                <h4 className="text-lg font-bold text-[#6366f1] dark:text-[#C9BFFF] animate-pulse">Running Python OCR...</h4>
                <p className="text-sm text-[#64748b] dark:text-[#57737A] mt-2">Extracting line items and prices</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
