import { useState, useEffect } from "react";
import { TodoItem, Todo } from "@/components/TodoItem";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoStats } from "@/components/TodoStats";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Circle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import todoHero from "@/assets/todo-hero.png";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { toast } = useToast();

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('ai-todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // Convert date strings back to Date objects
        const todosWithDates = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        setTodos(todosWithDates);
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('ai-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    
    setTodos(prev => [newTodo, ...prev]);
    toast({
      title: "Todo added!",
      description: "Your new task has been created.",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
    
    const todo = todos.find(t => t.id === id);
    if (todo) {
      toast({
        title: todo.completed ? "Task reopened!" : "Task completed!",
        description: todo.completed ? "Task marked as pending" : "Great job! Keep it up!",
      });
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast({
      title: "Todo deleted",
      description: "Task has been removed from your list.",
      variant: "destructive",
    });
  };

  const handleTranslate = (id: string, translatedText: string, language: string, originalText: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? {
            ...todo,
            translatedText,
            targetLanguage: language,
            originalText: originalText
          }
        : todo
    ));
  };

  const clearCompleted = () => {
    const completedCount = todos.filter(todo => todo.completed).length;
    setTodos(prev => prev.filter(todo => !todo.completed));
    
    if (completedCount > 0) {
      toast({
        title: "Completed tasks cleared!",
        description: `Removed ${completedCount} completed task${completedCount > 1 ? 's' : ''}.`,
      });
    }
  };

  const allTodos = todos;
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const renderTodoList = (todoList: Todo[]) => {
    if (todoList.length === 0) {
      return (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground text-lg">No tasks here yet.</p>
          <p className="text-muted-foreground/70 text-sm mt-1">
            {todos.length === 0 ? "Add your first todo above!" : "Great job on staying organized!"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {todoList.map((todo, index) => (
          <div
            key={todo.id}
            style={{ animationDelay: `${index * 100}ms` }}
            className="animate-slide-in-up"
          >
            <TodoItem
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onTranslate={handleTranslate}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-slide-in-up">
          <div className="relative mb-6">
            <img 
              src={todoHero} 
              alt="AI Todo App" 
              className="w-full max-w-2xl mx-auto rounded-2xl shadow-card"
            />
            <div className="absolute inset-0 bg-gradient-primary/20 rounded-2xl"></div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            AI Todo App
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Organize your tasks with style. Add todos, mark them complete, and translate them into any language with AI power.
          </p>
        </div>

        {/* Stats Section */}
        <div className="animate-slide-in-up" style={{ animationDelay: "200ms" }}>
          <TodoStats todos={todos} />
        </div>

        {/* Add Todo Form */}
        <div className="mb-8 animate-slide-in-up" style={{ animationDelay: "400ms" }}>
          <AddTodoForm onAdd={addTodo} />
        </div>

        {/* Todo Lists with Tabs */}
        <div className="animate-slide-in-up" style={{ animationDelay: "600ms" }}>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4 md:mb-0">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  All ({allTodos.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  Active ({activeTodos.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Done ({completedTodos.length})
                </TabsTrigger>
              </TabsList>

              {completedTodos.length > 0 && (
                <Button
                  onClick={clearCompleted}
                  variant="outline"
                  size="sm"
                  className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Clear Completed
                </Button>
              )}
            </div>

            <TabsContent value="all" className="space-y-4">
              {renderTodoList(allTodos)}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {renderTodoList(activeTodos)}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {renderTodoList(completedTodos)}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border/30">
          <p className="text-muted-foreground/70 text-sm">
            Built with AI assistance using Claude • Deployed on Vercel
          </p>
          <div className="flex justify-center items-center gap-2 mt-2 text-xs text-muted-foreground/50">
            <Sparkles className="w-3 h-3" />
            <span>Translation powered by MyMemory API</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;