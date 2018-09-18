import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import aktivitetStatus from 'kodeverk/aktivitetStatus';

import LonnsendringForm, { lonnsendringField } from './LonnsendringForm';
import FastsettATFLInntektForm from './FastsettATFLInntektForm';

describe('<LonnsendringForm>', () => {
  it('skal teste at korrekt antall radioknapper vises med korrekte props', () => {
    const wrapper = shallow(<LonnsendringForm
      readOnly={false}
      isAksjonspunktClosed={false}
      erLonnsendring={false}
      tilfeller={[]}
      radioknappOverskrift={['test1', 'test2']}
      manglerIM={false}
    />);
    const radios = wrapper.find('RadioOption');
    const atInntekt = wrapper.find(FastsettATFLInntektForm);
    expect(atInntekt).to.have.length(0);
    expect(radios).to.have.length(2);
    expect(radios.last().prop('disabled')).is.eql(false);
  });

  it('skal teste at komponent for å fastsette inntekt vises hvis vi skal vise den', () => {
    const wrapper = shallow(<LonnsendringForm
      readOnly={false}
      isAksjonspunktClosed={false}
      erLonnsendring
      tilfeller={[]}
      radioknappOverskrift={['test1', 'test2']}
      manglerIM={false}
      skalViseInntektstabell
    />);
    const atInntekt = wrapper.find(FastsettATFLInntektForm);
    expect(atInntekt).to.have.length(1);
  });

  it('skal teste at transformValues gir korrekt output', () => {
    const values = { };
    values[lonnsendringField] = true;
    values.dummyField = 'tilfeldig verdi';
    const transformedObject = LonnsendringForm.transformValues(values);
    expect(transformedObject.vurdertLonnsendring.erLønnsendringIBeregningsperioden).to.equal(true);
    expect(transformedObject.vurdertLonnsendring.dummyField).to.equal(undefined);
  });

  it('skal teste at buildInitialValues gir korrekt output med gyldig beregningsgrunnlag', () => {
    const gyldigBG = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            {
              aktivitetStatus: {
                kode: aktivitetStatus.ARBEIDSTAKER,
              },
              lonnsendringIBeregningsperioden: true,
            },
          ],
        },
      ],
    };
    const initialValues = LonnsendringForm.buildInitialValues(gyldigBG);
    expect(initialValues[lonnsendringField]).to.equal(true);
  });
});
