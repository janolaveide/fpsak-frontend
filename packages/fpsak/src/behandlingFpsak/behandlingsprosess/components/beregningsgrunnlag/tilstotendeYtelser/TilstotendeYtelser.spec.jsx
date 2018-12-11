import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers//intl-enzyme-test-helper';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import TilstotendeYtelser, { getTekstForAndelBruktIBeregning } from './TilstotendeYtelser';

const dagpengerInntekt = 200000;
const aapInntekt = 300000;
const aapNavn = 'Beregningsgrunnlag.TilstottendeYtelse.AAP';
const dagpengerNavn = 'Beregningsgrunnlag.TilstottendeYtelse.Dagpenger';
const dpAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.DAGPENGER,
    navn: dagpengerNavn,
  },
  beregnetPrAar: dagpengerInntekt,
  elementNavn: dagpengerNavn,
};
const aapAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.ARBEIDSAVKLARINGSPENGER,
    navn: aapNavn,
  },
  beregnetPrAar: aapInntekt,
  elementNavn: aapNavn,
};
const urelatertAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.FRILANSER,
    navn: 'Frilanser',
  },
  beregnetPrAar: aapInntekt,
};
const andeler = [dpAndel, aapAndel, urelatertAndel];
describe('<TilstotendeYtelser>', () => {
  it('Skal teste at de korrekte ytelser for dagpenger / AAP vises og at urelaterte andeler ikke vises', () => {
    const wrapper = shallowWithIntl(<TilstotendeYtelser
      alleAndeler={andeler}
      isKombinasjonsstatus={false}
      skalViseOppjustertGrunnlag={false}
    />);
    const element = wrapper.find('Element');
    const formattedMessage = wrapper.find('FormattedMessage');

    expect(formattedMessage).to.have.length(2);
    expect(formattedMessage.at(0).prop('id')).to.equal(dagpengerNavn);
    expect(formattedMessage.at(1).prop('id')).to.equal(aapNavn);

    expect(element).to.have.length(2);
    expect(element.children().at(0).text()).to.equal(formatCurrencyNoKr(dagpengerInntekt));
    expect(element.children().at(1).text()).to.equal(formatCurrencyNoKr(aapInntekt));
  });

  it('Skal teste at komponenten regner ut oppjustert dagsats korrekt for dagpenger', () => {
    const wrapper = shallowWithIntl(<TilstotendeYtelser
      alleAndeler={[dpAndel]}
      isKombinasjonsstatus={false}
      skalViseOppjustertGrunnlag
    />);
    const element = wrapper.find('Element');
    const formattedMessage = wrapper.find('FormattedMessage');
    const normaltekst = wrapper.find('Normaltekst');

    expect(formattedMessage).to.have.length(2);
    expect(formattedMessage.at(0).prop('id')).to.equal('Beregningsgrunnlag.TilstottendeYtelse.DagpengerOppjustert');
    expect(formattedMessage.at(1).prop('id')).to.equal('Beregningsgrunnlag.TilstottendeYtelse.DagpengerGrunnlag');

    expect(element).to.have.length(1);
    expect(element.children().at(0).text()).to.equal(formatCurrencyNoKr(320513));

    expect(normaltekst).to.have.length(3);
    expect(normaltekst.children().at(2).text()).to.equal(formatCurrencyNoKr(200000));
  });

  it('Skal teste at komponenten regner ut oppjustert dagsats korrekt for arbeidsavklaringspenger', () => {
    const wrapper = shallowWithIntl(<TilstotendeYtelser
      alleAndeler={[aapAndel]}
      isKombinasjonsstatus={false}
      skalViseOppjustertGrunnlag
    />);
    const element = wrapper.find('Element');
    const formattedMessage = wrapper.find('FormattedMessage');
    const normaltekst = wrapper.find('Normaltekst');

    expect(formattedMessage).to.have.length(2);
    expect(formattedMessage.at(0).prop('id')).to.equal('Beregningsgrunnlag.TilstottendeYtelse.AAPOppjustert');
    expect(formattedMessage.at(1).prop('id')).to.equal('Beregningsgrunnlag.TilstottendeYtelse.AAPGrunnlag');

    expect(element).to.have.length(1);
    expect(element.children().at(0).text()).to.equal(formatCurrencyNoKr(454545));

    expect(normaltekst).to.have.length(3);
    expect(normaltekst.children().at(2).text()).to.equal(formatCurrencyNoKr(300000));
  });

  it('Skal hente riktig tekst for andel brukt i beregning', () => {
    expect(getTekstForAndelBruktIBeregning(aapAndel, false)).to.equal('Beregningsgrunnlag.TilstottendeYtelse.AAP');
    expect(getTekstForAndelBruktIBeregning(aapAndel, true)).to.equal('Beregningsgrunnlag.TilstottendeYtelse.AAPOppjustert');
    expect(getTekstForAndelBruktIBeregning(dpAndel, false)).to.equal('Beregningsgrunnlag.TilstottendeYtelse.Dagpenger');
    expect(getTekstForAndelBruktIBeregning(dpAndel, true)).to.equal('Beregningsgrunnlag.TilstottendeYtelse.DagpengerOppjustert');
  });
});