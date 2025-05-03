
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Layout/Header";
import Dashboard from "@/components/Dashboard/Dashboard";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 px-3 py-2 space-y-2 overflow-y-auto">
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          <Dashboard />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
