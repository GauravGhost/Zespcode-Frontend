import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface UsePostApiResult<T, D> {
  data: T | null;
  loading: boolean;
  error: string | null;
  postData: (url: string, postData: D, options?: AxiosRequestConfig) => Promise<void>;
}

const usePostApi = <T, D>(): UsePostApiResult<T, D> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const postData = useCallback(async (url: string, postData: D, options?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<T> = await axios.post(url, postData, options);
      setData(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(axiosError.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, postData };
};

export default usePostApi;



/**
 * @example - 
 * import React, { useState } from 'react';
import usePostApi from './usePostApi';

interface NewTodo {
  title: string;
  completed: boolean;
}

interface TodoResponse {
  id: number;
  title: string;
  completed: boolean;
}

const CreateTodo: React.FC = () => {
  const [title, setTitle] = useState('');
  const { data, loading, error, postData } = usePostApi<TodoResponse, NewTodo>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await postData('https://jsonplaceholder.typicode.com/todos', { title, completed: false });
  };

  if (loading) return <div>Submitting...</div>;
  if (error) return <div>Error: {error}</div>;
  if (data) return <div>Todo created with ID: {data.id}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Enter todo title" 
      />
      <button type="submit">Create Todo</button>
    </form>
  );
};

export default CreateTodo;
 */