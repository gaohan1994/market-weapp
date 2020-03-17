import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux';
import invariant from 'invariant';
import { View } from '@tarojs/components'
import Types from './component/types'
import './index.less'
import Header from '../index/components/Header';
import TopicAction from '../../actions/topic';
import MyList from '../index/components/List';
import { getTopicList, getTopicListTotal } from '../../reducers/topic';
import { ResponseCode } from '../../common/request/config';

const prefix = 'topic';

let offset = 0;

class Page extends Taro.Component {
  
  componentDidShow () {
    this.init();
  }

  init = async () => {
    this.fetchData(0);
  }

  fetchData = async (page) => {
    try {
      const payload = {
        offset: typeof page === 'number' ? page : 0,
      }
      const result = await TopicAction.topicList(payload);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  render () {
    const { topicList, topicListTotal } = this.props;
    return (
      <View className='container container-color'>
        <View className={`${prefix}-bg`}>
          <Header />
        </View>
        <Types />
        <MyList 
          type='topic'
          productList={topicList}
          productListTotal={topicListTotal}
        />
      </View>
    )
  }
}

const select = (state) => ({
  topicList: getTopicList(state),
  topicListTotal: getTopicListTotal(state),
});

export default connect(select)(Page);