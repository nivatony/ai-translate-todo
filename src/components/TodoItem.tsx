import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { TranslateButton } from "./TranslateButton";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  originalText?: string;
  translatedText?: string;
  targetLanguage?: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTranslate: (id: string, translatedText: string, language: string, originalText: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete, onTranslate }: TodoItemProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onToggle(todo.id);
  };

  const displayText = todo.translatedText || todo.text;
  const hasTranslation = todo.translatedText && todo.originalText;

  return (
    <div className={cn(
      "group flex items-center gap-3 p-4 rounded-lg bg-gradient-card border border-border",
      "transition-all duration-300 hover:shadow-elegant hover:border-primary/30",
      "animate-slide-in-up",
      isAnimating && "animate-complete"
    )}>
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-gradient-primary data-[state=checked]:border-primary"
      />
      
      <div className="flex-1 space-y-1">
        <p className={cn(
          "text-sm font-medium transition-all duration-300",
          todo.completed && "line-through text-muted-foreground"
        )}>
          {displayText}
        </p>
        
        {hasTranslation && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              {todo.targetLanguage}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Original: {todo.originalText}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <TranslateButton
          todo={todo}
          onTranslate={onTranslate}
        />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(todo.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};