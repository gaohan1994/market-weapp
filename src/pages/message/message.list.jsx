import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import loginManager from '../../common/util/login.manager';
import productAction from '../../actions/product';
import '../publish/publish.less'
import '../index/index.less';
import MessageList from '../../component/list/message';

class PublishIndex extends Taro.Component {

  state = {
    userinfo: {},
    type: -1
  }

  componentDidShow () {
    const { type } = this.$router.params;
    const result = loginManager.getUserinfo();
    if (!!result.success) {
      this.setState({
        userinfo: result.result,
        type: type
      });

      const payload = {
        user_id: result.result.user_id,
        type: Number(type),
      }
      productAction.messageUserList(payload);
    }
  }

  render () {
    const { type } = this.state;
    const { messageList } = this.props;
    return (
      <View className='container container-color'>
        <MessageList 
          messageList={messageList}
          type={type}
        />
      </View>
    )
  }
}


const select = (state) => {
  return {
    messageList: state.product.messageHomeList
  };
};

export default connect(select)(PublishIndex);;