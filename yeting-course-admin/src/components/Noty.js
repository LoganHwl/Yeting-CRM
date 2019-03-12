import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { message } from 'antd';

class Noty extends React.Component {
  messageCloseCallback(msgType) {
    message.destroy();

    this.props.dispatch({
      type: 'common/CLEAR_MSG',
      payload: msgType,
    });

    if (this.props.callback) {
      this.props.callback();
    }
  }

  render() {
    const { success, error, info } = this.props;
    return (
      <span>
        {[
          success &&
            success.map(msg =>
              message.success(msg, 2, this.messageCloseCallback.bind(this, 'success'))
            ),
          error &&
            error.map(msg => message.error(msg, 2, this.messageCloseCallback.bind(this, 'error'))),
          info &&
            info.map(msg => message.info(msg, 2, this.messageCloseCallback.bind(this, 'info'))),
        ]}
      </span>
    );
  }
}

Noty.propTypes = {
  success: PropTypes.array,
  error: PropTypes.array,
  info: PropTypes.array,
};

export default connect(({ common }) => ({
  success: common.success,
  error: common.error,
  info: common.info,
}))(Noty);
