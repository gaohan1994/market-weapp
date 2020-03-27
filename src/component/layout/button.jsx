import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtFab } from 'taro-ui';
import loginManager from '../../common/util/login.manager';
import '../../pages/publish/publish.less';

const prefix = 'publish';

class PublishButton extends Taro.Component {

  onClick = () => {
    const result = loginManager.getUserinfo();
    if (!result.success) {
      Taro.redirectTo({
        url: `/pages/sign/login`
      });
      return;
    }
    const { onClick } = this.props;
    onClick();
  }

  render () {
    const { title } = this.props;
    return (
      <View className={`${prefix}-button-pub`}>
        <AtFab
          onClick={() => this.onClick()}
        >
          <View>{title}</View>
        </AtFab>
      </View>
    )
  }
}

export default PublishButton;