import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import {
  PeriodLabel, Table, TableColumn, TableRow,
} from '@fpsak-frontend/shared-components';

import styles from './tilbakekrevingVedtakPeriodeTabell.less';

const headerTextCodes = [
  'TilbakekrevingVedtakPeriodeTabell.Periode',
  'TilbakekrevingVedtakPeriodeTabell.FeilutbetaltBelop',
  'TilbakekrevingVedtakPeriodeTabell.Vurdering',
  'TilbakekrevingVedtakPeriodeTabell.AndelAvBelop',
  'TilbakekrevingVedtakPeriodeTabell.Renter',
  'TilbakekrevingVedtakPeriodeTabell.ForSkatt',
  'TilbakekrevingVedtakPeriodeTabell.BelopSomTilbakekreves',
];

const TilbakekrevingVedtakPeriodeTabell = ({
  perioder,
  getKodeverknavn,
}) => {
  const rader = perioder.map((periode) => (
    <TableRow key={periode.periode.fom}>
      <TableColumn><Normaltekst><PeriodLabel dateStringFom={periode.periode.fom} dateStringTom={periode.periode.tom} /></Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{formatCurrencyNoKr(periode.feilutbetaltBeløp)}</Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{getKodeverknavn(periode.vurdering)}</Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{periode.andelAvBeløp ? `${periode.andelAvBeløp}%` : ''}</Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{periode.renterProsent ? `${periode.renterProsent}%` : ''}</Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{formatCurrencyNoKr(periode.tilbakekrevingBeløp)}</Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{formatCurrencyNoKr(periode.tilbakekrevingBeløpEtterSkatt)}</Normaltekst></TableColumn>
    </TableRow>
  )).concat(
    <TableRow key="sum">
      <TableColumn><Normaltekst><FormattedMessage id="TilbakekrevingVedtakPeriodeTabell.Sum" /></Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{formatCurrencyNoKr(perioder.reduce((sum, periode) => sum + periode.feilutbetaltBeløp, 0))}</Normaltekst></TableColumn>
      <TableColumn />
      <TableColumn />
      <TableColumn />
      <TableColumn><Element>{formatCurrencyNoKr(perioder.reduce((sum, periode) => sum + periode.tilbakekrevingBeløp, 0))}</Element></TableColumn>
      <TableColumn><Element>{formatCurrencyNoKr(perioder.reduce((sum, periode) => sum + periode.tilbakekrevingBeløpEtterSkatt, 0))}</Element></TableColumn>
    </TableRow>,
  );

  return (
    <div className={styles.table}>
      <Table noHover headerTextCodes={headerTextCodes}>
        {rader}
      </Table>
    </div>
  );
};

TilbakekrevingVedtakPeriodeTabell.propTypes = {
  perioder: PropTypes.arrayOf(PropTypes.shape()),
  getKodeverknavn: PropTypes.func.isRequired,
};

export default TilbakekrevingVedtakPeriodeTabell;
