import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddTodoFormProps {
  onAdd: (text: string) => void;
}

export const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    
    // Simulate a brief loading for better UX
    setTimeout(() => {
      onAdd(text.trim());
      setText("");
      setIsLoading(false);
    }, 200);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-1 bg-muted/30 border-border/50 focus:border-primary focus:bg-card transition-colors"
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="bg-gradient-primary hover:opacity-90 shadow-elegant"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </form>
  );
};