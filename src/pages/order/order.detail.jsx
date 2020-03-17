import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtActivityIndicator, AtIcon } from 'taro-ui';
import invariant from 'invariant';
import { connect } from '@tarojs/redux'
import './index.less'
import productAction from '../../actions/product';
import loginManager from '../../common/util/login.manager';
import { ResponseCode } from '../../common/request/config';
import OrderItem from './component/item';

const prefix = 'order';

class OrderDetail extends Taro.Component {

  defaultProps = {
    orderDetail: {}
  }

  config = {
    navigationBarTitleText: '订单详情'
  }

  componentDidShow () {
    this.fetchData();
  }

  async fetchData () {
    try {
      const { order_no } = this.$router.params;
      invariant(!!order_no, '请传入订单编号');

      Taro.showLoading({title: '加载中~'});
      const result = await productAction.orderDetail({order_no});
      
      invariant(result.code === ResponseCode.success, result.msg);
      Taro.hideLoading();
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error.message,
        icon: 'loading'
      });
    }
  }  

  setStatus () {
    // 状态（0:未支付,1:已完成,2:已支付,3:关闭,4:退货,5:异常,6:拒绝取消订单）
    const { orderDetail } = this.props;
    return (
      <View className={`${prefix}-status`}>
        <View className={`${prefix}-status-text`}>
          {orderDetail.status === 0 ? '未支付'
          : orderDetail.status === 1 ? '已完成'
          : orderDetail.status === 2 ? '已支付'
          : orderDetail.status === 3 ? '关闭'
          : orderDetail.status === 4 ? '退货'
          : orderDetail.status === 5 ? '异常'
          : orderDetail.status === 6 ? '拒绝取消订'
          : ''}
        </View>
      </View>
    );
  }

  setUser () {
    const { orderDetail } = this.props;
    return (
      <View className={`${prefix}-user`}> 
        <AtIcon value='map-pin' size='15' color='#828E99' />
        {orderDetail.userinfo && (
          <View className={`${prefix}-user-text`}>
            {`${orderDetail.userinfo.name}    ${orderDetail.userinfo.phone}`}
          </View>
        )}
        <View className={`${prefix}-user-bottom`} />
      </View>
    );
  }

  setItem () {

    // amount: 180
    // create_time: "2020-02-05T00:49:47.000Z"
    // exp_fee: 0
    // flag: 0
    // id: 3476
    // is_delete: 0
    // logistics_no: null
    // notify_url: null
    // order_no: "15808349870"
    // package_id: null
    // pay_amount: 180
    // pay_status: 0
    // product_id: 28
    // product_name: "生日蛋糕"
    // product_picture: "https://weiyi.mynatapp.cc/tmp_69217b17a6276d9a5138a3d7d486899d45ccaeabba8670d4.jpg"
    // random_key: "123123"
    // refund_no: null
    // reject_reason: null
    // seller_id: 1
    // status: 0
    // trans_time: null
    // update_time: "2020-02-05T00:49:47.000Z"
    // user_id: 4
    const { orderDetail } = this.props;
    return (
      <View className={`${prefix}-product`}>
        setItem
      </View>
    );
  }

  setOrder () {
    const { orderDetail } = this.props;
    return (
      <View className={`${prefix}-order`}>
        setItem
      </View>
    );
  }

  render () {
    return (
      <View className='container container-color'>
        {this.setStatus()}
        {this.setUser()}
        {this.setItem()}
        {this.setOrder()}
      </View>
    );
  }
}

const select = (state) => ({
  orderDetail: state.product.orderDetail
});

export default connect(select)(OrderDetail);