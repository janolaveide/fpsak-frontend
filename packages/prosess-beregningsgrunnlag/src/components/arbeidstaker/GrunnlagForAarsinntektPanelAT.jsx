import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { behandlingFormValueSelector, getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { InputField } from '@fpsak-frontend/form';
import {
  Image, Table, TableColumn, TableRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import {
  formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber, required,
} from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import endretUrl from '@fpsak-frontend/assets/images/endret_felt.svg';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import NaturalytelsePanel from './NaturalytelsePanel';
import styles from './grunnlagForAarsinntektPanelAT.less';
import { createVisningsnavnForAktivitet } from '../util/visningsnavnHelper';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';

const formName = 'BeregningForm';

const andelErIkkeTilkommetEllerLagtTilAvSBH = (andel) => {
  // Andelen er fastsatt før og må kunne fastsettes igjen
  if (andel.overstyrtPrAar !== null && andel.overstyrtPrAar !== undefined) {
    return true;
  }

  // Andeler som er lagt til av sbh eller tilkom før stp skal ikke kunne endres på
  return andel.erTilkommetAndel === false && andel.lagtTilAvSaksbehandler === false;
};

const finnAndelerSomSkalVises = (andeler) => {
  if (!andeler) {
    return [];
  }

  return andeler
    .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER)
    .filter((andel) => andelErIkkeTilkommetEllerLagtTilAvSBH(andel));
};

const createTableRows = (relevanteAndeler, harAksjonspunkt, bruttoFastsattInntekt, readOnly, isAksjonspunktClosed, getKodeverknavn, intl) => {
  const beregnetAarsinntekt = relevanteAndeler.reduce((acc, andel) => acc + andel.beregnetPrAar, 0);
  const rows = relevanteAndeler.map((andel, index) => (
    <TableRow key={`index${index + 1}`}>
      <TableColumn>
        <Normaltekst>
          {createVisningsnavnForAktivitet(andel.arbeidsforhold, getKodeverknavn)}
        </Normaltekst>
      </TableColumn>
      <TableColumn><Normaltekst>{formatCurrencyNoKr(andel.beregnetPrAar)}</Normaltekst></TableColumn>
      { harAksjonspunkt
      && (
      <TableColumn className={styles.inntektField}>
        <div className={(isAksjonspunktClosed && readOnly) ? styles.adjustedField : undefined}>
          <InputField
            name={`inntekt${index}`}
            validate={[required]}
            readOnly={readOnly}
            parse={parseCurrencyInput}
            bredde="S"
          />
        </div>
      </TableColumn>
      )}
      { harAksjonspunkt && isAksjonspunktClosed && readOnly
      && (
      <TableColumn>
        <Image
          src={endretUrl}
          title={intl.formatMessage({ id: 'Behandling.EditedField' })}
        />
      </TableColumn>
      )}
    </TableRow>
  ));

  const summaryRow = (
    <TableRow key="bruttoBeregningsgrunnlag">
      <TableColumn><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.SumArbeidsinntekt" /></TableColumn>
      <TableColumn><Element>{formatCurrencyNoKr(beregnetAarsinntekt)}</Element></TableColumn>
      { harAksjonspunkt
    && (
    <TableColumn>
      <Element>{formatCurrencyNoKr(bruttoFastsattInntekt)}</Element>
    </TableColumn>
    )}
      { harAksjonspunkt && isAksjonspunktClosed && readOnly
      // For å matche den ekstra kolonnen som kommer på for "endret av saksbehandler" ikonet
      && <TableColumn />}
    </TableRow>
  );
  rows.push(summaryRow);

  return rows;
};

const harFastsettBgAtFlAksjonspunkt = (aksjonspunkter) => aksjonspunkter !== undefined && aksjonspunkter !== null
  && aksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS);

/**
 * GrunnlagForAarsinntektPanelAT
 *
 * Presentasjonskomponent. Viser beregningsgrunnlagstabellen for arbeidstakere.
 * Ved aksjonspunkt vil tabellen ha en kolonne med input felter med en rad per arbeidsgiver.
 * Vises også hvis status er en kombinasjonsstatus som inkluderer arbeidstaker.
 */
