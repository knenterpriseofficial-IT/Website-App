import { createContext, useContext, useState, useCallback } from "react";
import { adminLogin, adminLogout, getAdminSession, type AdminSession } from "@/lib/admin-auth.ts";

type AdminContextType = {
  session: AdminSession | null;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => getAdminSession());

  const login = useCallback((userId: string, password: string): boolean => {
    const s = adminLogin(userId, password);
    if (s) { setSession(s); return true; }
    return false;
  }, []);

  const logout = useCallback(() => {
    adminLogout();
    setSession(null);
  }, []);

  return (
    <AdminContext.Provider value={{ session, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
