import * as React from 'react';
import { default as AntBreadcrumb } from 'antd/lib/breadcrumb'
import Affix from 'antd/lib/affix';
import ItemRow, { IRowItem } from '../ItemsRow';
import { AffixProps } from 'antd';
import './index.scss'
import { getClassName } from '../util';
import { isElectron } from '@/constants';

interface IBreadcrumbProps {
  route?: Array<{ name: string; url?: string, click?: () => void }>;
  customItems?: IRowItem[];
  style?: React.CSSProperties;
  className?: string;
  offsetTop?: number;
}

const classname = (n: string = '') => {
  const cn = 't-breadcrumb'
  return getClassName(cn, n);
};

export default class TBreadcrumb extends React.Component<IBreadcrumbProps, any> {

  static defaultProps = {
    offsetTop: isElectron ? 36 : 0,
  }
  affixRef?: AffixProps;
  item: HTMLElement | null;
  oldPos: number;
  constructor(props: any) {
    super(props);
    this.state = {
      top: 0,
      route: null,
      button: null
    };
    this.item = null;
    this.oldPos = 0;
  }
  private onScroll = () => {
    if (this.affixRef && this.affixRef.updatePosition) {
      this.affixRef && this.affixRef.updatePosition();
    }

  }
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, true);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  getUrl(url: string) {
    let _url = url
    if (url.startsWith('/')) {
      _url = url.slice(1)
    }
    const { mainAppBaseUrl, microAppName } = this.context;
    const _mainAppBaseUrl = mainAppBaseUrl ? `${mainAppBaseUrl}/` : ''
    const _microAppName = microAppName ? `${microAppName}/` : ''
    return `${_mainAppBaseUrl}${_microAppName}${_url}`
  }

  render() {
    return (
      <div className={`${classname()} ${this.props.className || ''}`} style={this.props.style}>
        <Affix ref={(r) => { this.affixRef = r; }} offsetTop={this.props.offsetTop || 0}>
          <div className={`${classname('container')} ${this.state.fixed ? classname('container-fixed') : ''}`}>
            <AntBreadcrumb className={classname('inner-breadcrumb')} style={{ fontSize: '18px' }}>
              {
                this.props.route && this.props.route.map((v) => {
                  return v.url
                    ? (
                      <AntBreadcrumb.Item key={v.url}>
                        <a href={`#/${this.getUrl(v.url)}`}>{v.name}</a>
                      </AntBreadcrumb.Item>
                    )
                    : <AntBreadcrumb.Item key={v.name} className={v.click ? classname('click') : ''} onClick={v.click}>{v.name}</AntBreadcrumb.Item>
                })
              }
            </AntBreadcrumb>
            <div className={classname('custom-item-wrapper')}>
              <ItemRow items={this.props.customItems} />
            </div>
          </div>
        </Affix>
      </div>
    );
  }
}
