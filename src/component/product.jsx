
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
          style={`background-image: url(${product.userinfo.avatarUrl})`}
        />
        <View className={`${prefix}-topic-user-box`}>
          <Text className={`${prefix}-topic-user-box-name`}>{product.userinfo && product.userinfo.nickName}</Text> 
          <Text className={`${prefix}-topic-user-box-tip`}>{dayJs(product && product.create_time).fromNow()}</Text> 
        </View>
      </View>
    )
  }

  render () {
    const { product, type } = this.props;

    const cover = product && product.pics && product.pics.length > 0
      ? product.pics[0]
      : defaultImage;

    if (type === 'topic') {

      const bars = [{
        title: `收藏(${product.collect_count > 99 ? '99+' : product.collect_count})`,
        icon: 'heart',
      }, {
        title: `留言`,
        icon: 'message'
      }];

      return (
        <View 
          className={`${prefix}-topic`}
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/topic/topic?id=${product.id}`
            });
          }}
        >
          {this.renderUser()}
          <View className={`${prefix}-topic-content`}>
            <View className={`${prefix}-topic-content-title`}>{product.title}</View>
            <View className={`${prefix}-topic-content-desc`}>{product.description}</View>
          </View>

          {product.pics && product.pics.length > 0 && (
            <View className={`${prefix}-topic-image`}>
              {product.pics.map((img, index) => {
                return (
                  <View 
                    key={`i${index}`}
                    className={`${prefix}-topic-image-${product.pics.length > 2 ? 2 : 1} ${product.pics.length > 1 && index % 2 === 0 ? `${prefix}-topic-image-mar` : ''}`}
                    style={`background-image: url(${img})`}
                  />
                )
              })}
            </View>
          )}

          <View className={`${prefix}-topic-bar`}>
            {bars.map((bar) => {
              return (
                <View 
                  className={`${prefix}-topic-bar-item`}
                  key={bar.title}
                >
                  <AtIcon
                    value={bar.icon}
                    size='15'
                    color={bar.color || '#666666'}
                  />
                  <View style='margin-left: 5px' className={`${prefix}-topic-content-desc`}>{bar.title}</View>
                </View>
              )
            })}
          </View>
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
            {product.userinfo && product.userinfo.avatarUrl ? (
              <View 
                className={`${prefix}-user-avator`}
                style={`background-image: url(${product.userinfo.avatarUrl})`}
              />
            ) : (
              <AtIcon
                value='user'
                size='20'
                color='#828E99'
              />
            )}
            <View className={`${prefix}-detail-box`}>
              <View className={`${prefix}-user-name`}>{product.userinfo && product.userinfo.nickName}</View>
              <View className={`${prefix}-user-name`}>{product.like_count || 0}人喜欢</View>
            </View>
          </View>
        )}
        
      </View>
    )
  }
}

export default Product;