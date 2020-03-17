import merge from 'lodash.merge';
import constants from '../constants';

const INITIAL_STATE = {
  topicHomeList: [],
  topicList: [],
  topicListTotal: 0,
};

export default function topic (state = INITIAL_STATE, action) {
  
  switch (action.type) {

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