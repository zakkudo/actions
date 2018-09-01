<a name="module_Actions"></a>

## Actions
<p>
Helper class to make working with [Redux](https://redux.js.org/) actions enjoyable. The code is readable,
with minimal surprises.
</p>

<p>
<a href="https://travis-ci.org/zakkudo/actions">
    <img src="https://travis-ci.org/zakkudo/actions.svg?branch=master"
         alt="Build Status" /></a>
<a href="https://coveralls.io/github/zakkudo/actions?branch=master">
    <img src="https://coveralls.io/repos/github/zakkudo/actions/badge.svg?branch=master"
         alt="Coverage Status" /></a>
<a href="https://snyk.io/test/github/zakkudo/actions">
    <img src="https://snyk.io/test/github/zakkudo/actions/badge.svg"
         alt="Known Vulnerabilities"
         data-canonical-src="https://snyk.io/test/github/zakkudo/actions"
         style="max-width:100%;" /></a>
</p>

Why use this?

<ul>
<li>Consistancy with simplicity</li>
<li>Automates creation of the action types by sniffing the action creators</li>
<li>It works how you expect it to.  Changing a action type will also update action creator output.</li>
<li>Automatically generates the success/failure actions for side effect actions
  (For libraries like [Redux-Thunk](https://github.com/reduxjs/redux-thunk),
  [Redux-Saga](https://redux-saga.js.org/), [Redux-Observable](https://redux-observable.js.org/)...)</li>
<li>All action type strings are prefixed the namespace on contruction</li>
</ul>

Install with:

```console
yarn add @zakkudo/actions
```

**Example**  
```js
import Actions from '@zakkudo/actions';

const actions = new Actions({
    setValue(value) {
        return {
            type: 'SET_VALUE',
            value,
        };
    },
    requestValue(request) {
        return {
            type: 'REQUEST_VALUE',
            request,
        };
    }
}, 'APPLICATION');

// Automatically generates the action type strings with a namespace

actions.setValue(3); // {type: "@APPLICATION/SET_VALUE", value: 3}
actions.SET_VALUE // @APPLICATION/SET_VALUE

actions.requestValue(() => fetch('/data'));
actions.REQUEST_VALUE // @APPLICATION/REQUEST_VALUE

// The below are also automatically generated from requestValue() because
// it's an async action

actions.valueRequestSucceeded(response); // {type: "@APPLICATION_VALUE_REQUEST_SUCCEEDED", response}
actions.VALUE_REQUEST_SUCCEEDED // @APPLICATION/VALUE_REQUEST_SUCCEEDED

actions.valueRequestFailed(reason); // {type: "@APPLICATION/VALUE_REQUEST_FAILED", reason}
actions.VALUE_REQUEST_FAILED // @APPLICATION/VALUE_REQUEST_FAILED

Object.keys(actions) // ['setValue', 'SET_VALUE',
                     //  'requestValue', 'REQUEST_VALUE',
                     //  'valueRequestSucceeded', 'VALUE_REQUEST_SUCCEEDED",
                     //  'valueRequestFailed', 'VALUE_REQUEST_FAILED']
```
