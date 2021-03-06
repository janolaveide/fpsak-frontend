import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import MedlemskapInfoPanel from './components/MedlemskapInfoPanel';
import medlemskapAksjonspunkterPropType from './propTypes/medlemskapAksjonspunkterPropType';
import medlemskapMedlemskapPropType from './propTypes/medlemskapMedlemskapPropType';
import medlemskapBehandlingPropType from './propTypes/medlemskapBehandlingPropType';
import medlemskapSoknadPropType from './propTypes/medlemskapSoknadPropType';
import medlemskapInntektArbeidYtelsePropType from './propTypes/medlemskapInntektArbeidYtelsePropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const MedlemskapFaktaIndex = ({
  behandling,
  soknad,
  inntektArbeidYtelse,
  medlemskap,
  aksjonspunkter,
  harApneAksjonspunkter,
  submittable,
  fagsakPerson,
  isForeldrepengerFagsak,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  submitCallback,
  readOnly,
  readOnlyForStartdatoForForeldrepenger,
}) => (
  <RawIntlProvider value={intl}>
    <MedlemskapInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      behandlingStatus={behandling.status}
      behandlingPaaVent={behandling.behandlingPaaVent}
      soknad={soknad}
      inntektArbeidYtelse={inntektArbeidYtelse}
      medlemskap={medlemskap}
      fagsakPerson={fagsakPerson}
      aksjonspunkter={aksjonspunkter}
      hasOpenAksjonspunkter={harApneAksjonspunkter}
      submittable={submittable}
      isForeldrepenger={isForeldrepengerFagsak}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlyForStartdatoForForeldrepenger={readOnlyForStartdatoForForeldrepenger}
    />
  </RawIntlProvider>
);

MedlemskapFaktaIndex.propTypes = {
  behandling: medlemskapBehandlingPropType.isRequired,
  medlemskap: medlemskapMedlemskapPropType.isRequired,
  soknad: medlemskapSoknadPropType.isRequired,
  inntektArbeidYtelse: medlemskapInntektArbeidYtelsePropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(medlemskapAksjonspunkterPropType).isRequired,
  fagsakPerson: PropTypes.shape().isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  isForeldrepengerFagsak: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlyForStartdatoForForeldrepenger: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
};

export default MedlemskapFaktaIndex;
