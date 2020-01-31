
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import numeral from 'numeral';
import "./index.less";

const prefix = 'component-product';

class Product extends Taro.Component {

  onClick () {
    const { product } = this.props;
    Taro.navigateTo({
      url: `/pages/product/product?id=${product.id}`
    })
  }

  render () {
    const { product } = this.props;
    return (
      <View 
        className={`${prefix}`}
        onClick={() => this.onClick()}
      >
        <View
          className={`${prefix}-image`}
          style="background-image: url('https://img14.360buyimg.com/babel/s700x360_jfs/t1/4099/12/2578/101668/5b971b4bE65ae279d/89dd1764797acfd9.jpg')"
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