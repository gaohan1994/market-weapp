import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui';
import './index.less'
import ListNoMore from '../../component/list/noMore'
import productAction from '../../actions/product';
import loginManager from '../../common/util/login.manager';
import { ResponseCode } from '../../common/request/config';
import CollectItem from './component/item';

const prefix = 'collect';

let offset = 0;

class Collect extends Taro.Component {

  state = { 
    userinfo: {}
  }

  componentDidShow () {
    const userinfo = loginManager.getUserinfo();
    offset = 0;
    if (userinfo.success) {
      this.setState({userinfo: userinfo.result});
      this.fetchData(0);
      return;
    }
  }

  fetchData = async (page) => {
    const userinfo = loginManager.getUserinfo();
    const result = await productAction.collectList({
      offset: typeof page === 'number' ? page : offset, 
      user_id: userinfo.result.user_id
    });
    if (result.code === ResponseCode.success) {
      if (typeof page === 'number') {
        offset = page;
        return;
      } 
      offset = offset + 1;
    }
  }

  config = {
    navigationBarTitleText: '我的收藏'
  }

  login = () => {
    Taro.navigateTo({
      url: '/pages/sign/login'
    });
  }

  render () {
    const { collectTotal, collectList } = this.props;
    return (
      <View className='container container-color'>
        <ScrollView 
          className='container container-color'
          scrollY
        >
          {collectTotal === 0 && (
            <View>
              empty
            </View>
          )}
          {collectList && collectList.length > 0 && collectList.map((item) => {
            return (
              <CollectItem 
                key={item.id}
                collect={item}
              />
            )
          })}
          {collectList.length >= collectTotal && (
            <ListNoMore />
          )}
        </ScrollView>
      </View>
    )
  }
}

const select = (state) => ({
  collectTotal: state.product.collectTotal,
  collectList: state.product.collectList,
});

export default connect(select)(Collect);
