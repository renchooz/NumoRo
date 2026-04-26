const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

const STORAGE_KEY = "numo-admin-auth";

type AdminAuthState = {
  token: string;
  email: string;
  loggedInAt: number;
};

export function adminLogin(email: string, password: string) {
  const ok = email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  if (!ok) return { ok: false as const, message: "Invalid credentials" };

  const state: AdminAuthState = {
    token: "admin-token",
    email: ADMIN_EMAIL,
    loggedInAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return { ok: true as const };
}

export function adminLogout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAdminToken(): string | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AdminAuthState>;
    return typeof parsed.token === "string" ? parsed.token : null;
  } catch {
    return null;
  }
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

