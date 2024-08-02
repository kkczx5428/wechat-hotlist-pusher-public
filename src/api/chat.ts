import http from "@/utils/axios.js";

// user list 部分
export const apiUserList = (word: string = '', wxids: string = '', labels: string = '') => {
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

export const apiUserSessionList = () => {
    return http.post('/api/rs/user_session_list', {})
        .then((res: any) => {
            return res;
        })
        .catch((err: any) => {
            console.log(err);
            return [];
        })
}

// 消息详情部分
export const apiMsgs = (msgid: string) => {
    return http.post('/api/rs/msg_detail', {
        'msgid': msgid
    }).then((res: any) => {
        console.log(res);
        return res;
    }).catch((err: any) => {
        console.log(err);
        return '';
    })
}