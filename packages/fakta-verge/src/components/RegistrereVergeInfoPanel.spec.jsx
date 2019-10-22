import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { RegistrereVergeInfoPanelImpl } from './RegistrereVergeInfoPanel';

describe('<RegistrereVergeInfoPanel>', () => {
  it('skal vise faktapanel og form for registrere verge', () => {
    const wrapper = shallowWithIntl(<RegistrereVergeInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={['verge']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      readOnly={false}
      aksjonspunkt={{
        kode: 5030,
        id: 100001,
        definisjon: { kode: '5030', navn: 'VERGE' },
        status: { kode: 'OPPR', navn: 'Opprettet', kodeverk: 'AKSJONSPUNKT_STATUS' },
        kanLoses: true,
        erAktivt: true,
      }}
      vergetyper={[{}]}
      behandlingId={1}
      behandlingVersjon={1}
      alleMerknaderFraBeslutter={{}}
    />);

    const panel = wrapper.find('FaktaEkspandertpanel');
    expect(panel).to.have.length(1);
    expect(panel.prop('title')).to.eql('RegistrereVergeInfoPanel.Info');
    expect(panel.prop('hasOpenAksjonspunkter')).is.true;
    expect(panel.prop('isInfoPanelOpen')).is.true;
    expect(panel.prop('faktaId')).to.eql('verge');
  });

  it('skal vise lukket faktapanel når panelet er markert lukket', () => {
    const wrapper = shallowWithIntl(<RegistrereVergeInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={['tilleggsopplysninger']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      readOnly={false}
      aksjonspunkt={{
        kode: 5030,
        id: 100001,
        definisjon: { kode: '5030', navn: 'VERGE' },
        status: { kode: 'OPPR', navn: 'Opprettet', kodeverk: 'AKSJONSPUNKT_STATUS' },
        kanLoses: true,
        erAktivt: true,
      }}
      vergetyper={[{}]}
      behandlingId={1}
      behandlingVersjon={1}
      alleMerknaderFraBeslutter={{}}
    />);

    const panel = wrapper.find('FaktaEkspandertpanel');
    expect(panel.prop('isInfoPanelOpen')).is.false;
  });
});