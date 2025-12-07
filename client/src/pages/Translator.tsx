import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronDown } from "lucide-react";
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

const CheckIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.345 5.26068C19.0295 5.72737 19.206 6.66056 18.7393 7.34503L11.2393 18.345C10.9877 18.7141 10.5847 18.9518 10.14 18.9935C9.69533 19.0352 9.25517 18.8765 8.93934 18.5607L4.43934 14.0607C3.85355 13.4749 3.85355 12.5251 4.43934 11.9394C5.02513 11.3536 5.97487 11.3536 6.56066 11.9394L9.78052 15.1592L16.2607 5.65502C16.7273 4.97055 17.6605 4.794 18.345 5.26068Z" fill="currentColor"></path>
  </svg>
);

const CopyIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12.7587 2H16.2413C17.0463 1.99999 17.7106 1.99998 18.2518 2.04419C18.8139 2.09012 19.3306 2.18868 19.816 2.43597C20.5686 2.81947 21.1805 3.43139 21.564 4.18404C21.8113 4.66937 21.9099 5.18608 21.9558 5.74817C22 6.28936 22 6.95372 22 7.75868V11.2413C22 12.0463 22 12.7106 21.9558 13.2518C21.9099 13.8139 21.8113 14.3306 21.564 14.816C21.1805 15.5686 20.5686 16.1805 19.816 16.564C19.3306 16.8113 18.8139 16.9099 18.2518 16.9558C17.8906 16.9853 17.4745 16.9951 16.9984 16.9984C16.9951 17.4745 16.9853 17.8906 16.9558 18.2518C16.9099 18.8139 16.8113 19.3306 16.564 19.816C16.1805 20.5686 15.5686 21.1805 14.816 21.564C14.3306 21.8113 13.8139 21.9099 13.2518 21.9558C12.7106 22 12.0463 22 11.2413 22H7.75868C6.95372 22 6.28936 22 5.74818 21.9558C5.18608 21.9099 4.66937 21.8113 4.18404 21.564C3.43139 21.1805 2.81947 20.5686 2.43597 19.816C2.18868 19.3306 2.09012 18.8139 2.04419 18.2518C1.99998 17.7106 1.99999 17.0463 2 16.2413V12.7587C1.99999 11.9537 1.99998 11.2894 2.04419 10.7482C2.09012 10.1861 2.18868 9.66937 2.43597 9.18404C2.81947 8.43139 3.43139 7.81947 4.18404 7.43598C4.66937 7.18868 5.18608 7.09012 5.74817 7.04419C6.10939 7.01468 6.52548 7.00487 7.00162 7.00162C7.00487 6.52548 7.01468 6.10939 7.04419 5.74817C7.09012 5.18608 7.18868 4.66937 7.43598 4.18404C7.81947 3.43139 8.43139 2.81947 9.18404 2.43597C9.66937 2.18868 10.1861 2.09012 10.7482 2.04419C11.2894 1.99998 11.9537 1.99999 12.7587 2ZM9.00176 7L11.2413 7C12.0463 6.99999 12.7106 6.99998 13.2518 7.04419C13.8139 7.09012 14.3306 7.18868 14.816 7.43598C15.5686 7.81947 16.1805 8.43139 16.564 9.18404C16.8113 9.66937 16.9099 10.1861 16.9558 10.7482C17 11.2894 17 11.9537 17 12.7587V14.9982C17.4455 14.9951 17.7954 14.9864 18.089 14.9624C18.5274 14.9266 18.7516 14.8617 18.908 14.782C19.2843 14.5903 19.5903 14.2843 19.782 13.908C19.8617 13.7516 19.9266 13.5274 19.9624 13.089C19.9992 12.6389 20 12.0566 20 11.2V7.8C20 6.94342 19.9992 6.36113 19.9624 5.91104C19.9266 5.47262 19.8617 5.24842 19.782 5.09202C19.5903 4.7157 19.2843 4.40973 18.908 4.21799C18.7516 4.1383 18.5274 4.07337 18.089 4.03755C17.6389 4.00078 17.0566 4 16.2 4H12.8C11.9434 4 11.3611 4.00078 10.911 4.03755C10.4726 4.07337 10.2484 4.1383 10.092 4.21799C9.7157 4.40973 9.40973 4.7157 9.21799 5.09202C9.1383 5.24842 9.07337 5.47262 9.03755 5.91104C9.01357 6.20463 9.00489 6.55447 9.00176 7ZM5.91104 9.03755C5.47262 9.07337 5.24842 9.1383 5.09202 9.21799C4.7157 9.40973 4.40973 9.7157 4.21799 10.092C4.1383 10.2484 4.07337 10.4726 4.03755 10.911C4.00078 11.3611 4 11.9434 4 12.8V16.2C4 17.0566 4.00078 17.6389 4.03755 18.089C4.07337 18.5274 4.1383 18.7516 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.24842 19.8617 5.47262 19.9266 5.91104 19.9624C6.36113 19.9992 6.94342 20 7.8 20H11.2C12.0566 20 12.6389 19.9992 13.089 19.9624C13.5274 19.9266 13.7516 19.8617 13.908 19.782C14.2843 19.5903 14.5903 19.2843 14.782 18.908C14.8617 18.7516 14.9266 18.5274 14.9624 18.089C14.9992 17.6389 15 17.0566 15 16.2V12.8C15 11.9434 14.9992 11.3611 14.9624 10.911C14.9266 10.4726 14.8617 10.2484 14.782 10.092C14.5903 9.7157 14.2843 9.40973 13.908 9.21799C13.7516 9.1383 13.5274 9.07337 13.089 9.03755C12.6389 9.00078 12.0566 9 11.2 9H7.8C6.94342 9 6.36113 9.00078 5.91104 9.03755Z" fill="currentColor"></path>
  </svg>
);

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
    setOutputText("");
    try {
      const targetLangName = LANGUAGES.find(l => l.code === targetLang)?.name || "English";
      const result = await translateText({ 
        text: inputText, 
        targetLang: targetLangName,
        sourceLang: LANGUAGES.find(l => l.code === sourceLang)?.name,
        onChunk: (chunk) => setOutputText(chunk)
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
      
      <header className="w-full max-w-5xl flex justify-between items-center mb-8 md:mb-12 pt-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <svg viewBox="0 0 35 24" fill="none" className="w-9 h-6 flex-shrink-0 text-primary"><g clipPath="url(#clip0_4892_24313)"><path d="M26.5542 4.34393C26.2719 4.20592 26.1506 4.46928 25.9856 4.60268C25.9292 4.64581 25.8815 4.70216 25.8338 4.75391C25.4215 5.19438 24.9396 5.48361 24.3105 5.44911C23.3905 5.39736 22.605 5.68659 21.9104 6.39041C21.7626 5.52271 21.2721 5.00462 20.5258 4.67226C20.1353 4.49976 19.7403 4.32668 19.4666 3.95119C19.2757 3.68381 19.2234 3.38595 19.1279 3.09211C19.0669 2.91501 19.0066 2.73388 18.8024 2.7034C18.5811 2.6689 18.4942 2.85463 18.4074 3.00989C18.0601 3.6447 17.9255 4.34393 17.9388 5.05235C17.9692 6.64572 18.642 7.91478 19.9789 8.81756C20.1307 8.92106 20.1698 9.02457 20.1221 9.1758C20.0307 9.48688 19.9226 9.78876 19.8271 10.0998C19.7662 10.2982 19.6753 10.3419 19.4626 10.2551C18.7288 9.94862 18.0952 9.49493 17.5351 8.94694C16.5846 8.02749 15.7249 7.01258 14.6531 6.21791C14.4013 6.03218 14.1494 5.85967 13.8889 5.69522C12.7952 4.63316 14.0321 3.76086 14.3185 3.65736C14.618 3.54925 14.4225 3.17779 13.4548 3.18239C12.487 3.18642 11.6015 3.51073 10.4727 3.94256C10.3077 4.00754 10.1341 4.05469 9.95637 4.09379C8.93227 3.89944 7.86849 3.85631 6.75755 3.98167C4.66564 4.21455 2.99464 5.20358 1.7664 6.89183C0.290908 8.92106 -0.0564026 11.2269 0.368535 13.6316C0.815324 16.1663 2.10911 18.2645 4.09695 19.905C6.15838 21.6059 8.53263 22.4397 11.2415 22.2799C12.8867 22.185 14.7181 21.9648 16.7841 20.2161C17.3051 20.4755 17.8519 20.579 18.7587 20.6566C19.4574 20.7216 20.1302 20.6221 20.6511 20.514C21.4671 20.3415 21.4107 19.5859 21.1157 19.4473C18.7242 18.3335 19.2492 18.7866 18.772 18.4198C19.987 16.9822 21.8431 14.4269 22.4158 10.9474C22.4722 10.5633 22.5441 10.0222 22.5355 9.71114C22.5309 9.52138 22.5746 9.44778 22.7913 9.42593C23.3905 9.35693 23.9718 9.19305 24.506 8.89921C26.0557 8.05279 26.6808 6.6624 26.828 4.996C26.8498 4.74126 26.8234 4.47791 26.5542 4.34393ZM13.0511 19.3438C10.7332 17.5216 9.60906 16.9219 9.14502 16.9477C8.71089 16.9736 8.78909 17.4704 8.88454 17.7942C8.98459 18.1139 9.11455 18.3341 9.29683 18.6147C9.42276 18.8004 9.50959 19.0764 9.1709 19.284C8.42453 19.7458 7.12671 19.1288 7.06576 19.0983C5.55519 18.2087 4.29245 17.0346 3.40233 15.4285C2.54268 13.8829 2.04356 12.2245 1.96133 10.4546C1.93948 10.0274 2.06541 9.87617 2.49092 9.79854C3.05099 9.69504 3.62831 9.67319 4.1878 9.75541C6.55342 10.101 8.56713 11.1585 10.2554 12.8341C11.2191 13.788 11.9482 14.9283 12.6992 16.0421C13.4979 17.2249 14.357 18.3519 15.4512 19.276C15.8377 19.5997 16.1459 19.8458 16.4408 20.0275C15.5513 20.127 14.0666 20.1483 13.0511 19.345V19.3438ZM14.162 12.1981C14.162 12.0083 14.3139 11.8571 14.5048 11.8571C14.5479 11.8571 14.587 11.8657 14.6221 11.8784C14.6698 11.8956 14.7135 11.9215 14.748 11.9606C14.8089 12.021 14.8434 12.1072 14.8434 12.1981C14.8434 12.3878 14.6916 12.5391 14.5007 12.5391C14.3098 12.5391 14.162 12.3878 14.162 12.1981ZM17.6127 13.968C17.3913 14.0588 17.17 14.1365 16.9572 14.1451C16.6271 14.1623 16.2672 14.0284 16.0717 13.8645C15.7681 13.6098 15.5507 13.4671 15.4599 13.0227C15.4208 12.8329 15.4426 12.5391 15.4771 12.3706C15.5553 12.0078 15.4685 11.7749 15.2126 11.5633C15.0045 11.3908 14.7394 11.343 14.4484 11.343C14.3397 11.343 14.2403 11.2953 14.1661 11.2568C14.0447 11.1964 13.9447 11.0452 14.0401 10.8594C14.0706 10.7991 14.2184 10.6524 14.2529 10.6266C14.6479 10.4017 15.1034 10.4753 15.5248 10.6438C15.9153 10.8037 16.2108 11.0969 16.6358 11.5115C17.0699 12.0124 17.1481 12.1504 17.3954 12.5264C17.5909 12.8203 17.7686 13.1221 17.8905 13.4677C17.9641 13.6834 17.8686 13.8599 17.6127 13.968Z" fill="currentColor"></path></g><defs><clipPath id="clip0_4892_24313"><rect width="26.634" height="19.6" fill="white" transform="translate(0.199951 2.69922)"></rect></clipPath></defs></svg>
          <span>AI Translator</span>
        </div>
        <div className="text-xs text-muted-foreground/50 uppercase tracking-widest">
          DeepSeek V3.1
        </div>
      </header>

      <main className="w-full max-w-5xl flex-1">
        
        <div className="flex items-center justify-center gap-4 mb-6">
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

        <div className="flex flex-col md:flex-row md:gap-0 overflow-hidden">
          
          <div className="flex-1 min-w-0 relative p-4 md:pr-8 overflow-hidden">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleTranslate();
                }
              }}
              placeholder="Wpisz tekst..."
              className="w-full bg-transparent border-0 text-2xl md:text-3xl font-normal leading-relaxed placeholder:text-muted-foreground/30 focus:ring-0 focus:outline-none focus-visible:ring-0 shadow-none resize-none p-0 h-[200px] md:h-[350px] overflow-y-auto custom-scrollbar"
              spellCheck={false}
            />
            {inputText && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => { setInputText(""); setOutputText(""); }}
                className="absolute right-4 top-4 p-2 text-muted-foreground/30 hover:text-primary transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          <div className="hidden md:block w-px bg-border/50 self-stretch mx-4" />
          <div className="md:hidden h-px bg-border/50 mx-4" />

          <div className="flex-1 min-w-0 relative p-4 md:pl-8 overflow-hidden">
            {outputText && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleCopy}
                className={`absolute right-4 top-4 p-2 transition-colors z-10 ${copied ? 'text-[#cccccc]' : 'text-muted-foreground/30 hover:text-primary'}`}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </motion.button>
            )}
            
            <AnimatePresence mode="wait">
              {outputText ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-[200px] md:h-[350px] overflow-y-auto custom-scrollbar pr-8"
                >
                  <div className="text-2xl md:text-3xl text-foreground/90 font-normal leading-relaxed">
                    {outputText}
                  </div>
                </motion.div>
              ) : (
                <div className="text-2xl md:text-3xl text-muted-foreground/20 select-none h-[200px] md:h-[350px]">
                  Tłumaczenie...
                </div>
              )}
            </AnimatePresence>
          </div>
          
        </div>

        <div className="flex justify-center pt-6">
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

      </main>

      <footer className="w-full max-w-5xl py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-center text-xs text-muted-foreground/30">
        AI Translator • NVIDIA DeepSeek Model
      </footer>
    </div>
  );
}
