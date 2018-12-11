import React from 'react';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import { getRangeOfMonths } from 'utils/dateUtils';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import avregningCodes from 'kodeverk/avregningCodes';
import mottakerTyper from 'kodeverk/avregningMottakerTyper';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import moment from 'moment/moment';
import CollapseButton from './CollapseButton';
import styles from './avregningTable.less';

const classNames = classnames.bind(styles);

const getHeaderCodes = (showCollapseButton, collapseProps, rangeOfMonths, nextPeriod) => {
  const firstElement = showCollapseButton ? <CollapseButton {...collapseProps} key={`collapseButton-${rangeOfMonths.length}`} /> : <div />;
  return [
    firstElement,
    ...rangeOfMonths.map(month => (
      <span
        className={classNames({ nextPeriod: `${month.month}${month.year}` === (nextPeriod ? moment(nextPeriod).format('MMMMYY') : false) })}
        key={`${month.month}-${month.year}`}
      >
        <FormattedHTMLMessage id={`Avregning.headerText.${month.month}`} />
      </span>
    )),
  ];
};

const showCollapseButton = mottakerResultatPerFag => mottakerResultatPerFag.some(fag => fag.rader.length > 1);

const rowToggable = (fagOmråde, rowIsFeilUtbetalt) => {
  const fagFeilUtbetalt = fagOmråde.rader.find(rad => rad.feltnavn === avregningCodes.DIFFERANSE);
  return fagFeilUtbetalt && !rowIsFeilUtbetalt;
};

const rowIsHidden = (isRowToggable, showDetails) => isRowToggable && !showDetails;

const createColumns = (perioder, rangeOfMonths, nextPeriod) => {
  const nextPeriodFormatted = `${moment(nextPeriod).format('MMMMYY')}`;

  const perioderData = rangeOfMonths.map((month) => {
    const periodeExists = perioder.find(periode => moment(periode.periode.tom).format('MMMMYY') === `${month.month}${month.year}`);
    return periodeExists || { måned: `${month.month}${month.year}`, beløp: null };
  });

  return perioderData.map((måned, månedIndex) => (
    <TableColumn
      key={`columnIndex${månedIndex + 1}`}
      className={classNames({
        rodTekst: måned.beløp < 0,
        lastColumn: måned.måned ? måned.måned === nextPeriodFormatted : moment(måned.periode.tom).format('MMMMYY') === nextPeriodFormatted,
      })}
    >
      {formatCurrencyNoKr(måned.beløp)}
    </TableColumn>
  ));
};

const tableTitle = mottaker => (mottaker.mottakerType.kode === mottakerTyper.ARBG
  ? (
    <Normaltekst className={styles.tableTitle}>
      {mottaker.mottakerNavn}
      {' '}
(
      {mottaker.mottakerNummer}
)
    </Normaltekst>
  )
  : null
);

const AvregningTable = ({ simuleringResultat, toggleDetails, showDetails }) => {
  const rangeOfMonths = getRangeOfMonths(
    simuleringResultat.periodeFom,
    simuleringResultat.nestUtbPeriodeTom ? simuleringResultat.nestUtbPeriodeTom : simuleringResultat.periodeTom,
  );
  return (
    simuleringResultat.perioderPerMottaker.map((mottaker, mottakerIndex) => (
      <div className={styles.table} key={`tableIndex${mottakerIndex + 1}`}>
        { tableTitle(mottaker) }
        <Table
          headerTextCodes={getHeaderCodes(
            showCollapseButton(mottaker.resultatPerFagområde),
            { toggleDetails, showDetails: showDetails[mottakerIndex] ? showDetails[mottakerIndex].show : false, mottakerIndex },
            rangeOfMonths,
            simuleringResultat.nestUtbPeriodeTom,
          )}
          allowFormattedHeader
          key={`tableIndex${mottakerIndex + 1}`}
        >
          {
          mottaker.resultatPerFagområde.map((fagOmråde, fagIndex) => fagOmråde.rader.filter((rad) => {
            const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
            const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
            return !rowIsHidden(isRowToggable, showDetails[mottakerIndex] ? showDetails[mottakerIndex].show : false);
          })
            .map((rad, rowIndex) => {
              const isFeilUtbetalt = rad.feltnavn === avregningCodes.DIFFERANSE;
              const isRowToggable = rowToggable(fagOmråde, isFeilUtbetalt);
              return (
                <TableRow
                  isBold={isFeilUtbetalt}
                  isDashedBottomBorder={isRowToggable}
                  isSolidBottomBorder={!isRowToggable}
                  key={`rowIndex${fagIndex + 1}${rowIndex + 1}`}
                >
                  <TableColumn>
                    <FormattedMessage id={`Avregning.${fagOmråde.fagOmrådeKode.kode}.${rad.feltnavn}`} />
                  </TableColumn>
                  {createColumns(rad.resultaterPerMåned, rangeOfMonths, simuleringResultat.nestUtbPeriodeTom)}
                </TableRow>
              );
            })).flat()
            .concat(mottaker.resultatOgMotregningRader.map((resultat, resultatIndex) => (
              <TableRow
                isBold={resultat.feltnavn !== avregningCodes.INNTREKKNESTEMÅNED}
                isSolidBottomBorder
                key={`rowIndex${resultatIndex + 1}`}
              >
                <TableColumn>
                  <FormattedMessage id={`Avregning.${resultat.feltnavn}`} />
                </TableColumn>
                {createColumns(resultat.resultaterPerMåned, rangeOfMonths, simuleringResultat.nestUtbPeriodeTom)}
              </TableRow>
            )))
        }
        </Table>
      </div>
    ))
  );
};

AvregningTable.propTypes = {
  toggleDetails: PropTypes.func.isRequired,
  showDetails: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  simuleringResultat: PropTypes.shape().isRequired,
};

export default AvregningTable;