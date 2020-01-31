import Taro from '@tarojs/taro';
import invariant from 'invariant';
import { View, Image } from '@tarojs/components';
import numeral from 'numeral';
import dayJs from 'dayjs';
import { connect } from '@tarojs/redux';
import productAction from '../../actions/product';
import { ResponseCode } from '../../common/request/config';
import BaseItem from '../../component/item/BaseItem';
import { defaultImage } from '../../common/util/common';
import MyRow from '../../component/row/index';
import "./index.less";
import loginManager from '../../common/util/login.manager';

const prefix = 'product';

class ProductDetail extends Taro.Component {

  defaultProps = {
    productDetail: {}
  }

  state = {
    userinfo: {}
  }

  config = {
    navigationBarTitleText: '宝贝详情'
  }

  componentDidShow () {
    this.init();
  }

  async init () {
    try {
      const { id } = this.$router.params;  
      invariant(!!id, '请传入商品id');
      this.fetchData(id);
      const userinfo = loginManager.getUserinfo();
      if (userinfo.success) {
        this.setState({ userinfo: userinfo.result });
      }

    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  async onItemClick (item) {
    const { userinfo } = this.state;
    const { productDetail } = this.props;
    if (!userinfo.user_id) {
      Taro.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000
      });
      setTimeout(() => {
        Taro.navigateTo({
          url: '/pages/sign/login'
        });
      }, 1000);
      return;
    }
    try {
      if (item.key === 2) {
        
        if (productDetail && productDetail.collect && productDetail.collect.collect) {
          //取消收藏
          const result = await productAction.collectCancel({id: productDetail.collect.id});
          invariant(result.code === ResponseCode.success, result.msg || ' ');
          Taro.showToast({title: '取消收藏'});
          setTimeout(() => {
            this.fetchData(productDetail.id);  
          }, 1000);
          return;
        }
        // 收藏
        const result = await productAction.collectAdd({user_id: userinfo.user_id, item_id: productDetail.id});
        invariant(result.code === ResponseCode.success, result.msg || ' ');
        Taro.showToast({title: '收藏成功！'});
        setTimeout(() => {
          this.fetchData(productDetail.id);
        }, 1000);
        return;
      }
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  async fetchData (id) {
    try {
      Taro.showLoading();
      const result = await productAction.productDetail({id});  
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      Taro.hideLoading();
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  setSeller () {
    const { productDetail } = this.props;
    return (
      <BaseItem
        avator={defaultImage}
        title={productDetail && productDetail.userinfo && productDetail.userinfo.username}
        subTitle={`${dayJs(productDetail.create_time || '').format('YYYY.MM.DD')} 发布`}
        mater={numeral(productDetail.amount).format('0.00')}
        isRenderContent={false}
      />
    );
  }

  setArticle () {
    const { productDetail } = this.props;
    return (
      <View className='at-article'>
        <View className='at-article__h1'>
          {productDetail.title}
        </View>
        <View className='at-article__content'>
          <View className='at-article__section'>
            <View className='at-article__p'>
              {productDetail.description}
            </View>
            {productDetail.pics && productDetail.pics.map((pic, index) => {
              return (
                <Image
                  key={`p${index}`} 
                  className='at-article__img' 
                  src={pic} 
                  mode='widthFix'
                />
              )
            })}
            <View className='at-article__p'>
              这是文本段落。这是文本段落。这是文本段落。这是文本段落。这是文本段落。这是文本段落。这是文本段落。这是文本落。这是文本段落。1234567890123456789012345678901234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ
            </View>
            <View className='at-article__p'>
              这是文本段落。这是文本段落。
            </View>
            <Image 
              className='at-article__img' 
              src='https://jdc.jd.com/img/400x400' 
              mode='widthFix'
            />
          </View>
        </View>
      </View>
    );
  }

  setMessage () {
    return (
      <View>
        empty
      </View>
    );
  }

  setFooter () {
    const { productDetail } = this.props;
    const items = [
      {key: 1, title: '留言', icon: ''},
      {key: 2, title: productDetail && productDetail.collect && productDetail.collect.collect ? '取消收藏' : '收藏', icon: ''},
    ];
    return (
      <View className={`${prefix}-footer`}>
        <View className={`${prefix}-footer-content`}>
          {
            items.map((item) => {
              return (
                <View
                  key={item.key}
                  className={`${prefix}-footer-content-item`}
                  onClick={() => this.onItemClick(item)}
                >
                  <Image 
                    src={defaultImage}
                    className={`${prefix}-footer-content-item-icon`}
                  />  
                  <View className={`${prefix}-footer-content-item-title`}>{item.title}</View>
                </View>
              )
            })
          }
          <View className={`${prefix}-footer-content-right`}>
            <View
              type='primary'
              className={`${prefix}-footer-button`}
            >
              我想要
            </View>
          </View>
        </View>
      </View>
    );
  }

  render () {
    return (
      <View className={`${prefix}`}>
        {this.setSeller()}
        {this.setArticle()}
        <MyRow title='留言板' />
        {this.setMessage()}
        {this.setFooter()}
      </View>
    )
  }
}

const select = (state) => {
  return {
    productDetail: state.product.productDetail
  };
}

export default connect(select)(ProductDetail);