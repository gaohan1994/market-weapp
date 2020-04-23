/*
 * @Author: Ghan
 * @Date: 2019-11-01 10:07:05
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-04-23 11:49:06
 */
import Taro, { useState } from "@tarojs/taro";
import { View, Button, Input } from "@tarojs/components";
import classnames from "classnames";
import invariant from "invariant";
import "./index.less";
import LoginManager from "../../common/util/login.manager";
import weixin from "../../common/weixin/weixin";
import requestHttp from "../../common/request/request.http";

function Login() {
  const [studentId, setStudentId] = useState("");

  async function onGetUserInfo(params) {
    try {
      const { detail } = params;
      Taro.showLoading();
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
      console.log("====================================");
      console.log(result);
      console.log("====================================");
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
      const { username, password } = this.state;
      invariant(!!username, "请输入手机号");
      invariant(!!password, "请输入密码");
      const result = await LoginManager.login({ username, password: password });
      invariant(result.success, result.msg || "登录失败");
      Taro.showToast({ title: "登录成功", duration: 1000 });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
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
          openType="getUserInfo"
          onGetUserInfo={onGetUserInfo}
          className="sign-button"
          style="margin-left: 0px"
        >
          使用微信登录
        </Button>
      </View>
    </View>
  );
}

Login.config = {
  navigationBarTitleText: "登录"
};

export default Login;
