import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import 'taro-ui/dist/style/index.scss';
import Index from './pages/index'
import configStore from './store'
import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
export const store = configStore() || {};

class App extends Component {

  componentDidMount () {}

  config = {
    pages: [
      'pages/index/index',
      'pages/publish/publish',
      'pages/publish/index',
      'pages/user/user',
      'pages/sign/login',
      'pages/collect/collect',
      'pages/order/order',
      'pages/product/product',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: "#ACACAC",
      selectedColor: "#2EAAF8",
      backgroundColor: "#ffffff",
      borderStyle: 'black',
      list: [{
        pagePath: "pages/index/index",
        iconPath: "./assets/tab-bar/icon_nav_home.png",
        selectedIconPath: "./assets/tab-bar/icon_nav_home_xuan.png",
        text: "首页"
      }, {
        pagePath: "pages/publish/index",
        iconPath: "./assets/tab-bar/icon_reportforms.png",
        selectedIconPath: "./assets/tab-bar/icon_reportforms_xuan.png",
        text: "发布"
      }, {
        pagePath: "pages/user/user",
        iconPath: "./assets/tab-bar/icon_mine.png",
        selectedIconPath: "./assets/tab-bar/icon_mine_xuan.png",
        text: "我的"
      }]
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
