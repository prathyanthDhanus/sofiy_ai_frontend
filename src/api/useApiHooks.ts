import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query'
import type { AxiosRequestConfig, AxiosProgressEvent } from 'axios'
import axiosClient from './axiosClient'

/**
 * useGet Hook
 * Wraps TanStack useQuery for GET requests
 */
export function useGet<
  TData = unknown,
  TParams extends Record<string, unknown> = Record<string, unknown>
>(
  queryKey: QueryKey,
  url: string,
  params?: TParams,
  options?: Omit<UseQueryOptions<TData, Error, TData, QueryKey>, 'queryKey' | 'queryFn'>,
  config?: AxiosRequestConfig
) {
  return useQuery<TData, Error, TData, QueryKey>({
    queryKey,
    queryFn: async () => {
      const response = await axiosClient.get<TData>(url, {
        params,
        ...config,
      })
      return response as unknown as TData
    },
    ...options,
  })
}

/**
 * usePost Hook
 * Wraps TanStack useMutation for POST requests
 */
export function usePost<TResponse = unknown, TVariables = unknown>(
  url: string,
  options?: UseMutationOptions<TResponse, Error, TVariables>,
  config?: AxiosRequestConfig
) {
  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await axiosClient.post<TResponse>(url, variables, config)
      return response as unknown as TResponse
    },
    ...options,
  })
}

/**
 * usePut Hook
 * Wraps TanStack useMutation for PUT requests
 */
export function usePut<TResponse = unknown, TVariables = unknown>(
  url: string,
  options?: UseMutationOptions<TResponse, Error, TVariables>,
  config?: AxiosRequestConfig
) {
  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await axiosClient.put<TResponse>(url, variables, config)
      return response as unknown as TResponse
    },
    ...options,
  })
}

/**
 * usePatch Hook
 * Wraps TanStack useMutation for PATCH requests
 */
export function usePatch<TResponse = unknown, TVariables = unknown>(
  url: string,
  options?: UseMutationOptions<TResponse, Error, TVariables>,
  config?: AxiosRequestConfig
) {
  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await axiosClient.patch<TResponse>(url, variables, config)
      return response as unknown as TResponse
    },
    ...options,
  })
}

/**
 * useDelete Hook
 * Wraps TanStack useMutation for DELETE requests
 */
export function useDelete<TResponse = unknown, TVariables = unknown>(
  url: string,
  options?: UseMutationOptions<TResponse, Error, TVariables>,
  config?: AxiosRequestConfig
) {
  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (variables?: TVariables) => {
      const response = await axiosClient.delete<TResponse>(url, {
        data: variables,
        ...config,
      })
      return response as unknown as TResponse
    },
    ...options,
  })
}

/**
 * useUpload Hook
 * Specialized hook for file / multipart-form-data uploads
 */
export interface UploadVariables {
  formData: FormData
  onProgress?: (progressEvent: AxiosProgressEvent) => void
}

export function useUpload<TResponse = unknown>(
  url: string,
  options?: UseMutationOptions<TResponse, Error, UploadVariables>,
  config?: AxiosRequestConfig
) {
  return useMutation<TResponse, Error, UploadVariables>({
    mutationFn: async ({ formData, onProgress }: UploadVariables) => {
      const response = await axiosClient.post<TResponse>(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress,
      })
      return response as unknown as TResponse
    },
    ...options,
  })
}
