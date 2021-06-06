import axios from 'axios';
import qs from "qs";
import { hintMessage } from '../utils/hintMessage';

const successCode = [200, 'success'];
const Instance = axios.create({
    timeout: 60 * 1000,
    headers: {
        // TODO 根据业务逻辑添加头部参数
    }
});

Instance.interceptors.request.use(
    config => {
        if (config.method === 'post') {
            config.data = qs.stringify(config.data);
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else if (config.method === 'get') {
            config.params = {
                ...config.params,
            };
        }
        return config;
    },
    error => {
        Promise.reject(error);
    },
);
Instance.interceptors.response.use(
    response => {
        const { code, message } = response.data;
        if (successCode.includes(code) || typeof code !== 'number') {
            return response.data;
        } else if (code === 400) {
            // redirectLogin()
            console.log('40000');
        } else if (code) {
            hintMessage('数据异常，请稍后再试');
            return Promise.reject(response.data);
        } else {
            return Promise.resolve(response.data);
        }
    },
    error => {
        if (error.message !== 'cancel http') {
            hintMessage('数据异常，请稍后再试');
        }
        return Promise.reject(error);
    },
);

export default Instance;
