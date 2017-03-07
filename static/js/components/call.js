const html = require('choo/html');
const t = require('../utils/translation');

const find = require('lodash/find');
const contact = require('./contact.js');
const noContact = require('./noContact.js');
const script = require('./script.js');
const outcomes = require('./outcomes.js');
const scriptLine = require('./scriptLine.js');
const promote = require('./promote.js');

module.exports = (state, prev, send) => {
  const issue = find(state.issues, ['id', state.location.params.issueid]);

  if (issue == null) {
    return html`<section class="call" onload=${(e) => send('oldcall')}>
      <div class="call_complete">
        <h2 class="call__title">${t.getText('noCalls.title')}</h2>
        <p class="call__text">${t.getText('noCalls.reason')}</p>
        <p class="call__text">${t.getText('noCalls.nextStep')}</p>
      </div>
    </section>`;
  }
  const currentIndex = state.contactIndices[issue.id];
  const currentContact = issue.contacts[currentIndex];

  function contactArea() {
    if (currentContact != null) {
      return contact(currentContact, state, prev, send)
    } else {
      return noContact(state, prev, send)
    }
  }

  return html`
  <section class="call">
    <header class="call__header">
      <h2 class="call__title">${issue.name}</h2>
      <div class="call__reason">${issue.reason.split('\n').map((line) => scriptLine(line, state, prev, send))}</div>
    </header>

    ${contactArea()}

    ${script(state, prev, send)}

    ${outcomes(state, prev, send)}

    ${promote(state, prev, send)}

  </section>
  `;
}
