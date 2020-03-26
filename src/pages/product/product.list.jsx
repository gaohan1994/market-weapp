/**
 * @todo [商品主页面]
 * @Author: Ghan 
 * @Date: 2020-03-26 13:35:22 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-03-26 14:58:06
 */
import Taro from '@tarojs/taro'
import { AtActivityIndicator } from 'taro-ui';
import { View, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import invariant from 'invariant';
import classnames from 'classnames';
import './index.less'
import productAction from '../../actions/product';
import MyList from '../index/components/List';
import { ResponseCode } from '../../common/request/config';

const fields = [{
  id: 1,
  title: '热度',
  field: {
    order: 'viewing_count',
    by: 'desc'
  }
}, {
  id: 2,
  title: '价格升序',
  field: {
    order: 'amount',
    by: 'asc'
  }
}, {
  id: 3,
  title: '价格降序',
  field: {
    order: 'amount',
    by: 'desc'
  }
}];

const prefix = 'product';
let offset = 0;
class Page extends Taro.Component {

  state = {
    currentType: undefined,
    fieldId: 1,
    loading: false,
  }

  config = {
    navigationBarTitleText: '二手市场'
  }

  componentDidShow () {
    this.init();
  }

  init = async () => {
    await productAction.productTypes();
    this.fetchData(0);
  }

  fetchData = async (page) => {
    try {
      this.setState({loading: true});
      const { currentType, fieldId } = this.state;
      const payload = {
        offset: typeof page === 'number' ? page : offset,
        limit: 20,
        ...!!currentType ? {type: currentType.id} : {},
        ...fields.find(f => f.id === fieldId).field
      }
      const result = await productAction.productList(payload);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      this.setState({loading: false});

      if (typeof page === 'number') {
        offset = page;
      } else {
        offset += 20;
      }

    } catch (error) {
      this.setState({loading: false});
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  onPickerCancel = () => {
    this.setState({
      currentType: undefined
    }, () => {
      this.fetchData(0);
    })
  }
  onPickerChange = (e) => {
    const { types } = this.props;
    this.setState({currentType: types[e.detail.value]}, () => {
      this.fetchData(0);
    });
  }

  onFieldClick = (item) => {
    if (item.id === 4) {
      // picker
      return;
    }
    this.setState({ fieldId: item.id }, () => {
      this.fetchData(0);
    });
    return;
  }

  renderField = () => {
    const { currentType, fieldId } = this.state;
    const { types } = this.props;
    const range = types && types.map((item) => {
      return item.name;
    }) || [];
    return (
      <View className={`${prefix}-field`}>
        {fields.map((item) => {
          return (
            <View 
              className={classnames(`${prefix}-field-item`, {
                [`${prefix}-field-item-active`]: item.field && item.id === fieldId
              })}
              key={item.title}
              onClick={() => this.onFieldClick(item)}
            >
              {item.title}
            </View>
          );
        })}
        <Picker
          mode='selector'
          range={range}
          onCancel={this.onPickerCancel}
          onChange={this.onPickerChange}
          className={`${prefix}-field-item`}
          value={types && currentType && types.findIndex(t => t.id === currentType.id) || 0}
        >
          <View 
            className={classnames(`${prefix}-field-item`, {
              [`${prefix}-field-item-active`]: !!currentType
            })}
            onClick={() => this.onFieldClick({
              id: 4,
              title: currentType && currentType.name || '分类',
            })}
          >
            {currentType.name || '分类'}
          </View>
        </Picker>
      </View>
    )
  }

  render () {
    const { loading } = this.state;
    const { productList, productListTotal } = this.props;
    return (
      <View className='container container-color'>
        {this.renderField()}
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
  productList: state.product.productList,
  productListTotal: state.product.productListTotal,
  types: state.product.productTypes,
});

export default connect(select)(Page)
