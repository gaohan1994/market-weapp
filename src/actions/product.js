import requestHttp from "../common/request/request.http";
import { ResponseCode } from "../common/request/config";
import constants from '../constants';
import { store } from "../app";
import { jsonToQueryString } from "../common/util/common";
import loginManager from "../common/util/login.manager";

class ProductAction {

  sendMessage = async (
    product,
    userinfo,
    content,
    parentMessage,
  ) => {
    /**
     * @todo 组成基本参数
     */
    let payload = {
      item_id: product.id,
      user_id: userinfo.user_id,
      content
    };

    /**
     * @todo 如果是二级评论那么继续组成二级评论参数
     */
    if (parentMessage && parentMessage.id) {
      payload = {
        ...payload,
        parent_id: parentMessage.id,
        reply_id: parentMessage.user_id
      };
    }
    const result = await requestHttp.post('/message/add', payload);
    return result;
  }

  messageList = async (params) => {
    const result = await requestHttp.get(`/message/list${jsonToQueryString(params)}`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_MESSAGE_LIST,
        payload: {
          ...result.data,
          params
        }
      });
    }
    return result;
  }

  orderCancel = async (params) => {
    const result = await requestHttp.post(`/order/cancel`, params);
    return result;
  }

  orderList = async (field = {}) => {
    const result = await requestHttp.get(`/order/list${jsonToQueryString(field)}`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_ORDER_LIST,
        payload: {
          ...result.data,
          field,
        }
      });
    }
    return result;
  }

  fetchProductCollect = async (params) => {
    const result = await requestHttp.get(`/collect/product${jsonToQueryString(params)}`);
    return result;
  }

  collectCancel = async (params) => {
    const result = await requestHttp.post(`/collect/delete`, params);
    return result;
  }

  collectAdd = async (params) => {
    const result = await requestHttp.post('/collect/add', params);
    return result;
  }

  collectList = async (field = {}) => {
    const result = await requestHttp.get(`/collect/list${jsonToQueryString(field)}`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_COLLECT_LIST,
        payload: {
          ...result.data,
          field,
        }
      });
    }
    return result;
  }

  productSearch = async (params) => {
    const result = await requestHttp.get(`/product/search${jsonToQueryString(params)}`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_SEARCH_LIST,
        payload: result.data
      });
    }
    return result;
  }

  productSearchEmpty = async () => {
    store.dispatch({
      type: constants.RECEIVE_SEARCH_LIST,
      payload: []
    });
  }

  productTypes = async () => {
    const result = await requestHttp.get(`/type/list`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_PRODUCT_TYPES,
        payload: result
      });
    }
  }

  /**
   * @todo [请求首页的数据]
   */
  productHomeList = async (field = {}) => {
    console.log('field: ', field);
    const result = await requestHttp.get(`/product/list`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_PRODUCT_LIST,
        payload: {
          ...result.data,
          field
        }
      })
    }
  }

  productAdd = async (payload) => {
    const result = await requestHttp.post('/product/add', payload);
    return result;
  }

  productDetail = async (params) => {
    const result = await requestHttp.get(`/product/detail${jsonToQueryString(params)}`);

    const userinfo = loginManager.getUserinfo();
    let collect = {};
    if (userinfo.success) {
      const collectResult = await this.fetchProductCollect({user_id: userinfo.result.user_id, product_id: params.id});
      if (collectResult.code === ResponseCode.success) {
        collect = collectResult.data
      }
    }
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_PRODUCT_DETAIL,
        payload: {
          ...result.data,
          collect
        }
      });
    }
    
    return result;
  }
}

export default new ProductAction();