import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';

import { Normaltekst, Element } from 'nav-frontend-typografi';
import { behandlingForm } from 'behandlingFpsak/behandlingForm';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import {
  required, minLength, maxLength, hasValidText, createVisningsnavnForAktivitet,
} from '@fpsak-frontend/utils';
import BehandlingspunktSubmitButton from 'behandlingFpsak/behandlingsprosess/components/BehandlingspunktSubmitButton';
import { Column, Row } from 'nav-frontend-grid';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer, Image, BorderBox } from '@fpsak-frontend/shared-components';
import behandleImageURL from '@fpsak-frontend/assets/images/advarsel.svg';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import aksjonspunktStatus, { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { getAksjonspunkter, getBehandlingVenteArsakKode, getAndelerMedGraderingUtenBG } from 'behandlingFpsak/behandlingSelectors';
import styles from './graderingUtenBG.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

const formName = 'graderingUtenBGForm';
const begrunnelseFieldName = 'begrunnelse';
const radioFieldName = 'graderingUtenBGSettPaaVent';

const lagArbeidsgiverString = (andelerMedGraderingUtenBG) => {
  if (!andelerMedGraderingUtenBG || andelerMedGraderingUtenBG.length < 1) {
    return '';
  }
  if (andelerMedGraderingUtenBG.length === 1) {
    return createVisningsnavnForAktivitet(andelerMedGraderingUtenBG[0].arbeidsforhold);
  }
  const arbeidsgiverVisningsnavn = andelerMedGraderingUtenBG.map(andel => (andel.arbeidsforhold
    ? createVisningsnavnForAktivitet(andel.arbeidsforhold) : andel.aktivitetStatus.kode));
  const sisteNavn = arbeidsgiverVisningsnavn.splice(andelerMedGraderingUtenBG.length - 1);
  const tekst = arbeidsgiverVisningsnavn.join(', ');
  return `${tekst} og ${sisteNavn}`;
};

export const GraderingUtenBG = ({
  andelerMedGraderingUtenBG,
  readOnly,
  aksjonspunkt,
  ...formProps
}) => {
  if (!aksjonspunkt || !andelerMedGraderingUtenBG || andelerMedGraderingUtenBG.length === 0) {
    return null;
  }
  let aksjonspunktTekstId = 'Beregningsgrunnlag.Gradering.AksjonspunkttekstEtForhold';
  if (andelerMedGraderingUtenBG && andelerMedGraderingUtenBG.length > 1) {
    aksjonspunktTekstId = 'Beregningsgrunnlag.Gradering.AksjonspunkttekstFlereForhold';
  }
  return (
    <BorderBox>
      <form onSubmit={formProps.handleSubmit}>
        <Element>
          <FormattedMessage id="Beregningsgrunnlag.Gradering.Tittel" />
        </Element>
        <VerticalSpacer sixteenPx />
        <Row>
          <Column xs="1">
            <Image className={styles.image} src={behandleImageURL} />
            <div className={styles.divider} />
          </Column>
          <Column xs="11">
            <Normaltekst>
              <FormattedMessage id={aksjonspunktTekstId} values={{ arbeidsforholdTekst: lagArbeidsgiverString(andelerMedGraderingUtenBG) }} />
            </Normaltekst>
          </Column>
        </Row>
        <VerticalSpacer twentyPx />
        <Row>
          <Column xs="9">
            <RadioGroupField
              name={radioFieldName}
              validate={[required]}
              direction="vertical"
              readOnly={readOnly}
              isEdited={!isAksjonspunktOpen(aksjonspunkt.status.kode)}
            >
              <RadioOption
                label={<FormattedMessage id="Beregningsgrunnlag.Gradering.FordelingErRiktig" />}
                value={false}
              />
              <RadioOption
                label={<FormattedMessage id="Beregningsgrunnlag.Gradering.FordelingMåVurderes" />}
                value
              />
            </RadioGroupField>
          </Column>
        </Row>
        <Row>
          <Column xs="6">
            <TextAreaField
              name={begrunnelseFieldName}
              label={<FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />}
              validate={[required, maxLength1500, minLength3, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
            />
          </Column>
        </Row>
        <Row>
          <Column xs="1">
            <VerticalSpacer eightPx />
            <BehandlingspunktSubmitButton formName={formProps.form} isReadOnly={readOnly} isSubmittable={!readOnly} />
          </Column>
        </Row>
      </form>
    </BorderBox>
  );
};

GraderingUtenBG.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  andelerMedGraderingUtenBG: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  submitCallback: PropTypes.func.isRequired,
  aksjonspunkt: PropTypes.shape(),
};

GraderingUtenBG.defaultProps = {
  aksjonspunkt: undefined,
};


export const transformValues = (values) => {
  const skalSettesPaaVent = values[radioFieldName];
  const begrunnelse = values[begrunnelseFieldName];
  return {
    kode: aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG,
    begrunnelse,
    skalSettesPaaVent,
  };
};

export const buildInitialValues = createSelector(
  [getAksjonspunkter, getBehandlingVenteArsakKode],
  (aksjonspunkter, venteKode) => {
    const vurderGraderingUtenBGAP = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG);
    const settPaaVentAap = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.AUTO_VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG);
    if (!vurderGraderingUtenBGAP || vurderGraderingUtenBGAP.status.kode !== aksjonspunktStatus.UTFORT) {
      return undefined;
    }
    if (vurderGraderingUtenBGAP && !settPaaVentAap) {
      return {
        graderingUtenBGSettPaaVent: false,
        begrunnelse: vurderGraderingUtenBGAP.begrunnelse,
      };
    }
    if (vurderGraderingUtenBGAP && settPaaVentAap && settPaaVentAap.status.kode === aksjonspunktStatus.UTFORT) {
      return {
        graderingUtenBGSettPaaVent: false,
        begrunnelse: vurderGraderingUtenBGAP.begrunnelse,
      };
    }
    if (venteKode && venteKode === venteArsakType.VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG) {
      return {
        graderingUtenBGSettPaaVent: true,
        begrunnelse: vurderGraderingUtenBGAP.begrunnelse,
      };
    }
    return undefined;
  },
);


const mapStateToProps = (state, ownProps) => ({
  andelerMedGraderingUtenBG: getAndelerMedGraderingUtenBG(state),
  aksjonspunkt: getAksjonspunkter(state).find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG),
  onSubmit: values => ownProps.submitCallback([transformValues(values)]),
  initialValues: buildInitialValues(state),
});

export default connect(mapStateToProps)(behandlingForm({ form: formName })(GraderingUtenBG));
