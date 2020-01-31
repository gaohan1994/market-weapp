import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui';
import './user.less'
import productAction from '../../actions/product';
import loginManager from '../../common/util/login.manager';
import Menu from '../../component/menu/Menu';

const prefix = 'user';

class User extends Taro.Component {

  state = { 
    userinfo: {}
  }

  componentDidShow () {
    const userinfo = loginManager.getUserinfo();
    if (userinfo.success) {
      this.setState({userinfo: userinfo.result});

      setTimeout(() => {
        productAction.collectList({offset: 0, user_id: userinfo.result.user_id});
        productAction.orderList({offset: 0, user_id: userinfo.result.user_id});
      }, 500);
    }
  }

  config = {
    navigationBarTitleText: '我的'
  }

  onMenuClick = (menu) => {
    if (menu.id === 3) {
      Taro.navigateTo({
        url: '/pages/order/order'
      });
      return;
    }
    if (menu.id === 4) {
      Taro.navigateTo({
        url: '/pages/collect/collect'
      });
      return;
    }
  }

  logout = async () => {
    Taro.showModal({
      title: '提示',
      content: '确定退出登录吗?',
      success: async (result) => {
        if (result.confirm) {
          Taro.showLoading();
          await loginManager.logout();
          this.setState({userinfo: {}});
          Taro.showToast({title: '退出登录'});
        }
      }
    })
    
  }

  login = () => {
    Taro.navigateTo({
      url: '/pages/sign/login'
    });
  }

  render () {
    const { userinfo } = this.state;
    const { collectTotal, orderTotal } = this.props;
    return (
      <View className='container container-color'>
        <View className={`${prefix}-bg`} />
        <View className={`${prefix}-user`}>
          <View 
            className={`${prefix}-user-image`} 
            style={`background-image: url('https://img14.360buyimg.com/babel/s700x360_jfs/t1/4099/12/2578/101668/5b971b4bE65ae279d/89dd1764797acfd9.jpg!q90!cc_350x180')`}
          />
          <View className={`${prefix}-user-detail`}>
            <View className={`${prefix}-user-detail-name`}>{userinfo.name}</View>
            <View className={`${prefix}-user-detail-phone`}>{userinfo.phone}</View>
          </View>
        </View>
        <Menu
          title='卖在微易'
          menus={[
            {id: 1, name: '我发布的'},
            {id: 2, name: '我卖出的'},
          ]}
        />
        <Menu
          title='买在微易'
          onClick={(menu) => this.onMenuClick(menu)}
          menus={[
            {id: 3, name: `我买到的 ${orderTotal}`},
            {id: 4, name: `我收藏的 ${collectTotal}`},
          ]}
        />
        {userinfo.user_id ? (
          <AtButton 
            onClick={() => this.logout()}
            className='theme-button'
          >
            退出登录
          </AtButton>
        ) : (
          <AtButton 
            onClick={() => this.login()}
            className='theme-button'
          >
            登录
          </AtButton>
        )}
      </View>
    )
  }
}

const select = (state) => ({
  collectTotal: state.product.collectTotal,
  orderTotal: state.product.orderTotal,
});

export default connect(select)(User);
