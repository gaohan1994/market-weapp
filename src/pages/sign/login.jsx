/*
 * @Author: Ghan 
 * @Date: 2019-11-01 10:07:05 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-03-23 14:57:19
 */
import Taro from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import classnames from 'classnames';
import invariant from 'invariant';
import './index.less';
import LoginManager from '../../common/util/login.manager';
import weixin from '../../common/weixin/weixin';
import requestHttp from '../../common/request/request.http';

class Login extends Taro.Component {

  state = {
    username: '',
    password: '',
    checked: true,
  };

  config = {
    navigationBarTitleText: '登录',
  };
  /**
   * @todo [用户输入用户名]
   *
   * @memberof Login
   */
  changeUsername = (value) => {
    this.setState({ username: value });
  }
  /**
   * @todo [用户输入密码]
   *
   * @memberof Login
   */
  changePassword = (value) => {
    this.setState({ password: value });
  }
  /**
   * @todo [用户勾选政策]
   *
   * @memberof Login
   */
  changeChecked = () => {
    this.setState(preState => {
      return {
        ...preState,
        checked: !preState.checked
      };
    });
  }
  getDisabled = () => {
    return false;
  }

  wxLogin = async () => {
    Taro.login({
      success: (result) => {
        console.log('result: ', result);
      }
    })
  }

  onGetUserInfo = async (params) => {
    try {
      const { detail } = params;
      Taro.showLoading();
      invariant(detail.errMsg === "getUserInfo:ok", '获取用户信息失败');
      const codeRes = await weixin.getWeixinCode();
      invariant(codeRes.success, codeRes.msg || '请先登录微信');
      const payload = {
        encryptedData: detail.encryptedData,
        iv: detail.iv,
        code: codeRes.result
      };

      const result = await requestHttp.post('/weixin/decrypt', payload);
      const sign = await LoginManager.login(result.data);
      Taro.hideLoading();
      invariant(!!sign.success, sign.msg || ' ');
      Taro.showToast({
        title: '登录成功！'
      });
      setTimeout(() => {
        Taro.navigateBack();
      }, 500);
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  onLogin = async () => {
    try {
      Taro.showLoading();
      const { username, password } = this.state;
      invariant(!!username, '请输入手机号');
      invariant(!!password, '请输入密码');
      const result = await LoginManager.login({username, password: password});
      invariant(result.success, result.msg || '登录失败');
      Taro.showToast({title: '登录成功', duration: 1000});
      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }
  onChangeValue = (key, value) => {
    this.setState(prevState => {
      return {
        ...prevState,
        [key]: value
      };
    });
    return value;
  }

  render () {
    return (
      <View className={classnames(['container', 'sign'])} >
        <View className='sign-card'>
          <View className='sign-card-bg' />
          <View className='sign-card-title'>使用微信登录</View>
          <Button
            openType='getUserInfo'
            onGetUserInfo={this.onGetUserInfo}
            className='sign-button'
          >
            登录
          </Button>
        </View>
      </View>
    );
  }
}

export default Login;