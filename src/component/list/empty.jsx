import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.less';

const prefix = 'empty-component';
class ListEmpty extends Taro.Component {
  render () {
    const { text = '空空如也~' } = this.props;
    return (
      <View className={`${prefix}`}>
        <Image
          className={`${prefix}-image`}
          src='http://net.huanmusic.com/market/default.png'
        />
        <View className={`${prefix}-text`}>{text}</View>
      </View>
    );
  }
}

export default ListEmpty;