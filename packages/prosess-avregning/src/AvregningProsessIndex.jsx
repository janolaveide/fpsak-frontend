import React from 'react';
import PropTypes from 'prop-types';

import { CustomLanguageProvider } from '@fpsak-frontend/fp-felles';
import AvregningPanel from './components/AvregningPanel';
import avregningFagsakPropType from './propTypes/avregningFagsakPropType';
import avregningBehandlingPropType from './propTypes/avregningBehandlingPropType';
import avregningAksjonspunkterPropType from './propTypes/avregningAksjonspunkterPropType';
import avregningSimuleringResultatPropType from './propTypes/avregningSimuleringResultatPropType';
import messages from '../i18n/nb_NO';

const AvregningProsessIndex = ({
  fagsak,
  behandling,
  aksjonspunkter,
  simuleringResultat,
  tilbakekrevingvalg,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  apCodes,
  isApOpen,
  previewCallback,
  featureToggles,
}) => (
  <CustomLanguageProvider messages={messages}>
    <AvregningPanel
      fagsak={fagsak}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      sprakkode={behandling.sprakkode}
      aksjonspunkter={aksjonspunkter}
      simuleringResultat={simuleringResultat}
      tilbakekrevingvalg={tilbakekrevingvalg}
      featureToggles={featureToggles}
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      apCodes={apCodes}
      isApOpen={isApOpen}
      previewCallback={previewCallback}
    />
  </CustomLanguageProvider>
);

AvregningProsessIndex.propTypes = {
  fagsak: avregningFagsakPropType.isRequired,
  behandling: avregningBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(avregningAksjonspunkterPropType).isRequired,
  simuleringResultat: avregningSimuleringResultatPropType,
  tilbakekrevingvalg: PropTypes.shape(),
  submitCallback: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApOpen: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  featureToggles: PropTypes.shape().isRequired,
};

AvregningProsessIndex.defaultProps = {
  simuleringResultat: undefined,
  tilbakekrevingvalg: undefined,
};

export default AvregningProsessIndex;
