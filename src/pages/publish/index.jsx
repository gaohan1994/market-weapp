import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import loginManager from '../../common/util/login.manager';
import Menu from '../../component/menu/Menu';
import productAction from '../../actions/product';
import './publish.less'
import '../index/index.less';
import MessageList from '../../component/list/message';

class PublishIndex extends Taro.Component {

  state = {
    userinfo: {}
  }

  componentDidShow () {
    const result = loginManager.getUserinfo();
    if (!!result.success) {
      this.setState({
        userinfo: result.result
      });

      const payload = {
        user_id: result.result.user_id,
        type: 0,
      }
      productAction.messageUserList(payload);
    }
  }

  checkAuth = () => {
    const { userinfo } = this.state;
    if (userinfo && userinfo.user_id) {
      return true;
    }
    return false
  }

  onMenuClick = () => {
    const result = this.checkAuth();
    if (result) {
      Taro.showToast({
        title: '正在开发中',
        icon: 'none'
      });
      return;
    }
    this.loginHandle();
  }

  loginHandle = () => {
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 1000
    });

    setTimeout(() => {
      Taro.navigateTo({
        url: '/pages/sign/login'
      });
    }, 1000);
  }

  render () {
    const { messageList } = this.props;
    const menus = [
      {id: 1, name: '商品消息', icon: 'http://net.huanmusic.com/market/news.png'},
      {id: 2, name: '帖子回复', icon: 'http://net.huanmusic.com/market/my.png'},
    ];
    return (
      <View className='container container-color'>
        <View className='index-bg'>
          <View className='index-color' />
          <View className='index-pos'>
            <Menu
              menus={menus}
              onClick={(menu) => this.onMenuClick(menu)}
            />
          </View>
        </View>
        <MessageList 
          messageList={messageList}
        />
      </View>
    )
  }
}


const select = (state) => {
  return {
    messageList: state.product.messageHomeList
  };
};

export default connect(select)(PublishIndex);;