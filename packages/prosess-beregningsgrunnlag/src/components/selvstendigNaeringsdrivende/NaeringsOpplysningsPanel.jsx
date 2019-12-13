import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  DateLabel, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { dateFormat, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import styles from './naeringsOpplysningsPanel.less';

const virksomhetsDatoer = (naringsAndel) => {
  const { oppstartsdato, opphoersdato } = naringsAndel;
  if (!oppstartsdato) {
    return undefined;
  }
  return opphoersdato ? `${dateFormat(oppstartsdato)}-${dateFormat(opphoersdato)} ` : `${dateFormat(oppstartsdato)}-`;
};

const revisorDetaljer = (naringsAndel) => {
  const { navn, telefon } = naringsAndel;
  if (!navn) {
    return '';
  }
  return telefon ? `${navn}-${telefon} ` : `${dateFormat(navn)}-`;
};


const lagBeskrivelsePanel = (naringsAndel, intl) => (
  <>
    <Lesmerpanel
      className={styles.lesMer}
      intro={(
        <>
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <Normaltekst>
                  <FormattedMessage id="Beregningsgrunnlag.NaeringsOpplysningsPanel.Begrunnelse" />
                </Normaltekst>
              </FlexColumn>
              <FlexColumn>
                <Normaltekst className={beregningStyles.semiBoldText}>
                  <DateLabel dateString={naringsAndel.endringsdato} />
                </Normaltekst>
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </>
)}
      lukkTekst={intl.formatMessage({ id: 'Beregningsgrunnlag.NaeringsOpplysningsPanel.SkjulBegrunnelse' })}
      apneTekst={intl.formatMessage({ id: 'Beregningsgrunnlag.NaeringsOpplysningsPanel.VisBegrunnelse' })}
      defaultApen
    >
      <Normaltekst className={styles.beskrivelse}>
        {naringsAndel.begrunnelse}
      </Normaltekst>
    </Lesmerpanel>

  </>
);

export const NaeringsopplysningsPanel = ({
  alleAndelerIForstePeriode,
  intl,
}) => {
  const snAndel = alleAndelerIForstePeriode.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  if (!snAndel.næringer) {
    return null;
  }

  return (
    <Panel className={beregningStyles.panel}>
      <Element className={beregningStyles.semiBoldText}>
        <FormattedMessage id="Beregningsgrunnlag.NaeringsOpplysningsPanel.Overskrift" />
      </Element>
      <Row key="SNInntektIngress">
        <Column xs="8" />
        <Column xs="4">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.NaeringsOpplysningsPanel.OppgittAar" />
          </Normaltekst>
        </Column>
      </Row>
      <VerticalSpacer fourPx />
      {snAndel.næringer.map((naring) => (
        <React.Fragment key={`NaringsWrapper${naring.orgnr}`}>
          <Row key={`NaringsNavn${naring.orgnr}`}>
            <Column xs="6">
              <Normaltekst>
                <span>Bedriftsnavn</span>
              </Normaltekst>
            </Column>
            <Column xs="2">
              <Normaltekst>
                {naring.virksomhetType && naring.virksomhetType.kode ? naring.virksomhetType.kode : ''}
              </Normaltekst>
            </Column>
            <Column xs="4">
              <Normaltekst>
                {formatCurrencyNoKr(naring.oppgittInntekt)}
              </Normaltekst>
            </Column>
          </Row>
          <Row key={`NaringsDetaljer${naring.orgnr}`}>
            <Column xs="2">
              <Normaltekst>
                {naring && naring.orgnr ? naring.orgnr : ''}
              </Normaltekst>
            </Column>
            <Column xs="2">
              <Normaltekst>
                {virksomhetsDatoer(naring)}
              </Normaltekst>
            </Column>
          </Row>
          <Row key={`RevisorRad${naring.orgnr}`}>
            <Column xs="10">
              <Normaltekst>
                {revisorDetaljer(naring)}
              </Normaltekst>
            </Column>
          </Row>
          <Row>
            {lagBeskrivelsePanel(naring, intl)}
          </Row>
        </React.Fragment>
      ))}
    </Panel>
  );
};

NaeringsopplysningsPanel.propTypes = {
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
};
NaeringsopplysningsPanel.defaultProps = {
  alleAndelerIForstePeriode: undefined,
};


export default injectIntl(NaeringsopplysningsPanel);