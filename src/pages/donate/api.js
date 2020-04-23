import requestHttp from "../../common/request/request.http";
import loginManager from "../../common/util/login.manager";
import { jsonToQueryString } from "../../common/util/common";

class DonateApi {
  donateDetail = async params => {
    const userinfo = loginManager.getUserinfo().result;
    const payload = {
      ...params,
      user_id: userinfo.user_id
    };
    const result = await requestHttp.get(
      `/donate/detail${jsonToQueryString(payload)}`
    );
    return result;
  };
  donateList = async params => {
    const userinfo = loginManager.getUserinfo().result;
    const payload = {
      ...params,
      user_id: userinfo.user_id
    };
    const result = await requestHttp.get(
      `/donate/list${jsonToQueryString(payload)}`
    );
    return result;
  };

  donateAdd = async payload => {
    const result = await requestHttp.post("/donate/add", payload);
    return result;
  };
}

export default new DonateApi();
