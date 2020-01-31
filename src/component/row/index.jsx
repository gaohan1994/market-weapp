import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import "./index.less";

const prefix = 'row-component';

class MyRow extends Taro.Component {
  render () {
    const { title } = this.props;
    return (
      <View className={`${prefix}`}>
        <View className={`${prefix}-bge`} />
        <View>{title}</View>
      </View>
    )
  }
}

export default MyRow;