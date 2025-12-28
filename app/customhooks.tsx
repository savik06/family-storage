'use client';

import useSWR from 'swr';

// Универсальный fetcher для всех роутов бэка
const fetcher = async (url: string, options?: RequestInit) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // @ts-ignore
    error.info = await response.json().catch(() => ({}));
    // @ts-ignore
    error.status = response.status;
    throw error;
  }

  return response.json();
};

// Хук для получения данных о пользователе
export const useUser = (userId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/user/find/${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useUsers = () => {
    const { data, error, isLoading, mutate } = useSWR(
        '/user/all',
        fetcher,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        }
    );
    return {
        users: data,
        isLoading,
        mutate
    }
}

export const useMemories = () => {
  const { data, isLoading, error } = useSWR(
    '/memory/all',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );
  return {
    memories: data
  };
}