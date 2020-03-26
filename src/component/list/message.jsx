
import Taro from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import "../../pages/index/index.less"
import MessageList from '../message/message';
import ListEmty from '../list/empty';
import ListNoMore from '../list/noMore';

const prefix = 'index-component-list';

class List extends Taro.Component {

  config = {
    addGlobalClass: true
  }

  render () {
    const { className, onScrollToLower, messageList, messageListTotal, type, showMore = true } = this.props;
    return (
      <ScrollView
        className={`${prefix} container-color`}
        scrollY
        onScrollToLower={onScrollToLower}
      >
        {messageList.length === 0 && (
          <ListEmty />
        )}
        <View className={`${prefix}`}>
          {messageList && messageList.map((product) => {
            return (
              <View
                key={product.id}
                className={`${prefix}-item`}
              >
                <MessageList  
                  type={type}
                  message={product}
                />
              </View>
            );
          })}
        </View>
        
        {!!showMore && messageListTotal !== 0 && messageListTotal <= messageList.length && (
          <ListNoMore />
        )}
      </ScrollView>
    )
  }
}

export default List;