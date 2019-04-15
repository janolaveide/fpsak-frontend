import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import { VerticalSpacer, ArrowBox } from '@fpsak-frontend/shared-components';
import { RadioOption, RadioGroupField } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';

import aktsomhet from 'behandlingTilbakekreving/src/kodeverk/aktsomhet';
import AktsomhetSarligeGrunnerFormPanel from './AktsomhetSarligeGrunnerFormPanel';

const AktsomhetGradUaktsomhetFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  erSerligGrunnAnnetValgt,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
}) => (
  <ArrowBox alignOffset={handletUaktsomhetGrad === aktsomhet.GROVT_UAKTSOM ? 120 : 285}>
    {(handletUaktsomhetGrad === aktsomhet.SIMPEL_UAKTSOM && erTotalBelopUnder4Rettsgebyr) && (
      <>
        <Undertekst><FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Tilbakekrev" /></Undertekst>
        <VerticalSpacer eightPx />
        <RadioGroupField
          validate={[required]}
          name="tilbakekrevSelvOmBeloepErUnder4Rettsgebyr"
          readOnly={readOnly}
        >
          <RadioOption label={<FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Ja" />} value>
            <AktsomhetSarligeGrunnerFormPanel
              harGrunnerTilReduksjon={harGrunnerTilReduksjon}
              erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
              sarligGrunnTyper={sarligGrunnTyper}
              harMerEnnEnYtelse={harMerEnnEnYtelse}
              feilutbetalingBelop={feilutbetalingBelop}
              readOnly={readOnly}
              handletUaktsomhetGrad={handletUaktsomhetGrad}
            />
          </RadioOption>
          <RadioOption label={<FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Nei" />} value={false}>
            <ArrowBox alignOffset={20}>
              <FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.AllePerioderBehandlesLikt" />
            </ArrowBox>
          </RadioOption>
        </RadioGroupField>
        <VerticalSpacer eightPx />
      </>
    )}
    {(handletUaktsomhetGrad !== aktsomhet.SIMPEL_UAKTSOM || !erTotalBelopUnder4Rettsgebyr) && (
      <AktsomhetSarligeGrunnerFormPanel
        harGrunnerTilReduksjon={harGrunnerTilReduksjon}
        erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse={harMerEnnEnYtelse}
        feilutbetalingBelop={feilutbetalingBelop}
        readOnly={readOnly}
        handletUaktsomhetGrad={handletUaktsomhetGrad}
      />
    )}
  </ArrowBox>
);

AktsomhetGradUaktsomhetFormPanel.propTypes = {
  harGrunnerTilReduksjon: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  erSerligGrunnAnnetValgt: PropTypes.bool.isRequired,
  harMerEnnEnYtelse: PropTypes.bool.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
  erTotalBelopUnder4Rettsgebyr: PropTypes.bool.isRequired,
  sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
};

AktsomhetGradUaktsomhetFormPanel.defaultProps = {
  harGrunnerTilReduksjon: undefined,
};

export default AktsomhetGradUaktsomhetFormPanel;