import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.less';

const prefix = 'empty-component';
class ListNoMore extends Taro.Component {
  render () {
    const { text = '------ 我也是有底线的~ ------' } = this.props;
    return (
      <View className={`${prefix}`}>
        <View className={`${prefix}-nomore`}>
          {text}
        </View>
      </View>
    );
  }
}

export default ListNoMore;