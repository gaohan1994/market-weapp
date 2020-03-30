/**
 * @todo [商品主页面]
 * @Author: Ghan 
 * @Date: 2020-03-26 13:35:22 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-03-30 16:08:01
 */
import Taro from '@tarojs/taro'
import { AtActivityIndicator, AtIcon } from 'taro-ui';
import { View, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import invariant from 'invariant';
import classnames from 'classnames';
import merge from 'lodash.merge';
import './index.less'
import productAction from '../../actions/product';
import MyList from '../index/components/List';
import { ResponseCode } from '../../common/request/config';
import PublishButton from '../../component/layout/button';
import loginManager from '../../common/util/login.manager';

const fields = [{
  id: 1,
  title: '热度',
  field: {
    order: 'viewing_count',
    by: 'desc'
  }
}, {
  id: 2,
  title: '价格',
  field: {
    order: 'amount',
    by: 'asc'
  }
}, {
  id: 3,
  title: '时间',
  field: {
    order: 'create_time',
    by: 'desc'
  }
}];

const prefix = 'product';
let offset = 0;
class Page extends Taro.Component {

  state = {
    currentType: undefined,
    currentField: undefined,
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
      const { currentType, currentField } = this.state;
      const payload = {
        offset: typeof page === 'number' ? page : offset,
        limit: 20,
        ...!!currentType ? {type: currentType.id} : {},
        ...!!currentField ? currentField : {},
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
    const { currentField } = this.state;
    if (!!currentField && item.id !== 1 && currentField.order === item.field.order) {
      // 切换orderby
      console.log('item: ', item);
      const nextField = merge({}, {
        ...item.field,
        by: currentField.by === 'desc' ? 'asc' : 'desc'
      });
      console.log('nextField: ', nextField);
      this.setState({ currentField: nextField }, () => {
        this.fetchData(0);
      });
      return;
    }

    const nextField = merge({}, item.field);
    this.setState({ currentField: nextField }, () => {
      this.fetchData(0);
    });
    return;
  }

  renderField = () => {
    const { currentType, currentField } = this.state;
    const { types } = this.props;
    const range = types && types.map((item) => {
      return item.name;
    }) || [];
    return (
      <View className={`${prefix}-field`}>
        {fields.map((item) => {
          const selected = currentField && item.field.order === currentField.order;
          return (
            <View 
              className={classnames(`${prefix}-field-item`, {
                [`${prefix}-field-item-active`]: !!selected
              })}
              key={item.title}
              onClick={() => this.onFieldClick(item)}
            >
              <View>{item.title}</View>
              {item.id !== 1 && (
                <AtIcon 
                  value={!!selected && currentField.by === 'desc' ? 'arrow-down' : 'arrow-up'}
                  color={!!selected ? '#F05065' :'#666666'}
                  size={13}
                />
              )}
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
        <View className={`${prefix}-scrollview`}>
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

        <PublishButton
          title='发布'
          onClick={() => {
            const { success } = loginManager.getUserinfo();
            if (!success) {
              Taro.redirectTo({
                url: '/pages/sign/login'
              })
              return;
            }
            Taro.navigateTo({
              url: `/pages/publish/publish`
            })
          }}
        />
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
