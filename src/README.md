# @zakkudo/actions

Helper class to make working with [Redux](https://redux.js.org/) actions enjoyable.

[![Build Status](https://travis-ci.org/zakkudo/actions.svg?branch=master)](https://travis-ci.org/zakkudo/actions)
[![Coverage Status](https://coveralls.io/repos/github/zakkudo/actions/badge.svg?branch=master)](https://coveralls.io/github/zakkudo/actions?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/zakkudo/actions/badge.svg)](https://snyk.io/test/github/zakkudo/actions)
[![Node](https://img.shields.io/node/v/@zakkudo/actions.svg)](https://nodejs.org/)
[![License](https://img.shields.io/npm/l/@zakkudo/actions.svg)](https://opensource.org/licenses/BSD-3-Clause)

## Why use this?

- Consistancy with simplicity
- Automates creation of the action types by sniffing the action creators
- It works how you expect it to.  Changing a action type will also update action creator output.
- Automatically generates the success/failure actions for side effect actions
  (For libraries like [Redux-Thunk](https://github.com/reduxjs/redux-thunk),
  [Redux-Saga](https://redux-saga.js.org/), [Redux-Observable](https://redux-observable.js.org/)...)
- All action type strings are prefixed the namespace on contruction

## Install

```console
# Install using npm
npm install @zakkudo/actions
```

``` console
# Install using yarn
yarn add @zakkudo/actions
```

## Examples

### Simple action
``` javascript
const actions = new Actions({
    setValue(value) {
        return {
            type: 'SET_VALUE',
            value,
        };
    },
}, 'APPLICATION');

// Automatically generates the action type strings with a namespace

actions.setValue(3); // {type: "@APPLICATION/SET_VALUE", value: 3}
actions.SET_VALUE // @APPLICATION/SET_VALUE
```

### Async action
``` javascript
const actions = new Actions({
    requestValue(request) {
        return {
            type: 'REQUEST_VALUE',
            request,
        };
    }
}, 'APPLICATION');

// Action creators whose names start with 'request' are assumed to be asynchronous actions

actions.requestValue(() => fetch('/data'));
actions.REQUEST_VALUE // @APPLICATION/REQUEST_VALUE

// Because it's an asynchronous action, the succeess and failure actions are also automatically generated.

actions.valueRequestSucceeded(response); // {type: "@APPLICATION_VALUE_REQUEST_SUCCEEDED", response}
actions.VALUE_REQUEST_SUCCEEDED // @APPLICATION/VALUE_REQUEST_SUCCEEDED

actions.valueRequestFailed(reason); // {type: "@APPLICATION/VALUE_REQUEST_FAILED", reason}
actions.VALUE_REQUEST_FAILED // @APPLICATION/VALUE_REQUEST_FAILED
```

### Full example
``` javascript
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
