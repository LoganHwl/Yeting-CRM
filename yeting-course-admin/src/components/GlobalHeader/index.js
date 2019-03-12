import React, { PureComponent } from 'react';
import { Icon, Divider } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';

@connect(({ login }) => ({
  ...login,
}))
export default class GlobalHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.handleExitClick = this.handleExitClick.bind(this);
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  //退出按钮
  handleExitClick() {
    this.props.dispatch({
      type: 'login/logout',
      payload: {},
    });
  }

  render() {
    const { collapsed, isMobile, logo } = this.props;
    const userName = localStorage.getItem('userName');
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />

        {/* <RightContent {...this.props} /> */}
        <div className={styles.exit_box}>
          <span>
            用户：
            {userName}
          </span>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={this.handleExitClick}>
            退出
          </a>
        </div>
      </div>
    );
  }
}
