import React from 'react';
import {
  withKnobs, object, text,
} from '@storybook/addon-knobs';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import FodselSammenligningIndex from '@fpsak-frontend/prosess-fakta-fodsel-sammenligning';

import withReduxProvider from '../../decorators/withRedux';

const avklartBarn = [{
  fodselsdato: '2019-01-10',
  dodsdato: '2019-01-10',
  fnr: '1213200001',
}];

const soknad = {
  fodselsdatoer: { 1: '2019-01-10' },
  termindato: '2019-01-01',
  utstedtdato: '2019-01-02',
  antallBarn: 1,
};

const originalBehandling = {
  soknad,
  familiehendelse: {
    termindato: '2019-01-01',
    fodselsdato: '2019-01-10',
    antallBarnTermin: 1,
    antallBarnFodsel: 1,
  },
};

export default {
  title: 'prosessOgFakta/prosess-fakta-fodsel-sammenligning',
  component: FodselSammenligningIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForNårBehandlingstypeErRevurdering = () => (
  <FodselSammenligningIndex
    behandlingsTypeKode={behandlingType.REVURDERING}
    avklartBarn={object('avklartBarn', avklartBarn)}
    termindato={text('termindato', '2019-01-01')}
    vedtaksDatoSomSvangerskapsuke={text('vedtaksDatoSomSvangerskapsuke', '2019-01-01')}
    soknad={object('soknad', soknad)}
    originalBehandling={object('originalBehandling', originalBehandling)}
  />
);

export const visPanelForNårBehandlingstypeErFørstegangssoknad = () => (
  <FodselSammenligningIndex
    behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
    avklartBarn={object('avklartBarn', avklartBarn)}
    termindato={text('termindato', '2019-01-01')}
    vedtaksDatoSomSvangerskapsuke={text('vedtaksDatoSomSvangerskapsuke', '2019-01-01')}
    soknad={object('soknad', soknad)}
    originalBehandling={object('originalBehandling', originalBehandling)}
  />
);
