import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import './index.less'
import Header from '../index/components/Header';
import Menu from '../../component/menu/Menu';

class Page extends Taro.Component {

  config = {
    navigationBarTitleText: '二手市场'
  }

  render () {
    return (
      <View className='container container-color'>
        <Header />
        <Menu 
          menus={this.props.menus} 
        />
        View
      </View>
    )
  }
}

const select = (state) => ({
  menus: state.product.productTypes,
});

export default connect(select)(Page)
