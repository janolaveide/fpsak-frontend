import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme/build';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import AksjonspunktHelpTextV2 from '../redesign/AksjonspunktHelpText_V2';
import { BeregningFormImpl2, transformValues } from './BeregningForm_V2';
import AvviksopplysningerPanel from '../fellesPaneler/AvvikopplysningerPanel';
import SkjeringspunktOgStatusPanel2 from '../fellesPaneler/SkjeringspunktOgStatusPanel_V2';
import AksjonspunktBehandler from '../fellesPaneler/AksjonspunktBehandler';
import Beregningsgrunnlag2 from '../beregningsgrunnlagPanel/Beregningsgrunnlag_V2';

const apVurderDekningsgrad = {
  definisjon: {
    kode: aksjonspunktCodes.VURDER_DEKNINGSGRAD,
    navn: 'apNavn2',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn2',
  },
  kanLoses: true,
  erAktivt: true,
};
const apFastsettBgATFL = {
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    navn: 'apNavn1',
  },
  status: {
    kode: 'UTFO',
    navn: 'statusNavn1',
  },
  kanLoses: false,
  erAktivt: false,
};

const apVurderVarigEndretEllerNyoppstartetSN = {
  definisjon: {
    kode: aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    navn: 'apNavn3',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn3',
  },
  kanLoses: true,
  erAktivt: true,
};

const apFastsettBgSnNyIArbeidslivet = {
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
    navn: 'apNavn4',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn4',
  },
  kanLoses: true,
  erAktivt: true,
};
const apFastsettBgTidsbegrensetArbeidsforhold = {
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
    navn: 'apNavn5',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn5',
  },
  kanLoses: true,
  erAktivt: true,
};

const apEttLukketOgEttApent = [apFastsettBgATFL, apVurderDekningsgrad];

const allAndeler = [{
  aktivitetStatus: {
    kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  },
  elementNavn: 'arbeidsgiver 1',
  beregnetPrAar: 200000,
  overstyrtPrAar: 100,
}];
const allPerioder = [{
  bruttoPrAar: 300000,
  beregningsgrunnlagPrStatusOgAndel: allAndeler,
}];

const relevanteStatuser = {
  isArbeidstaker: true,
  isKombinasjonsstatus: true,
};
const lagPeriode = () => ({
  beregningsgrunnlagPeriodeFom: '2019-09-16',
  beregningsgrunnlagPeriodeTom: undefined,
  beregnetPrAar: 360000,
  bruttoPrAar: 360000,
  bruttoInkludertBortfaltNaturalytelsePrAar: 360000,
  avkortetPrAar: 360000,
  redusertPrAar: 360000,
  beregningsgrunnlagPrStatusOgAndel: [{
    aktivitetStatus: {
      kode: 'AT',
      kodeverk: 'AKTIVITET_STATUS',
    },
  }],
  andelerLagtTilManueltIForrige: [],
});
const lagBeregningsgrunnlag = (avvikPromille, årsinntektVisningstall,
  sammenligningSum, dekningsgrad, tilfeller) => ({
  beregningsgrunnlagPeriode: [lagPeriode()],
  sammenligningsgrunnlag: {
    avvikPromille,
    rapportertPrAar: sammenligningSum,
  },
  dekningsgrad,
  årsinntektVisningstall,
  faktaOmBeregning: {
    faktaOmBeregningTilfeller: tilfeller,
  },
});
const alleKodeverk = {
  test: 'test',
};
const mockVilkar = [{
  vilkarType: {
    kode: 'FP_VK_41',
  },
  vilkarStatus: {
    kode: vilkarUtfallType.OPPFYLT,
  },
}];

