import Taro from "@tarojs/taro";
import invariant from "invariant";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import { AtLoadMore, AtActivityIndicator } from "taro-ui";
import dayJs from "dayjs";
import { connect } from "@tarojs/redux";
import productAction from "../../actions/product";
import topicAction from "../../actions/topic";
import { ResponseCode } from "../../common/request/config";
import BaseItem from "../../component/item/BaseItem";
import { defaultImage } from "../../common/util/common";
import MyRow from "../../component/row/index";
import "../product/index.less";
import "./index.less";
import loginManager from "../../common/util/login.manager";
import Comment from "../product/component/comment";
import MessageItem from "../../component/item/MessageItem";
import ListEmpty from "../../component/list/empty";
import Footer from "../../component/layout/footer";

let offset = 0;
const prefix = "product";

class Page extends Taro.Component {
  defaultProps = {
    productDetail: {}
  };

  state = {
    messageLoading: false,
    userinfo: {},
    showComment: false,
    parentMessage: {}
  };

  config = {
    navigationBarTitleText: "帖子详情"
  };

  onShareAppMessage = () => {
    const { productDetail } = this.props;

    return {
      title: productDetail.title,
      path: `/pages/product/topic?id=${productDetail.id}`,
      imageUrl: productDetail.pics[0]
    };
  };

  componentDidShow() {
    this.init();
  }

  showCommentHandle() {
    this.setState({ showComment: true });
  }

  async messageCallback() {
    this.messageList(0);
  }

  hideCommentHandle() {
    this.setState({
      showComment: false,
      parentMessage: {}
    });
  }

