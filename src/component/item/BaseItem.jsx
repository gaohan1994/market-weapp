
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import "./style.less";

const prefix = 'base-item';

class BaseItem extends Taro.Component {

  defaultProps = {
    headerClick: undefined,
    contentClick: undefined,
  }

  renderHeader () {
    const { avator, title, subTitle, mater, headerClick } = this.props;
    return (
      <View 
        className={`${prefix}-header`}
        onClick={headerClick}
      >
        {!!avator && (
          <View 
            className={`${prefix}-header-image`} 
            style={`background-image: url(${avator})`}
          />
        )}
        <View className={`${prefix}-header-user`}>
          <View className={`${prefix}-header-user-name`} >{title}</View>
          {!!subTitle && (
            <View className={`${prefix}-header-user-desc`} >{subTitle}</View>
          )}
        </View>
        {!!mater && (
          <View className={`${prefix}-header-price`}>
            {mater}
          </View>
        )}
      </View>
    );
  }

  renderProduct () {
    const { 
      isRenderContent = true,
      type = 'images',
      images,
      image,
      contentTitle,
      contentDetail,
      contentMater,
      contentClick,
    } = this.props;
    if (isRenderContent) {
      return (
        <View 
          className={`${prefix}-content`}
          onClick={contentClick}
        >
          {type === 'images' && (
            <View className={`${prefix}-content-title`}>{contentTitle}</View>
          )}
          {images && images.length > 0 && (
            <View className={`${prefix}-content-images`}>
              {images.map((pic, index) => {
                return (
                  <View 
                    key={`p-${index}`}
                    className={`${prefix}-content-image`} 
                    style={`background-image: url(${pic})`}
                  />
                );
              })}
            </View>
          )}
          {type === 'image' && (
            <View className={`${prefix}-content-single`}>
              <View className={`${prefix}-content-box`}>
                <View 
                  className={`${prefix}-content-box-image`} 
                  style={`background-image: url(${image})`}
                />
                <View className={`${prefix}-content-box-text`}>{contentTitle}</View>
              </View>
              {contentDetail && (
                <View className={`${prefix}-content-box-detail`}>
                  <View>{contentDetail}</View>
                  {contentMater && (
                    <View className={`${prefix}-content-box-mater`}>{contentMater}</View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      );
    }
    return <View />;
  }

  renderBar () {
    const { buttons } = this.props;
    if (buttons && buttons.length > 0) {
      return (
        <View className={`${prefix}-bar`}>
          {
            buttons && buttons.map((button) => {
              return (
                <View
                  key={button.title}
                  className={`${prefix}-bar-button-dash`}
                  onClick={button.onClick}
                >
                  {button.title}
                </View>
              )
            })
          }
        </View>
      )
    }
    return <View />;
  }

  render () {
    const { pad = false } = this.props;
    return (
      <View 
        className={classNames(`${prefix}`, {
          [`${prefix}-pad`]: pad
        })}
      >
        {this.renderHeader()}
        {this.renderProduct()}
        {this.renderBar()}
      </View>
    )
  }
}

export default BaseItem;