import Taro from '@tarojs/taro';
// import MapSdk from '../../qqmap-wx-jssdk'
import { store } from '../../app';
import invariant from 'invariant'

export declare namespace WeixinInterface {
  interface Userinfo {
    gender: number;
    avatarUrl: string;
    city: string;
    country: string;
    language: string;
    nickName: string;
    openId: string;
    province: string;
  }
}

/**
 * @todo 腾讯地图key
 */
// const mapKey = 'DLFBZ-7AXKW-TWYRV-OLVUQ-FA527-2CBQG'
// const mapSdk = new MapSdk({ key: mapKey })

class WeixinSDK {

  public reducerInterface = {
    RECEIVE_CURRENT_ADDRESS: 'RECEIVE_CURRENT_ADDRESS',
    CHANGE_COSTOM_INDEX_ADDRESS: 'CHANGE_COSTOM_INDEX_ADDRESS'
  }

  public checkAuth = (auth: string): Promise<{ success: boolean, result?: any }> => {
    const key = `scope.${auth}`;
    return new Promise((resolve) => {
      Taro.getSetting({
        success: (setting) => {
          if (setting.authSetting && !!setting.authSetting[key]) {
            resolve({ success: true })
          }
          resolve({ success: false })
        },
        fail: (res) => {
          resolve({ success: false, result: res })
        }
      });
    });
  }

  public authorize = async (auth: string): Promise<any> => {
    const key = `scope.${auth}`;
    const result = await Taro.authorize({ scope: key });
    return result;
  }

  public chooseAddress = async (): Promise<{ success: boolean, result: any }> => {
    return new Promise((resolve) => {
      Taro.chooseLocation({
        success: (result) => {
          resolve({ success: true, result })
        },
        fail: (result) => {
          resolve({ success: false, result })
        }
      });
    })
  }

  public getWeixinCode = async (): Promise<any> => {
    return new Promise((resolve) => {
      Taro.login({
        success: async (res) => {
          const { code } = res;
          resolve({success: true, result: code, msg: ''});
        },
        fail: (error: any) => {
          resolve({ success: false, result: undefined, msg: error.errMsg });
        }
      })
    })
  }

  public getWeixinUserinfo = async () => {
    const authRes: any = await this.checkAuth('userInfo');
    if (authRes.success) {
      return new Promise((resolve) => {
        Taro.getUserInfo({
          success: (res) => {
            resolve({ success: true, result: res.userInfo, msg: '' })
          },
          fail: (error: any) => {
            resolve({ success: false, result: undefined, msg: error.errMsg })
          }
        })
      })
    } else {
      return { success: false, result: undefined, msg: '未授权获取微信头像和昵称' };
    }
  }

  // public getLocation = async (): Promise<{ success: boolean, result: any, msg: string }> => {
  //   const that = this;
  //   return new Promise((resolve) => {
  //     Taro.getLocation({
  //       success: (res) => {
  //         mapSdk.reverseGeocoder({
  //           location: {
  //             latitude: res.latitude,
  //             longitude: res.longitude
  //           },
  //           success: (result) => {
  //             store.dispatch({
  //               type: that.reducerInterface.RECEIVE_CURRENT_ADDRESS,
  //               payload: {
  //                 address: result.result.address,
  //                 latitude: result.result.location.lat,
  //                 longitude: result.result.location.lng,
  //               }
  //             })
  //             resolve({ success: true, result: result.result, msg: '' })
  //           },
  //           fail: (error) => {
  //             resolve({ success: false, result: undefined, msg: error.message })
  //           }
  //         })
  //       },
  //       fail: (error) => {
  //         resolve({ success: false, result: undefined, msg: error.message })
  //       }
  //     })
  //   })
  // }

  public changeCostomIndexAddress = (address) => {
    store.dispatch({
      type: this.reducerInterface.CHANGE_COSTOM_INDEX_ADDRESS,
      payload: {
        address
      }
    })
  }

  // /**
  //  * @todo [判断当前redux中是否存在首页地址如果没有则初始化]
  //  */
  // public initAddress = async () => {
  //   try {
  //     const state = await store.getState();
  //     const address = getIndexAddress(state);

  //     if (address && address.latitude) {
  //       return;
  //     }
  //     const result = await this.getLocation();
  //     invariant(!!result.success, result.msg || '获取地理位置失败');
  //     const payload = {
  //       address: result.result.address,
  //       latitude: result.result.location.lat,
  //       longitude: result.result.location.lng,
  //     }
  //     this.changeCostomIndexAddress(payload as any);
  //   } catch (error) {
  //     Taro.showToast({
  //       title: error.message,
  //       icon: 'none'
  //     })
  //   }
  // }
}

export default new WeixinSDK();