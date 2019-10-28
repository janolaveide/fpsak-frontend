import React from 'react';
import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import vedtakAksjonspunkterPropType from '../propTypes/vedtakAksjonspunkterPropType';
import vedtakVilkarPropType from '../propTypes/vedtakVilkarPropType';
import vedtakBeregningsresultatPropType from '../propTypes/vedtakBeregningsresultatPropType';
import VedtakForm from './VedtakForm';
import VedtakRevurderingForm from './revurdering/VedtakRevurderingForm';

/*
 * VedtakPanels
 *
 * Presentasjonskomponent.
 */
const VedtakPanels = ({
  readOnly,
  previewCallback,
  submitCallback,
  behandlingTypeKode,
  behandlingId,
  behandlingVersjon,
  behandlingresultat,
  sprakkode,
  behandlingStatus,
  behandlingPaaVent,
  behandlingArsaker,
  erBehandlingHenlagt,
  tilbakekrevingvalg,
  simuleringResultat,
  resultatstruktur,
  medlemskapFom,
  aksjonspunkter,
  ytelseType,
  employeeHasAccess,
  alleKodeverk,
  vilkar,
  sendVarselOmRevurdering,
  resultatstrukturOriginalBehandling,
}) => {
  if (behandlingTypeKode === behandlingType.REVURDERING) {
    return (
      <VedtakRevurderingForm
        submitCallback={submitCallback}
        previewCallback={previewCallback}
        readOnly={readOnly}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        behandlingresultat={behandlingresultat}
        behandlingStatusKode={behandlingStatus.kode}
        ytelseType={ytelseType}
        sprakkode={sprakkode}
        kanOverstyre={employeeHasAccess}
        alleKodeverk={alleKodeverk}
        aksjonspunkter={aksjonspunkter}
        resultatstruktur={resultatstruktur}
        behandlingArsaker={behandlingArsaker}
        sendVarselOmRevurdering={sendVarselOmRevurdering}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskapFom={medlemskapFom}
        erBehandlingHenlagt={erBehandlingHenlagt}
        vilkar={vilkar}
        tilbakekrevingvalg={tilbakekrevingvalg}
        simuleringResultat={simuleringResultat}
      />
    );
  }

  return (
    <VedtakForm
      submitCallback={submitCallback}
      readOnly={readOnly}
      previewCallback={previewCallback}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      behandlingresultat={behandlingresultat}
      behandlingStatus={behandlingStatus}
      sprakkode={sprakkode}
      behandlingPaaVent={behandlingPaaVent}
      erBehandlingHenlagt={erBehandlingHenlagt}
      tilbakekrevingvalg={tilbakekrevingvalg}
      simuleringResultat={simuleringResultat}
      resultatstruktur={resultatstruktur}
      behandlingArsaker={behandlingArsaker}
      aksjonspunkter={aksjonspunkter}
      ytelseType={ytelseType}
      kanOverstyre={employeeHasAccess}
      alleKodeverk={alleKodeverk}
      vilkar={vilkar}
    />
  );
};

VedtakPanels.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingresultat: PropTypes.shape().isRequired,
  sprakkode: kodeverkObjektPropType.isRequired,
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  behandlingArsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  erBehandlingHenlagt: PropTypes.bool.isRequired,
  tilbakekrevingvalg: PropTypes.shape(),
  simuleringResultat: PropTypes.shape(),
  resultatstruktur: vedtakBeregningsresultatPropType,
  medlemskapFom: PropTypes.string,
  aksjonspunkter: PropTypes.arrayOf(vedtakAksjonspunkterPropType).isRequired,
  ytelseType: kodeverkObjektPropType.isRequired,
  employeeHasAccess: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  vilkar: PropTypes.arrayOf(vedtakVilkarPropType.isRequired),
  sendVarselOmRevurdering: PropTypes.bool.isRequired,
  resultatstrukturOriginalBehandling: vedtakBeregningsresultatPropType,
  readOnly: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  behandlingTypeKode: PropTypes.string.isRequired,
};

VedtakPanels.defaultProps = {
  tilbakekrevingvalg: undefined,
  simuleringResultat: undefined,
  resultatstruktur: undefined,
};

export default VedtakPanels;