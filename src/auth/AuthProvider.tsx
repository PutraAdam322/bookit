import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient, useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getAccessToken } from "@/utils/utils";

type AuthState = {
  user: any | null;
  setUser: (u: any | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const url = import.meta.env.VITE_API_URL
const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const qc = useQueryClient();
  //const navigate = useNavigate();

  const userQuery = () => queryOptions({
    queryKey: ['user'],
    queryFn: async () => {
      const token = getAccessToken()
      if(!token || token == "" || token == 'null') return null;
      const res = await fetch(`${url}/api/v1/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })
      const d = await res.json()
      if (!res.ok) {throw new Error(d.message);}
      return d;
    },
  })

  useEffect(() => {
    const token = getAccessToken();
    if (!token || token == "" || token == "null") {
      setUser(null);
      return;
    }
    setUser(usr.data);
  }, []);

  const usr = useSuspenseQuery(userQuery())

  const logout = () => {
    localStorage.removeItem("token");
    qc.clear();
    setUser(null);
    //({ to: "/login", replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};