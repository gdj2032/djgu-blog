import React, { ReactNode } from 'react';
import { getFieldsByPath } from '@tmind/utils'
import { default as AntSelect, SelectProps, OptionProps } from 'antd/lib/select';
import Spin from 'antd/lib/spin'
import './index.scss'
import { getClassName } from '../util';

const classname = (n: string = '') => {
  const cn = 't-select'
  return getClassName(cn, n);
};

export type SelectGetPropFunc<T = any> = (item: T) => OptionProps;
export type SelectGetDataFunc<T = any> = (offset: number, pageSize?: number, keyword?: string) => T[] | Promise<T[]>;
export type SelectCompolexOption<T = any> = { datasource: T[] | SelectGetDataFunc<T>; id?: string; name?: string; props?: SelectGetPropFunc<T> };
export type SelectSearchType = boolean | 'children' | 'value' | 'async';
export type SelectLoadMoreParam = boolean | { loadMoreTitle?: ReactNode; pageSize?: number };

export interface ISelectOption<T = any> {
  id?: string | number;
  name?: string | number;
  disabled?: boolean;
  /**
   * Select的其他属性
   */
  props?: OptionProps | SelectGetPropFunc<T>;
}

// @ts-ignore
export interface ISelectProp<T = any> extends SelectProps<any> {
  /**
   * 下拉数据
   */
  options: Array<ISelectOption<T>> | SelectCompolexOption<T>;
  /**
   * 如果设置，不为undefined , 则显示‘全部', 且key=设置的值
   */
  optionAll?: boolean | string | number | undefined | null | { name: string; value: string | number | undefined };
  /**
   * props.showSearch 的語法糖
   * false(默認)：不search
   * true/children: showSearch=true && optionFilterProps = 'children'
   * value: showSearch=true && optionFilterProps = 'value'
   * 'async': showSearch=true && filterOption=false
   */
  search?: SelectSearchType;
  /**
   * loadMoreTitle: 加载更多的标题，如果是一个ReactElement, 需要自己显示loading图标
   * pageSize: 每次加载的条目数，默认50
   */
  loadMore?: SelectLoadMoreParam;
}

declare type LoadingStatus = 'loadingMore' | 'Searching' | boolean;
export interface ISelectState<T = any> {
  data: Array<ISelectOption<T>>;
  loading: LoadingStatus;
  hasMore: boolean;
  loadFunc?: SelectGetDataFunc<T>;
  keyword?: string;
}

const DEFAULT_LOADMORE_PAGESIZE = 50;

export default class SelectEx<T = any> extends React.Component<ISelectProp<T>, ISelectState<T>> {
  static Option = AntSelect.Option;

  state: ISelectState<T> = { keyword: undefined, loading: false, hasMore: false, ...this.updateDataFromProp(this.props, []) };
  lastRequestId = 1;
  searchTimer: any = undefined;

  private getOptionsArray(options?: Array<ISelectOption<T>> | SelectCompolexOption<T>): Array<ISelectOption<T>> {
    if (Array.isArray(options)) {
      return options;
    } else if (typeof options === 'object') {
      if (!options.datasource || !Array.isArray(options.datasource)) {
        throw new Error('option 未配置datasource');
      }
      const namePath = options.name || 'name';
      const idPath = options.id || 'id';
      return options.datasource.map((data: any) => {
        return {
          id: getFieldsByPath(data, idPath),
          name: getFieldsByPath(data, namePath),
          disabled: data.disabled,
          props: () => { return options.props ? options.props(data) : null },
        }
      });

    } else {
      return [];
    }
  }

  private getOptionProps: (data: T, props: any) => { [key: string]: any } = (data, props) => {
    if (!props) {
      return {};
    }

    if (typeof props === 'function') {
      props = props(data);
    }
    return props || {};
  }

