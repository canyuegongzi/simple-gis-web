import { Loading } from 'element-ui';

class LoadingPluginService {
    public loading: any;
    constructor() {}

    /**
     * 开启加载
     */
    public startLoading() {
        console.log(this.loading);
        this.closeLoading();
        this.loading = Loading.service({
            lock: true,
            body: true,
            customClass: 'app-custom-loading',
            text: '计算中......',//加载动画的文字
            background: 'rgba(0, 0, 0, 0.7)'//加载动画的背景
        });
        console.log(this.loading);
    }

    /**
     * 关闭加载
     */
    public closeLoading() {
        if (this.loading) {
            this.loading.close();
        }
    }
}

export default new LoadingPluginService();
