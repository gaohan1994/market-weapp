import loginManager from "../../../common/util/login.manager";

function isSeller (order) {
  const user = loginManager.getUserinfo();
  const userinfo = user.result;
  if (order && order.seller_id && Number(order.seller_id) === Number(userinfo.user_id)) {
    return true;
  }
  return false;
}

function c () {

}

export { isSeller, c };