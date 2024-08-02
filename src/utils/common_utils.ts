import {ElMessage} from "element-plus";
import router from "@/router";
import http from '@/utils/axios.js';

const to_initview = () => {
    router.push({name: 'db_init'});
    ElMessage.error('请先初始化数据');
}

export const is_db_init = () => {
    http.get('/api/rs/is_init').then((res: any) => {
        console.log("is_db_init", res);
        if (res) {
            localStorage.setItem('isDbInit', 't');
            return true;
        } else {
            localStorage.setItem('isDbInit', 'f');
            to_initview();
            return false;
        }
    }).catch((err: any) => {
        console.log(err);
        localStorage.setItem('isDbInit', 'f');
        to_initview();
        return false;
    });
}