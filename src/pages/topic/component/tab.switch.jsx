import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import classnames from 'classnames';
import './tab.switch.less';

const cssPrefix = 'tabs-switch';


class TabsSwitch extends Taro.Component {

  onTabClick = (tabNum) => {
    const { onChangeTab } = this.props;
    if (onChangeTab) {
      onChangeTab(tabNum);
    }
  }

  render() {
    const { current, tabs } = this.props;
    return (
      <View className={`${cssPrefix}`}>
        {
          tabs && tabs.length && tabs.map((tab, index) => {
            return (
              <View 
                key={`${index}`}
                className={`${cssPrefix}-tab`} style={`width: ${750 / tabs.length}px`}
              >
                <View
                  key={tab.title}
                  className={classnames(`${cssPrefix}-tab-content`, {
                    [`${cssPrefix}-tab-content-active`]: index === current,
                  })}
                  onClick={() => { this.onTabClick(index); }}
                // style={'width: 100px'}
                >
                  {tab.title}
                  {
                    tab.num && tab.num > 0 && (
                      <View className={`${cssPrefix}-tab-badge`}>{tab.num}</View>
                    )
                  }
                </View>
              </View>

            );
          })
        }
      </View>
    )
  }


}

export default TabsSwitch;