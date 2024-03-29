import React, { useState, useEffect } from 'react';
import Checkbox from 'antd/lib/checkbox';
import Button from 'antd/lib/button';
import * as R from 'ramda';
import Arrow from 'crocks/Arrow';
import Async from 'crocks/Async';
import maybeToAsync from 'crocks/Async/maybeToAsync';
import safe from 'crocks/Maybe/safe';
import isObject from 'crocks/predicates/isObject';
import isString from 'crocks/predicates/isString';

import { TextInput, PwdInput } from './components/Input';
import initState from './State';
import Form from './components/Form';

import './App.css';

const requestUrl = 'https://gist.githubusercontent.com/jasonYoge/\
39a229d8fb21e31a31650ebff27928c8/raw/37ffce0e4cb3ac1d02655ef4010c3b1403f55f1c/loginInfo.json';

const property = R.curry((f, x) => f(R.lensProp(x)));

const setUserProp = property(R.over, 'username')(R.toUpper);

const getUserProp = property(R.view, 'username');

const setUsername = setState => setState.contramap(setUserProp);

const getUsername = getState => getState.map(getUserProp);

const handler = R.curry((setState, data) => setState.runWith(data));

const fetchMethod = url => Async((reject, resolve) => 
  fetch(url).then(data => data.json().then(resolve)).catch(reject))
  .chain(maybeToAsync('Return Type Error!!!', safe(isObject)));
  // .chain(maybeToAsync('Return Type Error!!!', safe(isString)));

const customState = R.curry((setter, getter, initState) => {
  const [state, _setState] = useState(initState);

  const getState = Arrow(() => state);

  const setState = Arrow(_setState);

  return [setter(setState), getter(getState)];
});

const useFormState = customState(setUsername, getUsername);

const useFetch = R.curry((url, resolve, reject) => useEffect(() => fetchMethod(url).fork(reject, resolve), []));

function App() {
  const [setState, getState] = useFormState(initState);

  useFetch(requestUrl, res => setState.runWith(res), alert);

  const onSubmit = handler(setState);

  // getState.map(R.concat('username: ')).map(console.log).runWith();

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
