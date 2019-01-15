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

### Shortest form to create actions:
``` javascript
const actions = new Actions({
    setValue: true,
    syncValue: true,
    requestValue: true
});

// When an action name starts with set, it will accept one argument and set a variable with the same name
actions.setValue(3); // {type: "@APPLICATION/SET_VALUE", value: 3}
actions.SET_VALUE // @APPLICATION/SET_VALUE

// When an action name starts with request, it will accept one argument and set a variable with the name request
// Success and failure actions will also be automatically created
actions.requestValue(3); // {type: "@APPLICATION/REQUEST_VALUE", request: 3}
actions.REQUEST_VALUE // @APPLICATION/REQUEST_VALUE

// Otherwise, an action with no payload is created
actions.syncValue(); // {type: "@APPLICATION/SYNC_VALUE"}
actions.SYNC_VALUE // @APPLICATION/SYNC_VALUE
```

### Simple action with implied type
``` javascript
const actions = new Actions({
    setValue: (value) => ({value})
}, 'APPLICATION');

// Automatically generates the action type strings with a namespace

actions.setValue(3); // {type: "@APPLICATION/SET_VALUE", value: 3}
actions.SET_VALUE // @APPLICATION/SET_VALUE

Object.keys(actions) // ['setValue', 'SET_VALUE']
```

### Simple action with explicit type
``` javascript
const actions = new Actions({
    setValue(value) {
        type: 'SET_VALUE_WITH_EXPLICIT_TYPE',
        value
    }
}, 'APPLICATION');

// Automatically generates the action type strings with a namespace

actions.setValue(3); // {type: "@APPLICATION/SET_VALUE_WITH_EXPLICIT_TYPE", value: 3}
actions.SET_VALUE // @APPLICATION/SET_VALUE_WITH_EXPLICIT_TYPE

Object.keys(actions) // ['setValue', 'SET_VALUE_WITH_EXPLICIT_TYPE']
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

actions.valueRequestSucceeded(response); // {type: "@APPLICATION/VALUE_REQUEST_SUCCEEDED", response}
actions.VALUE_REQUEST_SUCCEEDED // @APPLICATION/VALUE_REQUEST_SUCCEEDED

actions.valueRequestFailed(reason); // {type: "@APPLICATION/VALUE_REQUEST_FAILED", reason}
actions.VALUE_REQUEST_FAILED // @APPLICATION/VALUE_REQUEST_FAILED

Object.keys(actions) // ['requestValue', 'REQUEST_VALUE',
                     //  'valueRequestSucceeded', 'VALUE_REQUEST_SUCCEEDED",
                     //  'valueRequestFailed', 'VALUE_REQUEST_FAILED']
```

### Override action type after contruction
``` javascript
const actions = new Actions({
    setValue(value) {
        return {
            type: 'SET_VALUE',
            value,
        };
    },
}, 'APPLICATION');

actions.SET_VALUE = 'SET_VALUE_OVERRIDE';

// Automatically uses the updated action type
actions.setValue(3); // {type: "SET_VALUE_OVERRIDE", value: 3}

Object.keys(actions) // ['setValue', 'SET_VALUE']
```

### Generate custom success/failure action creators for an async action
``` javascript
const actions = new Actions({
    requestValue(request) {
        return {
            type: 'REQUEST_VALUE',
            request,
        };
    },
    valueRequestSucceeded(response) {
        return {
            type: 'VALUE_REQUEST_SUCCEEDED_OVERRIDE',
            override: response,
        };
    },
    valueRequestFailed(reason) {
        return {
            type: 'VALUE_REQUEST_FAILED_OVERRIDE',
            override: reason,
        };
    },
}, 'APPLICATION');

actions.requestValue(() => fetch('/data'));
actions.REQUEST_VALUE // @APPLICATION/REQUEST_VALUE

// Uses the overriden side effect resolutions

actions.valueRequestSucceeded(response); // {type: "@APPLICATION/VALUE_REQUEST_SUCCEEDED_OVERRIDE", override}
actions.VALUE_REQUEST_SUCCEEDED // @APPLICATION/VALUE_REQUEST_SUCCEEDED_OVERRIDE

actions.valueRequestFailed(reason); // {type: "@APPLICATION/VALUE_REQUEST_FAILED_OVERRID", override}
actions.VALUE_REQUEST_FAILED // @APPLICATION/VALUE_REQUEST_FAILED_OVERRIDE

Object.keys(actions) // ['requestValue', 'REQUEST_VALUE',
                     //  'valueRequestSucceeded', 'VALUE_REQUEST_SUCCEEDED",
                     //  'valueRequestFailed', 'VALUE_REQUEST_FAILED']
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

actions.valueRequestSucceeded(response); // {type: "@APPLICATIONnVALUE_REQUEST_SUCCEEDED", response}
actions.VALUE_REQUEST_SUCCEEDED // @APPLICATION/VALUE_REQUEST_SUCCEEDED

actions.valueRequestFailed(reason); // {type: "@APPLICATION/VALUE_REQUEST_FAILED", reason}
actions.VALUE_REQUEST_FAILED // @APPLICATION/VALUE_REQUEST_FAILED

Object.keys(actions) // ['setValue', 'SET_VALUE',
                     //  'requestValue', 'REQUEST_VALUE',
                     //  'valueRequestSucceeded', 'VALUE_REQUEST_SUCCEEDED",
                     //  'valueRequestFailed', 'VALUE_REQUEST_FAILED']
```

## API

<a name="module_@zakkudo/actions"></a>

<a name="module_@zakkudo/actions..Actions"></a>

### @zakkudo/actions~Actions ⏏

**Kind**: Exported class

<a name="new_module_@zakkudo/actions..Actions_new"></a>

#### new Actions(actionCreators, [namespace])

| Param | Type | Description |
| --- | --- | --- |
| actionCreators | <code>Object</code> | An object containing a set of [action creators](https://redux.js.org/basics/actions#action-creators) to auto complete the types for. |
| [namespace] | <code>String</code> | The desired namespace for the set of actions |

