import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less';

const prefix = 'component-topic';

class Page extends Taro.Component {
  render () {
    return (
      <View className={`${prefix}-types`}>
        <View className={`${prefix}-types-item`}>
          美食
        </View>
        <View className={`${prefix}-types-item`}>
          美食
        </View>
        <View className={`${prefix}-types-item`}>
          美食
        </View>
      </View>
    )
  }
}

export default Page;