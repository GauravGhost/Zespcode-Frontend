import { useState, useCallback, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetch: (url: string, options?: AxiosRequestConfig) => Promise<void>;
}
interface ResponseTemplate<T> {
  success: boolean;
  data: T;
  err: object;
  message: string
}

const useApi = <T>(initialUrl?: string, initialOptions?: AxiosRequestConfig): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (url: string, options?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<ResponseTemplate<T>> = await axios(url, { ...initialOptions, ...options });
      setData(response.data.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(axiosError.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [initialOptions]);

  useEffect(() => {
    if (initialUrl) {
      fetch(initialUrl);
    }
  }, [initialUrl, fetch]);

  return { data, loading, error, fetch };
};

export default useApi;


/**
 * @example -
 * import React from 'react';
import useApi from './useApi';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const { data, loading, error, fetch } = useApi<Todo[]>('https://jsonplaceholder.typicode.com/todos');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Todo List</h1>
      <button onClick={() => fetch('https://jsonplaceholder.typicode.com/todos')}>Refresh</button>
      <ul>
        {data?.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
 */