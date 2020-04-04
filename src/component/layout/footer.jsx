import Taro from '@tarojs/taro'
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui'
import '../../pages/product/index.less';

const prefix = 'product';

class Page extends Taro.Component {
  render () {
    const { onItemClick, items = [], button, buttonClick, type } = this.props;

    if (type === 'topic') {
      return (
        <View className={`${prefix}-footer`}>
          <View className={`${prefix}-footer-content`}>

            <View 
              className={`${prefix}-footer-topic`}
              onClick={buttonClick}
            >
              <AtIcon
                value='edit'
                size='15'
                color='#666666'
              />
              <View className={`${prefix}-footer-topic-text`}>{button}</View>
            </View>

            <View className={`${prefix}-footer-content-right`}>
              {
                items.map((item) => {
                  return (
                    <View
                      key={item.key}
                      className={`${prefix}-footer-content-item`}
                      onClick={() => onItemClick(item)}
                    >
                      {!!item.iconUrl ? (
                        <View 
                          className={`${prefix}-footer-content-item-icon`}
                          style={`background-image: url(${item.iconUrl})`}
                        />
                      ) : (
                        <AtIcon 
                          value={item.icon}
                          size={15}
                          color={item.color || '#666666'}
                        />
                      )}
                        
                      <View className={`${prefix}-footer-content-item-title`}>{item.title}</View>
                    </View>
                  )
                })
              }
            </View>
          </View>
        </View>
      )
    }

    return (
      <View className={`${prefix}-footer`}>
        <View className={`${prefix}-footer-content`}>
          {
            items.map((item) => {
              return (
                <View
                  key={item.key}
                  className={`${prefix}-footer-content-item`}
                  onClick={() => onItemClick(item)}
                >
                  {!!item.iconUrl ? (
                    <View 
                      className={`${prefix}-footer-content-item-icon`}
                      style={`background-image: url(${item.iconUrl})`}
                    />
                  ) : (
                    <AtIcon 
                      value={item.icon}
                      size={15}
                      color={item.color || '#666666'}
                    />
                  )}
                  <View className={`${prefix}-footer-content-item-title`}>{item.title}</View>
                </View>
              )
            })
          }
          {!!button && (
            <View className={`${prefix}-footer-content-right`}>
              <View
                type='primary'
                className={`${prefix}-footer-button`}
                onClick={buttonClick}
              >
                {button}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default Page;