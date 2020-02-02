import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { AtSearchBar, AtMessage } from 'taro-ui'
import invariant from 'invariant';
import './index.less'
import ProductAction from '../../actions/product';
import { ResponseCode } from '../../common/request/config';
import MyList from '../index/components/List';

class Search extends Component {

  state = {
    value: ''
  }

  componentDidShow () {
    ProductAction.productSearchEmpty();
    this.setState({ value: '' });
  }

  onChange (value) {
    this.setState({
      value: value
    })
  }

  async onActionClick () {
    try {
      const { value } = this.state; 
      invariant(!!value, '请输入要搜索的内容');
      Taro.showLoading();

      const result = await ProductAction.productSearch({word: value});
      Taro.hideLoading();
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      if (result.data.length > 0) {
        Taro.atMessage({
          'message': `成功找到${result.data.length}条宝贝`,
          'type': 'success',
        });
      }
      
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  render () {
    const { value } = this.state;
    const { searchList } = this.props;
    return (
      <View className='container container-color'>
        <AtMessage />
        <AtSearchBar
          placeholder='请输入要搜索的宝贝名称~'
          actionName='搜一下'
          value={value}
          onChange={this.onChange.bind(this)}
          onActionClick={this.onActionClick.bind(this)}
        />
        <MyList
          productList={searchList}
          productListTotal={searchList && searchList.length || 0}
        />
      </View>
    )
  }
}

const select = (state) => ({
  searchList: state.product.searchList,
});

export default connect(select)(Search);