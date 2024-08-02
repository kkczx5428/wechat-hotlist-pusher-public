import {ElMessage} from "element-plus";
import router from "@/router";

export const is_db_init = () => {
    if (localStorage.getItem('isDbInit') === 't') {
        return true;
    } else {
        router.push({name: 'db_init'});
        ElMessage.error('请先初始化数据');
        return false;
    }
}