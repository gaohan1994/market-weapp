import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import dayJs from "dayjs";
import "./style.less";
import "../../pages/product/index.less";
import { defaultImage } from "../../common/util/common";
import LikeItem from "./LikeItem";

const prefix = "base-item-message";

class MessageItem extends Taro.Component {
  setUser() {
    const { message, setLike = true } = this.props;
    return (
      <View className={`${prefix}-user`}>
        {!!setLike && <LikeItem message={message} />}
        <View
          className={`${prefix}-user-avator`}
          style={`background-image: url(${(message.userinfo &&
            message.userinfo.avatarUrl) ||
            defaultImage})`}
        />
        <View className={`${prefix}-user-name`}>
          {message.userinfo && message.userinfo.nickName}
        </View>
        <View className={`${prefix}-user-time`}>
          {dayJs((message && message.create_time) || "").format(
            "YYYY-MM-DD HH:mm:ss"
          )}
        </View>
      </View>
    );
  }

  setContent() {
    const { message } = this.props;
    return (
      <View className={`${prefix}-detail`}>
        <View className={`${prefix}-detail-content`}>{message.content}</View>
      </View>
    );
  }

  setSubMessage() {
    const { message, setLike = true } = this.props;
    if (message && message.subMessage && message.subMessage.length > 0) {
      return (
        <View className={`${prefix}-sub`}>
          {message.subMessage.map(item => {
            return (
              <View key={item.id} className={`${prefix}-sub-item`}>
                <View className={`${prefix}-sub-item-user`}>
                  {!!setLike && <LikeItem message={item} />}
                  <View>{item.userinfo && item.userinfo.nickName}</View>
                  <View className={`${prefix}-sub-item-time`}>
                    {dayJs(item.create_time).format("YYYY-MM-DD HH:mm:ss")}
                  </View>
                </View>
                <View className={`${prefix}-sub-item-content`}>
                  回复
                  <View className={`${prefix}-sub-item-reply`}>
                    {message.userinfo.nickName}
                  </View>
                  {`: ${item.content}`}
                </View>
              </View>
            );
          })}
        </View>
      );
    }
    return <View />;
  }

  render() {
    const { onClick } = this.props;
    return (
      <View className={`${prefix}`} onClick={onClick}>
        {this.setUser()}
        {this.setContent()}
        {this.setSubMessage()}
      </View>
    );
  }
}
export default MessageItem;
