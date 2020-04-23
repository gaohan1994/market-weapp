import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtTabs, AtTabsPane } from "taro-ui";
import "./index.less";
import api from "./api";
import { ResponseCode } from "../../common/request/config";
import ProductComponent from "../../component/product";
import ListEmpty from "../../component/list/empty";

function DonateList() {
  const [current, setCurrent] = useState(0);
  const [publishList, setPublishList] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const payload = {
      status: current === 0 ? 1 : 2
    };
    api.donateList(payload).then(response => {
      console.log("response: ", response);
      if (response.code === ResponseCode.success) {
        if (current === 0) {
          setPublishList(response.data.rows);
          return;
        }
        setHistoryList(response.data.rows);
      }
    });
  }, [current]);
  async function onChangeTab(index) {
    setCurrent(index);
  }

  const tabList = [
    { title: "我发布的", key: 0, data: publishList },
    { title: "公益历史", key: 1, data: historyList }
  ];
  return (
    <View className="container">
      <AtTabs tabList={tabList} current={current} onClick={onChangeTab}>
        {tabList.map(item => {
          return (
            <AtTabsPane
              current={current}
              index={item.key}
              customStyle="background: #f6f6f6"
            >
              {item.data && item.data.length > 0 ? (
                item.data.map(donate => {
                  return <ProductComponent type="donate" product={donate} />;
                })
              ) : (
                <ListEmpty text="空空如也" />
              )}
            </AtTabsPane>
          );
        })}
      </AtTabs>
    </View>
  );
}

DonateList.config = {
  navigationBarTitleText: "我的公益"
};

export default DonateList;
