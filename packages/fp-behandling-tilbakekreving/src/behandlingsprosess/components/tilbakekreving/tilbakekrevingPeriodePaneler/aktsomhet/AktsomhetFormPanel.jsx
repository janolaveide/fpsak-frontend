import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FormSection } from 'redux-form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Undertekst, Element } from 'nav-frontend-typografi';

import {
 required, minLength, maxLength, hasValidText, removeSpacesFromNumber,
} from '@fpsak-frontend/utils';
import { TextAreaField, RadioOption, RadioGroupField } from '@fpsak-frontend/form';

import Aktsomhet from 'behandlingTilbakekreving/src/kodeverk/aktsomhet';
import AktsomhetGradFormPanel from './AktsomhetGradFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const uaktsomhetCodes = [
  Aktsomhet.GROVT_UAKTSOM,
  Aktsomhet.SIMPEL_UAKTSOM,
  Aktsomhet.FORSETT,
];

const AktsomhetFormPanel = ({
  readOnly,
  resetFields,
  resetAnnetTextField,
  handletUaktsomhetGrad,
  harGrunnerTilReduksjon,
  erSerligGrunnAnnetValgt,
  aktsomhetTyper,
  sarligGrunnTyper,
  antallYtelser,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
}) => (
  <>
    <Element>
      <FormattedMessage id="AktsomhetFormPanel.Aktsomhet" />
    </Element>
    <VerticalSpacer eightPx />
    <TextAreaField
      name="aktsomhetBegrunnelse"
      label={{ id: 'AktsomhetFormPanel.Vurdering' }}
      validate={[required, minLength3, maxLength1500, hasValidText]}
      maxLength={1500}
      readOnly={readOnly}
    />
    <Undertekst>
      <FormattedMessage id="AktsomhetFormPanel.HandletUaktsomhetGrad" />
    </Undertekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      validate={[required]}
      name="handletUaktsomhetGrad"
      readOnly={readOnly}
      onChange={resetFields}
    >
      {aktsomhetTyper.map(vrt => (
        <RadioOption
          key={vrt.kode}
          label={vrt.navn}
          value={vrt.kode}
        />
      ))}
    </RadioGroupField>
    { uaktsomhetCodes.includes(handletUaktsomhetGrad) && (
      <FormSection name={handletUaktsomhetGrad} key={handletUaktsomhetGrad}>
        <AktsomhetGradFormPanel
          harGrunnerTilReduksjon={harGrunnerTilReduksjon}
          readOnly={readOnly}
          handletUaktsomhetGrad={handletUaktsomhetGrad}
          erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
          resetAnnetTextField={resetAnnetTextField}
          sarligGrunnTyper={sarligGrunnTyper}
          harMerEnnEnYtelse={antallYtelser > 1}
          feilutbetalingBelop={feilutbetalingBelop}
          erTotalBelopUnder4Rettsgebyr={erTotalBelopUnder4Rettsgebyr}
        />
      </FormSection>
    )}
  </>
);

AktsomhetFormPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  resetFields: PropTypes.func.isRequired,
  resetAnnetTextField: PropTypes.func.isRequired,
  harGrunnerTilReduksjon: PropTypes.bool,
  erSerligGrunnAnnetValgt: PropTypes.bool,
  handletUaktsomhetGrad: PropTypes.string,
  antallYtelser: PropTypes.number.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
  erTotalBelopUnder4Rettsgebyr: PropTypes.bool.isRequired,
  aktsomhetTyper: PropTypes.arrayOf(PropTypes.shape()),
  sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
};

AktsomhetFormPanel.defaultProps = {
  erSerligGrunnAnnetValgt: false,
  harGrunnerTilReduksjon: undefined,
  handletUaktsomhetGrad: undefined,
};

const formatAktsomhetData = (aktsomhet, sarligGrunnTyper) => {
  const sarligeGrunner = sarligGrunnTyper.reduce((acc, type) => (aktsomhet[type.kode] ? acc.concat({ kode: type.kode }) : acc), []);
  return {
    harGrunnerTilReduksjon: aktsomhet.harGrunnerTilReduksjon,
    ileggRenter: aktsomhet.skalDetTilleggesRenter,
    sarligGrunner: sarligeGrunner.length > 0 ? sarligeGrunner : undefined,
    andelTilbakekreves: aktsomhet.andelSomTilbakekreves,
    tilbakekrevesBelop: removeSpacesFromNumber(aktsomhet.belopSomSkalTilbakekreves),
    annetBegrunnelse: aktsomhet.annetBegrunnelse,
    tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: aktsomhet.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr,
  };
};

AktsomhetFormPanel.transformValues = (info, sarligGrunnTyper) => {
  const aktsomhet = info[info.handletUaktsomhetGrad];
  return {
    '@type': 'annet',
    aktsomhet: { kode: info.handletUaktsomhetGrad },
    begrunnelse: info.aktsomhetBegrunnelse,
    aktsomhetInfo: aktsomhet ? formatAktsomhetData(aktsomhet, sarligGrunnTyper) : null,
  };
};


AktsomhetFormPanel.buildInitalValues = (vilkarResultatInfo) => {
  const { aktsomhet, aktsomhetInfo, begrunnelse } = vilkarResultatInfo;
  const aktsomhetData = aktsomhetInfo ? {
    [aktsomhet.kode]: {
      harGrunnerTilReduksjon: aktsomhetInfo.harGrunnerTilReduksjon,
      skalDetTilleggesRenter: aktsomhetInfo.ileggRenter,
      andelSomTilbakekreves: aktsomhetInfo.andelTilbakekreves,
      belopSomSkalTilbakekreves: aktsomhetInfo.tilbakekrevesBelop,
      annetBegrunnelse: aktsomhetInfo.annetBegrunnelse,
      tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: aktsomhetInfo.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr,
      ...(aktsomhetInfo.sarligGrunner ? aktsomhetInfo.sarligGrunner.reduce((acc, sg) => ({ ...acc, [sg.kode]: true }), {}) : {}),
    },
  } : {};

  return {
    aktsomhetBegrunnelse: begrunnelse,
    handletUaktsomhetGrad: aktsomhet.kode,
    ...aktsomhetData,
  };
};

export default AktsomhetFormPanel;