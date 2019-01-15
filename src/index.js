/**
 * @module @zakkudo/actions
 */

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
    return Object.entries(actionCreators).reduce((accumulator, [k, actionCreator]) => {
        if (actionCreator === true) {
            if (k.startsWith('set') && k !== 'set') {
                actionCreator = (value) => ({[uncapitalize(k.slice(3))]: value});
            } else if (k.startsWith('request') && k !== 'request') {
                actionCreator = (value) => ({'request': value});
            } else {
                actionCreator = () => ({});
            }
        }
        const type = actionCreator().type || toActionTypeName(k);
        const nameSpacedType = namespace ? `@${namespace}/${type}` : type;
        const actionTypeName = toActionTypeName(k);

        /**
         * @private
         * @return {Object} The scoped action
         */
        function scopedActionCreator(...args) {
            const action = actionCreator(...args);

            action.type = self[actionTypeName];

            return action;
        }

        return Object.assign({}, accumulator, {
            [k]: scopedActionCreator,
            [actionTypeName]: nameSpacedType,
        });
    }, {});
}

class Actions {
    /**
     * @param {Object} actionCreators - An object containing a set of
     * [action creators]{@link https://redux.js.org/basics/actions#action-creators}
     * to auto complete the types for.
     * @param {String} [namespace] - The desired namespace for the set of actions
     */
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

export default Actions;
