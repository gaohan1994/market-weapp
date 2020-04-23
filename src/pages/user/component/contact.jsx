import Taro, { useState } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";
import "../user.less";

const prefix = "user";

function Contact() {
  const [open, setOpen] = useState(false);
  return (
    <View className={`${prefix}-contact`}>
      <View className={`${prefix}-contact-img`} onClick={() => setOpen(true)} />
      <AtModal isOpened={open} onCancel={() => setOpen(false)}>
        <AtModalHeader>联系客服</AtModalHeader>
        <AtModalContent>
          <View>客服联系方式</View>
          <View>微信：gaohanjiayou</View>
          <View>手机号：15659995443</View>
        </AtModalContent>
        <AtModalAction>
          {" "}
          <Button onClick={() => setOpen(false)}>确定</Button>{" "}
        </AtModalAction>
      </AtModal>
    </View>
  );
}

export default Contact;
