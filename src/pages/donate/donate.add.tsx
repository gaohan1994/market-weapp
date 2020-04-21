/**
 * @Author: Ghan
 * @Date: 2020-04-17 15:28:36
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-04-21 14:39:04
 */
import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtTextarea, AtButton, AtImagePicker } from "taro-ui";
import invariant from "invariant";
import "../publish/publish.less";
import FormRow from "../../component/row";
import loginManager from "../../common/util/login.manager";
import productAction from "../../actions/product";
import api from "./api";
import { ResponseCode } from "../../common/request/config";

const prefix = "publish";

function DonateAdd() {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  async function onSubmit() {
    try {
      invariant(!!title, "请输入标题");
      invariant(!!description, "请输入描述");
      invariant(!!phone, "请输入手机号码");
      const userinfo = await loginManager.getUserinfo();
      const pics =
        files.length > 0 ? await productAction.uploadImages(files) : [];
      const payload = {
        title,
        description,
        phone,
        user_id: userinfo.result.user_id,
        pics
      };
      const result = await api.donateAdd(payload);
      invariant(result.code === ResponseCode.success, result.msg || " ");
      Taro.showToast({ title: "发布成功!" });
      Taro.navigateBack({});
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  }

  return (
    <View className="container container-color">
      <View style="background-color: #ffffff">
        <AtInput
          name="value"
          title="名称"
          type="text"
          placeholder="请输入名称"
          value={title}
          onChange={value => setTitle(value)}
        />
      </View>

      <AtTextarea
        height={400}
        value={description}
        onChange={({ detail: { value } }) => setDescription(value)}
        placeholderStyle="font-size: 12px; color: #C6C6C6;"
        maxLength={200}
        placeholder="在这里详细描述你想说的话吧..."
      />

      <View className={`${prefix}-images`}>
        <AtImagePicker
          multiple
          length={4}
          files={files}
          onChange={files => setFiles(files)}
        />
        {files.length === 0 && (
          <View className={`${prefix}-images-tip`}>快来上传图片吧~</View>
        )}
      </View>

      <FormRow
        title="手机号码"
        main
        isInput
        hasBorder={false}
        inputName="member.phone"
        inputValue={phone}
        inputPlaceHolder="请输入您的手机号码"
        inputOnChange={value => setPhone(value)}
      />

      <AtButton
        className={`${prefix}-button`}
        type="primary"
        circle
        onClick={() => onSubmit()}
      >
        确认发布公益
      </AtButton>
    </View>
  );
}

DonateAdd.config = {
  navigationBarTitleText: "发布公益"
};

export default DonateAdd;
