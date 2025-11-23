import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

/**
 * Hook for authentication
 */
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (email: string, password: string, role: 'CREATOR' | 'BRAND' | 'FAN') => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.register(email, password, role);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(email, password);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await apiClient.logout();
  }, []);

  const getMe = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getMe();
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    register,
    login,
    logout,
    getMe,
    isLoading,
    error,
    isAuthenticated: apiClient.isAuthenticated(),
  };
}

/**
 * Hook for discovering creators
 */
export function useDiscoverCreators() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const discover = useCallback(async (params: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.discoverCreators(params);
      setData(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to discover creators';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { discover, isLoading, error, data };
}

/**
 * Hook for analytics
 */
export function useAnalytics() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCreatorAnalytics = useCallback(async (creatorId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCreatorAnalytics(creatorId);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getVideoAnalytics = useCallback(async (videoId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getVideoAnalytics(videoId);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch video analytics';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getCreatorAnalytics, getVideoAnalytics, isLoading, error };
}

/**
 * Hook for projects
 */
export function useProjects() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = useCallback(
    async (data: {
      title: string;
      description: string;
      goal_amount: number;
      min_investment: number;
      projected_roi: number;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.createProject(data);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create project';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const listProjects = useCallback(async (params: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.listProjects(params);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const publishProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.publishProject(projectId);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to publish project';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const investInProject = useCallback(async (projectId: string, amount: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.investInProject(projectId, amount);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to invest';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createProject,
    listProjects,
    publishProject,
    investInProject,
    isLoading,
    error,
  };
}

/**
 * Hook for AI Insights
 */
export function useAIInsights() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJob = useCallback(
    async (data: {
      query: string;
      selection_mode: string;
      video_ids?: string[];
      top_n?: number;
      days_back?: number;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.createAIJob(data);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create AI job';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getJobStatus = useCallback(async (jobId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getAIJobStatus(jobId);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch job status';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const chatWithAI = useCallback(async (jobId: string, message: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.chatWithAI(jobId, message);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to chat with AI';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createJob, getJobStatus, chatWithAI, isLoading, error };
}
