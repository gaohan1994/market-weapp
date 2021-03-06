import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

const prefix = 'index-component-publish';

class Page extends Taro.Component {
  render () {
    return (
      <View className={`${prefix}`}>
        <View 
          className={`${prefix}-item`}
          onClick={() => {
            Taro.switchTab({
              url: `/pages/product/productList`
            })
          }}
        >
          <View className={`${prefix}-item-title`}>今日上新</View>
          <View className={`${prefix}-item-detail`}>由每日数百名师大学生提供</View>
          <View className={`${prefix}-item-img ${prefix}-item-red`} />
        </View>
        <View 
          className={`${prefix}-item`}
          onClick={() => {
            Taro.switchTab({
              url: `/pages/topic/topicMain`
            })
          }}
        >
          <View className={`${prefix}-item-title`}>今日热帖</View>
          <View className={`${prefix}-item-detail`}>附近小吃、最新热点</View>
          <View className={`${prefix}-item-img ${prefix}-item-yellow`} />
        </View>
      </View>
    )
  }
}

export default Page;