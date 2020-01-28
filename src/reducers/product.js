import merge from 'lodash.merge';
import constants from '../constants';

const INITIAL_STATE = {
  productTypes: [],
  productList: [],
  productListTotal: 0,
}

export default function product (state = INITIAL_STATE, action) {
  
  switch (action.type) {
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