import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import './index.less'
import Header from './components/Header';
import MySwiper from './components/Swiper';
// import Menu from '../../component/menu/Menu';
import ProductAction from '../../actions/product';
import TopicAction from '../../actions/topic';
import MyList from './components/List';
import Publish from './components/Publish';
import SectionHeader from '../../component/layout/section';
import weixin from '../../common/weixin/weixin';

let offset = 0;

class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentDidShow () {
    weixin.getWeixinCode();
    offset = 0;
    ProductAction.productListRandom();
    ProductAction.productTypes();
    TopicAction.topicHomeList();
    setTimeout(() => {
      ProductAction.productHomeList({offset});  
    }, 1000);
  }

  onSwiperClick (item) {
    Taro.navigateTo({
      url: `/pages/product/product?id=${item.id}`
    });
  }

  render () {
    const { productList, productRandom, topicHomeList } = this.props;
    const images = productRandom && productRandom.length > 0
      ? productRandom.map((item) => {
        return {
          id: item.id,
          pic: item.pics[0]
        };
      })
      : [];
    return (
      <View className='index container container-color'>
        <ScrollView
          scrollY
          className='index-list'
        >
          <View className='index-bg'>
            <View className='index-color' />
            <View className='index-pos'>
              <Header />
              <MySwiper  
                images={images}
                onClick={this.onSwiperClick}
              />  
            </View>
          </View>
          {/* <SectionHeader
            title='每日更新'
            showMore={false}
          /> */}
          <Publish />

          <SectionHeader
            title='跳蚤市场'
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/product/product.list`
              })
            }}
          />
          <MyList 
            productList={productList.length > 4 ? productList.slice(0, 4) : productList}
            showMore={false}
          />

          <View style='width: 100%; height: 100px;' />
        </ScrollView>
        
      </View>
    )
  }
}

const select = (state) => ({
  menus: state.product.productTypes,
  productList: state.product.productList,
  productListTotal: state.product.productListTotal,
  productRandom: state.product.productRandom,
  topicHomeList: state.topic.topicHomeList,
});

export default connect(select)(Index)
