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
import PublishButton from '../../component/layout/button';
import loginManager from '../../common/util/login.manager';

const prefix = 'topic';

let offset = 0;

class Page extends Taro.Component {

  state = {
    currentIndex: 0,
    loading: false,
  }
  config = {
    navigationBarTitleText: '论坛',
  };
  
  componentDidShow () {
    this.init();
  }

  init = async () => {
    await productAction.topicTypes();
    this.fetchData(0);
  }

  onScrollToLower = async () => {
    this.fetchData();
  }

  fetchData = async (page) => {
    try {
      this.setState({loading: true});
      const { currentIndex } = this.state;
      const { types } = this.props;
      const payload = {
        offset: typeof page === 'number' ? page : offset,
        limit: 20,
        type: types[currentIndex].id
      }
      const result = await TopicAction.topicList(payload);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      this.setState({loading: false});

      if (typeof page === 'number') {
        offset = page;
      } else {
        offset += 20;
      }

    } catch (error) {
      this.setState({loading: false});
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  handleClick = (params) => {
    this.setState({currentIndex: params}, () => {
      this.fetchData(0);
    });
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
    const { loading } = this.state;
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
              {!!loading 
              ? (
                <AtActivityIndicator mode='center' size='large' />
              ) 
              : (
                <MyList 
                  type='topic'
                  productList={topicList}
                  productListTotal={topicListTotal}
                  onScrollToLower={this.onScrollToLower}
                />
              )}
            </View>
          </View>
        )}
        <PublishButton
          title='发布'
          onClick={() => {
            const { success } = loginManager.getUserinfo();
            if (!success) {
              Taro.redirectTo({
                url: '/pages/sign/login'
              })
              return;
            }
            Taro.navigateTo({
              url: `/pages/publish/publish.topic`
            })
          }}
        />
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