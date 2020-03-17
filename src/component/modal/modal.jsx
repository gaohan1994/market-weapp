import Taro from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';

class ModalBase extends Taro.Component {

  defaultProps = {
    header: '',
    buttons: []
  }
  
  setContent () {
    return (
      <View>
        {this.props.children}
      </View>
    )
  }

  render () {
    const { header, isOpened, buttons } = this.props;
    return (
      <AtModal
        isOpened={isOpened}
        onCancel={() => this.onCancel()}
      >
        {!!header && (
          <AtModalHeader>{header}</AtModalHeader>
        )}
        <AtModalContent>
          {this.setContent()}
        </AtModalContent>
        {buttons && buttons.length > 0 && (
          <AtModalAction>
            {buttons.map((button) => {
              return (
                <Button 
                  key={button.title}
                  onClick={button.onClick}
                >
                  {button.title}
                </Button>
              )
            })}
          </AtModalAction>
        )}
        
      </AtModal>
    );
  }
}

export default ModalBase;