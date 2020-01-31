import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtFab } from 'taro-ui';
import loginManager from '../../common/util/login.manager';
import Menu from '../../component/menu/Menu';
import './publish.less'

const prefix = 'publish';

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

  navPublish = () => {
    const result = this.checkAuth();
    if (result) {
      Taro.navigateTo({
        url: '/pages/publish/publish'
      });
      return;
    }
    this.loginHandle();
  }

  render () {
    const { userinfo } = this.state;
    const menus = [
      {id: 1, name: '我的留言'},
      {id: 2, name: '回复留言'},
    ];
    return (
      <View className='container container-color publish'>
        <View className={`${prefix}-bg`} />
        <Menu
          menus={menus}
          onClick={(menu) => this.onMenuClick(menu)}
        />
        
        <View
          onClick={() => this.navPublish()}
        >
          发布
        </View>
        PublishIndex

        <View className={`${prefix}-button-pub`}>
          <AtFab
            onClick={() => this.navPublish()}
          >
            <View>发布</View>
          </AtFab>
        </View>
      </View>
    )
  }
}

export default PublishIndex;