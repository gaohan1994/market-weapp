import requestHttp from "../../common/request/request.http";

class DonateApi {
  donateAdd = async payload => {
    const result = await requestHttp.post(payload);
    return result;
  };
}

export default new DonateApi();
