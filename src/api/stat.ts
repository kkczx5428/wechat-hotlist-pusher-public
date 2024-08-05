import http from "@/utils/axios.js";
import {ElNotification} from "element-plus";

// user list 部分
export const apiDateCount = (wxid: string = '') => {
    return http.post('/api/rs/date_count', {
        'wxid': wxid,
    }).then((res: any) => {
        return res;
    }).catch((err: any) => {
        console.log(err);
        return '';
    })
}
