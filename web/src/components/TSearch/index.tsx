import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { removeNull } from '@tmind/utils';
import { ButtonProps } from 'antd';
import Button from 'antd/lib/button'
import { FormInstance } from 'antd/lib/form';
import React, { Fragment, PureComponent } from 'react';
import TForm, { IFormItem } from '../TForm';
import { getClassName } from '../util';
import './index.scss'

const ENTER_KEY_CODE = 13; // 回车键的值为13

const classname = (n: string = '') => {
  const cn = 't-search'
  return getClassName(cn, n);
};

interface ISearchProps {
  className?: string;
  /**
   * 需要的数据: [ { lable: ...,id: ..., required: ..., type: ..., }, ... ]
   */
  searchItems: IFormItem[];
  /**
   * 搜索按钮 params返回form表单的数据
   */
  onSearch?: (params: any, isReset: boolean) => any;
  /**
   * 搜索项默认展开，不填写默认false
   */
  defaultShowAll?: boolean;
  customButtons?: ButtonProps[]
}

interface ISearchState {
  /**
   * 是否显示全部
   */
  showAll: boolean;
}

interface IKeyObj {
  keyCode: number;
}

export default class TSearch extends PureComponent<ISearchProps, ISearchState> {
  formRef = React.createRef<FormInstance>();
  searchWrap = React.createRef<HTMLDivElement>();

  state: ISearchState = {
    showAll: this.props.defaultShowAll || false,
  }

  componentDidMount() {
    this.searchWrap.current.addEventListener('keydown', this.onEnterKeySearch);
  }

  componentWillUnmount() {
    this.searchWrap.current.removeEventListener('keydown', this.onEnterKeySearch);
  }

  /**
   * 键盘按下事件
   * [IKeyObj] keyObj键盘按下事件对象
   */
  onEnterKeySearch = (keyObj: IKeyObj) => {
    const { keyCode } = keyObj;
    if (keyCode === ENTER_KEY_CODE) {
      // 按下回车键进行搜索
      this.search();
    }
  }

  reset: () => void = () => {
    this.formRef.current!.resetFields();
    this.search(true);
  }

  validateFields = async () => {
    const values = await this.formRef.current!.validateFields()
    return values
  }

  // 设置展开收起状态
  setShowAll: (show?: boolean) => void = (show = false) => {
    this.setState({
      showAll: show
    })
  }

  private search: (isReset?: boolean) => void = (isReset?: boolean) => {
    const { onSearch } = this.props;
    this.formRef.current!.validateFields().then(values => {
      removeNull(values);
      onSearch && onSearch(values, !!isReset);
    })
  }

  private renderSearchButtons() {
    const { customButtons = [], searchItems = [] } = this.props;
    const hasMore = searchItems.length > 2;

    return (
      <div className={classname('btn-wrapper')}>
        {
          customButtons?.length > 0 ?
            <Fragment>
              {
                customButtons.map((e) => (
                  <Button className={classname('btn')} {...e}>{e.children}</Button>
                ))
              }
            </Fragment>
            :
            <Fragment>
              <Button className={classname('btn btn-reset')} onClick={() => this.reset()}>重置</Button>
              <Button className={classname('btn btn-search')} onClick={() => { this.search(); }} type="primary" >搜索</Button>
            </Fragment>
        }
        {
          hasMore && (
            <div className={classname('btn btn-collapse')} onClick={() => { this.setState({ showAll: !this.state.showAll }); }}>
              <span>{this.state.showAll ? '收起' : '展开'}</span>
              {this.state.showAll ? <CaretUpOutlined /> : <CaretDownOutlined />}
            </div>
          )
        }
      </div>
    );
  }

  render() {
    const { showAll } = this.state;
    const { searchItems } = this.props;
    const sItems = searchItems.map((item, idx) => {
      const newItem = { ...item };
      if (searchItems.length > 2 && idx >= 2 && !showAll) {
        newItem.formItemProps = { ...item.formItemProps }
        newItem.formItemProps.style = { ...newItem.formItemProps.style, display: 'none' }
      }

      return newItem;
    });
    const hasMore = searchItems && searchItems.length > 2;

    return (
      <div ref={this.searchWrap} className={`${classname('')} ${showAll ? '' : classname('collapsed')} ${this.props.className || ''}`}>
        <div className={classname('form')}>
          <TForm
            ref={this.formRef}
            formItems={sItems}
            column={3}
          />
          {(!hasMore || (hasMore && !this.state.showAll)) && this.renderSearchButtons()}
        </div>
        {
          (hasMore && this.state.showAll) && (
            < div className={classname('footer')}>
              {this.renderSearchButtons()}
            </div>
          )
        }
      </div>
    )
  }
}
