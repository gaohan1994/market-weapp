import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtInput, AtTextarea, AtButton, AtImagePicker } from 'taro-ui';
import invariant from 'invariant';
import './publish.less'
import productAction from '../../actions/product';
import topicAction from '../../actions/topic';
import { ResponseCode } from '../../common/request/config';
import loginManager from '../../common/util/login.manager';
import FormRow from '../../component/row';

const prefix = 'publish';
class Publish extends Component {

  state = {
    title: '',
    description: '',
    typeValue: 0,
    files: [],
  }

  async componentDidShow () {
    const userinfo = await loginManager.getUserinfo();
    productAction.topicTypes();
    if (!userinfo.success) {
      Taro.navigateTo({
        url: '/pages/sign/login'
      });
    }
  }

  config = {
    navigationBarTitleText: '发布帖子'
  }
  handleChange = (key, value) => {
    this.setState(prevState => {
      return {
        ...prevState,
        [key]: value
      };
    });
  }

  onChange (files) {
    this.setState({files})
  }
  onFail (mes) {
    Taro.atMessage({
      'message': `${mes.message}`,
      'type': 'error',
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
      files: [],
    });
  }

  onSubmit = async () => {
    try {
      const { 
        title,
        description,
        typeValue,
        files,
      } = this.state;
      const { productTypes } = this.props;
      invariant(!!title, '请输入帖子标题');
      invariant(!!description, '请输入帖子详情');
      // invariant(files.length > 0, '请上传帖子图片');
      Taro.showLoading({ title: '上传图片中~', mask: true });

      const currentType = productTypes[typeValue];
      let pics = [];
      if (files.length > 0) {
        pics = await productAction.uploadImages(files);
      }

      const userinfo = loginManager.getUserinfo();
      const payload = {
        title,
        description,
        pics: pics,
        user_id: userinfo.result.user_id,
        type: currentType.id
      };
      const result = await topicAction.topicAdd(payload);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      Taro.hideLoading();
      Taro.showToast({ title: '发布帖子成功！', duration: 1000 });
      this.reset();
      setTimeout(() => {
        Taro.redirectTo({
          url: `/pages/topic/topic?id=${result.data.id}`
        });
      }, 1000);
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  renderImages = () => {
    const { files } = this.state;
    return (
      <View className={`${prefix}-images`}>
        <AtImagePicker
          multiple
          maxLength={4}
          files={files}
          onChange={this.onChange.bind(this)}
        />
        {files.length === 0 && (
          <View className={`${prefix}-images-tip`}>快来上传帖子图片吧~</View>
        )}
      </View>
    );
  }

  renderForms = () => {
    const { typeValue } = this.state;
    const { productTypes, productTypesSelector } = this.props;
    return (
      <View>
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
      </View>
    );
  }

  render () {
    return (
      <View className='container container-color'>
        <View style='background-color: #ffffff'>
          <AtInput
            name='value'
            title='帖子标题'
            type='text'
            placeholder='请输入你想分享的的标题'
            value={this.state.title}
            onChange={(value) => this.handleChange('title', value)}
          />  
        </View>
        
        <AtTextarea
          height={400}
          value={this.state.description}
          onChange={({detail: {value}}) => this.handleChange('description', value)}
          placeholderStyle='font-size: 12px; color: #C6C6C6;'
          maxLength={200}
          placeholder='在这里详细描述你想说的话吧...'
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
  const productTypes =  state.topic.topicTypes;
  const productTypesSelector = productTypes.map((type) => type.name);
  return {
    productTypes,
    productTypesSelector,
  };
};

export default connect(select)(Publish);
