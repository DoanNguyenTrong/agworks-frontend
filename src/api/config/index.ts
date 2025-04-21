/* eslint-disable import/no-anonymous-default-export */
import { toast } from "@/hooks/use-toast";
import { ResponseStatusCode } from "@/lib/utils/constant";
import axios, { AxiosRequestConfig } from "axios";
import { get } from "lodash";

const PORT = "3100"
const BASE_URL = `http://192.168.11.59:${PORT}`;

const timeout = 10000;
const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";
const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    headers: {
        "content-type": "application/json",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers":
        "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization",
    },
    timeout,
};

const request = axios.create(config);
let isRefreshing = false;
let failedQueue: any = [];

const processQueue = async () => {
    for (const element of failedQueue) {
        const { request, originalRequest } = element;
        await request(originalRequest);
    }
    failedQueue = [];
};

// Add a request interceptor
request.interceptors.request.use(
    async (config) => {
        const access_token = localStorage.getItem(ACCESS_TOKEN);
        if (access_token)
        config.headers["Authorization"] = `Bearer ${access_token}`;
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

// Add a response interceptor
request.interceptors.response.use(
    (response) => {
        // if (typeof window !== "undefined") {
        //     const BASE_URL = window.location.host.split(":")[0];
        //     console.log('object :>> ', BASE_URL);
        //     config.baseURL = `http://${BASE_URL}:${PORT}`;
        //   } else {
        //     config.baseURL = `http://localhost:${PORT}`;
        //   }
        return response;
    },

    async function (error) {
        const originalRequest = error?.response?.config;
        if (get(error, "response.data.statusCode") === 1000) {
        console.log(
            get(error, "response.data.statusCode"),
            "changePermission_show_statusCode"
        );
        // dispatch(changePermission(true));
        }
        // refresh token expired
        if (
        error?.response?.status === 401 &&
        originalRequest?.url === `refresh_token`
        ) {
        return Promise.reject(error);
        }

        const refreshToken = await localStorage.getItem(REFRESH_TOKEN);
        if (
        error?.response?.status === 401 &&
        !originalRequest?._retry &&
        refreshToken
        ) {
        if (isRefreshing) {
            failedQueue.push({ request, originalRequest });
            return;
        }
        originalRequest._retry = true;
        isRefreshing = true;
        return axios({
            ...config,
            method: "POST",
            headers: { Authorization: `Bearer ${refreshToken}` },
        })
            .then(async (res) => {
            if (res.status === ResponseStatusCode.success) {
                const data = res?.data?.data?.data;
                localStorage.setItem(ACCESS_TOKEN, data?.accessToken);
                localStorage.setItem(REFRESH_TOKEN, data?.refreshToken);
                request.defaults.headers.common[
                "Authorization"
                ] = `Bearer ${data.accessToken}`;
                processQueue();
                return request(originalRequest);
            }
            })
            .catch((err) => {
            // TODO handle role permission error
            // dispatch(userLogout(null));
            return Promise.reject(err);
            })
            .finally(() => {
            isRefreshing = false;
            });
        }

        return Promise.reject(error);
    }
);
const _handleSucess = (response: any, option: any) => {
    if (get(response, "config.method") !== "get") {
        // notification.success({
        //   message: "Success",
        //   description: get(response, "data.msg", "thành công"),
        // });
    }
    return response;
};
const _handleError = (err: any, option: any) => {
    toast({
        title: "Error",
        description: err.message || "error",
        variant: "destructive",
    });
    if (option?.showError) {
    }
    throw err;
};
const optionDefault = {
    success: false,
    showError: false, // boolean
};
const apiClient = {
    get: (url: string, data = {}, option: any = optionDefault) => {
        return request({ method: "get", url, params: data })
        .then((res) => _handleSucess(res, option))
        .catch((err) => _handleError(err, option));
    },
    post: (url: string, data = {}, option: any = optionDefault) => {
        return request({ method: "post", url, data })
        .then((res) => _handleSucess(res, option))
        .catch((err) => _handleError(err, option));
    },
    upload: (url: string, data = {}, option: any = optionDefault) => {
        return request({
        method: 'post',
        url,
        headers: { 'Content-Type': 'multipart/form-data' },
        data,
        })
        .then((res) => _handleSucess(res, option))
        .catch((err) => _handleError(err, option));
    },
    put: (url: string, data = {}, option: any = optionDefault) => {
        return request({ method: "put", url, data })
        .then((res) => _handleSucess(res, option))
        .catch((err) => _handleError(err, option));
    },
    patch: (url: string, data = {}, option: any = optionDefault) => {
        return request({ method: "patch", url, data })
        .then((res) => _handleSucess(res, option))
        .catch((err) => _handleError(err, option));
    },
    delete: (url: string, data = {}, option: any = optionDefault) => {
        return request({ method: "delete", url, params: data })
        .then((res) => _handleSucess(res, option))
        .catch((err) => _handleError(err, option));
    },
};

// const AxiosInterceptor = ({ children }: any) => {
//   const notificationMsg = useContext(NotificationContextGlobal);
//   //const navigate = useNavigate();

//   useEffect(() => {
//     const resInterceptor = (response: any) => {
//       return response;
//     };

//     const errInterceptor = (error: any) => {
//       if (error.code === "ERR_NETWORK") {
//         notificationMsg.error(COULD_NOT_CONNECT_API);
//         return error;
//       } else {
//         return Promise.reject(error);
//       }
//     };

//     const interceptor = request.interceptors.response.use(
//       resInterceptor,
//       errInterceptor
//     );

//     return () => request.interceptors.response.eject(interceptor);
//   }, []);

//   return children;
// };

export { apiClient };

