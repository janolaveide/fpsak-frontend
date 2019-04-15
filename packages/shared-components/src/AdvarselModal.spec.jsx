import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import Modal from 'nav-frontend-modal';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import Image from './Image';

import AdvarselModal from './AdvarselModal';

describe('<AdvarselModal>', () => {
  it('skal rendre modal', () => {
    const wrapper = shallowWithIntl(
      <AdvarselModal.WrappedComponent
        intl={intlMock}
        textCode="OpenBehandlingForChangesMenuItem.OpenBehandling"
        showModal
        submit={sinon.spy()}
      />,
    );

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql('Åpne behandling for endringer?');

    const image = wrapper.find(Image);
    expect(image).to.have.length(1);
    expect(image.prop('altCode')).is.eql('OpenBehandlingForChangesMenuItem.OpenBehandling');

    const message = wrapper.find(FormattedMessage);
    expect(message).to.have.length(1);
    expect(message.prop('id')).is.eql('OpenBehandlingForChangesMenuItem.OpenBehandling');
  });
});