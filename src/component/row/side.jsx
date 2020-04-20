import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import classnames from "classnames";
import "./index.less";
import "../../pages/product/index.less";

const prefix = "product";

const orders = [
  {
    title: "最新",
    order: "create_time"
  },
  {
    title: "最热",
    order: "like_count"
  }
];

function RowSide(props) {
  const { fetchData } = props;
  const [order, setOrder] = useState("create_time");
  async function onOrderClick(item) {
    if (item.order === order) {
      return;
    }
    setOrder(item.order);
    fetchData(item.order);
  }
  return (
    <View className='row-component-side'>
      {orders.map(item => {
        const selected = item.order === order;
        return (
          <View
            className={classnames(`${prefix}-field-item`, {
              [`${prefix}-field-item-active`]: selected
            })}
            style='margin-right: 10px'
            key={item.title}
            onClick={() => onOrderClick(item)}
          >
            <View>{item.title}</View>
            <AtIcon
              value='arrow-down'
              color={!!selected ? "#F05065" : "#666666"}
              size={13}
            />
          </View>
        );
      })}
    </View>
  );
}

export default RowSide;
