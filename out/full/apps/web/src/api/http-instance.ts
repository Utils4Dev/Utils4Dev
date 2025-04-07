import Axios, { AxiosRequestConfig } from "axios";

const { VITE_BACKEND_URL } = import.meta.env;

export const AXIOS_INSTANCE = Axios.create({
  baseURL: VITE_BACKEND_URL,
  withCredentials: true,
});

export const instance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  return promise;
};
