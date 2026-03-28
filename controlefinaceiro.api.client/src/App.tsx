import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/Layout";
import PersonsPage from "@/pages/PersonsPage";
import CategoriesPage from "@/pages/CategoriesPage";
import TransactionsPage from "@/pages/TransactionsPage";
import TotalsByPersonPage from "@/pages/TotalsByPersonPage";
import TotalsByCategoryPage from "@/pages/TotalsByCategoryPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<PersonsPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/transacoes" element={<TransactionsPage />} />
              <Route path="/totais-pessoa" element={<TotalsByPersonPage />} />
              <Route path="/totais-categoria" element={<TotalsByCategoryPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
