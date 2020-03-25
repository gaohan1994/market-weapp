import Taro from '@tarojs/taro';
import { Swiper, SwiperItem, View } from '@tarojs/components';
import "./index.less";
import { defaultImage } from '../../../common/util/common';

const prefix = 'index-component-swiper';

class MySwiper extends Taro.Component {
  defaultProps = {
    images: []
  }
  render () {
    const { images, onClick } = this.props;
    return(
      <Swiper
        className={`${prefix}`}
        indicatorColor='#999'
        indicatorActiveColor='#F05065'
        circular
        indicatorDots
        autoplay
      >
        {
          images.map((image, index) => {
            return (
              <SwiperItem
                key={`d-${index}`}
                onClick={() => onClick(image)}
              >
                <View className={`${prefix}-image`}>
                  <View 
                    style={`background-image: url(${image && image.pic || defaultImage})`}
                    className={`${prefix}-image`}
                  />
                </View>
              </SwiperItem>
            )
          })
        }
      </Swiper>
    );
  }
}
export default MySwiper;