import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers//intl-enzyme-test-helper';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import YtelserFraInfotrygd from './YtelserFraInfotrygd';

describe('<YtelserFraInfotrygd>', () => {
  it('Skal teste at de korrekte verdier for ytelse', () => {
    const brutto = 290000;
    const wrapper = shallowWithIntl(<YtelserFraInfotrygd
      bruttoPrAar={brutto}
    />);
    const element = wrapper.find('Element');
    const formattedMessage = wrapper.find('FormattedMessage');

    expect(formattedMessage).to.have.length(1);
    expect(formattedMessage.at(0).prop('id')).to.equal('Beregningsgrunnlag.YtelserFraInfotrygd.Ytelse');

    expect(element).to.have.length(1);
    expect(element.children().at(0).text()).to.equal(formatCurrencyNoKr(brutto));
  });
});
