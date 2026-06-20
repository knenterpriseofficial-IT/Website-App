import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ServicePage from "./pages/services/page.tsx";
import AdminPage from "./pages/admin/page.tsx";
import { AdminProvider } from "./hooks/use-admin.tsx";
import { useServiceWorker } from "./hooks/use-service-worker.ts";

function AppInner() {
  useServiceWorker();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/services/:id" element={<ServicePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <DefaultProviders>
      <AdminProvider>
        <AppInner />
      </AdminProvider>
    </DefaultProviders>
  );
}
