import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux';
import invariant from 'invariant';
import { View, Picker } from '@tarojs/components'
import { AtActivityIndicator, AtIcon } from 'taro-ui'
import classnames from 'classnames';
import merge from 'lodash.merge';
import TabsSwitch from './component/tab.switch';
import './index.less'
import '../product/index.less';
import productAction from '../../actions/product';
import TopicAction from '../../actions/topic';
import MyList from '../index/components/List';
import { getTopicList, getTopicListTotal } from '../../reducers/topic';
import { ResponseCode } from '../../common/request/config';
import PublishButton from '../../component/layout/button';
import loginManager from '../../common/util/login.manager';

const fields = [{
  id: 1,
  title: '热度',
  field: {
    order: 'viewing_count',
    by: 'desc'
  }
}, {
  id: 3,
  title: '时间',
  field: {
    order: 'create_time',
    by: 'desc'
  }
}];

const prefix = 'topic';

let offset = 0;

class Page extends Taro.Component {

  state = {
    currentType: undefined,
    currentField: undefined,
    currentIndex: 0,
    loading: false,
  }
  config = {
    navigationBarTitleText: '论坛',
  };
  
  componentDidShow () {
    this.init();
  }

  init = async () => {
    await productAction.topicTypes();
    this.fetchData(0);
  }

  onScrollToLower = async () => {
    this.fetchData();
  }

  fetchData = async (page) => {
    try {
      this.setState({loading: true});
      const { types } = this.props;
      const { currentType, currentField, currentIndex } = this.state;
      const payload = {
        offset: typeof page === 'number' ? page : offset,
        limit: 20,
        ...!!currentType ? {type: currentType.id} : {},
        ...!!currentField ? currentField : {},
        type: types[currentIndex].id
      }
      const result = await TopicAction.topicList(payload);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      this.setState({loading: false});

      if (typeof page === 'number') {
        offset = page;
      } else {
        offset += 20;
      }

    } catch (error) {
      this.setState({loading: false});
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  handleClick = (params) => {
    this.setState({currentIndex: params}, () => {
      this.fetchData(0);
    });
  }


  onPickerCancel = () => {
    this.setState({
      currentType: undefined
    }, () => {
      this.fetchData(0);
    })
  }
  onPickerChange = (e) => {
    const { types } = this.props;
    this.setState({currentType: types[e.detail.value]}, () => {
      this.fetchData(0);
    });
  }

  onFieldClick = (item) => {
    const { currentField } = this.state;
    if (!!currentField && item.id !== 1 && currentField.order === item.field.order) {
      // 切换orderby
      console.log('item: ', item);
      const nextField = merge({}, {
        ...item.field,
        by: currentField.by === 'desc' ? 'asc' : 'desc'
      });
      console.log('nextField: ', nextField);
      this.setState({ currentField: nextField }, () => {
        this.fetchData(0);
      });
      return;
    }

    const nextField = merge({}, item.field);
    this.setState({ currentField: nextField }, () => {
      this.fetchData(0);
    });
    return;
  }

  renderField = () => {
    const { currentType, currentField } = this.state;
    const { types } = this.props;
    const range = types && types.map((item) => {
      return item.name;
    }) || [];
    const prefix = 'product';
    return (
      <View className={`${prefix}-field`}>
        {fields.map((item) => {
          const selected = currentField && item.field.order === currentField.order;
          return (
            <View 
              className={classnames(`${prefix}-field-item`, {
                [`${prefix}-field-item-active`]: !!selected
              })}
              key={item.title}
              onClick={() => this.onFieldClick(item)}
            >
              <View>{item.title}</View>
              {item.id !== 1 && (
                <AtIcon 
                  value={!!selected && currentField.by === 'desc' ? 'arrow-down' : 'arrow-up'}
                  color={!!selected ? '#F05065' :'#666666'}
                  size={13}
                />
              )}
            </View>
          );
        })}
        <Picker
          mode='selector'
          range={range}
          onCancel={this.onPickerCancel}
          onChange={this.onPickerChange}
          className={`${prefix}-field-item`}
          value={types && currentType && types.findIndex(t => t.id === currentType.id) || 0}
        >
          <View 
            className={classnames(`${prefix}-field-item`, {
              [`${prefix}-field-item-active`]: !!currentType
            })}
          >
            {currentType.name || '分类'}
          </View>
        </Picker>
      </View>
    )
  }

  render () {
    const { loading } = this.state;
    const { topicList, topicListTotal, types } = this.props;
    return (
      <View className='container container-color'>
        {/* <Types /> */}
        {!types ? (
          <AtActivityIndicator mode='center' size='large' />
        ) : (
          <View className='container'>
            {this.renderField()}
            <View className={`${prefix}-scrollview`}>
              {!!loading 
              ? (
                <AtActivityIndicator mode='center' size='large' />
              ) 
              : (
                <MyList 
                  type='topic'
                  productList={topicList}
                  productListTotal={topicListTotal}
                  onScrollToLower={this.onScrollToLower}
                />
              )}
            </View>
          </View>
        )}
        <PublishButton
          title='发布'
          onClick={() => {
            const { success } = loginManager.getUserinfo();
            if (!success) {
              Taro.redirectTo({
                url: '/pages/sign/login'
              })
              return;
            }
            Taro.navigateTo({
              url: `/pages/publish/publish.topic`
            })
          }}
        />
      </View>
    )
  }
}

const select = (state) => ({
  topicList: getTopicList(state),
  topicListTotal: getTopicListTotal(state),
  types: state.topic.topicTypes,
});

export default connect(select)(Page);