import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import invariant from "invariant";
import classnames from "classnames";
import "../../pages/product/index.less";
import "./style.less";
import { ResponseCode } from "../../common/request/config";
import loginManager from "../../common/util/login.manager";
import productAction from "../../actions/product";

const prefix = "base-item-message";

function LikeItem(props) {
  const { message } = props;
  const [like, setLike] = useState(!!message.like);
  const [likeCount, setLikeCount] = useState(message.like_count);

  async function messageLike(e) {
    try {
      e.stopPropagation();
      setLikeCount(!like ? likeCount + 1 : likeCount - 1);
      setLike(!like);
      const payload = {
        item_id: message.id,
        user_id: loginManager.getUserinfo().result.user_id,
        type: 3
      };
      const result = await productAction.fetchItemLike(payload);
      invariant(result.code === ResponseCode.success, result.msg || " ");
      if (!like) {
        Taro.showToast({ title: "点赞成功" });
      }
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: "none"
      });
    }
  }
  return (
    <View
      className={classnames(`${prefix}-like`, {
        [`${prefix}-like-sub`]: message && message.parent_id !== 0
      })}
      onClick={messageLike}
    >
      <View
        className='product-footer-content-item-icon'
        style={`background-image: url(${
          !!like
            ? "//net.huanmusic.com/market/like.selected.png"
            : "//net.huanmusic.com/market/like.png"
        }); margin: 0px`}
      />
      <View className={`${prefix}-like-text`}>{likeCount}</View>
    </View>
  );
}

export default LikeItem;
