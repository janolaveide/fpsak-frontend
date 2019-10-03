import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';

import withReduxProvider from '../../decorators/withRedux';

const personstatusKodeverk = 'PERSONSTATUS_TYPE';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingHenlagt: false,
};

const medlemskap = {
  fom: '2019-01-01',
};

const personopplysninger = {
  personstatus: {
    kode: personstatusType.DOD,
    kodeverk: personstatusKodeverk,
  },
  avklartPersonstatus: {
    orginalPersonstatus: {
      kode: personstatusType.BOSATT,
      kodeverk: personstatusKodeverk,
    },
    overstyrtPersonstatus: {
      kode: personstatusType.DOD,
      kodeverk: personstatusKodeverk,
    },
  },
};

const alleKodeverk = {
  [kodeverkTyper.PERSONSTATUS_TYPE]: [{
    kode: personstatusType.DOD,
    navn: 'Død',
    kodeverk: personstatusKodeverk,
  }, {
    kode: personstatusType.BOSATT,
    navn: 'Bosatt',
    kodeverk: personstatusKodeverk,
  }, {
    kode: personstatusType.UTVANDRET,
    navn: 'Utvandret',
    kodeverk: personstatusKodeverk,
  }],
};


export default {
  title: 'prosess/CheckPersonStatusIndex',
  component: CheckPersonStatusIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunkt = () => (
  <CheckPersonStatusIndex
    behandling={object('behandling', behandling)}
    medlemskap={object('medlemskap', medlemskap)}
    personopplysninger={object('personopplysninger', personopplysninger)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnly', true)}
  />
);

export const visUtførtAksjonspunkt = () => (
  <CheckPersonStatusIndex
    behandling={object('behandling', behandling)}
    medlemskap={object('medlemskap', medlemskap)}
    personopplysninger={object('personopplysninger', personopplysninger)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
      begrunnelse: 'Dette er en begrunnelse',
    }]}
    alleKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    readOnly
    readOnlySubmitButton
  />
);