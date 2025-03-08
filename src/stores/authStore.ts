// src/stores/authStore.ts
import { create } from 'zustand';
import apiClient from '@/apiClient';

// Data type definitions
export interface User {
  id: string;
  email: string;
  name: string;
  // Additional user fields
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  // Additional admin fields
}

export interface Cow {
  _id: string;
  name: string;
  photo?: string;
  age: number;
  sicknessStatus: boolean;
  agedStatus: boolean;
  adoptionStatus: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Donation {
  _id: string;
  user: string;
  amount: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  donationType: 'one-time' | 'recurring';
  recurringFrequency?: 'monthly' | 'quarterly' | 'yearly';
  transactionDetails?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  // Authentication state
  user: User | null;
  admin: Admin | null;
  isAuthenticatedUser: boolean;
  isAuthenticatedAdmin: boolean;

  // Data state
  cows: Cow[];
  donations: Donation[];

  // Global flags
  isLoading: boolean;
  error: string | null;

  // Auth functions
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;

  // Cow API functions
  fetchCows: (queryParams?: Record<string, any>) => Promise<void>;
  fetchCowById: (id: string) => Promise<Cow | null>;
  createCow: (data: Partial<Cow>) => Promise<void>;
  updateCow: (id: string, data: Partial<Cow>) => Promise<void>;
  deleteCow: (id: string) => Promise<void>;

  // Donation API functions
  createDonation: (data: Partial<Donation>) => Promise<void>;
  fetchDonationHistory: () => Promise<void>;
  fetchAllDonations: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  admin: null,
  isAuthenticatedUser: false,
  isAuthenticatedAdmin: false,
  cows: [],
  donations: [],
  isLoading: false,
  error: null,

  // Authentication functions using apiClient
  loginUser: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/user/login', { email, password });
      // Assume the response contains user data and sets cookies automatically
      set({
        user: response.data.data,
        isAuthenticatedUser: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  logoutUser: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/user/logout');
      set({ user: null, isAuthenticatedUser: false, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Logout failed', isLoading: false });
      throw err;
    }
  },

  loginAdmin: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/admin/login', {
        email,
        password,
      });
      set({
        admin: response.data.data,
        isAuthenticatedAdmin: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Admin login failed', isLoading: false });
      throw err;
    }
  },

  logoutAdmin: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/admin/logout');
      set({ admin: null, isAuthenticatedAdmin: false, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Admin logout failed', isLoading: false });
      throw err;
    }
  },

  // Cow API functions using apiClient
  fetchCows: async (queryParams = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/cows', {
        params: queryParams,
      });
      set({ cows: response.data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch cows', isLoading: false });
      throw err;
    }
  },

  fetchCowById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/cows/${id}`);
      set({ isLoading: false });
      return response.data.data;
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch cow', isLoading: false });
      throw err;
    }
  },

  createCow: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/admin/cows', data);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to create cow', isLoading: false });
      throw err;
    }
  },

  updateCow: async (id: string, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.put(`/admin/cows/${id}`, data);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update cow', isLoading: false });
      throw err;
    }
  },

  deleteCow: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/admin/cows/${id}`);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete cow', isLoading: false });
      throw err;
    }
  },

  // Donation API functions using apiClient
  createDonation: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/donations', data);
      set({ isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to create donation',
        isLoading: false,
      });
      throw err;
    }
  },

  fetchDonationHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/donations/history');
      set({ donations: response.data.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to fetch donation history',
        isLoading: false,
      });
      throw err;
    }
  },

  fetchAllDonations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/donations/admin/all');
      set({ donations: response.data.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to fetch all donations',
        isLoading: false,
      });
      throw err;
    }
  },
}));
