import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import "./index.less";

const prefix = 'component-menu';

class Menu extends Taro.Component {
  render () {
    const { menus, title, onClick } = this.props;
    return (
      <View className={`${prefix}-container`}>
        {title && (
          <View className={`${prefix}-title`}>{title}</View>
        )}
        <View className={`${prefix}`}>
          {
            menus && menus.length > 0 && menus.slice(0, 8).map((type) => {
              return (
                <View
                  key={type.id}
                  className={`${prefix}-item`}
                  onClick={() => onClick(type)}
                >
                  <View 
                    className={`${prefix}-icon`}
                    style={`background-image: url(${type.icon})`}
                  />
                  {/* <AtIcon value='sketch' size='30' color='#666666' /> */}
                  <View className={`${prefix}-item-text`}>{type.name}</View>
                </View>
              );
            })
          }
        </View>
      </View>
    );
  }
}

export default Menu;