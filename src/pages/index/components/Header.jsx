
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtIcon } from 'taro-ui';
import "./index.less";

const prefix = 'index-component-header';

class Header extends Taro.Component {

  onSearch = () => {
    console.log('onSearch:');
  }

  render () {
    return (
      <View className={`${prefix}`}>
        <View className={`${prefix}-box`}>
          <View style='color: #666666;'>医用口罩</View>
        </View>

        <View
          className={`${prefix}-icon`}
          onClick={this.onSearch}
        >
          <AtIcon 
            value='search' 
            size='20' 
            color='#ffffff' 
          />  
        </View>
      </View>
    )
  }
}

export default Header;