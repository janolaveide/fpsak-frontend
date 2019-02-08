import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import { isSelectedBehandlingspunktOverrideReadOnly } from 'behandlingFpsak/src/behandlingsprosess/behandlingsprosessSelectors';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-behandling-felles';
import { getAksjonspunkter, getBehandlingResultatstruktur } from 'behandlingFpsak/src/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingFpsak/src/behandlingForm';
import {
  VerticalSpacer, FadingPanel, FlexContainer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import {
  required, minValue, maxValue, hasValidInteger, formatCurrencyWithKr,
} from '@fpsak-frontend/utils';
import { InputField } from '@fpsak-frontend/form';
import OverstyrVurderingChecker from 'behandlingFpsak/src/behandlingsprosess/components/OverstyrVurderingChecker';
import OverstyrConfirmationForm from 'behandlingFpsak/src/behandlingsprosess/components/OverstyrConfirmationForm';
import OverstyrConfirmVilkarButton from 'behandlingFpsak/src/behandlingsprosess/components/OverstyrConfirmVilkarButton';
import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import styles from './beregningsresultatEngangsstonadForm.less';

const minValue1 = minValue(1);
const maxValue500000 = maxValue(500000);

/**
 * BeregningsresultatEngangsstonadForm
 *
 * Presentasjonskomponent. Viser beregnet engangsstønad. Resultatet kan overstyres av Nav-ansatt
 * med overstyr-rettighet.
 */
export const BeregningsresultatEngangsstonadFormImpl = ({
  intl,
  beregningResultat,
  isOverstyrt,
  isReadOnly,
  ...formProps
}) => (
  <FadingPanel>
    <form onSubmit={formProps.handleSubmit}>
      <Row>
        <Column xs="9">
          <Undertittel>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.Beregning' })}</Undertittel>
        </Column>
        <Column xs="3">
          <OverstyrVurderingChecker isBeregningOverstyrer aksjonspunktCode={aksjonspunktCode.OVERSTYR_BEREGNING} resetValues={formProps.reset} />
        </Column>
      </Row>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="3">
          <Undertekst>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.BeregnetEngangsstonad' })}</Undertekst>
          {(!isOverstyrt || isReadOnly)
          && <Normaltekst>{formatCurrencyWithKr(beregningResultat.beregnetTilkjentYtelse)}</Normaltekst>
        }
          {isOverstyrt && !isReadOnly
          && (
          <FlexContainer fluid>
            <FlexRow>
              <FlexColumn>
                <InputField
                  name="beregningResultat.beregnetTilkjentYtelse"
                  parse={(value) => {
                    const parsedValue = parseInt(value, 10);
                    return Number.isNaN(parsedValue) ? value : parsedValue;
                  }}
                  validate={[required, hasValidInteger, minValue1, maxValue500000]}
                  bredde="XS"
                />
              </FlexColumn>
              <FlexColumn>
                <Normaltekst className={styles.editAdjuster}>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.Kroner' })}</Normaltekst>
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
          )
        }
        </Column>
        <Column xs="2">
          <Undertekst>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.AntallBarn' })}</Undertekst>
          <Normaltekst className={isOverstyrt && !isReadOnly ? styles.editAdjuster : ''}>{beregningResultat.antallBarn}</Normaltekst>
        </Column>
        <Column xs="2">
          <Undertekst>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.Sats' })}</Undertekst>
          <Normaltekst className={isOverstyrt && !isReadOnly ? styles.editAdjuster : ''}>{formatCurrencyWithKr(beregningResultat.satsVerdi)}</Normaltekst>
        </Column>
      </Row>
      {isOverstyrt
      && (
      <div>
        <OverstyrConfirmationForm isBeregningConfirmation formProps={formProps} />
        <OverstyrConfirmVilkarButton submitting={formProps.submitting} pristine={formProps.pristine} />
      </div>
      )
    }
    </form>
  </FadingPanel>
);

BeregningsresultatEngangsstonadFormImpl.propTypes = {
  intl: intlShape.isRequired,
  beregningResultat: PropTypes.shape(),
  isOverstyrt: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  ...formPropTypes,
};

BeregningsresultatEngangsstonadFormImpl.defaultProps = {
  beregningResultat: {
    beregnetTilkjentYtelse: 0,
    antallBarn: 0,
    satsVerdi: 0,
  },
  isOverstyrt: false,
  isReadOnly: false,
};

const buildInitialValues = createSelector([getAksjonspunkter, getBehandlingResultatstruktur], (aksjonspunkter, beregningResultat) => {
  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCode.OVERSTYR_BEREGNING);
  return {
    beregningResultat,
    isOverstyrt: aksjonspunkt !== undefined,
    ...OverstyrConfirmationForm.buildInitialValues(aksjonspunkt),
  };
});

const transformValues = values => ({
  kode: aksjonspunktCode.OVERSTYR_BEREGNING,
  beregnetTilkjentYtelse: values.beregningResultat.beregnetTilkjentYtelse,
  ...OverstyrConfirmationForm.transformValues(values),
});

const formName = 'BeregningsresultatEngangsstonadForm';

const mapStateToProps = (state, ownProps) => ({
  initialValues: buildInitialValues(state),
  isReadOnly: isSelectedBehandlingspunktOverrideReadOnly(state),
  onSubmit: values => ownProps.submitCallback([transformValues(values)]),
  ...behandlingFormValueSelector(formName)(state, 'beregningResultat', 'isOverstyrt'),
});

const BeregningsresultatEngangsstonadForm = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: formName,
})(BeregningsresultatEngangsstonadFormImpl)));

BeregningsresultatEngangsstonadForm.supports = behandlingspunkt => behandlingspunkt === behandlingspunktCodes.BEREGNING;

export default BeregningsresultatEngangsstonadForm;