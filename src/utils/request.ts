import type{
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

// 定义接口返回数据的类型
interface ApiResponse<T = any> {
    code: string;
    description: string;
    result: T;
    extendResult: T;
    success: boolean;
}

class Request {
    private instance: AxiosInstance;
    private readonly options: AxiosRequestConfig;

    constructor(options: AxiosRequestConfig = {}) {
        this.options = options;
        this.instance = axios.create(options);

        // 请求拦截
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        )

        // 响应拦截
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                // 处理响应数据
                const data: ApiResponse = response.data;
                if (data.code !== '0000') {
                    console.error('API Error:', data.description);
                    return Promise.reject(new Error(data.description || 'Error'));
                }
                return data.result;
            },
            (error) => {
                // 在这里处理 HTTP 错误
                if (error.response) {
                    switch (error.response.status) {
                    case 401:
                        // 处理未授权
                        break
                    case 403:
                        // 处理禁止访问
                        break
                    case 404:
                        // 处理未找到
                        break
                    case 500:
                        // 处理服务器错误
                        break
                    }
                }
                return Promise.reject(error)
            }
        )

    }

    // 通用请求方法
    public request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.instance.request(config);
    }

    // GET 请求
    public get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.get(url, { params, ...config });
    }

    // POST 请求
    public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.instance.post(url, data, config);
    }

    // PUT 请求
    public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.instance.put(url, data, config);
    }

    // DELETE 请求
    public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.instance.delete(url, config);
    }

}

// 默认配置
const defaultOptions: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
}

// 创建 Request 实例
const request = new Request(defaultOptions);
// 导出 Request 实例
export default request;
