import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.less";
import RowSide from "./side";

const prefix = "row-component";

class MyRow extends Taro.Component {
  render() {
    const { title, setSide = false, sideFetch = () => {} } = this.props;
    return (
      <View className={`${prefix}`}>
        <View className={`${prefix}-bge`} />
        <View>{title}</View>
        {!!setSide && <RowSide fetchData={sideFetch} />}
        {this.props.children}
      </View>
    );
  }
}

export default MyRow;
