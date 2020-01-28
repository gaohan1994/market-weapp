import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtIcon } from 'taro-ui';
import "./index.less";
import getBaseUrl from '../../../common/request/base.url';

const prefix = 'index-component-menu';

class Menu extends Taro.Component {
  render () {
    const { productTypes } = this.props;
    return (
      <View className={`${prefix}`}>
        {
          productTypes && productTypes.length > 0 && productTypes.slice(0, 8).map((type) => {
            return (
              <View
                key={type.id}
                className={`${prefix}-item`}
              >
                {/* <Image 
                  src={`${getBaseUrl()}/9f5e0210e2622906e36f30d0d14dbdca`}
                  className={`${prefix}-item-image`}
                /> */}
                <AtIcon value='sketch' size='30' color='#666666' />
                <View className={`${prefix}-item-text`}>{type.name}</View>
              </View>
            );
          })
        }
      </View>
    );
  }
}

const select = (state) => {
  return {
    productTypes: state.product.productTypes
  }
}

export default connect(select)(Menu);