/**
 * @param {String} text - The text to uncapitalize the first letter of
 * @return {String} The uncapitalized version of text
 * @private
 */
function uncapitalize(text) {
    return text.charAt().toLowerCase() + text.substring(1);
}

/**
 * @param {String} text - Tests if the string is all upper case
 * @return {Boolean} true if the string is fully upper case, otherwise false
 * @private
 */
function isUpperCase(text) {
    return text === text.toUpperCase();
}

/**
 * Converts a camel case variable to a upper snake case variable.
 * setValue -> SET_VALUE
 * @param {String} actionCreatorName - The camel case string to convert
 * @return {String} The new upper snake case version
 * @private
 */
function toActionTypeName(actionCreatorName) {
    return actionCreatorName.split('').reduce((accumulator, letter, index) => {
        if (isUpperCase(letter) && index > 0) {
            return `${accumulator}_${letter}`;
        }

        return `${accumulator}${letter}`;
    }, '').toUpperCase();
}

/**
 * Automatically adds *RequestSucceeded and *RequestFailed when
 * a action creator with the name format request* is found.
 * @param {Object} actionCreators - The action creators initialization object
 * @return {Object} The actionCreators object with the auto created async result
 * action creators.
 * @private
 */
function addMissingAsyncActionCreators(actionCreators) {
    return Object.keys(actionCreators).reduce((accumulator, k) => {
        if (k.startsWith('request')) {
            const prefix = uncapitalize(k.substring('request'.length));
            const successActionCreatorName = `${prefix}RequestSucceeded`;
            const failedActionCreatorName = `${prefix}RequestFailed`;

            if (!actionCreators[successActionCreatorName]) {
                const successActionTypeName = toActionTypeName(successActionCreatorName);
                const failedActionTypeName = toActionTypeName(failedActionCreatorName);

                return Object.assign({}, accumulator, {
                    [successActionCreatorName]: function(response) {
                        return {
                            type: successActionTypeName,
                            response,
                        };
                    },
                    [failedActionCreatorName]: function(reason) {
                        return {
                            type: failedActionTypeName,
                            reason,
                        };
                    },
                }, Object.assign({}, actionCreators));
            }
        }

        return Object.assign({}, accumulator, {
            [k]: actionCreators[k],
        });
    }, {});
}

/**
 * @param {Object} actionCreators = The action creators to scope and add action types to
 * @param {String} [namespace=''] - The namespace to add
 * @param {Object} self - The object to look for the type name
 * @return {Object} The scoped aciton creators with action types on the same object
 * @private
*/
function addActionTypeNamesWithScopes(actionCreators, namespace, self) {
    return Object.keys(actionCreators).reduce((accumulator, k) => {
        const actionCreator = actionCreators[k];
        const type = actionCreator().type;
        const nameSpacedType = namespace ? `@${namespace}/${type}` : type;
        const actionTypeName = toActionTypeName(k);

        /**
         * @private
         * @return {Object} The scoped action
         */
        function scopedActionCreator(...args) {
            const action = actionCreator(...args);

            if (namespace) {
                action.type = self[actionTypeName];
            }

            return action;
        }

        return Object.assign({}, accumulator, {
            [k]: scopedActionCreator,
            [actionTypeName]: nameSpacedType,
        });
    }, {});
}

/**
 * Helper class to make working with [Redux]{@link https://redux.js.org/} actions enjoyable. The code is readable,
 * with minimal surprises.
 *
 * [![Build Status](https://travis-ci.org/zakkudo/actions.svg?branch=master)](https://travis-ci.org/zakkudo/actions)
 * [![Coverage Status](https://coveralls.io/repos/github/zakkudo/actions/badge.svg?branch=master)](https://coveralls.io/github/zakkudo/actions?branch=master)
 *
 * Why use this?
 *
 * - Consistancy with simplicity
 * - Automates creation of the action types by sniffing the action creators
 * - It works how you expect it to.  Changing a action type will also update action creator output.
 * - Automatically generates the success/failure actions for side effect actions
 *   (For libraries like [Redux-Thunk]{@link https://github.com/reduxjs/redux-thunk},
 *   [Redux-Saga]{@link https://redux-saga.js.org/}, [Redux-Observable]{@link https://redux-observable.js.org/}...)
 * - All action type strings are prefixed the namespace on contruction
 *
 * Install with:
 *
 * ```console
 * yarn add @zakkudo/actions
 * ```
 *
 * @example
 * import Actions from '@zakkudo/actions';
 *
 * const actions = new Actions({
 *     setValue(value) {
 *         return {
 *             type: 'SET_VALUE',
 *             value,
 *         };
 *     },
 *     requestValue(request) {
 *         return {
 *             type: 'REQUEST_VALUE',
 *             request,
 *         };
 *     }
 * }, 'APPLICATION');
 *
 * // Automatically generates the action type strings with a namespace
 *
 * actions.setValue(3); // {type: "@APPLICATION/SET_VALUE", value: 3}
 * actions.SET_VALUE // @APPLICATION/SET_VALUE
 *
 * actions.requestValue(() => fetch('/data'));
 * actions.REQUEST_VALUE // @APPLICATION/REQUEST_VALUE
 *
 * // The below are also automatically generated from requestValue() because
 * // it's an async action
 *
 * actions.valueRequestSucceeded(response); // {type: "@APPLICATION_VALUE_REQUEST_SUCCEEDED", response}
 * actions.VALUE_REQUEST_SUCCEEDED // @APPLICATION/VALUE_REQUEST_SUCCEEDED
 *
 * actions.valueRequestFailed(reason); // {type: "@APPLICATION/VALUE_REQUEST_FAILED", reason}
 * actions.VALUE_REQUEST_FAILED // @APPLICATION/VALUE_REQUEST_FAILED
 *
 * Object.keys(actions) // ['setValue', 'SET_VALUE',
 *                      //  'requestValue', 'REQUEST_VALUE',
 *                      //  'valueRequestSucceeded', 'VALUE_REQUEST_SUCCEEDED",
 *                      //  'valueRequestFailed', 'VALUE_REQUEST_FAILED']
 * @module Actions
 */
export default class Actions {
    constructor(actionCreators, namespace='') {
        Object.assign(this,
            addActionTypeNamesWithScopes(
                addMissingAsyncActionCreators(actionCreators),
                namespace,
                this
            )
        );
    }
}
