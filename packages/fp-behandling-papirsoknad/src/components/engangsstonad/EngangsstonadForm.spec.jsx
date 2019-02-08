import React from 'react';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import foreldreType from '@fpsak-frontend/kodeverk/src/foreldreType';
import { reduxFormPropsMock } from '@fpsak-frontend/assets/testHelpers/redux-form-test-helper';
import SoknadData from 'papirsoknad/src/SoknadData';
import RegistreringFodselGrid from './RegistreringFodselGrid';
import RegistreringAdopsjonOgOmsorgGrid from './RegistreringAdopsjonOgOmsorgGrid';
import { EngangsstonadForm } from './EngangsstonadForm';

describe('<EngangsstonadForm>', () => {
  it('skal vise fødselpaneler når familieHendelseType er lik fødsel', () => {
    const wrapper = shallowWithIntl(<EngangsstonadForm
      {...reduxFormPropsMock}
      intl={intlMock}
      onSubmitUfullstendigsoknad={sinon.spy()}
      countryCodes={[]}
      readOnly={false}
      soknadData={new SoknadData(fagsakYtelseType.ENGANGSSTONAD, familieHendelseType.FODSEL, foreldreType.MOR, [])}
    />);
    const form = wrapper.find(RegistreringFodselGrid);
    expect(form).to.have.length(1);
  });

  it('skal vise adopsjonspaneler når familieHendelseType er lik adopsjon', () => {
    const wrapper = shallowWithIntl(<EngangsstonadForm
      {...reduxFormPropsMock}
      intl={intlMock}
      onSubmitUfullstendigsoknad={sinon.spy()}
      countryCodes={[]}
      readOnly={false}
      soknadData={new SoknadData(fagsakYtelseType.ENGANGSSTONAD, familieHendelseType.ADOPSJON, foreldreType.MOR, [])}
    />);
    const form = wrapper.find(RegistreringAdopsjonOgOmsorgGrid);
    expect(form).to.have.length(1);
  });
});