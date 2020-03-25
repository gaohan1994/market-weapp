
import Taro from '@tarojs/taro';
import { Swiper, SwiperItem, View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import "./index.less";

const prefix = 'index-component-header';

class Header extends Taro.Component {

  onSearch = () => {
    Taro.navigateTo({
      url: '/pages/search/search'
    });
  }

  render () {
    const items = [{
      title: '医用口罩',
      id: 1,
    }, {
      title: 'yeezy350',
      id: 2,
    }, {
      title: 'bosie',
      id: 3,
    }];
    return (
      <View 
        className={`${prefix}`}
        onClick={this.onSearch}
      >
        <Swiper 
          className={`${prefix}-box`}
          vertical
          circular
          autoplay
        >
          {items.map((item) => {
            return (
              <SwiperItem
                key={item.id}
              >
                <View className={`${prefix}-item`}>{item.title}</View>
              </SwiperItem>
            )
          })}
        </Swiper>

        <View
          className={`${prefix}-icon`}
          // onClick={this.onSearch}
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