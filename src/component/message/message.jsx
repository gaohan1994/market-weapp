import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import dayJs from 'dayjs';
import { defaultImage } from '../../common/util/common';
import "./index.less";
import loginManager from '../../common/util/login.manager';

const prefix = 'c-message';

class MessageComp extends Taro.Component {
  render () {
    const { message, type } = this.props;
    
    return (
      <View 
        className={`${prefix}`}
        onClick={() => {
          const { success } = loginManager.getUserinfo();
          if (!success) {
            Taro.redirectTo({
              url: '/pages/sign/login'
            })
            return;
          }
          Taro.navigateTo({
            url: `/pages/${Number(type) === 1 ? `topic/topic?id=${message.item_id}` : `product/product?id=${message.item_id}`} `
          });
        }}
      >
        <View className={`${prefix}-content`}>
          <View 
            className={`${prefix}-content-icon`}
            style={`background-image: url(${message && message.replyUserinfo && message.replyUserinfo.avatarUrl || defaultImage})`}
          />
          <View className={`${prefix}-content-detail`}>
            <View className={`${prefix}-content-title`}>
              {`${message && message.replyUserinfo && message && message.replyUserinfo.nickName} 给您留言了`}
            </View>
            <View className={`${prefix}-content-text`}>{message.content}</View>
            <View className={`${prefix}-content-time ${prefix}-content-text`}>{dayJs(message && message.create_time || '').fromNow()}</View>
          </View>
        </View>
      </View>
    )
  }
}

export default MessageComp; 