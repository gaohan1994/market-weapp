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
      'pages/publish/publish.topic',
      'pages/user/user',
      'pages/sign/login',
      'pages/collect/collect',
      'pages/order/order',
      'pages/order/order.detail',
      'pages/product/product',
      'pages/search/search',
      'pages/pay/cart',
      'pages/product/product.list',
      'pages/topic/topicMain',
      'pages/topic/topic'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#F05065',
      navigationBarTitleText: '微易',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color: "#929292",
      selectedColor: "#DF394D",
      backgroundColor: "#ffffff",
      borderStyle: 'black',
      list: [{
        pagePath: "pages/index/index",
        iconPath: "./assets/tab-bar/home.unselected.png",
        selectedIconPath: "./assets/tab-bar/home.png",
        text: "首页"
      }, {
        pagePath: "pages/topic/topicMain",
        iconPath: "./assets/tab-bar/course.unselected.png",
        selectedIconPath: "./assets/tab-bar/course.png",
        text: "论坛"
      }, {
        pagePath: "pages/publish/index",
        iconPath: "./assets/tab-bar/jijing.unselected.png",
        selectedIconPath: "./assets/tab-bar/jijing.png",
        text: "发布"
      }, {
        pagePath: "pages/user/user",
        iconPath: "./assets/tab-bar/class.unselected.png",
        selectedIconPath: "./assets/tab-bar/class.png",
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
