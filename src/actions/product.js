import requestHttp from "../common/request/request.http";
import { ResponseCode } from "../common/request/config";
import constants from '../constants';
import { store } from "../app";

class ProductAction {

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
}

export default new ProductAction();