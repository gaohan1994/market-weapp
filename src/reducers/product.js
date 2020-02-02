import merge from 'lodash.merge';
import constants from '../constants';

const INITIAL_STATE = {
  productTypes: [],
  productList: [],
  productDetail: {},
  messageList: [],
  messageTotal: 0,
  productListTotal: 0,
  searchList: [],
  collectList: [],
  collectTotal: 0,

  orderList: [],
  orderTotal: 0,
}

export default function product (state = INITIAL_STATE, action) {
  
  switch (action.type) {

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
      console.log('nextList:', nextList);
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
    case constants.RECEIVE_PRODUCT_LIST: {
      const { payload } = action;
      const { count, rows, field = {} } = payload;
      const { offset = 0 } = field;
      
      const nextProductList = 
        offset === 0 
        ? rows
        : merge([], state.productList).concat(rows);
      console.log('nextProductList:', nextProductList);
      return {
        ...state,
        productListTotal: count,
        productList: rows,
      };
    }
    default: {
      return {
        ...state
      }
    }
  }
}