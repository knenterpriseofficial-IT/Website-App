// Admin session stored in sessionStorage — no Hercules Auth required
// Credentials: Aditya0918/890655, Subhajit1113/993204

const SESSION_KEY = "kn_admin_session";

export type AdminSession = {
  userId: string;
  name: string;
  loggedInAt: number;
};

const ADMIN_CREDENTIALS: Record<string, { password: string; name: string }> = {
  Aditya0918: { password: "890655", name: "Aditya Saha" },
  Subhajit1113: { password: "993204", name: "Subhajit Dhar" },
};

export function adminLogin(userId: string, password: string): AdminSession | null {
  const cred = ADMIN_CREDENTIALS[userId];
  if (!cred || cred.password !== password) return null;
  const session: AdminSession = { userId, name: cred.name, loggedInAt: Date.now() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function adminLogout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null;
}