lagBeregningsgrunnlag(0, 100000, 100000, 100, []);
const getBGVilkar = (vilkar) => (vilkar ? vilkar.find((v) => v.vilkarType && v.vilkarType.kode === vilkarType.BEREGNINGSGRUNNLAGVILKARET) : undefined);
describe('<BeregningForm2>', () => {
  it('skal teste at AvviksopplysningerPanel får korrekte props fra BeregningFP', () => {
    const wrapper = shallow(<BeregningFormImpl2
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const avvikPanel = wrapper.find(AvviksopplysningerPanel);
    expect(avvikPanel.props().beregnetAarsinntekt).to.have.equal(100000);
    expect(avvikPanel.props().sammenligningsgrunnlag).to.have.equal(100000);
    expect(avvikPanel.props().avvik).to.have.equal(0);
    const expectedPerioder = lagPeriode();
    expect(avvikPanel.props().allePerioder[0]).to.eql(expectedPerioder);
  });
  it('skal teste at SkjeringspunktOgStatusPanel får korrekte props fra BeregningFP', () => {
    const wrapper = shallow(<BeregningFormImpl2
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 120000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const skjeringspunktOgStatusPanel = wrapper.find(SkjeringspunktOgStatusPanel2);
    expect(skjeringspunktOgStatusPanel.props().gjeldendeAksjonspunkter).to.equal(apEttLukketOgEttApent);
  });

  it('skal teste at Aksjonspunktbehandler får korrekte props fra BeregningFP', () => {
    const wrapper = shallow(<BeregningFormImpl2
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 120000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const aksjonspunktBehandler = wrapper.find(AksjonspunktBehandler);
    expect(aksjonspunktBehandler.props().readOnly).to.have.equal(false);
    expect(aksjonspunktBehandler.props().tidsBegrensetInntekt).to.have.equal(false);
    const expectedPerioder = lagPeriode();
    expect(aksjonspunktBehandler.props().allePerioder[0]).to.eql(expectedPerioder);
    expect(aksjonspunktBehandler.props().aksjonspunkter).to.eql(apEttLukketOgEttApent);
  });

  it('skal teste at Beregningsgrunnlag får korrekte props fra BeregningFP', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = true;
    const wrapper = shallow(<BeregningFormImpl2
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const formName = 'BeregningForm';
    const beregningsgrunnlag = wrapper.find(Beregningsgrunnlag2);
    expect(beregningsgrunnlag.props().relevanteStatuser).to.have.equal(relevanteStatuser);
    expect(beregningsgrunnlag.props().readOnly).to.have.equal(false);
    expect(beregningsgrunnlag.props().gjeldendeAksjonspunkter).to.have.equal(apEttLukketOgEttApent);
    expect(beregningsgrunnlag.props().formName).to.have.equal(formName);
    expect(beregningsgrunnlag.props().readOnlySubmitButton).to.have.equal(true);
    expect(beregningsgrunnlag.props().submitCallback).to.have.equal(sinon.spy);
    const expectedPerioder = lagPeriode();
    expect(beregningsgrunnlag.props().allePerioder[0]).to.eql(expectedPerioder);
  });

  it('skal teste at Beregningsgrunnlag ikke blir vist', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = false;
    const wrapper = shallow(<BeregningFormImpl2
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const beregningsgrunnlag = wrapper.find(Beregningsgrunnlag2);
    expect(beregningsgrunnlag).to.have.lengthOf(0);
  });

  it('skal teste et ett åpent aksjonspunkt og ett lukket aksjonspunkt blir vist riktig', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = false;
    const wrapper = shallow(<BeregningFormImpl2
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const aksjonspunkter = wrapper.find(AksjonspunktHelpTextV2);
    const aktiveAksjonspunkter = aksjonspunkter.get(0);
    const lukkedeAksjonspunkter = aksjonspunkter.get(1);
    expect(aksjonspunkter).to.have.lengthOf(2);
    expect(aktiveAksjonspunkter.props.children[0].key).to.have.equal('5087');
    expect(aktiveAksjonspunkter.props.isAksjonspunktOpen).to.have.equal(true);
    expect(aktiveAksjonspunkter.props.children[0].props.id).to.have.equal('Beregningsgrunnlag.Helptext.BarnetHarDødDeFørsteSeksUkene');
    expect(lukkedeAksjonspunkter.props.children[0].key).to.have.equal('5038');
    expect(lukkedeAksjonspunkter.props.isAksjonspunktOpen).to.have.equal(false);
    expect(lukkedeAksjonspunkter.props.children[0].props.id).to.have.equal('Beregningsgrunnlag.Helptext.Arbeidstaker');
  });

  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5039, samt varigEndring', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
      erVarigEndretNaering: true,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder);
    expect(result).to.have.lengthOf(3);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5039');
    expect(result[2].kode).to.have.equal('5042');
  });

  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5039, uten varigEndring', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
      erVarigEndretNaering: false,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5039');
  });

  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5049', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apFastsettBgSnNyIArbeidslivet];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5049');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5047', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apFastsettBgTidsbegrensetArbeidsforhold];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5047');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5039', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5039');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087', () => {
    const values = {
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
    };
    const aksjonspunkt = [apVurderDekningsgrad];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5087');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5039', () => {
    const values = {
      fellesVurdering: 'bbb',
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkt = [apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5039');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5049', () => {
    const values = {
      fellesVurdering: 'bbb',
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkt = [apFastsettBgSnNyIArbeidslivet];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5049');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5047', () => {
    const values = {};
    const aksjonspunkt = [apFastsettBgTidsbegrensetArbeidsforhold];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5047');
  });
});