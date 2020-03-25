import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux';
import invariant from 'invariant';
import { View } from '@tarojs/components'
import { AtActivityIndicator } from 'taro-ui'
// import Types from './component/types'
import TabsSwitch from './component/tab.switch';
import './index.less'
import productAction from '../../actions/product';
// import Header from '../index/components/Header';
import TopicAction from '../../actions/topic';
import MyList from '../index/components/List';
import { getTopicList, getTopicListTotal } from '../../reducers/topic';
import { ResponseCode } from '../../common/request/config';

const prefix = 'topic';

let offset = 0;

class Page extends Taro.Component {

  state = {
    currentIndex: 0
  }
  
  componentDidShow () {
    this.init();
  }

  init = async () => {
    productAction.topicTypes();
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

  handleClick = (params) => {
    console.log('params :', params);
    this.setState({currentIndex: params});
  }

  renderTabs = () => {
    const { types } = this.props;
    const { currentIndex } = this.state;
    const tabList = types.map((type) => {
      return {
        ...type,
        title: type.name
      }
    });
    return (
      <View className={`${prefix}-tabs`}>
        <TabsSwitch
          current={currentIndex}
          tabs={tabList}
          onChangeTab={this.handleClick}
        />
      </View>
    )
  }

  render () {
    const { } = this.state;
    const { topicList, topicListTotal, types } = this.props;
    return (
      <View className='container container-color'>
        {/* <Types /> */}
        {!types ? (
          <AtActivityIndicator mode='center' size='large' />
        ) : (
          <View className='container'>
            {this.renderTabs()}
            <View className={`${prefix}-scrollview`}>
              <MyList 
                type='topic'
                productList={topicList}
                productListTotal={topicListTotal}
              />
            </View>
            
          </View>

        )}
      </View>
    )
  }
}

const select = (state) => ({
  topicList: getTopicList(state),
  topicListTotal: getTopicListTotal(state),
  types: state.topic.topicTypes,
});

export default connect(select)(Page);