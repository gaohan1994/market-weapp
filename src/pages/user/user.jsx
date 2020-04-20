import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton } from "taro-ui";
import "./user.less";
import "../index/index.less";
import productAction from "../../actions/product";
import loginManager from "../../common/util/login.manager";
import Menu from "../../component/menu/Menu";

const prefix = "user";

class User extends Taro.Component {
  state = {
    userinfo: {}
  };

  componentDidShow() {
    const userinfo = loginManager.getUserinfo();
    console.log("userinfo: ", userinfo);
    if (userinfo.success) {
      this.setState({ userinfo: userinfo.result });

      setTimeout(() => {
        productAction.collectList({
          offset: 0,
          user_id: userinfo.result.user_id
        });
        productAction.orderList({
          offset: 0,
          user_id: userinfo.result.user_id
        });
      }, 500);
    }
  }

  config = {
    navigationBarTitleText: "我的"
  };

  onMenuClick = menu => {
    const userinfo = loginManager.getUserinfo();
    if (!userinfo.success) {
      Taro.redirectTo({
        url: `/pages/sign/login`
      });
      return;
    }

    if (menu.id === 1) {
      Taro.navigateTo({
        url: "/pages/product/product.user"
      });
      return;
    }

    if (menu.id === 3) {
      Taro.navigateTo({
        url: "/pages/order/order"
      });
      return;
    }
    if (menu.id === 4) {
      Taro.navigateTo({
        url: "/pages/collect/collect"
      });
      return;
    }
    if (menu.id === 5) {
      Taro.navigateTo({
        url: "/pages/topic/topic.user"
      });
      return;
    }
    if (menu.id === 6) {
      Taro.navigateTo({
        url: "/pages/donate/donate.list"
      });
      return;
    }
    if (menu.id === 7) {
      Taro.navigateTo({
        url: "/pages/donate/donate.add"
      });
      return;
    }
  };

  logout = async () => {
    Taro.showModal({
      title: "提示",
      content: "确定退出登录吗?",
      success: async result => {
        if (result.confirm) {
          Taro.showLoading();
          await loginManager.logout();
          this.setState({ userinfo: {} });
          Taro.showToast({ title: "退出登录" });
        }
      }
    });
  };

  login = () => {
    Taro.navigateTo({
      url: "/pages/sign/login"
    });
  };

  render() {
    const { userinfo } = this.state;
    const { collectTotal, orderTotal } = this.props;
    return (
      <View className='container container-color'>
        <View className='index-bg'>
          <View className='index-color' />
          <View className='index-pos'>
            <View className={`${prefix}-user`}>
              <View
                className={`${prefix}-user-image`}
                style={`background-image: url(${userinfo.avatarUrl})`}
              />
              <View className={`${prefix}-user-detail`}>
                <View className={`${prefix}-user-detail-name`}>
                  {userinfo.nickName}
                </View>
                <View className={`${prefix}-user-detail-phone`}>
                  {userinfo.city}
                </View>
              </View>
            </View>
          </View>
        </View>

        <Menu
          title='卖在微易'
          onClick={menu => this.onMenuClick(menu)}
          menus={[
            {
              id: 1,
              name: "我发布的",
              icon: `http://net.huanmusic.com/market/distinguished.logo.png`
            },
            // {id: 2, name: '我卖出的', icon: `http://net.huanmusic.com/market/teachers.answer.png`},
            {
              id: 5,
              name: "我的帖子",
              icon: `http://net.huanmusic.com/market/credit.png`
            }
          ]}
        />
        <Menu
          title='买在微易'
          onClick={menu => this.onMenuClick(menu)}
          menus={[
            {
              id: 3,
              name: `我的订单 ${orderTotal}`,
              icon: `http://net.huanmusic.com/market/analysis.png`
            },
            {
              id: 4,
              name: `我收藏的 ${collectTotal}`,
              icon: `http://net.huanmusic.com/market/collection.png`
            }
          ]}
        />
        <Menu
          title='公益回收'
          onClick={menu => this.onMenuClick(menu)}
          menus={[
            {
              id: 6,
              name: `我的公益`,
              icon: `http://net.huanmusic.com/market/analysis.png`
            },
            {
              id: 7,
              name: `发布公益`,
              icon: `http://net.huanmusic.com/market/collection.png`
            }
          ]}
        />
        {userinfo.user_id ? (
          <AtButton onClick={() => this.logout()} className='theme-button'>
            退出登录
          </AtButton>
        ) : (
          <AtButton onClick={() => this.login()} className='theme-button'>
            登录
          </AtButton>
        )}
      </View>
    );
  }
}

const select = state => ({
  collectTotal: state.product.collectTotal,
  orderTotal: state.product.orderTotal
});

export default connect(select)(User);
