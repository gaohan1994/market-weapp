
import Taro from '@tarojs/taro';
import numeral from 'numeral';
import invariant from 'invariant';
import { defaultImage } from '../../../common/util/common';
import BaseItem from '../../../component/item/BaseItem';
import productAction from '../../../actions/product';
import { ResponseCode } from '../../../common/request/config';

class OrderItem extends Taro.Component {
  
  cancelOrder = async () => {
    try {
      const { order, userinfo } = this.props;
      const payload = {
        user_id: userinfo.user_id,
        order_no: order.order_no
      };
      const result = await productAction.orderCancel(payload);
      console.log('result: ', result);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      productAction.orderList({offset: 0, user_id: userinfo.user_id});
      Taro.showToast({title: '取消订单', duration: 1000});
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'loading'
      });
    }
  }

  navOrder (order_no) {
    Taro.navigateTo({
      url: `/pages/order/order.detail?order_no=${order_no}`
    })
  }

  setOrderStatus () {
    const { order, userinfo } = this.props;
    /**
     * @param {isSeller} [是否是卖家]
     */
    const isSeller = userinfo.user_id === order.seller_id;
    switch (Number(order.status)) {
      // 状态（0:未支付,1:已完成,2:已支付,3:关闭,4:退货,5:异常,6:拒绝取消订单）
      case 0: {
        return `${isSeller && '买家'}未支付`;
      }
      case 1: {
        return '订单已完成'
      }
      case 2: {
        return `${isSeller && '买家'}已支付`;
      }
      case 3: {
        return '订单已关闭';
      }
      case 4: {
        return '退货';
      }
      case 5: {
        return '订单异常';
      }
      default: {
        return '异常订单';
      }
    }
  }

  render () {
    const { order } = this.props;
    /**
     * @param {isSeller} [是否是卖家]
     */
    const that = this;
    const buttons = order && Number(order.status) === 0 ? [
      {title: '取消订单', onClick: () => {
        console.log('onClick');
        Taro.showModal({
          title: '提示',
          content: '确定取消订单吗',
          success: (result) => {
            if (result.confirm) {
              that.cancelOrder();
            }
          }
        })
      }}
    ] : [];

    return (
      <BaseItem
        title={`订单号：${order.order_no}`}
        headerClick={() => this.navOrder(order.order_no)}
        contentClick={() => this.navOrder(order.order_no)}
        pad
        mater={this.setOrderStatus()} 
        type='image'
        contentTitle={order.product_name}
        contentDetail='共1件商品 合计：'
        contentMater={numeral(order.pay_amount || 0).format('0.00')}
        image={order && order.product_picture || defaultImage}
        buttons={buttons}
      />
    );
  }
}

export default OrderItem;