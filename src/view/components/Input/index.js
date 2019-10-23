import React, { useState, Component } from 'react';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import * as R from 'ramda';

import './index.scss';

const prefix = x => <Icon type={x} style={{ color: 'rgba(0,0,0,.25)' }} />;

const prefixN2 = R.curry((a, b) => <Icon type={a} style={b} />);

const input = R.curry((fn, a, b, c, d) => <Input type={a} placeholder={b} prefix={fn(c)} {...d} />);

export const TextInput = input(prefix)('text', '请输入文字', 'user');

export const PwdInput = input(prefix)('password', '请输入密码', 'lock');