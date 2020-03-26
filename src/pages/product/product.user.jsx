/**
 * @todo [商品主页面]
 * @Author: Ghan 
 * @Date: 2020-03-26 13:35:22 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-03-26 15:49:28
 */
import Taro from '@tarojs/taro'
import { AtActivityIndicator } from 'taro-ui';
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import invariant from 'invariant';
import './index.less'
import productAction from '../../actions/product';
import MyList from '../index/components/List';
import { ResponseCode } from '../../common/request/config';
import loginManager from '../../common/util/login.manager';

class Page extends Taro.Component {

  state = {
    loading: false,
  }

  config = {
    navigationBarTitleText: '我的商品'
  }

  componentDidShow () {
    this.init();
  }

  init = async () => {
    this.fetchData(0);
  }

  fetchData = async () => {
    try {
      this.setState({loading: true});
      const userinfo = loginManager.getUserinfo();
      const payload = {
        user_id: userinfo.result.user_id,
      }
      const result = await productAction.productList(payload);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      this.setState({loading: false});

    } catch (error) {
      this.setState({loading: false});
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  render () {
    const { loading } = this.state;
    const { productList, productListTotal } = this.props;
    return (
      <View className='container container-color'>
        {!!loading 
        ? (
          <AtActivityIndicator mode='center' size='large' />
        ) 
        : (
          <MyList 
            productList={productList}
            productListTotal={productListTotal}
          />
        )}
      </View>
    )
  }
}

const select = (state) => ({
  productList: state.product.productUserList,
  productListTotal: state.product.productUserListTotal,
});

export default connect(select)(Page)
