import Taro from '@tarojs/taro';
import { Swiper, SwiperItem, View, Image } from '@tarojs/components';
import "./index.less";

const prefix = 'index-component-swiper';

class MySwiper extends Taro.Component {
  render () {
    return(
      <Swiper
        className={`${prefix}`}
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        indicatorDots
        autoplay
      >
        <SwiperItem>
          <View className={`${prefix}-image`}>
            <View 
              style={`background-image: url('https://img14.360buyimg.com/babel/s700x360_jfs/t1/4099/12/2578/101668/5b971b4bE65ae279d/89dd1764797acfd9.jpg!q90!cc_350x180')`}
              className={`${prefix}-image`}
            />
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className={`${prefix}-image`}>
            <View 
              style={`background-image: url('https://img14.360buyimg.com/babel/s700x360_jfs/t1/4099/12/2578/101668/5b971b4bE65ae279d/89dd1764797acfd9.jpg!q90!cc_350x180')`}
              className={`${prefix}-image`}
            />
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className={`${prefix}-image`}>
            <View 
              style={`background-image: url('https://img14.360buyimg.com/babel/s700x360_jfs/t1/4099/12/2578/101668/5b971b4bE65ae279d/89dd1764797acfd9.jpg!q90!cc_350x180')`}
              className={`${prefix}-image`}
            />
          </View>
        </SwiperItem>
      </Swiper>
    );
  }
}
export default MySwiper;