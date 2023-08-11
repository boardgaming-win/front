import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true
});

const gomoku_api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GOMOKU_BASE_URL,
  withCredentials: true
});

const file_api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FILE_BASE_URL,
  withCredentials: true
});

api.interceptors.response.use(
  response => {
    // 정상 응답 처리
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

gomoku_api.interceptors.response.use(
  response => {
    // 정상 응답 처리
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

file_api.interceptors.response.use(
  response => {
    // 정상 응답 처리
    return response;
  },
  error => {
    return Promise.reject(error);
  }
)

export { api, gomoku_api, file_api };
