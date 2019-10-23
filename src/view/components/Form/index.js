import React, { Children } from 'react';
import Form from 'antd/lib/form';
import * as R from 'ramda';
import { Right, Left } from 'crocks';

import './index.scss';

// 获取属性
const key = R.path(['props', 'id']);

const rule = R.path(['props', 'rules']);

// fields :: (a, b -> (c -> d)) -> a -> b -> c -> Either d c
const fields = R.curry((fn, a, b, c) => a && b ? fn(a, b)(c) : c);

// 表单校验
const submitter = R.curry((f, x) => e => x.validateFields((err, values) => {
  e.preventDefault();
  return !err ? Right(f(values)) : Left(err);
}));

// 封装FormItem组件
const formItem = x => (<Form.Item>{ x }</Form.Item>);

// 封装Form方法
function _Form({
  form,
  children,
  handler,
  ...rest
}) {
  const formValidator = a => Children.map(a, b => fields(R.prop('getFieldDecorator', form))(key(b), rule(b), b));

  const formChilds = R.compose(formItem, formValidator)(children);

  const onSubmit = submitter(handler, form);

  return (
    <Form className="form" onSubmit={onSubmit} {...rest}>
      { formChilds }
    </Form>
  )
}

export default Form.create({ name: 'login' })(_Form);