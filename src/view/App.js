import React, { useState } from 'react';
import Checkbox from 'antd/lib/checkbox';
import Button from 'antd/lib/button';
import * as R from 'ramda';
import Arrow from 'crocks/Arrow';
import Async from 'crocks/Async';

import { TextInput, PwdInput } from './components/Input';
import initState from './State';
import Form from './components/Form';

import './App.css';

function App() {
  const [state, _setState] = useState(initState);
  
  const getState = Arrow(() => state);

  const setState = Arrow(_setState);

  const handler = (data) => {
    setState.contramap(R.over(R.lensProp('username'))).runWith(R.always(data));
    console.log(getState.map(R.view(R.lensProp('username')).runWith()));
  };

  return (
    <div className="App">
      <Form handler={handler}>
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
