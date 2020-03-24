import Taro from '@tarojs/taro';
import invariant from 'invariant';
import { View, Image, Text } from '@tarojs/components';
import numeral from 'numeral';
import dayJs from 'dayjs';
import { connect } from '@tarojs/redux';
import productAction from '../../actions/product';
import { ResponseCode } from '../../common/request/config';
import BaseItem from '../../component/item/BaseItem';
import { defaultImage } from '../../common/util/common';
import "./index.less";
import "../product/index.less";
import FormRow from '../../component/row';
import ConfrimModal from './component/modal';

const prefix = 'pay';

class Cart extends Taro.Component {
  defaultProps = {
    cartProduct: {}
  }

  state = {
    visible: false
  }

  config = {
    navigationBarTitleText: '购买宝贝'
  }

  onBuy = () => {
    this.changeValue(true);
  }

  changeValue (visible) {
    this.setState({visible});
  }

  setFooter () {
    const { cartProduct } = this.props;
    const prefix = 'product';
    return (
      <View className={`${prefix}-footer`}>
        <View className={`${prefix}-footer-content`}>
          <View className={`${prefix}-footer-content-item`}>
            <View className={`${prefix}-footer-content-item-price`}>
              金额 
              <Text style='color: #FF7332'>{numeral(cartProduct.amount).format('0.00')}</Text>
            </View>
          </View>
          <View className={`${prefix}-footer-content-right`}>
            <View
              type='primary'
              className={`${prefix}-footer-button`}
              onClick={() => this.onBuy()}
            >
              确定
            </View>
          </View>
        </View>
      </View>
    );
  }

  render () {
    const { visible } = this.state;
    const { cartProduct } = this.props;
    return (
      <View className='container container-color'>
        <BaseItem
          pad
          type='image'
          avator={cartProduct.userinfo && cartProduct.userinfo.avatarUrl || defaultImage}
          title={cartProduct.userinfo && cartProduct.userinfo.nickName}
          subTitle={dayJs(cartProduct.create_time || '').format('YYYY-MM-DD')}
          contentTitle={`${cartProduct.title} ${cartProduct.description}`}
          contentDetail=' '
          contentMater={`￥ ${numeral(cartProduct.amount || 0).format('0.00')}`}
          image={cartProduct.pics && cartProduct.pics[0] || defaultImage}
        />

        <View className={`${prefix}-rows`}>
          <FormRow
            title='收货地址'
            extraText='福建师范大学仓山校区'
          />
          <FormRow
            title='交易方式'
            extraText='线下交易'
            extraTextColor='#FF7332'
            hasBorder={false}
          />
        </View>

        {this.setFooter()}
        <ConfrimModal
          isOpened={visible}
          onCancel={() => this.changeValue(false)}
          product={cartProduct}
        />
      </View>
    )
  }
}

const select = (state) => ({
  cartProduct: state.product.cartProduct
})

export default connect(select)(Cart);