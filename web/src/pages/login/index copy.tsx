import { doLogin } from '@/utils';
import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';
// import * as sha1 from 'sha1';
// import { VERSION } from '@/constants';
import './index.scss';
import Setting from '@/utils/setting';

function Login() {
  const onFinish = (values: any) => {
    doLogin({ id: '1', ...values, isLogin: true })
  };

  return (
    <div className="layout-login">
      <div className="login-wrap">
        <div className="login-content">
          {/* <div className="project-name">DEMO</div> */}
          <div className="login-form">
            <div className="login-title">登录</div>
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
                initialValue={Setting.username}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
                initialValue={Setting.password}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>记住密码</Checkbox>
              </Form.Item>

              <Form.Item className="login-btn">
                <Button type="primary" htmlType="submit">
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
          {/* {process.env.NODE_ENV !== 'development' ? <div className="version-number" style={{ fontSize: 10, textAlign: 'right' }}>{`版本号：${VERSION}`}</div> : null} */}
        </div>
      </div>
    </div>
  );
}

export default Login;