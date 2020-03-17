
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AtIcon } from 'taro-ui';
import 'dayjs/locale/zh-cn';
import numeral from 'numeral';
import dayJs from 'dayjs';
import { defaultImage } from '../common/util/common';
import "./index.less";

dayJs.locale('zh-cn')
dayJs.extend(relativeTime);

const prefix = 'component-product';

class Product extends Taro.Component {

  onClick () {
    const { product, type = 'product' } = this.props;
    Taro.navigateTo({
      url: `/pages/${type}/${type}?id=${product.id}`
    })
  }

  renderUser = () => {
    const { product } = this.props;
    return (
      <View className={`${prefix}-topic-user`}>
        <View 
          className={`${prefix}-user-avator`}
          style="background-image: url('')"
        />
        <View className={`${prefix}-topic-user-box`}>
          <Text className={`${prefix}-topic-user-box-name`}>{product.userinfo && product.userinfo.username}</Text> 
          <Text className={`${prefix}-topic-user-box-tip`}>{dayJs(product && product.create_time).fromNow()}</Text> 
        </View>
      </View>
    )
  }

  render () {
    const { product, type } = this.props;

    const cover = product && product.pics && product.pics.length > 0
      ? product.pics.split(',')[0]
      : defaultImage;

    if (type === 'topic') {
      return (
        <View className={`${prefix}-topic`}>
          {this.renderUser()}
        </View>
      );
    }


    return (
      <View 
        className={`${prefix}`}
        onClick={() => this.onClick()}
      >
        <View
          className={`${prefix}-image`}
          style={`background-image: url(${cover})`}
        />
        <View className={`${prefix}-detail`}>
          <View className={`${prefix}-detail-title`}>{product.title}</View>
          <View className={`${prefix}-detail-box`}>
            <View className={`${prefix}-detail-box-price`}>{numeral(product && product.amount || 0).format('0.00')}元</View>
            <View className={`${prefix}-detail-box-view`}>{product.viewing_count || 0}人浏览</View>
          </View>
        </View>
        {product && product.userinfo && (
          <View className={`${prefix}-user`}>
            {product.userinfo && product.userinfo.avator ? (
              <View 
                className={`${prefix}-user-avator`}
                style="background-image: url('')"
              />
            ) : (
              <AtIcon
                value='user'
                size='20'
                color='#828E99'
              />
            )}
            <View className={`${prefix}-user-name`}>{product.userinfo && product.userinfo.username}</View>
          </View>
        )}
        
      </View>
    )
  }
}

export default Product;