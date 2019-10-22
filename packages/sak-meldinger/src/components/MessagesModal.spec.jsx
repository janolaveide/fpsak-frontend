import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import Modal from 'nav-frontend-modal';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import MessagesModal from './MessagesModal';

describe('<MessagesModal>', () => {
  it('skal vise modal', () => {
    const closeCallback = sinon.spy();
    const wrapper = shallowWithIntl(<MessagesModal.WrappedComponent
      showModal
      closeEvent={closeCallback}
      intl={intlMock}
    />);

    const modal = wrapper.find(Modal);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('onRequestClose')).to.eql(closeCallback);
  });
});