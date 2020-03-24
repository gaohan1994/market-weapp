import Taro from '@tarojs/taro';
import { View, Button, Input } from '@tarojs/components';
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui';
import invariant from 'invariant';
import './index.less';
import productAction from '../../../actions/product';
import { defaultImage } from '../../../common/util/common';
import { ResponseCode } from '../../../common/request/config';

const prefix = 'comment-component';

class Comment extends Taro.Component {
  state = {
    value: '',
    focus: false,
  }

  componentWillReceiveProps (nextProps) {
    const { isOpened } = this.props;

    if (isOpened === false && nextProps.isOpened === true) {
      this.setState({ focus: true });
    }
  }

  componentDidShow () {

  }

  async onClose () {
    console.log('onClose: ');
  }
  async onCancel () {
    this.setState({focus: false, value: ''});
    const { onCancel } = this.props;
    onCancel();
  }
  async onConfirm () {
    try {
      const { value } = this.state;  
      const { product, userinfo, parentMessage, callback, type = 0 } = this.props;
      invariant(!!value, '请输入要回复的内容');
      Taro.showLoading();
      const result = await productAction.sendMessage(
        product,
        userinfo,
        value,
        parentMessage,
        type,
      );
      Taro.hideLoading();
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      Taro.showToast({ title: '留言成功！', duration: 1000 });
      this.onCancel();
      if (callback) {
        callback(result);
      }
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  setHeader () {
    const { userinfo } = this.props;
    return (
      <View className={`${prefix}-header`}>
        <View 
          className={`${prefix}-header-avator`}
          style={`background-image: url(${userinfo.avatarUrl || defaultImage})`}
        />
        <View>{userinfo.nickName}</View>
      </View>
    );
  }
  onInput ({detail: {value}}) {
    this.setState({value});
  }
  setContent () {
    const { value } = this.state;
    const { parentMessage } = this.props;
    return (
      <View className={`${prefix}-content`}>
        <Input
          className={`${prefix}-content-input`}
          placeholderClass={`${prefix}-content-input-place`}
          focus={this.state.focus}
          placeholder={parentMessage && parentMessage.id 
            ? `回复 ${parentMessage.userinfo && parentMessage.userinfo.nickName}` 
            : '写下你想说的话吧~'}
          value={value}
          onInput={this.onInput}
          cursorSpacing={100}
          onConfirm={this.onConfirm}
        />
      </View>
    );
  }

  render () {
    const { isOpened } = this.props;
    return (
      <AtModal
        isOpened={isOpened}
        onCancel={() => this.onCancel()}
      >
        <AtModalContent>
          {this.setHeader()}
          {this.setContent()}
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => this.onCancel()}>
            取消
          </Button>
          <Button onClick={() => this.onConfirm()}>
            回复
          </Button>
        </AtModalAction>
      </AtModal>
    );
  }
}
export default Comment;