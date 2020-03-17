import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
import productAction from '../../actions/product';
import loginManager from '../../common/util/login.manager';
import { ResponseCode } from '../../common/request/config';
import OrderItem from './component/item';

const prefix = 'order';

let offset = 0;

class Order extends Taro.Component {

  state = { 
    userinfo: {}
  }

  config = {
    navigationBarTitleText: '订单列表'
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
    const result = await productAction.orderList({
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
    navigationBarTitleText: '我的订单'
  }

  login = () => {
    Taro.navigateTo({
      url: '/pages/sign/login'
    });
  }

  render () {
    const { orderTotal, orderList } = this.props;
    return (
      <View className='container container-color'>
        <ScrollView 
          className='container container-color'
          scrollY
        >
          {orderTotal === 0 && (
            <View>
              empty
            </View>
          )}
          {orderList && orderList.length > 0 && orderList.map((item) => {
            return (
              <OrderItem
                key={item.order_no}
                order={item}
                userinfo={this.state.userinfo}
              />
            )
          })}
          {orderList.length >= orderTotal && (
            <View>
              我也是有底线的
            </View>
          )}
        </ScrollView>
      </View>
    )
  }
}

const select = (state) => ({
  orderTotal: state.product.orderTotal,
  orderList: state.product.orderList,
});

export default connect(select)(Order);
