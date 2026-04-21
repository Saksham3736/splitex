"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Trash2, Plus } from "lucide-react";
import { Button } from "./Button";

interface Item {
  description: string;
  price: number;
}

interface ScannedBillReviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    items: Item[];
    total: number;
  } | null;
  onConfirm: (finalTotal: number, finalItems: Item[]) => void;
}

export const ScannedBillReview = ({ isOpen, onClose, data, onConfirm }: ScannedBillReviewProps) => {
  const [items, setItems] = useState<Item[]>(data?.items || []);

  React.useEffect(() => {
    if (data?.items) setItems(data.items);
  }, [data]);

  const handleItemChange = (index: number, field: keyof Item, value: string) => {
    const newItems = [...items];
    if (field === 'price') {
      newItems[index].price = parseFloat(value) || 0;
    } else {
      newItems[index].description = value;
    }
    setItems(newItems);
  };

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddRow = () => {
    setItems([...items, { description: "", price: 0 }]);
  };

  const currentTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl bg-[#ffffff] dark:bg-[#040F0F] border border-[#e2e8f0] dark:border-[#57737A]/50 rounded-2xl p-6 shadow-2xl relative flex flex-col max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-[#64748b] dark:text-[#57737A] hover:text-[#0f172a] dark:hover:text-[#C2FCF7]"
            >
              <X size={20} />
            </button>

            <div className="mb-6 mt-2">
              <h3 className="text-xl font-bold text-[#0f172a] dark:text-[#C2FCF7]">Verify Bill Items</h3>
              <p className="text-sm text-[#475569] dark:text-[#85BDBF]">Please check the Python OCR results and correct any mistakes.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-6">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#f8fafc] dark:bg-[#57737A]/10 p-3 rounded-lg border border-[#e2e8f0] dark:border-[#57737A]/20">
                  <input 
                    type="text" 
                    value={item.description}
                    onChange={(e) => handleItemChange(i, 'description', e.target.value)}
                    className="flex-1 bg-transparent border-b border-transparent hover:border-[#cbd5e1] focus:border-[#6366f1] dark:hover:border-[#57737A] dark:focus:border-[#C9BFFF] focus:outline-none text-[#0f172a] dark:text-[#C2FCF7] px-1 py-1 transition-colors"
                    placeholder="Item name"
                  />
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#64748b] dark:text-[#57737A]">₹</span>
                    <input 
                      type="number" 
                      value={item.price}
                      onChange={(e) => handleItemChange(i, 'price', e.target.value)}
                      className="w-24 bg-transparent border-b border-transparent hover:border-[#cbd5e1] focus:border-[#6366f1] dark:hover:border-[#57737A] dark:focus:border-[#C9BFFF] focus:outline-none text-[#0f172a] dark:text-[#C2FCF7] pl-6 pr-1 py-1 font-mono transition-colors text-right"
                    />
                  </div>
                  <button onClick={() => handleRemove(i)} className="text-red-400 hover:text-red-500 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={handleAddRow}
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#cbd5e1] dark:border-[#57737A]/30 rounded-lg text-[#64748b] dark:text-[#57737A] hover:text-[#6366f1] dark:hover:text-[#C9BFFF] hover:border-[#6366f1] dark:hover:border-[#C9BFFF] transition-colors font-medium text-sm"
              >
                <Plus size={16} /> Add Missing Item
              </button>
            </div>

            <div className="border-t border-[#e2e8f0] dark:border-[#57737A]/30 pt-4 mt-auto">
              <div className="flex justify-between items-center mb-6 px-2">
                <span className="text-lg font-semibold text-[#475569] dark:text-[#85BDBF]">Total Amount</span>
                <span className="text-3xl font-bold text-[#6366f1] dark:text-[#C9BFFF]">₹{currentTotal.toLocaleString()}</span>
              </div>
              
              <div className="flex gap-4">
                <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button variant="primary" className="flex-1 gap-2" onClick={() => onConfirm(currentTotal, items)}>
                  <Check size={18} /> Confirm & Split
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
