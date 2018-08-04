<a name="module_Actions"></a>

## Actions
Helper class to generate enum of action types that are
property namespaced for a set of action generators.

Install with

```
yarn add @zakkudo/actions
```

Why use this?

- Automates creation of the action types by sniffing the action creators
- Automatically generates the success/failure actions for side effect actions
- Changing the action type strings after generation correctly updates the keys for the action creators
- All methods are prefixed the namespace on contruction

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
   actions.REQUEST_VALUE // @APPLICATOIN/REQUEST_VALUE

   // The below are also automatically generated from requestValue() because
   // it's an async action

   actions.valueRequestSucceeded(response);
   actions.VALUE_REQUEST_SUCCEEDED // @APPLICATOIN/VALUE_REQUEST_SUCCEEDED

   actions.valueRequestFailed(response);
   actions.VALUE_REQUEST_FAILED // @APPLICATOIN/VALUE_REQUEST_FAILED
```
