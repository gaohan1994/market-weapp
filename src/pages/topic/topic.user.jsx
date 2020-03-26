import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux';
import invariant from 'invariant';
import { View } from '@tarojs/components'
import { AtActivityIndicator } from 'taro-ui'
import TabsSwitch from './component/tab.switch';
import './index.less'
import TopicAction from '../../actions/topic';
import MyList from '../index/components/List';
import { ResponseCode } from '../../common/request/config';
import loginManager from '../../common/util/login.manager';

const prefix = 'topic';

class Page extends Taro.Component {

  state = {
    loading: false,
  }
  config = {
    navigationBarTitleText: '我的帖子',
  };
  
  componentDidShow () {
    this.init();
  }

  init = async () => {
    this.fetchData(0);
  }

  onScrollToLower = async () => {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const userinfo = loginManager.getUserinfo();
      this.setState({loading: true});
      const payload = {user_id: userinfo.result.user_id};
      const result = await TopicAction.topicList(payload);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      this.setState({loading: false});
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
    const { topicList, topicListTotal } = this.props;
    return (
      <View className='container container-color'>
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
    )
  }
}

const select = (state) => ({
  topicList: state.topic.topicUserList,
  topicListTotal: state.topic.topicUserListTotal,
});

export default connect(select)(Page);