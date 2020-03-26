
import Taro from '@tarojs/taro';
import requestHttp from "../common/request/request.http";
import { ResponseCode } from "../common/request/config";
import constants from '../constants';
import { store } from "../app";
import loginManager from '../common/util/login.manager';
import productAction from './product';
import { jsonToQueryString } from '../common/util/common';

class TopicAction {

  productDetail = async (params) => {
    const result = await requestHttp.get(`/topic/detail${jsonToQueryString(params)}`);

    const userinfo = loginManager.getUserinfo();
    let collect = {};
    if (userinfo.success) {
      const collectResult = await productAction.fetchProductCollect({user_id: userinfo.result.user_id, product_id: params.id, type: 1});
      if (collectResult.code === ResponseCode.success) {
        collect = collectResult.data
      }
    }
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_TOPIC_DETAIL,
        payload: {
          ...result.data,
          collect
        }
      });
    }
    
    return result;
  }

  topicAdd = async (payload) => {
    const result = await requestHttp.post('/topic/add', payload);
    return result;
  }

  topicList = async (field = {}) => {
    const result = await requestHttp.get(`/topic/list${jsonToQueryString(field)}`);
    if (result.code === ResponseCode.success) {

      if (!!field.user_id) {
        store.dispatch({
          type: constants.RECEIVE_USER_TOPIC,
          payload: {...result.data}
        });
        return result;
      }

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