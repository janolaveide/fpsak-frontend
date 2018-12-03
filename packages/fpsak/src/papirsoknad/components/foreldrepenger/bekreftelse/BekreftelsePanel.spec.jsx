import React from 'react';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/assets/testHelpers//intl-enzyme-test-helper';
import { expect } from 'chai';

import { BekreftelsePanel } from './BekreftelsePanel';

describe('<BekreftelsePanel>', () => {
  describe('Foreldrepenger-søknad', () => {
    it('skal vise radioknapper for om annen foreldre er kjent med perioder det er søkt om', () => {
      const wrapper = shallowWithIntl(<BekreftelsePanel
        intl={intlMock}
        readOnly={false}
        annenForelderInformertRequired
      />);
      expect(wrapper.find({ name: 'annenForelderInformert' })).to.have.length(1);
    });
  });
});