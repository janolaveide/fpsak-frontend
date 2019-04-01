import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { ForeldelsePanelImpl } from './ForeldelsePanel';

const periode = {
  begrunnelse: '',
  belop: 51000,
  feilutbetaling: 51000,
  fom: '2016-03-16',
  foreldet: 'FORELDET',
  tom: '2016-05-26',
};

const mockProps = {
  foreldelsesresultatActivity: [periode],
  behandlingFormPrefix: '',
  reduxFormChange: sinon.spy(),
  reduxFormInitialize: sinon.spy(),
  fagsakPerson: {},
  isApOpen: true,
  apCodes: ['5003'],
  foreldeseSyncErrors: {},
  readOnly: false,
};

describe('<ForeldelsePanelImpl>', () => {
  it('skal rendre ForeldelsePanel', () => {
    const wrapper = shallow(<ForeldelsePanelImpl
      {...mockProps}
    />);

    const form = wrapper.find('form');
    expect(form).has.length(1);
    const fadingPanel = wrapper.find('FadingPanel');
    expect(fadingPanel).has.length(1);
    const undertittel = wrapper.find('Undertittel');
    expect(undertittel).has.length(1);
    const verticalSpacer = wrapper.find('VerticalSpacer');
    expect(verticalSpacer).has.length(3);
    const flexRow = wrapper.find('FlexRow');
    expect(flexRow).has.length(1);
    const flexColumn = wrapper.find('FlexColumn');
    expect(flexColumn).has.length(1);
    const bpTimelinePanel = wrapper.find('BpTimelinePanel');
    expect(bpTimelinePanel).has.length(1);
    const aksjonspunktHelpText = wrapper.find('AksjonspunktHelpText');
    expect(aksjonspunktHelpText).has.length(1);
    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).has.length(1);
  });

  it('skal ikke rendre timeline panel når foreldelsesresultatActivity er null', () => {
    const props = {
      ...mockProps,
      foreldelsesresultatActivity: null,
    };
    const wrapper = shallow(<ForeldelsePanelImpl
      {...props}
    />);

    const bpTimelinePanel = wrapper.find('BpTimelinePanel');
    expect(bpTimelinePanel).has.length(0);
    const aksjonspunktHelpText = wrapper.find('AksjonspunktHelpText');
    expect(aksjonspunktHelpText).has.length(0);
    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).has.length(0);
  });
});