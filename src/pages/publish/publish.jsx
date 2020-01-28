import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtInput, AtTextarea, AtButton } from 'taro-ui';
import invariant from 'invariant';
import './publish.less'
import productAction from '../../actions/product';
import FormRow from '../../component/row';
import { ResponseCode } from '../../common/request/config';
import loginManager from '../../common/util/login.manager';

const prefix = 'publish';
class Publish extends Component {

  state = {
    title: '',
    description: '',
    typeValue: 0,
    amount: '',
    trans_type: '0',
  }

  async componentDidShow () {
    const userinfo = await loginManager.getUserinfo();
    if (!userinfo.success) {
      Taro.navigateTo({
        url: '/pages/sign/login'
      });
    }
  }

  config = {
    navigationBarTitleText: '发布宝贝'
  }
  handleChange = (key, value) => {
    this.setState(prevState => {
      return {
        ...prevState,
        [key]: value
      };
    });
  }

  changeSelector = (e) => {
    this.setState({typeValue: e.detail.value});
  }

  reset = () => {
    this.setState({
      title: '',
      description: '',
      typeValue: 0,
      amount: '',
      trans_type: '0',
    });
  }

  onSubmit = async () => {
    try {
      const { 
        title,
        description,
        typeValue,
        amount,
        trans_type
      } = this.state;
      const { productTypes } = this.props;
      invariant(!!title, '请输入宝贝标题');
      invariant(!!description, '请输入宝贝详情');
      invariant(!!amount, '请输入宝贝价格');

      const currentType = productTypes[typeValue];

      const userinfo = loginManager.getUserinfo();
      console.log('userinfo: ', userinfo);
      const payload = {
        title,
        description,
        amount,
        type: currentType.id,
        pics: [],
        user_id: userinfo.result.user_id,
        trans_type: Number(trans_type),
      };
      // console.log('payload: ', payload);
      const result = await productAction.productAdd(payload);
      // console.log('result: ', result);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      Taro.showToast({ title: '发布宝贝成功！', duration: 1000 });
      this.reset();
      setTimeout(() => {
        Taro.navigateTo({
          url: '/publish/result'
        });
      }, 1000);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  renderImages = () => {
    return (
      <View className={`${prefix}-images`}>

      </View>
    );
  }

  renderForms = () => {
    const { typeValue, amount, trans_type } = this.state;
    const { productTypes, productTypesSelector } = this.props;
    return (
      <View>
        <FormRow
          title='交易方式'
          buttons={[
            {title: '线下交易', type: trans_type === '0' ? 'confirm' : 'cancel', onPress: () => this.handleChange('trans_type', '0')},
            {title: '邮寄', type: trans_type === '1' ? 'confirm' : 'cancel', onPress: () => this.handleChange('trans_type', '1')},
          ]}
        />
        <Picker
          mode='selector'
          range={productTypesSelector}
          onChange={this.changeSelector}
          value={typeValue}
        >
          <FormRow
            title='分类'
            extraText={productTypes[typeValue] && productTypes[typeValue].name || ''}
            arrow='right'
          />
        </Picker>
        <FormRow
          title='价格'
          isInput
          hasBorder={false}
          inputName='member.name'
          inputValue={amount}
          inputPlaceHolder='请输入宝贝价格'
          inputOnChange={(value) => this.handleChange('amount', value)}
        />
      </View>
    );
  }
  render () {
    return (
      <View className='container container-color'>
        <View style='background-color: #ffffff'>
          <AtInput
            name='value'
            title='宝贝标题'
            type='text'
            placeholder='请输入宝贝标题 品牌型号'
            value={this.state.title}
            onChange={(value) => this.handleChange('title', value)}
          />  
        </View>
        
        <AtTextarea
          height={400}
          value={this.state.description}
          onChange={(event) => this.handleChange('description', event.target.value)}
          placeholderStyle='font-size: 12px; color: #C6C6C6;'
          maxLength={200}
          placeholder='在这里详细描述一下宝贝的转手原因、入手渠道吧...'
        />
        {this.renderImages()}
        {this.renderForms()}
        <AtButton
          className={`${prefix}-button`}
          type='primary'
          circle
          onClick={() => this.onSubmit()}
        >
          确认发布
        </AtButton>
      </View>
    )
  }

}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

const select = (state) => {
  const productTypes =  state.product.productTypes;
  const productTypesSelector = productTypes.map((type) => type.name);
  return {
    productTypes,
    productTypesSelector,
  };
};

export default connect(select)(Publish);
