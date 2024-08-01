import mitt from 'mitt'
// 教程 https://blog.csdn.net/weixin_42373175/article/details/132446372
type Events = {
  sendMsg: string
  sendNum: number
}

const bus = mitt<Events>()
export default bus