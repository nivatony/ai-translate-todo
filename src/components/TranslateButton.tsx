import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Languages, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Todo } from "./TodoItem";

interface TranslateButtonProps {
  todo: Todo;
  onTranslate: (id: string, translatedText: string, language: string, originalText: string) => void;
}

const LANGUAGES = {
  'es': 'Spanish',
  'fr': 'French', 
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'nl': 'Dutch',
};

export const TranslateButton = ({ todo, onTranslate }: TranslateButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>("");
  const { toast } = useToast();

  const handleTranslate = async (languageCode: string) => {
    if (!languageCode) return;
    
    setIsLoading(true);
    try {
      // Using a free translation API (MyMemory)
      const textToTranslate = todo.originalText || todo.text;
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${languageCode}`
      );
      
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        const translatedText = data.responseData.translatedText;
        const languageName = LANGUAGES[languageCode as keyof typeof LANGUAGES];
        
        onTranslate(todo.id, translatedText, languageName, todo.originalText || todo.text);
        
        toast({
          title: "Translation complete!",
          description: `Translated to ${languageName}`,
        });
      } else {
        throw new Error("Translation failed");
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-accent hover:text-accent hover:bg-accent/10"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Languages className="w-4 h-4" />
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-56 p-2">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Translate to:</h4>
          <Select value={selectedLang} onValueChange={setSelectedLang}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            onClick={() => handleTranslate(selectedLang)}
            disabled={!selectedLang || isLoading}
            size="sm"
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {isLoading ? "Translating..." : "Translate"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};