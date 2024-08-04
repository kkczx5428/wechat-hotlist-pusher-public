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

export interface ExtraBuf {
  "个性签名": string
  "企微属性": string
  "公司名称": string
  "国": string
  "备注图片": string
  "备注图片2": string
  "市": string
  "性别[1男2女]": number
  "手机号": string
  "朋友圈背景": string
  "省": string
}

export interface User {
  wxid: string
  nOrder: number
  nUnReadCount: number
  strNickName: string
  nStatus: number
  nIsSend: number
  strContent: string
  nMsgLocalID: number
  nMsgStatus: number
  nTime: string
  nMsgType: number
  nMsgSubType: number
  nickname: string
  remark: string
  account: string
  describe: string
  headImgUrl: string
  ExtraBuf: ExtraBuf
  LabelIDList: string[]
}