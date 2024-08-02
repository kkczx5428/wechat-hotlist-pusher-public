import {ElMessage} from "element-plus";
import router from "@/router";
import http from '@/utils/axios.js';

export const is_db_init = async () => {
    try {
        const res = await http.get('/api/rs/is_init'); // 使用 await 来等待异步结果
        console.log("is_db_init", res);
        if (res) {
            localStorage.setItem('isDbInit', 't');
        } else {
            localStorage.setItem('isDbInit', 'f');
        }
    } catch (err) {
        localStorage.setItem('isDbInit', 'f');
        console.log(err);
    }

    if (localStorage.getItem('isDbInit') === 't') {
        return true;
    } else {
        router.push({name: 'db_init'});
        ElMessage.error('请先初始化数据');
        return false;
    }
}