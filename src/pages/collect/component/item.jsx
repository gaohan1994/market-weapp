
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import numeral from 'numeral';
import dayJs from 'dayjs';
import invariant from 'invariant';
import productAction from '../../../actions/product';
import "./index.less";
import { defaultImage } from '../../../common/util/common';
import loginManager from '../../../common/util/login.manager';
import { ResponseCode } from '../../../common/request/config';
import BaseItem from '../../../component/item/BaseItem';

const prefix = 'collect-component-item';

class Product extends Taro.Component {

  cancelCollect = async () => {
    const userinfo = loginManager.getUserinfo();
    const { collect } = this.props;
    if (userinfo.success && collect) {
      const result = await productAction.collectCancel({
        user_id: userinfo.result.user_id,
        id: collect.id
      });

      invariant(result.code === ResponseCode.success, result.msg || ' ');
      Taro.showToast({
        title: '取消收藏',
        icon: 'none',
        duration: 1000
      });
      setTimeout(() => {
        productAction.collectList({user_id: userinfo.result.user_id, offset: 0});
      }, 1000);
    }
  }

  render () {
    const { collect } = this.props;
    return (
      <BaseItem
        avator={collect && collect.product && collect.product.userinfo && collect.product.userinfo.avator || defaultImage}
        title={collect && collect.product && collect.product.userinfo && collect.product.userinfo.username}
        subTitle={dayJs(collect && collect.product && collect.product.create_time).format('YYYY-MM-DD')}
        mater={numeral(collect && collect.product && collect.product.amount || 0).format('0.00')}
        contentTitle={collect && collect.product && collect.product.title}
        images={collect && collect.product && collect.product.pics.split(',') || [defaultImage]}
        buttons={[
          {title: '取消收藏', onClick: () => {
            Taro.showModal({
              title: '提示',
              content: '确定取消收藏吗',
              success: (result) => {
                if (result.confirm) {
                  this.cancelCollect();
                }
              }
            })
          }}
        ]}
      />
    );
  }
}

export default Product;