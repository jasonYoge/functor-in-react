import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Checkbox from 'antd/lib/checkbox';
import Button from 'antd/lib/button';
import * as R from 'ramda';
import Arrow from 'crocks/Arrow';

import { TextInput, PwdInput } from './components/Input';
import initState from './State';
import Form from './components/Form';

import './App.css';

const property = R.curry((f, x) => f(R.lensProp(x)));

const setUserProp = property(R.over, 'username')(R.toUpper);

const getUserProp = property(R.view, 'username');

const setUsername = setState => setState.contramap(setUserProp);

const getUsername = getState => getState.map(getUserProp);

const handler = R.curry((setState, data) => setState.runWith(data));

function useFormState(initState) {
  const [state, _setState] = useState(initState);

  const getState = Arrow(() => state);

  const setState = Arrow(_setState);

  return [setUsername(setState), getUsername(getState)];
}

function App() {
  const [setState, getState] = useFormState(initState);

  getState.map(R.concat('username: ')).map(console.log).runWith();

  const onSubmit = handler(setState);

  return (
    <div className="App">
      <Form handler={onSubmit}>
        <TextInput
          id="username"
          rules={{
            rules: [{ required: true, message: 'Please input your username!' }]
          }}
        />
        <PwdInput
          id="password"
          rules={{
            rules: [{ required: true, message: 'Please input your Password!' }]
          }}
        />
        <Checkbox
          id="remember"
          rules={{
            valuePropName: 'checked',
          }}
          style={{ width: '100%', textAlign: 'left' }}
        >
          Remember me
        </Checkbox>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: '100%' }}
        >
          Log in
        </Button>
      </Form>
    </div>
  );
}

export default App;
