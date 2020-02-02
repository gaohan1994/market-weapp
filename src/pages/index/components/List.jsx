
import Taro from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import "./index.less";
import Product from '../../../component/product';
import ListEmty from '../../../component/list/empty';
import ListNoMore from '../../../component/list/noMore';

const prefix = 'index-component-list';

class List extends Taro.Component {

  render () {
    const { productList, productListTotal } = this.props;
    return (
      <ScrollView
        className={`${prefix} container-color`}
        scrollY
      >
        {productList.length === 0 && (
          <ListEmty />
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
          <ListNoMore />
        )}
      </ScrollView>
    )
  }
}

export default List;