import { createContext, useContext, useState, useCallback } from 'react';
import { adminVerify, adminLogin as apiLogin } from '../api/admin.api';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const verify = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) { setLoading(false); return false; }
    try {
      const data = await adminVerify();
      setAdmin(data);
      setLoading(false);
      return true;
    } catch {
      localStorage.removeItem('admin_token');
      setAdmin(null);
      setLoading(false);
      return false;
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await apiLogin(credentials);
    localStorage.setItem('admin_token', data.token);
    setAdmin({ username: credentials.username });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
  }, []);

  return (
    <AdminContext.Provider value={{ admin, loading, verify, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
};
