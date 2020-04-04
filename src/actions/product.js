import Taro from '@tarojs/taro';
import requestHttp from "../common/request/request.http";
import { ResponseCode } from "../common/request/config";
import constants from '../constants';
import { store } from "../app";
import { jsonToQueryString } from "../common/util/common";
import loginManager from "../common/util/login.manager";
import getBaseUrl from '../common/request/base.url';

class ProductAction {

  cartProduct = async (product) => {
    await store.dispatch({
      type: constants.RECEIVE_CART_PRODUCT,
      payload: product
    });
  }

  uploadImages = async (files) => {
    const promises = [];
    for (let i = 0; i < files.length; i++) {

      const file = files[i];
      const promise = new Promise((resolve) => {
        Taro.uploadFile({
          url: `${getBaseUrl('')}/upload/image`,
          filePath: file.url,
          name: 'image',
        })
        .then(res => {
          const data = JSON.parse(res.data);
          if (data.code === ResponseCode.success) {
            resolve(data.data);
          } else {
            throw new Error(data.msg || '上传图片失败');
          }
        })
        .catch(error => {
          resolve(error.message);
        })
      });
      promises.push(promise);
    }
    return new Promise((resolve) => {
      Promise.all(promises)
      .then(result => {
        resolve(result);
      });
    })
  }

  sendMessage = async (
    product,
    userinfo,
    content,
    parentMessage,
    type = 0,
  ) => {
    /**
     * @todo 组成基本参数
     */
    let payload = {
      item_id: product.id,
      user_id: userinfo.user_id,
      content,
      type,
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

  messageUserList = async (params) => {
    const userinfo = loginManager.getUserinfo();
    if (!!userinfo.success) {
      const result = await requestHttp.get(`/message/list/user${jsonToQueryString(params)}`);
      if (result.code === ResponseCode.success) {
        store.dispatch({
          type: constants.RECEIVE_MESSAGE_HOME_LIST,
          payload: {
            ...result.data
          }
        });
      }
      return result;
    }
  }

  messageList = async (params) => {
    const result = await requestHttp.get(`/message/list${jsonToQueryString(params)}`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: params.type === 1 ? constants.RECEIVE_TOPIC_MESSAGE_LIST : constants.RECEIVE_MESSAGE_LIST,
        payload: {
          ...result.data,
          params
        }
      });
    }
    return result;
  }

  createOrder = async (product, params) => {
    const userinfo = loginManager.getUserinfo();
    if (!userinfo.success) {
      return { code: ResponseCode.error, msg: '请先登录' };
    }
    if (!product) {
      return { code: ResponseCode.error, msg: '非法商品' };
    }

    const payload = {
      user_id: userinfo.result.user_id,
      product_id: product.id,
      random_key: Math.round(new Date() / 1000),
      ...params
    };
    console.log('payload: ', payload);
    const result = await requestHttp.post('/order/create', payload);
    console.log('result', result);
    return result;
  }

  orderConfirm = async (params) => {
    const result = await requestHttp.post(`/order/confirm`, params);
    return result;
  }

  orderCancel = async (params) => {
    const result = await requestHttp.post(`/order/cancel`, params);
    return result;
  }

  orderDetail = async (params) => {
    const result = await requestHttp.get(`/order/detail${jsonToQueryString(params)}`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_ORDER_DETAIL,
        payload: result.data
      });
    }
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

  fetchItemLike = async (params) => {
    const result = await requestHttp.post(`/like`, params);
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

  productListRandom = async () => {
    const result = await requestHttp.get('/product/random');
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_PRODUCT_RANDOM,
        payload: result.data
      })
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

  topicTypes = async () => {
    const result = await requestHttp.get(`/type/list?type=1`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_PRODUCT_TOPIC_TYPES,
        payload: result
      });
    }
  }

  /**
   * @todo [请求首页的数据]
   */
  productList = async (field = {}) => {
    const result = await requestHttp.get(`/product/list${jsonToQueryString(field)}`);
    if (result.code === ResponseCode.success) {

      if (!!field.user_id) {
        store.dispatch({
          type: constants.RECEIVE_USER_PRODUCT,
          payload: {...result.data}
        });
        return result;
      }

      store.dispatch({
        type: constants.RECEIVE_PRODUCT_LIST,
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
  productHomeList = async (field = {}) => {
    console.log('field: ', field);
    const result = await requestHttp.get(`/product/list`);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: constants.RECEIVE_PRODUCT_HOME_LIST,
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
    const userinfo = loginManager.getUserinfo();
    const payload = {
      ...params,
      user_id: userinfo.result.user_id
    }
    const result = await requestHttp.get(`/product/detail${jsonToQueryString(payload)}`);

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
          collect,
        }
      });
    }
    
    return result;
  }
}

export default new ProductAction();