// context/AuthContext.jsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useQueryClient,useMutation,useQuery } from '@tanstack/react-query';
import { getMeRequest,loginUser } from '@/api/auth';

const AuthContext = createContext(null);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // sends httpOnly cookie automatically
});

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()

  const {data:user,isLoading:loading}=useQuery({
    queryKey:['me'],
    queryFn:getMeRequest,
  })
const loginMutation = useMutation({
  mutationFn: loginUser,
  onSuccess: (data) => {
    queryClient.setQueryData(['me'], data.user);
    // ✅ Also invalidate so it refetches fresh from server
    queryClient.invalidateQueries({ queryKey: ['me'] });
  }
})


  async function register({ name, email, password }) {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await api.post('/api/auth/logout');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user:user||null,
      loading,
      isAdmin: user?.role === 'admin',
      isLoggedIn: !!user,
      login:loginMutation.mutateAsync,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}