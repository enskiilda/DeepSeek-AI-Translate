import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, Copy, Check, RotateCcw, Sparkles, ChevronDown } from "lucide-react";
import { translateText } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { code: "PL", name: "Polski" },
  { code: "EN", name: "English" },
  { code: "DE", name: "Deutsch" },
  { code: "ES", name: "Español" },
  { code: "FR", name: "Français" },
  { code: "IT", name: "Italiano" },
  { code: "ZH", name: "Chinese" },
  { code: "JA", name: "Japanese" },
  { code: "UA", name: "Українська" },
];

export default function Translator() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState("PL");
  const [targetLang, setTargetLang] = useState("EN");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const targetLangName = LANGUAGES.find(l => l.code === targetLang)?.name || "English";
      const result = await translateText({ 
        text: inputText, 
        targetLang: targetLangName,
        sourceLang: LANGUAGES.find(l => l.code === sourceLang)?.name
      });
      setOutputText(result);
    } catch (error: any) {
      console.error("Full error object:", error);
      toast({
        title: "Błąd tłumaczenia",
        description: error.message || "Nie udało się połączyć z usługą AI. Sprawdź konsolę.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const getLangName = (code: string) => LANGUAGES.find(l => l.code === code)?.name || code;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8 font-sans">
      
      {/* Header - minimal */}
      <header className="w-full max-w-3xl flex justify-between items-center mb-8 md:mb-12 pt-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>AI Translator</span>
        </div>
        <div className="text-xs text-muted-foreground/50 uppercase tracking-widest">
          DeepSeek V3.1
        </div>
      </header>

      <main className="w-full max-w-3xl flex-1 flex flex-col gap-6">
        
        {/* Language Selector */}
        <div className="flex items-center justify-center gap-4 w-full max-w-md mx-auto mb-4">
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="lg" className="text-primary gap-2 text-lg font-medium px-4">
                  {getLangName(sourceLang)} <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[210px]" align="start">
                {LANGUAGES.map(lang => (
                  <DropdownMenuItem 
                    key={lang.code} 
                    onClick={() => setSourceLang(lang.code)}
                    className="cursor-pointer py-2"
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button 
              onClick={swapLanguages}
              className="p-3 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
            >
              <svg width="1em" height="1em" viewBox="0 0 18 16" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" clipRule="evenodd" d="M5.70243 1.16073C6.02787 0.835297 6.55551 0.835297 6.88094 1.16073L9.79761 4.0774C10.123 4.40284 10.123 4.93048 9.79761 5.25591L6.88094 8.17258C6.55551 8.49802 6.02787 8.49802 5.70243 8.17258C5.37699 7.84714 5.37699 7.3195 5.70243 6.99407L7.19651 5.49999H1.50002C1.03978 5.49999 0.666687 5.12689 0.666687 4.66666C0.666687 4.20642 1.03978 3.83332 1.50002 3.83332H7.19651L5.70243 2.33925C5.37699 2.01381 5.37699 1.48617 5.70243 1.16073Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M12.2976 14.8392C11.9722 15.1647 11.4445 15.1647 11.1191 14.8392L8.20243 11.9226C7.87699 11.5971 7.87699 11.0695 8.20243 10.7441L11.1191 7.8274C11.4445 7.50196 11.9722 7.50196 12.2976 7.8274C12.623 8.15284 12.623 8.68048 12.2976 9.00591L10.8035 10.5H16.5C16.9603 10.5 17.3334 10.8731 17.3334 11.3333C17.3334 11.7936 16.9603 12.1667 16.5 12.1667H10.8035L12.2976 13.6607C12.623 13.9862 12.623 14.5138 12.2976 14.8392Z"></path></svg>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="lg" className="text-primary gap-2 text-lg font-medium px-4">
                  {getLangName(targetLang)} <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[210px]" align="end">
                {LANGUAGES.map(lang => (
                  <DropdownMenuItem 
                    key={lang.code} 
                    onClick={() => setTargetLang(lang.code)}
                    className="cursor-pointer py-2"
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

        </div>

        {/* Input Area */}
        <div className="relative group flex flex-col">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Wpisz tekst..."
            className="w-full bg-transparent border-0 text-3xl md:text-4xl font-normal leading-tight placeholder:text-muted-foreground/30 focus:ring-0 focus:outline-none focus-visible:ring-0 shadow-none resize-none p-0 h-[200px] overflow-y-auto custom-scrollbar"
            spellCheck={false}
          />
          {inputText && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => { setInputText(""); setOutputText(""); }}
              className="absolute -right-2 top-0 p-2 text-muted-foreground/30 hover:text-primary transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Divider / Action */}
        <div className="flex justify-center py-4">
           <button
            onClick={handleTranslate}
            disabled={isLoading || !inputText}
            className={`
              h-12 px-8 rounded-full flex items-center gap-2 font-medium transition-all duration-300
              ${inputText 
                ? 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95' 
                : 'bg-secondary text-muted-foreground cursor-not-allowed'}
            `}
           >
             {isLoading ? (
               <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
             ) : (
               <>
                 <span>Tłumacz</span>
                 <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M21 12C21 12.2652 20.8946 12.5196 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11L17.5858 11L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C20.8946 11.4804 21 11.7348 21 12Z" fill="currentColor"></path></svg>
               </>
             )}
           </button>
        </div>

        {/* Output Area */}
        <div className="relative h-[200px] pb-4">
          <AnimatePresence mode="wait">
            {outputText ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full h-full overflow-y-auto custom-scrollbar pr-2"
              >
                <div className="text-3xl md:text-4xl text-foreground/90 font-normal leading-tight">
                  {outputText}
                </div>
                
                <div className="sticky bottom-0 left-0 pt-4 bg-gradient-to-t from-background via-background to-transparent flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary/50"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Skopiowano" : "Kopiuj"}</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-3xl md:text-4xl text-muted-foreground/10 select-none">
                Tłumaczenie pojawi się tutaj...
              </div>
            )}
          </AnimatePresence>
        </div>

      </main>

      <footer className="w-full max-w-3xl py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center text-xs text-muted-foreground/30">
        AI Translator • NVIDIA DeepSeek Model
      </footer>
    </div>
  );
}
