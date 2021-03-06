import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import {
  DDMMYYYY_DATE_FORMAT, hasValidDecimal, ISO_DATE_FORMAT, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import OAType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { DatepickerField, DecimalField, InputField } from '@fpsak-frontend/form';

import styles from './activityDataSubPanel.less';

const ytelseTypes = [OAType.SYKEPENGER, OAType.FORELDREPENGER, OAType.PLEIEPENGER, OAType.SVANGERSKAPSPENGER, OAType.UTENLANDSK_ARBEIDSFORHOLD];

const isOfType = (selectedActivityType, ...opptjeningAktivitetType) => selectedActivityType && opptjeningAktivitetType.includes(selectedActivityType.kode);

const formatDate = (date) => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const minValue0 = minValue(0);
const maxValue200 = maxValue(200);

const getOppdragsgiverMessageId = (selectedActivityType) => (isOfType(selectedActivityType, OAType.FRILANS)
  ? 'ActivityPanel.Oppdragsgiver' : 'ActivityPanel.Arbeidsgiver');

const getArbeidsgiverText = (initialValues) => {
  if (initialValues.privatpersonNavn && initialValues.privatpersonFødselsdato) {
    const fodselsdato = formatDate(initialValues.privatpersonFødselsdato);
    return `${initialValues.privatpersonNavn} (${fodselsdato})`;
  }
  if (initialValues.arbeidsgiver) {
    return initialValues.oppdragsgiverOrg ? `${initialValues.arbeidsgiver} (${initialValues.oppdragsgiverOrg})` : initialValues.arbeidsgiver;
  }
  return '-';
};

const isManuallyAddedAndNotUtenlandskArbeidsforhold = (
  isManuallyAdded, selectedActivityType,
) => isManuallyAdded && !isOfType(selectedActivityType, OAType.UTENLANDSK_ARBEIDSFORHOLD);
const isManuallyAddedAndUtenlandskArbeidsforhold = (
  isManuallyAdded, selectedActivityType,
) => isManuallyAdded && isOfType(selectedActivityType, OAType.UTENLANDSK_ARBEIDSFORHOLD);

/**
 * ActivityDataSubPanel
 *
 * Presentasjonskomponent. Viser informasjon om valgt aktivitet
 */
const ActivityDataSubPanel = ({
  initialValues,
  readOnly,
  isManuallyAdded,
  selectedActivityType,
}) => (
  <>
    {isOfType(selectedActivityType, ...[OAType.ARBEID, OAType.NARING, ...ytelseTypes]) && (
      <Row>
        <Column xs="7">
          {!isManuallyAdded && (
            <>
              <VerticalSpacer eightPx />
              <Undertekst>
                <FormattedMessage id={getOppdragsgiverMessageId(selectedActivityType)} />
              </Undertekst>
              <div className={styles.arbeidsgiver}>
                <Normaltekst>{getArbeidsgiverText(initialValues)}</Normaltekst>
              </div>
            </>
          )}
          {isManuallyAddedAndNotUtenlandskArbeidsforhold(isManuallyAdded, selectedActivityType) && (
            <InputField
              name="oppdragsgiverOrg"
              label={{ id: 'ActivityPanel.Organisasjonsnr' }}
              validate={[required]}
              readOnly={readOnly}
              bredde="S"
            />
          )}
          {isManuallyAddedAndUtenlandskArbeidsforhold(isManuallyAdded, selectedActivityType) && (
            <InputField
              name="arbeidsgiver"
              label={{ id: 'ActivityPanel.Arbeidsgiver' }}
              validate={[required]}
              readOnly={readOnly}
              bredde="XL"
            />
          )}
        </Column>
        {isOfType(selectedActivityType, OAType.ARBEID) && (
          <Column xs="5">
            <DecimalField
              name="stillingsandel"
              label={{ id: 'ActivityPanel.Stillingsandel' }}
              validate={[required, minValue0, maxValue200, hasValidDecimal]}
              readOnly={readOnly || !isManuallyAdded}
              bredde="S"
              format={(value) => (readOnly || !isManuallyAdded ? `${value} %` : value)}
              normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
            />
          </Column>
        )}
      </Row>
    )}
    <VerticalSpacer eightPx />
    {isOfType(selectedActivityType, OAType.NARING) && (
      <Row>
        <Column xs="8">
          <DatepickerField
            name="naringRegistreringsdato"
            label={{ id: 'ActivityPanel.Registreringsdato' }}
            readOnly
          />
        </Column>
      </Row>
    )}
  </>
);

ActivityDataSubPanel.propTypes = {
  initialValues: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  isManuallyAdded: PropTypes.bool.isRequired,
  selectedActivityType: PropTypes.shape(),
};

ActivityDataSubPanel.defaultProps = {
  selectedActivityType: {},
};

export default ActivityDataSubPanel;
