import http from "@/utils/axios.js";
import {is_use_local_data} from "@/utils/common_utils";
const is_local_data = is_use_local_data();
export const apiVersion = () => {
    return http.get('/api/rs/version').then((res: any) => {
        // console.log(res);
        return res;
    }).catch((err: any) => {
        console.log(err);
        return '';
    })
}

export const api_db_init = async () => {
    const t = await http.get('/api/rs/is_init')
    console.log("is_db_init", !!t);
    return !!t;
}

export const api_img = (url: string) => {
    if (is_local_data) {
        return `./imgsrc/${url}`;
    }
    return `/api/rs/imgsrc/${url}`;
}