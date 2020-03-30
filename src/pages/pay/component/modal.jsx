import Taro from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import numeral from 'numeral';
import invariant from 'invariant';
import ListRow from '../../../component/row';
import ModalBase from '../../../component/modal/modal';
import productAction from '../../../actions/product';
import { ResponseCode } from '../../../common/request/config';

class ConfirmModal extends Taro.Component {

  defaultProps = {
    onCancel: undefined,
    onConfirm: undefined,
    product: {}
  }

  onCancel () {
    const { onCancel } = this.props;
    onCancel && onCancel();
  }

  async onConfirm () {
    try {
      const { onConfirm } = this.props;

      if (onConfirm) {
        onConfirm();
        this.onCancel();
        return;
      }
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }
  
  setContent () {
    const { product, phone } = this.props;
    return (
      <View>
        <ListRow 
          title='商品名字' 
          extraText={product.title && product.title.length > 5 ? product.title.slice(0, 5) : product.title}
          hasBorder={false} 
        />
        <ListRow 
          title='商品价格' 
          extraText={`￥ ${numeral(product.amount).format('0.00')}`}
          extraTextColor='#FF7332'
          hasBorder={false}
        />
        <ListRow 
          title='联系方式' 
          extraText={phone}
          extraTextColor='#FF7332'
          hasBorder={false}
        />
      </View>
    )
  }

  render () {
    const { isOpened, } = this.props;
    return (
      <ModalBase
        header='提示'
        isOpened={isOpened}
        buttons={[
          {title: '再想想', onClick: () => this.onCancel()},
          {title: '买买买', onClick: () => this.onConfirm()},
        ]}
      >
        {this.setContent()}
      </ModalBase>
    );
  }
}

export default ConfirmModal;