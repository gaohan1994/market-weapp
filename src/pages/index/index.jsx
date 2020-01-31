import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import './index.less'
import Header from './components/Header';
import MySwiper from './components/Swiper';
import Menu from '../../component/menu/Menu';
import ProductAction from '../../actions/product';
import MyList from './components/List';

let offset = 0;

class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentDidShow () {
    offset = 0;
    ProductAction.productTypes();
    ProductAction.productHomeList({offset});
  }

  render () {
    return (
      <View className='index container container-color'>
        <View className='index-bg'>
          <Header />
          <MySwiper />
          <Menu 
            menus={this.props.menus} 
          />
        </View>
        <MyList />
      </View>
    )
  }
}

const select = (state) => ({
  menus: state.product.productTypes
})

export default connect(select)(Index)