export const GrunnlagForAarsinntektPanelATImpl = ({
  intl,
  readOnly,
  alleAndeler,
  allePerioder,
  aksjonspunkter,
  bruttoFastsattInntekt,
  isAksjonspunktClosed,
  isKombinasjonsstatus,
  getKodeverknavn,
}) => {
  const headers = ['Beregningsgrunnlag.AarsinntektPanel.Arbeidsgiver', 'Beregningsgrunnlag.AarsinntektPanel.Inntekt'];
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndeler);
  const harAksjonspunkt = harFastsettBgAtFlAksjonspunkt(aksjonspunkter);
  if (harAksjonspunkt) {
    headers.push('Beregningsgrunnlag.AarsinntektPanel.FastsattInntekt');
  }
  return (
    <div className={styles.inntektTablePanel}>
      { isKombinasjonsstatus
      && (
      <div>
        <Element><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidstaker" /></Element>
        <VerticalSpacer eightPx />
      </div>
      )}
      <Table headerTextCodes={headers} noHover classNameTable={styles.inntektTable}>
        {createTableRows(relevanteAndeler, harAksjonspunkt, bruttoFastsattInntekt, readOnly, isAksjonspunktClosed, getKodeverknavn, intl)}
      </Table>
      <NaturalytelsePanel
        allePerioder={allePerioder}
      />

    </div>
  );
};

GrunnlagForAarsinntektPanelATImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  bruttoFastsattInntekt: PropTypes.number,
  aksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  isKombinasjonsstatus: PropTypes.bool.isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  getKodeverknavn: PropTypes.func.isRequired,
};

GrunnlagForAarsinntektPanelATImpl.defaultProps = {
  bruttoFastsattInntekt: 0,
  allePerioder: undefined,
};

const mapStateToProps = (state, initialProps) => {
  const getKodeverknavn = getKodeverknavnFn(initialProps.alleKodeverk, kodeverkTyper);
  const {
    alleAndeler, aksjonspunkter, behandlingId, behandlingVersjon,
  } = initialProps;
  const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS);
  const closedAps = aksjonspunkt ? !isAksjonspunktOpen(aksjonspunkt.status.kode) : false;
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndeler);
  const overstyrteInntekter = relevanteAndeler.map((inntekt, index) => {
    const overstyrtInntekt = behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(
      state, `inntekt${index}`,
    );
    return (overstyrtInntekt === undefined || overstyrtInntekt === '') ? 0 : removeSpacesFromNumber(overstyrtInntekt);
  });
  const bruttoFastsattInntekt = overstyrteInntekter.reduce((a, b) => a + b);
  return {
    isAksjonspunktClosed: closedAps,
    bruttoFastsattInntekt,
    getKodeverknavn,
  };
};

const GrunnlagForAarsinntektPanelAT = connect(mapStateToProps)(GrunnlagForAarsinntektPanelATImpl);

GrunnlagForAarsinntektPanelAT.buildInitialValues = (alleAndeler) => {
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndeler);
  const initialValues = { };
  relevanteAndeler.forEach((inntekt, index) => {
    initialValues[`inntekt${index}`] = formatCurrencyNoKr(inntekt.overstyrtPrAar);
  });
  return initialValues;
};

GrunnlagForAarsinntektPanelAT.transformValues = (values, relevanteStatuser, alleAndelerIForstePeriode) => {
  let inntektPrAndelList = null;
  let frilansInntekt = null;
  if (relevanteStatuser.isArbeidstaker) {
    inntektPrAndelList = finnAndelerSomSkalVises(alleAndelerIForstePeriode)
      .map(({ andelsnr }, index) => {
        const overstyrtInntekt = values[`inntekt${index}`];
        return {
          inntekt: (overstyrtInntekt === undefined || overstyrtInntekt === '') ? 0 : removeSpacesFromNumber(overstyrtInntekt),
          andelsnr,
        };
      });
  }
  if (relevanteStatuser.isFrilanser) {
    frilansInntekt = removeSpacesFromNumber(values.inntektFrilanser);
  }
  return {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    begrunnelse: values.ATFLVurdering,
    inntektFrilanser: frilansInntekt,
    inntektPrAndelList,
  };
};

export default injectIntl(GrunnlagForAarsinntektPanelAT);