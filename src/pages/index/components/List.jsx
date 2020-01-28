
import Taro from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtIcon } from 'taro-ui';
import "./index.less";
import Product from '../../../component/product';

const prefix = 'index-component-list';

class List extends Taro.Component {

  render () {
    const { productList, productListTotal } = this.props;
    console.log('productList: ', productList);
    console.log('productListTotal: ', productListTotal);
    return (
      <ScrollView
        className={`${prefix} container-color`}
        scrollY
      >
        {productList.length === 0 && (
          <View>
            empty
          </View>
        )}
        <View className={`${prefix}`}>
          {productList && productList.map((product) => {
            return (
              <View
                key={product.id}
                className={`${prefix}-item`}
              >
                <Product  
                  product={product}
                />
              </View>
              
            );
          })}
        </View>
        
        {productListTotal !== 0 && productListTotal <= productList.length && (
          <View>
            我也是有底线的
          </View>
        )}
      </ScrollView>
    )
  }
}

const select = (state) => ({
  productList: state.product.productList,
  productListTotal: state.product.total,
});

export default connect(select)(List);