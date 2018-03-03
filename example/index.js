import { h, app } from 'hyperapp';
import { jsonSchema } from '../index';
/** @jsx h */

const state = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      default: 'Hyperapp JSON-Schema Example',
    },
    count: {
      type: 'integer',
      default: 0,
      maximum: 5,
    },
  },
};

const actions = {
  sub: value => state => ({ count: state.count - value }),
  add: value => state => ({ count: state.count + value }),
};

const view = (state, actions) =>
  h('div', {}, [
    h('h1', {}, state.title),
    h('h2', {}, `Count: ${state.count}`),
    h('button', { onclick: () => actions.sub(1) }, '-'),
    h('button', { onclick: () => actions.add(1) }, '+'),
  ]);

const appActions = jsonSchema(log => {
  console.log(log);

  if (!log.valid) {
    alert(`
      Error: ${log.errors},
      in Action: ${log.action},
      value before: ${JSON.stringify(log.values.before)}
      value after: ${JSON.stringify(log.values.after)}
    `)
  }
})(app)(state, actions, view, document.getElementById('app'));

window.main = appActions;
