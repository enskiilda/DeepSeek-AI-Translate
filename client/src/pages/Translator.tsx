import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeftRight, Copy, Check, RotateCcw, Sparkles, ChevronDown } from "lucide-react";
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
              <ArrowLeftRight className="w-5 h-5" />
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
                 <ArrowRight className="w-4 h-4" />
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

      <footer className="w-full max-w-3xl py-6 text-center text-xs text-muted-foreground/30">
        AI Translator • NVIDIA DeepSeek Model
      </footer>
    </div>
  );
}
