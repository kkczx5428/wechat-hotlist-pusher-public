import http from "@/utils/axios.js";
import {ElNotification} from "element-plus";

// user list 部分
export const apit = (word: string = '', wxids: string[] = [], labels: string[] = []) => {
    return http.post('/api/rs/user_list', {
        'word': word,
        'wxids': wxids,
        'labels': labels
    }).then((res: any) => {
        return res;
    }).catch((err: any) => {
        console.log(err);
        return '';
    })
}
