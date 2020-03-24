import merge from 'lodash.merge';
import constants from '../constants';

const INITIAL_STATE = {
  topicHomeList: [],
  topicList: [],
  topicListTotal: 0,
  messageList: [],
  messageTotal: 0,
  productDetail: {},
};

export default function topic (state = INITIAL_STATE, action) {
  
  switch (action.type) {
    case constants.RECEIVE_TOPIC_DETAIL: {
      const { payload } = action;
      return {
        ...state,
        productDetail: payload
      };
    }

    case constants.RECEIVE_TOPIC_MESSAGE_LIST: {
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

    case constants.RECEIVE_TOPIC_LIST: {
      const { payload } = action;
      const { count, rows, field = {} } = payload;
      const { offset = 0 } = field;
      const nextList = 
        offset === 0 
        ? rows
        : merge([], state.topicList).concat(rows);
      return {
        ...state,
        topicListTotal: count,
        topicList: nextList
      };
    }

    case constants.RECEIVE_HOME_TOPIC_LIST: {
      const { payload } = action;
      return {
        ...state,
        topicHomeList: payload.rows
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export const getTopicList = state => state.topic.topicList;
export const getTopicListTotal = state => state.topic.topicListTotal;