  private onSearch: (keyword: string) => void = (keyword) => {
    // //先使前一次搜索无效
    this.lastRequestId += 1;
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = undefined;
    }
    this.searchTimer = setTimeout(() => {
      if (keyword === this.state.keyword) {
        return;
      }
      this.setState({ keyword, data: [] }, () => {
        this.loadMore(true);
      })
    }, 400);
  }

  private loadMore(isSearch: boolean) {
    if (Array.isArray(this.props.options)) {
      return;
    }
    const datasource = this.props.options.datasource;
    if (Array.isArray(datasource) || !datasource) {
      return;
    }

    if (!isSearch && this.state.loading) {
      // 正在加载更多
      return;
    }
    this.lastRequestId += 1;
    const requestId = this.lastRequestId;
    let pageSize = DEFAULT_LOADMORE_PAGESIZE;
    if (typeof this.props.loadMore === 'object') {
      pageSize = this.props.loadMore.pageSize || DEFAULT_LOADMORE_PAGESIZE;
    }

    const ret = datasource(this.state.data.length, pageSize, this.state.keyword);
    const updateDataSource: (data: T[]) => void = (data) => {
      data = data || [];
      if (!Array.isArray(this.props.options)) {
        const options: SelectCompolexOption<T> = { ...this.props.options, datasource: data };
        let newData = this.getOptionsArray(options);
        const hasMore = data.length >= pageSize && !!this.props.loadMore;
        if (!isSearch) {
          newData = this.state.data.concat(newData);
        }
        this.setState({ loading: false, data: newData, hasMore });
      }
    }
    if (ret instanceof Promise) {
      this.setState({ loading: isSearch ? 'Searching' : 'loadingMore' }, () => {
        ret.then(data => {
          if (this.lastRequestId === requestId) {
            updateDataSource(data);
          }
        }).catch(() => {
          this.setState({ loading: false });
        })
      });
    } else {
      updateDataSource(ret);
    }
  }

  private onPopupScroll: (event: React.UIEvent<HTMLDivElement>) => void = (e) => {
    const ul = e.currentTarget.getElementsByTagName('div')[0];
    const clientHeight = ul.clientHeight;
    const scrollHeight = ul.scrollHeight;
    const lastChildHeight = ul.children[ul.children.length - 1].clientHeight
    const scrollTop = ul.scrollTop;
    // console.log(clientHeight, scrollHeight, lastChildHeight, scrollTop);
    if (scrollTop + clientHeight >= scrollHeight - lastChildHeight && this.state.hasMore) {
      this.loadMore(false);
    }
  }

  private updateDataFromProp(props: ISelectProp, curData: Array<ISelectOption<T>>) {
    let data: Array<ISelectOption<T>> = curData || [];
    let loadFunc: SelectGetDataFunc<T> | undefined;
    if (!props.options) {
      return { data: curData, loadFunc };
    }
    if (Array.isArray(props.options)) {
      data = props.options;
    } else if (Array.isArray(props.options.datasource)) {
      data = this.getOptionsArray(props.options);
    } else {
      loadFunc = props.options.datasource;
    }
    return { data, loadFunc };
  }

  componentDidMount() {
    //首次进入，如果没有数据且loadFunc有，则使用pageSize加载一次
    if (this.state.data.length === 0 && this.state.loadFunc) {
      this.loadMore(true);
    }
  }
  componentWillReceiveProps(nextprops: ISelectProp) {
    const ret = this.updateDataFromProp(nextprops, this.state.data);
    this.setState(ret)
  }
  private getLoadMoreTitle() {
    let loadingTitle: ReactNode = '正在加载...';
    if (typeof this.props.loadMore === 'object') {
      if ('loadMoreTitle' in this.props.loadMore) {
        loadingTitle = this.props.loadMore.loadMoreTitle || '';
      }
    }
    if (typeof loadingTitle === 'string') {
      loadingTitle = (
        <div className={classname('loadmore-wrapper')}>
          <Spin className={classname('loadmore-spin')} />
          <span className={classname('loadmore-title')}>{loadingTitle}</span>
        </div>
      );
    }
    return loadingTitle;
  }
  private getSearchProps() {
    const { search } = this.props;
    let onSearch: any;
    let filterOption = this.props.filterOption || true;
    let showSearch = false;
    let optionFilterProp: 'children' | 'value' = 'children';
    if (search === true || search === 'children') {
      showSearch = true;
      optionFilterProp = 'children';
    } else if (search === 'value') {
      showSearch = true;
      optionFilterProp = 'value';
    } else if (search === 'async') {
      if (this.props.onSearch) {
        throw new Error('当search 设置为 "async"的时候，不能配置onSearch属性');
      } else if (!this.props.options || (!Array.isArray(this.props.options) && typeof this.props.options.datasource !== 'function')) {
        throw new Error('当search 设置为 "async"的时候，datasource必须是一个函数')
      } else {
        showSearch = true;
        optionFilterProp = 'children';
        filterOption = false;
        onSearch = this.onSearch;
      }
    } else {
      showSearch = false;
    }
    return { onSearch, filterOption, showSearch, optionFilterProp };
  }
  private getAllOption() {
    const { optionAll } = this.props;
    if (optionAll === undefined || optionAll === null || optionAll === false) {
      return null;
    }
    let name = '全部';
    let value: any = optionAll;
    if (optionAll === true) {
      value = undefined;
    }
    if (typeof optionAll === 'object') {
      name = optionAll.name;
      value = optionAll.value;
    }
    return { name, value };
  }
  render() {
    const { options, optionAll, placeholder, loadMore, ...resetProps } = this.props
    const allOpt = this.getAllOption();
    const searchProp = this.getSearchProps();
    return (
      <AntSelect
        {...resetProps}
        {...searchProp}
        onPopupScroll={loadMore ? this.onPopupScroll : undefined}
        placeholder={placeholder || (allOpt ? allOpt.name : '')}
        loading={this.state.loading === 'Searching'}
      >
        {
          allOpt && <AntSelect.Option key={'yuna-all-key'} value={allOpt.value}>{allOpt.name}</AntSelect.Option>
        }
        {
          (this.state.data || []).map((ele: any) => <AntSelect.Option disabled={ele.disabled} key={ele.id} value={ele.id} {...this.getOptionProps(ele, ele.props)}>{ele.name}</AntSelect.Option>)
          // this.getOptionsArray(this.props.options).map((ele: any) => <Select.Option disabled={ele.disabled} key={ele.id} value={ele.id} {...this.getOptionProps(ele, ele.props)}>{ele.name}</Select.Option>)
        }
        {
          this.state.hasMore && (
            <AntSelect.Option disabled key="yuna-select-loading-more" value="more-disable">
              {this.getLoadMoreTitle()}
            </AntSelect.Option>
          )
        }
      </AntSelect>
    )
  }
}
