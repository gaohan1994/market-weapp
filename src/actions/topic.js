
import Taro from '@tarojs/taro';
import requestHttp from "../common/request/request.http";
import { ResponseCode } from "../common/request/config";
import constants from '../constants';
import { store } from "../app";
import { jsonToQueryString } from "../common/util/common";
import loginManager from "../common/util/login.manager";
import getBaseUrl from '../common/request/base.url';

class TopicAction {

  topicList = async (field = {}) => {
    const result = await requestHttp.get(`/topic/list`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_TOPIC_LIST,
        payload: {
          ...result.data,
          field
        }
      })
    }
    return result;
  }

  /**
   * @todo [请求首页的数据]
   */
  topicHomeList = async (field = {}) => {
    console.log('field: ', field);
    const result = await requestHttp.get(`/topic/list`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_HOME_TOPIC_LIST,
        payload: {
          ...result.data,
          field
        }
      })
    }
  }
}

export default new TopicAction();