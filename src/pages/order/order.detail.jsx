import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtActivityIndicator, AtIcon } from 'taro-ui';
import invariant from 'invariant';
import numeral from 'numeral';
import dayJs from 'dayjs';
import { connect } from '@tarojs/redux'
import './index.less'
import productAction from '../../actions/product';
import { ResponseCode } from '../../common/request/config';
import { defaultImage } from '../../common/util/common';
import BaseItem from '../../component/item/BaseItem';
import { isSeller } from './component/util';
import Footer from '../../component/layout/footer';
import loginManager from '../../common/util/login.manager';

const prefix = 'order';

class OrderDetail extends Taro.Component {

  state = {
    loading: false
  }

  config = {
    navigationBarTitleText: '订单详情'
  }

  componentDidShow () {
    this.fetchData();
  }

  onPhone = (phone) => {
    Taro.makePhoneCall({
      phoneNumber: phone
    });
  }

  async confirm () {
    try {
      const { orderDetail } = this.props;
      const userinfo = loginManager.getUserinfo();
      Taro.showModal({
        title: '提示',
        content: '请确保您已经检验商品无误',
        success: async (result) => {
          if (result.confirm) { 
            // confirm order
            const payload = { order_no: orderDetail.order_no, user_id: userinfo.result.user_id }
            const status = await productAction.orderConfirm(payload);
            if (status.code === ResponseCode.success) {
              Taro.showToast({
                title: '交易成功!'
              });
            }

            this.fetchData();
          }
        }
      })
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'loading'
      });
    }
  }

  async fetchData () {
    try {
      const { order_no } = this.$router.params;
      invariant(!!order_no, '请传入订单编号');
      this.setState({loading: true});

      const result = await productAction.orderDetail({order_no});
      this.setState({loading: false});
      invariant(result.code === ResponseCode.success, result.msg || ' ');
    } catch (error) {
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
      <View 
        className={`${prefix}-user`}
        onClick={() => this.onPhone(orderDetail && orderDetail.user_phone || '')}
      > 
        <AtIcon value='map-pin' size='15' color='#828E99' />
        <View className={`${prefix}-user-text`}>
          {`买家: ${orderDetail && orderDetail.userinfo && orderDetail.userinfo.nickName || ''}  ${orderDetail && orderDetail.user_phone || ''}`}
        </View>
        <View className={`${prefix}-user-bottom`} />
      </View>
    );
  }

  setItem () {
    const { orderDetail: order } = this.props;
    return (
      <BaseItem
        title={order && order.productinfo && order.productinfo.title || ''}
        subTitle={order && order.productinfo && order.productinfo.description || ''}
        pad
        type='images'
        contentMater={numeral(order.pay_amount || 0).format('0.00')}
        images={order && order.productinfo && order.productinfo.pics || [defaultImage]}
      />
    );
  }

  renderFooter () {
    const { orderDetail } = this.props;
    if (orderDetail.status === 0) {
      return (
        <Footer 
          button='交易完成'
          buttonClick={() => this.confirm()}
        />
      )
    }
    return <View />
  }

  setOrder () {
    const { orderDetail } = this.props;
    const items = [{
      key: '订单号',
      title: `${orderDetail.order_no || ''}`
    }, {
      key: '订单金额',
      title: `${orderDetail.pay_amount || ''}`
    }, {
      key: '下单时间',
      title: `${dayJs(orderDetail.create_time || '').format('YYYY-MM-DD HH:mm:ss')}`
    }, {
      key: '卖家姓名',
      title: `${orderDetail && orderDetail.sellerinfo && orderDetail.sellerinfo.nickName || ''}`,
    }, {
      key: '卖家联系方式',
      title: `${orderDetail && orderDetail.productinfo && orderDetail.productinfo.phone || ''}`,
    }];
    return (
      <View className={`${prefix}-order`}>
        {items.map((item) => {
          return (
            <View
              className={`${prefix}-order-item`}
              key={item.key}
              onClick={() => {
                if (item.key === '卖家联系方式') {
                  this.onPhone(orderDetail && orderDetail.user_phone || '');
                }
              }}
            >
              <View>{item.key}</View>
              <View>{item.title}</View>
            </View>
          )
        })}
      </View>
    );
  }

  render () {
    const { loading } = this.state;
    const { orderDetail } = this.props;
    const token = isSeller(orderDetail);
    return (
      <View className='container container-color'>
        {!!loading
        ? (
          <AtActivityIndicator mode='center' size='large' />
        ) 
        : (
          <View className='container'>
            {this.setStatus()}
            {this.setUser()}
            {this.setItem()}
            {this.setOrder()}
            
          </View>
        )}
        {this.renderFooter()}
      </View>
      
    );
  }
}

const select = (state) => ({
  orderDetail: state.product.orderDetail
});

export default connect(select)(OrderDetail);