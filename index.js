import Ajv from 'ajv';

export function jsonSchema(onChange) {
  // init json-schema validator
  var ajv = new Ajv();

  return function(app) {
    return function(initalSchema, initialActions, view, element) {
      // map to normal hyperapp state object
      const mappedState = deepMap(initalSchema);

      function updateActions(actions, prefix) {
        const namespace = prefix ? prefix + '.' : '';

        return Object.keys(actions || {}).reduce(function(otherActions, name) {
          const namedspacedName = namespace + name;
          const action = actions[name];

          otherActions[name] =
            typeof action === 'function'
              ? function(data) {
                  return function(state, actions) {
                    var result = action(data);
                    result =
                      typeof result === 'function'
                        ? result(state, actions)
                        : result;

                    const beforeState = getBeforeState(state, result);
                    const check = validator(initalSchema, result, prefix);

                    onChange({
                      valid: check.valid,
                      errors: check.errors,
                      action: name,
                      values: {
                        before: beforeState,
                        after: result,
                      },
                    });

                    return check.valid ? result : beforeState;
                  };
                }
              : updateActions(action, namedspacedName);
          return otherActions;
        }, {});
      }

      return app(mappedState, updateActions(initialActions), view, element);
    };
  };

  // helper for deep mapping of objects
  function deepMap(obj) {
    console.log(obj, Object.keys(obj.properties));
    return Object.keys(obj.properties)
      .map(prop => {
        if (obj.properties[prop].type === 'object') {
          const newV = {};
          newV[prop] = deepMap(obj.properties[prop]);
          return newV;
        } else {
          const v = {};
          v[prop] = obj.properties[prop].default;
          return v;
        }
      })
      .reduce((acc, v) => {
        return Object.assign(acc, v);
      }, {});
  }

  // helper for deep find  via path (e.g. 'foo.bar.baz')
  function deepFind(obj, path) {
    if (path.indexOf('.')) {
      for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
        obj = obj[path[i]];
      }
    } else {
      obj[path];
    }
    return obj;
  }

  // validator for schemaFragments
  function validator(schema, value, path) {
    const name = Math.random().toString();
    const schemaFragment = path
      ? deepFind(schemaToTest.properties, path.split('.').join('.properties.'))
      : schema;

    var valid = ajv.addSchema(schemaFragment, name).validate(name, value);

    return { valid, errors: ajv.errorsText() };
  }

  function getBeforeState(stateBefore, change) {
    const obj = {};
    Object.keys(change).forEach(key => (obj[key] = stateBefore[key]));
    return obj;
  }
}
