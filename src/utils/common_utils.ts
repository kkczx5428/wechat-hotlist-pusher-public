import {ElMessage} from "element-plus";
import router from "@/router";
import http from '@/utils/axios.js';
import {api_db_init} from "@/api/base";

const to_initview = () => {
    router.push({name: 'db_init'});
    ElMessage.error('请先初始化数据');
}

export const is_db_init = async () => {
    const t = await api_db_init();
    localStorage.setItem('isDbInit', t ? 't' : 'f');
    !t ? to_initview() : null;
    return t;
}