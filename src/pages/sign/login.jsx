/*
 * @Author: Ghan
 * @Date: 2019-11-01 10:07:05
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-04-23 14:11:56
 */
import Taro, { useState } from "@tarojs/taro";
import { View, Button, Input } from "@tarojs/components";
import { AtModal, AtModalAction, AtModalHeader, AtModalContent } from "taro-ui";
import classnames from "classnames";
import invariant from "invariant";
import "./index.less";
import LoginManager from "../../common/util/login.manager";
import weixin from "../../common/weixin/weixin";
import requestHttp from "../../common/request/request.http";
import { ResponseCode } from "../../common/request/config";

function Login() {
  const [studentId, setStudentId] = useState("");
  const [visible, setVisible] = useState(false);

  async function onGetUserInfo(params) {
    try {
      const { detail } = params;
      Taro.showLoading();
      setVisible(false);
      invariant(detail.errMsg === "getUserInfo:ok", "获取用户信息失败");
      const codeRes = await weixin.getWeixinCode();
      invariant(codeRes.success, codeRes.msg || "请先登录微信");
      invariant(!!studentId, "请输入学号");
      const payload = {
        encryptedData: detail.encryptedData,
        iv: detail.iv,
        code: codeRes.result
      };

      const result = await requestHttp.post("/weixin/decrypt", payload);
      const sign = await LoginManager.login({
        ...result.data,
        studentId
      });
      Taro.hideLoading();
      invariant(!!sign.success, sign.msg || " ");
      Taro.showToast({
        title: "登录成功！"
      });
      setTimeout(() => {
        Taro.navigateBack();
      }, 500);
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  }

  async function onLogin() {
    try {
      Taro.showLoading();
      invariant(!!studentId, "请输入学号");
      setVisible(false);
      const result = await LoginManager.loginById({ studentId });
      Taro.hideLoading();
      if (result.code === ResponseCode.auth) {
        setVisible(true);
        return;
      }
      invariant(result.code === ResponseCode.success, result.msg || "登录失败");
      const userinfo = await LoginManager.saveUserinfo(result.data);
      Taro.showToast({
        title: "登录成功！"
      });
      setTimeout(() => {
        Taro.navigateBack();
      }, 500);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  }

  return (
    <View className={classnames(["container", "sign"])}>
      <View className="sign-card">
        <View className="sign-box">
          <View className="sign-box-input-text">学号</View>
          <Input
            className="sign-box-input sign-box-input-input"
            value={studentId}
            onInput={({ detail: { value } }) => setStudentId(value)}
            placeholder="请输入学号"
          />
        </View>
        <Button
          className="sign-button"
          style="margin-left: 0px"
          onClick={onLogin}
        >
          登录
        </Button>
      </View>

      <AtModal isOpened={visible} onCancel={() => setVisible(false)}>
        <AtModalHeader>提示</AtModalHeader>
        <AtModalContent>
          该学号还未绑定微信，确认授权使用微信信息
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => setVisible(false)}>取消</Button>
          <Button openType="getUserInfo" onGetUserInfo={onGetUserInfo}>
            使用微信登录
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  );
}

Login.config = {
  navigationBarTitleText: "登录"
};

export default Login;
