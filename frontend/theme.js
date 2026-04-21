const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/bg-\[\#040F0F\]/g, 'bg-[#ffffff] dark:bg-[#040F0F]');
  content = content.replace(/text-\[\#C2FCF7\]/g, 'text-[#0f172a] dark:text-[#C2FCF7]');
  content = content.replace(/text-\[\#85BDBF\]/g, 'text-[#475569] dark:text-[#85BDBF]');
  content = content.replace(/text-\[\#57737A\]/g, 'text-[#64748b] dark:text-[#57737A]');
  content = content.replace(/bg-\[\#57737A\]\/10/g, 'bg-[#f1f5f9] dark:bg-[#57737A]/10');
  content = content.replace(/bg-\[\#57737A\]\/5/g, 'bg-[#f8fafc] dark:bg-[#57737A]/5');
  content = content.replace(/bg-\[\#57737A\]\/20/g, 'bg-[#e2e8f0] dark:bg-[#57737A]/20');
  content = content.replace(/bg-\[\#57737A\]\/30/g, 'bg-[#cbd5e1] dark:bg-[#57737A]/30');
  content = content.replace(/border-\[\#57737A\]\/30/g, 'border-[#e2e8f0] dark:border-[#57737A]/30');
  content = content.replace(/border-\[\#57737A\]\/20/g, 'border-[#e2e8f0] dark:border-[#57737A]/20');
  content = content.replace(/border-\[\#57737A\]\/40/g, 'border-[#cbd5e1] dark:border-[#57737A]/40');
  content = content.replace(/border-\[\#57737A\]\/50/g, 'border-[#cbd5e1] dark:border-[#57737A]/50');
  content = content.replace(/text-\[\#C9BFFF\]/g, 'text-[#6366f1] dark:text-[#C9BFFF]');
  content = content.replace(/from-\[\#C9BFFF\]/g, 'from-[#6366f1] dark:from-[#C9BFFF]');
  content = content.replace(/from-\[\#C2FCF7\]\/20/g, 'from-[#e0e7ff] dark:from-[#C2FCF7]/20');
  fs.writeFileSync(filePath, content);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx')) {
      replaceInFile(p);
    }
  }
}

walk('src/app');
walk('src/components/antigravity');

// Fix layout.tsx specifically
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace('className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}', 'className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}');
layout = layout.replace('<body className="min-h-full flex flex-col bg-[#040F0F] text-[#C2FCF7] selection:bg-[#C9BFFF] selection:text-[#040F0F]">', '<body className="min-h-full flex flex-col bg-[#ffffff] dark:bg-[#040F0F] text-[#0f172a] dark:text-[#C2FCF7] selection:bg-[#C9BFFF] selection:text-[#040F0F]">');
if (!layout.includes('next-themes')) {
  layout = layout.replace('import { Providers } from "./providers";', 'import { Providers } from "./providers";\nimport { ThemeProvider } from "next-themes";');
  layout = layout.replace('<Providers>', '<Providers>\n          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>');
  layout = layout.replace('</Providers>', '</ThemeProvider>\n        </Providers>');
  fs.writeFileSync('src/app/layout.tsx', layout);
}
