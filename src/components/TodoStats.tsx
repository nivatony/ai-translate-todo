import { Todo } from "./TodoItem";
import { CheckCircle, Circle, Globe } from "lucide-react";

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats = ({ todos }: TodoStatsProps) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const translatedTodos = todos.filter(todo => todo.translatedText).length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-card border border-border rounded-lg p-4 text-center">
        <Circle className="w-8 h-8 mx-auto mb-2 text-primary" />
        <p className="text-2xl font-bold text-primary">{totalTodos}</p>
        <p className="text-sm text-muted-foreground">Total Tasks</p>
      </div>
      
      <div className="bg-gradient-card border border-border rounded-lg p-4 text-center">
        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
        <p className="text-2xl font-bold text-success">{completedTodos}</p>
        <p className="text-sm text-muted-foreground">Completed</p>
      </div>
      
      <div className="bg-gradient-card border border-border rounded-lg p-4 text-center">
        <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-accent font-bold">{completionRate}%</span>
        </div>
        <p className="text-2xl font-bold text-accent">{completionRate}%</p>
        <p className="text-sm text-muted-foreground">Progress</p>
      </div>
      
      <div className="bg-gradient-card border border-border rounded-lg p-4 text-center">
        <Globe className="w-8 h-8 mx-auto mb-2 text-warning" />
        <p className="text-2xl font-bold text-warning">{translatedTodos}</p>
        <p className="text-sm text-muted-foreground">Translated</p>
      </div>
    </div>
  );
};