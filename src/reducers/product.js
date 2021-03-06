import merge from 'lodash.merge';
import constants from '../constants';

const INITIAL_STATE = {
  productTypes: [],
  productList: [],
  productUserList: [],
  productUserListTotal: 0,
  productHomeList: [],
  productHomeListTotal: 0,
  productDetail: {},
  productRandom: [],
  messageList: [],
  messageTotal: 0,
  productListTotal: 0,
  searchList: [],
  collectList: [],
  collectTotal: 0,
  orderList: [],
  orderTotal: 0,
  orderDetail: {},
  cartProduct: {},
  messageHomeList: [],
}

export default function product (state = INITIAL_STATE, action) {
  
  switch (action.type) {

    case constants.RECEIVE_MESSAGE_HOME_LIST: {
      const { payload } = action;
      const { rows } = payload;
      return {
        ...state,
        messageHomeList: rows
      };
    }

    case constants.RECEIVE_USER_PRODUCT: {
      const { payload } = action;
      const { count, rows } = payload;
      return {
        ...state,
        productUserListTotal: count,
        productUserList: rows
      };
    }

    case constants.RECEIVE_ORDER_DETAIL: {
      const { payload } = action;
      return {
        ...state,
        orderDetail: payload
      };
    }

    case constants.RECEIVE_CART_PRODUCT: {
      const { payload } = action;
      return {
        ...state,
        cartProduct: payload
      };
    }

    case constants.RECEIVE_PRODUCT_RANDOM: {
      const { payload } = action;
      return {
        ...state,
        productRandom: payload
      };
    }

    case constants.RECEIVE_SEARCH_LIST: {
      const { payload } = action;
      return {
        ...state,
        searchList: payload
      };
    }

    case constants.RECEIVE_MESSAGE_LIST: {
      const { payload } = action;
      const { count, rows, field = {} } = payload;
      const { offset = 0 } = field;
      const nextList = 
        offset === 0 
        ? rows
        : merge([], state.messageList).concat(rows);
      return {
        ...state,
        messageTotal: count,
        messageList: nextList
      };
    }

    case constants.RECEIVE_PRODUCT_DETAIL: {
      const { payload } = action;
      return {
        ...state,
        productDetail: payload
      };
    }

    case constants.RECEIVE_ORDER_LIST: {
      const { payload } = action;
      const { count, rows, field = {} } = payload;
      const { offset = 0 } = field;
      const nextList = 
        offset === 0 
        ? rows
        : merge([], state.orderList).concat(rows);
      return {
        ...state,
        orderTotal: count,
        orderList: nextList
      };
    }

    case constants.RECEIVE_COLLECT_LIST: {
      const { payload } = action;
      const { count, rows, field = {} } = payload;
      const { offset = 0 } = field;
      const nextList = 
        offset === 0 
        ? rows
        : merge([], state.collectList).concat(rows);
      return {
        ...state,
        collectTotal: count,
        collectList: nextList
      };
    }

    case constants.RECEIVE_PRODUCT_TYPES: {
      const { payload } = action;
      return {
        ...state,
        productTypes: payload.data
      };
    }

    case constants.RECEIVE_PRODUCT_HOME_LIST: {
      const { payload } = action;
      const { count, rows } = payload;
      return {
        ...state,
        productHomeListTotal: count,
        productHomeList: rows,
      };
    }

    case constants.RECEIVE_PRODUCT_LIST: {
      const { payload } = action;
      const { count, rows, field = {} } = payload;
      const { offset = 0 } = field;
      
      const nextProductList = 
        offset === 0 
        ? rows
        : merge([], state.productList).concat(rows);
      return {
        ...state,
        productListTotal: count,
        productList: nextProductList,
      };
    }
    default: {
      return {
        ...state
      }
    }
  }
}