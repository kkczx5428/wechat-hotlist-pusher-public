import http from "@/utils/axios.js";

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