  async init() {
    try {
      const { id } = this.$router.params;
      invariant(!!id, "请传入帖子id");
      const userinfo = loginManager.getUserinfo();
      if (userinfo.success) {
        this.setState({ userinfo: userinfo.result });
      }
      this.messageList(0);
      this.fetchData(id);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  }

  async onItemClick(item) {
    const { userinfo } = this.state;
    const { productDetail } = this.props;
    if (!userinfo.user_id) {
      Taro.showToast({
        title: "请先登录",
        icon: "none",
        duration: 1000
      });
      setTimeout(() => {
        Taro.navigateTo({
          url: "/pages/sign/login"
        });
      }, 1000);
      return;
    }
    try {
      if (item.key === 1) {
        this.showCommentHandle();
        return;
      }
      if (item.key === 2) {
        if (
          productDetail &&
          productDetail.collect &&
          productDetail.collect.collect
        ) {
          //取消收藏
          const result = await productAction.collectCancel({
            id: productDetail.collect.id,
            type: 1
          });
          invariant(result.code === ResponseCode.success, result.msg || " ");
          Taro.showToast({ title: "取消收藏" });
          setTimeout(() => {
            this.fetchData(productDetail.id);
          }, 1000);
          return;
        }
        // 收藏
        const result = await productAction.collectAdd({
          user_id: userinfo.user_id,
          item_id: productDetail.id,
          type: 1
        });
        invariant(result.code === ResponseCode.success, result.msg || " ");
        Taro.showToast({ title: "收藏成功！" });
        setTimeout(() => {
          this.fetchData(productDetail.id);
        }, 1000);
        return;
      }
      if (item.key === 3) {
        const payload = {
          item_id: productDetail.id,
          user_id: userinfo.user_id,
          type: 1
        };
        const result = await productAction.fetchItemLike(payload);
        invariant(result.code === ResponseCode.success, result.msg || " ");

        if (productDetail.like && !!productDetail.like.id) {
          Taro.showToast({
            title: "取消点赞",
            icon: "none"
          });
        } else {
          Taro.showToast({
            title: "点赞成功"
          });
        }

        setTimeout(() => {
          this.fetchData(productDetail.id);
        }, 1000);
        return;
      }
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  }

  async fetchData(id) {
    try {
      Taro.showLoading();
      const result = await topicAction.productDetail({ id });
      invariant(result.code === ResponseCode.success, result.msg || " ");
      Taro.hideLoading();
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  }

  async changeOrder(order) {
    this.messageList(0, order);
  }

  async messageList(page, order = "create_time") {
    try {
      const { id } = this.$router.params;
      this.setState({ messageLoading: true });
      const result = await productAction.messageList({
        item_id: id,
        type: 1,
        offset: typeof page === "number" ? page : offset,
        order
      });
      invariant(result.code === ResponseCode.success, result.msg || " ");
      this.setState({ messageLoading: false });
      if (typeof page === "number") {
        offset = page;
      } else {
        offset = offset + 1;
      }
    } catch (error) {
      this.setState({ messageLoading: false });
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  }

  onMessageClick = message => {
    this.setState({
      parentMessage: message,
      showComment: true
    });
  };

  setSeller() {
    const { productDetail } = this.props;
    return (
      <BaseItem
        ableShare
        avator={
          (productDetail &&
            productDetail.userinfo &&
            productDetail.userinfo.avatarUrl) ||
          defaultImage
        }
        title={
          productDetail &&
          productDetail.userinfo &&
          productDetail.userinfo.nickName
        }
        subTitle={`${dayJs(productDetail.create_time || "").format(
          "YYYY.MM.DD"
        )} 发布`}
        isRenderContent={false}
        mater={`${(productDetail && productDetail.like_count) || 0}人喜欢`}
      />
    );
  }

  setArticle() {
    const { productDetail } = this.props;
    const images = productDetail.pics || [];
    return (
      <View className="at-article">
        {images.length > 0 && (
          <Swiper
            className="topic-swiper"
            indicatorColor="#999"
            indicatorActiveColor="#F05065"
            circular
            indicatorDots
            autoplay
          >
            {images.map((pic, index) => {
              return (
                <SwiperItem
                  key={`d${index}`}
                  className="topic-swiper-item"
                  onClick={() => {
                    Taro.previewImage({
                      urls: images,
                      index: index
                    });
                  }}
                >
                  <View
                    className="topic-swiper-image"
                    style={`background-image: url(${pic})`}
                  />
                </SwiperItem>
              );
            })}
          </Swiper>
        )}
        <View className="at-article__h1">{productDetail.title}</View>
        <View className="at-article__content">
          <View className="at-article__section">
            <View className="at-article__p">{productDetail.description}</View>
          </View>
        </View>
      </View>
    );
  }

  setMessage() {
    const { userinfo, showComment, parentMessage } = this.state;
    const { productDetail } = this.props;
    return (
      <Comment
        product={productDetail}
        userinfo={userinfo}
        isOpened={showComment}
        parentMessage={parentMessage}
        onCancel={() => this.hideCommentHandle()}
        callback={() => this.messageCallback()}
        type={1}
      />
    );
  }

  setFooter() {
    const { productDetail } = this.props;
    const items = [
      { key: 1, title: "留言", icon: "message" },
      {
        key: 2,
        title:
          productDetail &&
          productDetail.collect &&
          productDetail.collect.collect
            ? "取消收藏"
            : "收藏",
        icon:
          productDetail &&
          productDetail.collect &&
          productDetail.collect.collect
            ? "heart-2"
            : "heart",
        color:
          productDetail &&
          productDetail.collect &&
          productDetail.collect.collect
            ? "#DF394D"
            : ""
      },
      {
        key: 3,
        title:
          productDetail && productDetail.like && !!productDetail.like.id
            ? "取消点赞"
            : "点赞",
        iconUrl:
          productDetail && productDetail.like && !!productDetail.like.id
            ? "//net.huanmusic.com/market/like.selected.png"
            : "//net.huanmusic.com/market/like.png"
      }
    ];
    return (
      <Footer
        type="topic"
        items={items}
        button="说点什么..."
        buttonClick={() => this.showCommentHandle()}
        onItemClick={item => this.onItemClick(item)}
      />
    );
  }

  render() {
    const { messageLoading } = this.state;
    const { messageList, messageTotal } = this.props;
    const status =
      messageList.length >= messageTotal
        ? "noMore"
        : messageLoading
        ? "loading"
        : "more";
    return (
      <View className={`${prefix}`}>
        {this.setSeller()}
        {this.setArticle()}
        <MyRow
          title="留言板"
          setSide
          sideFetch={order => this.changeOrder(order)}
        />
        <View className={`${prefix}-message`}>
          {messageTotal === 0 && <ListEmpty />}
          {!!messageLoading ? (
            <AtActivityIndicator mode="center" size="large" />
          ) : (
            messageList &&
            messageList.map(item => {
              return (
                <MessageItem
                  key={item.id}
                  message={item}
                  onClick={() => this.onMessageClick(item)}
                />
              );
            })
          )}
          {!messageLoading && messageTotal > 0 && (
            <AtLoadMore
              onClick={() => this.messageList()}
              status={status}
              noMoreText="我也是有底线的"
            />
          )}
        </View>
        {this.setMessage()}
        {this.setFooter()}
      </View>
    );
  }
}

const select = state => {
  return {
    productDetail: state.topic.productDetail,
    messageList: state.topic.messageList,
    messageTotal: state.topic.messageTotal
  };
};

export default connect(select)(Page);
