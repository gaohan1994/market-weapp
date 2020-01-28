/**
 * @Author: Ghan 
 * @Date: 2019-11-08 17:10:29 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-01-28 23:30:48
 */

import Taro from '@tarojs/taro';
// import md5 from 'blueimp-md5';
import { ResponseCode } from '../request/config';
import requestHttp from '../request/request.http';

export const CentermOAuthKey: string = 'MarketWeapp';
class LoginManager {

  public LoginManagerConfig: any = {
    url: '/user/login',
  };

  public autoToken = async (params): Promise<any> => {
    const result = await requestHttp.post(this.LoginManagerConfig.url, params);
    if (result.code === ResponseCode.success) {
      return { success: true, result: result.data };
    } else {
      return { success: false, result: result.msg };
    }
  }

  /**
   * @todo [登录]
   *
   * @memberof LoginManager
   */
  public login = async (params: any) => {
    const payload = {
      ...params,
      password: params.password,
    };
    const { success, result } = await this.autoToken(payload);

    if (success === true) {
      return new Promise((resolve) => {
        Taro
          .setStorage({ key: CentermOAuthKey, data: JSON.stringify(result) })
          .then(() => {
            resolve({success: true, result, msg: ''});
          })
          .catch(error => resolve({success: false, result: {} as any, msg: error.message || '登录失败'}));
      });
    } else {
      return new Promise((resolve) => {
        resolve({success: false, result: {} as any, msg: result || '登录失败'});
      });
    }
  }

  public getUserinfo = () => {
    const userinfo = Taro.getStorageSync(CentermOAuthKey);
    if (userinfo) {
      return { success: true, result: JSON.parse(userinfo) };
    } else {
      return { success: false, result: '' };
    }
  }
  
  /**
   * @todo [退出登陆]
   *
   * @memberof LoginManager
   */
  public logout = async () => {
    return new Promise((resolve, reject) => {
      Taro
        .setStorage({ key: CentermOAuthKey, data: '' })
        .then(() => {
          resolve({ success: true, result: '' });
        })
        .catch(error => {
          reject({ success: false, result: error.message });
        });
    });
  }
}

export default new LoginManager();