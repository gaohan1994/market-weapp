/**
 * @Author: Ghan 
 * @Date: 2019-11-05 14:41:35 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-01-28 20:45:45
 * 
 * @todo [fockedTaroUiListItem,增加以及修改了一些属性]
 */
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import classnames from 'classnames';
import { AtInput } from 'taro-ui';
import './style.sass';
import './form.card.less';

class FormRow extends Taro.Component {

  static defaultProps = {
    main: false,
    note: '',
    disabled: false,
    title: '',
    thumb: '',
    hasBorder: true,
    extraText: '',
    extraThumb: '',
    extraTextStyle: 'black',
    infoColor: '333333',
    extraTextBold: '',
    iconInfo: {},
    onClick: () => {/** */},
    extraThumbClick: () => {/** */},
    buttons: [],
    isInput: false,
    maxInput: false,
    inputValue: '',
    inputName: 'form.row.name',
    inputPlaceHolder: '',
    extraTextColor: undefined,
    extraTextSize: undefined,
    inputType: 'text',
    inputOnChange: () => { /** */ },
  };

  render () {
    let {
      main,
      extraText,
      title,
      note,
      thumb,
      disabled,
      hasBorder,
      arrow,
      extraThumb,
      extraTextStyle,
      extraTextBold,
      extraThumbClick,
      buttons,
      onClick,
      infoColor,
      isInput,
      inputType,
      maxInput,
      inputName,
      inputValue,
      inputPlaceHolder,
      inputOnChange,
      extraTextColor,
      inputCursorSpacing,
      extraTextSize,
      children,
    } = this.props;

    const rootClass = classnames(
      'at-list__item',
      {
        'at-list__item--thumb': thumb,
        'at-list__item--multiple': note,
        'at-list__item--disabled': disabled,
        'at-list__item--no-border': !hasBorder
      },
      this.props.className
    );

    extraText = String(extraText);
    title = String(title);
    return (
      <View className={rootClass} onClick={onClick}>
        <View className='at-list__item-container'>
          {thumb && (
            <View className='at-list__item-thumb item-thumb'>
              <Image
                className='item-thumb__info'
                mode='scaleToFill'
                src={thumb}
              />
            </View>
          )}

          <View className='at-list__item-content item-content'>
            <View className='item-content__info'>
              {main && <View className='item-content__info-icon'>*</View>}
              <View 
                className={classnames('item-content__info-title', `component-form-info-${infoColor}`)}
              >
                {title}
              </View>
              {note && <View className='item-content__info-note'>{note}</View>}
            </View>
          </View>

          <View className='at-list__item-extra item-extra component-list-row-extra'>
            {extraText && (
              <View 
                className={classnames(
                  `component-form-${extraTextStyle}`, {
                  'component-form-bold': extraTextBold === 'bold',
                  [`component-form-size-${extraTextSize}`]: !!extraTextSize,
                })}
                style={`${!!extraTextColor ? `color: ${extraTextColor};` : ''}`}
              >
                {extraText}
              </View>
            )}

            {isInput === true && (
              <View 
                className={classnames({
                  ["component-form-input"]: buttons && buttons.length > 0,
                  ['component-form-input-max']: maxInput,
                })}
              >
                <AtInput 
                  className={classnames('component-list-row-input')}
                  name={inputName || 'form.row.name'}
                  value={inputValue} 
                  onChange={inputOnChange}
                  type={inputType}
                  placeholder={inputPlaceHolder}
                  border={false}
                  cursorSpacing={inputCursorSpacing}
                  placeholderClass='component-list-placeholder'
                  placeholderStyle='color: #cccccc;'
                />
              </View>
            )}

            {buttons && buttons.length > 0 && (
              <View className='component-form-buttons'>
                {buttons.map((button) => {
                  return (
                    <View
                      key={button.title}
                      onClick={button.onPress}
                      className={classnames(
                        'component-form-button', 
                        {
                          'component-form-button-confirm': button.type !== 'cancel' ? true : false,
                          'component-form-button-cancel': button.type === 'cancel' ? true : false,
                        }
                      )}
                    >
                      {button.title}
                    </View>
                  );
                })}
              </View>
            )}

            {children}
            
            {extraThumb && (
              <View className='item-extra__image' onClick={extraThumbClick}>
                <Image
                  className='item-extra__image-info'
                  mode='aspectFit'
                  src={extraThumb}
                />
              </View>
            )}

            {arrow ? (
              <Image 
                src='//net.huanmusic.com/weapp/icon_commodity_into.png' 
                className='component-form-arrow'
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

export default FormRow;