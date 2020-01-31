/*
 * @Author: Ghan 
 * @Date: 2019-11-01 10:07:05 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-01-29 13:59:54
 */
import Taro from '@tarojs/taro';
import { View, Image, Text, Input } from '@tarojs/components';
import classnames from 'classnames';
import { AtButton } from 'taro-ui';
import invariant from 'invariant';
import './index.less';
import LoginManager from '../../common/util/login.manager';

const cssPrefix = 'sign';

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
    const { username, password } = this.state;
    return (
      <View className={classnames(['container', 'sign'])} >
        <View className='sign-card'>
          <View className='sign-card-title'>欢迎使用师大微易</View>
          <View className='sign-card-input'>
            <View className={`${cssPrefix}-input-box`} >
              <Image src='http://net.huanmusic.com/weapp/icon_login_user.png' className={`${cssPrefix}-input-box-icon`} />
              <View className={`${cssPrefix}-input-container`}>
                <Input
                  // cursorSpacing={300}
                  className={`${cssPrefix}-input-box-input`} 
                  value={username}
                  onInput={({detail: {value}}) => this.onChangeValue('username', value)}
                  placeholder='请输入手机号'
                  placeholderStyle='fontSize: 26px; color: #cccccc'
                  type='number'
                  autoFocus
                />
              </View>
            </View>
          </View>
          <View className='sign-card-input'>
            <View className={`${cssPrefix}-input-box`} >
              <Image src='http://net.huanmusic.com/weapp/icon_login_password.png' className={`${cssPrefix}-input-box-icon`} />
              <View className={`${cssPrefix}-input-container`}>
                <Input
                  // cursorSpacing={300}
                  className={`${cssPrefix}-input-box-input`} 
                  value={password}
                  onInput={({detail: {value}}) => this.changePassword(value)}
                  placeholder='请输入密码'
                  placeholderStyle='fontSize: 26px; color: #cccccc'
                />
              </View>
            </View>
          </View>
          <View className={classnames(['sign-card-check'])}>
            {
              this.state.checked === true 
              ? (
                <Image onClick={this.changeChecked} className='sign-card-check-icon' src='http://net.huanmusic.com/weapp/icon_pitchon.png' />
              )
              : (
                <View onClick={this.changeChecked} className={classnames(['sign-card-check-icon', 'sign-card-check-uncheck'])} />
              )
            }
            <Text className='small-text'>登录代表您已同意用户协议和隐私权政策</Text>
          </View>
          <AtButton 
            type='primary' 
            disabled={this.getDisabled()}
            onClick={this.onLogin}
          >
            登录
          </AtButton>
        </View>
      </View>
    );
  }
}

export default Login;