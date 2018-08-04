# Actions
Helper class for primarily generating action types from action type creators

Why use this?

- Automates creation of the action types by sniffing the action creators
- Automatically generates the success/failure actions for side effect actions
- Changing the action type strings after generation correctly updates the keys for the action creators
- All methods are prefixed the namespace on contruction

```js
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

actions.valueRequestSucceeded(response);
actions.VALUE_REQUEST_SUCCEEDED // @APPLICATION/VALUE_REQUEST_SUCCEEDED

actions.valueRequestFailed(response);
actions.VALUE_REQUEST_FAILED // @APPLICATION/VALUE_REQUEST_FAILED
```
