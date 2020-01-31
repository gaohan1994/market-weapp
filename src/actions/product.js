import requestHttp from "../common/request/request.http";
import { ResponseCode } from "../common/request/config";
import constants from '../constants';
import { store } from "../app";
import { jsonToQueryString } from "../common/util/common";

class ProductAction {

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

  collectCancel = async (params) => {
    const result = await requestHttp.post(`/collect/delete`, params);
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
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_PRODUCT_DETAIL,
        payload: result.data
      });
    }
    
    return result;
  }
}

export default new ProductAction();