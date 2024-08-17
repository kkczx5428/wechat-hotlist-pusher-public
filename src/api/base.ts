import http from "@/utils/axios.js";


// const is_local_data  = false;
const is_local_data = localStorage.getItem('isUseLocalData') === 't';

export const apiVersion = () => {
    return http.get('/api/rs/version').then((res: any) => {
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
        return `./imgsrc?src=${url}`;
    }
    return `/api/rs/imgsrc?src=${url}`;
}
export const api_audio = (url: string) => {
    if (is_local_data) {
        return `./audio?src=${url}`;
    }
    return `/api/rs/audio?src=${url}`;
}

export const api_video = (url: string) => {
    if (is_local_data) {
        return `./video?src=${url}`;
    }
    return `/api/rs/video?src=${url}`;
}