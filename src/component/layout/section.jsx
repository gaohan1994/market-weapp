import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

const prefix = 'component-section';

class SectionHeader extends Taro.Component {
  render () {
    const { title, showMore = true, more = `查看更多 >`, onClick = () => {} } = this.props;
    return(
      <View 
        className={`${prefix}-header`}
        onClick={onClick}
      >
        <View className={`${prefix}-header-title`}>
          {title}
        </View>
        {!!showMore && (
          <View className={`${prefix}-header-button`}>
            {more}
          </View>
        )}
      </View>
    )
  }
}

export default SectionHeader;