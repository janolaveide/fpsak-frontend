import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import classnames from 'classnames/bind';
import { Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import { calcDays, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import {
  FlexColumn, FlexContainer, FlexRow, Image,
} from '@fpsak-frontend/shared-components';
import overlapp from '@fpsak-frontend/assets/images/overlapp.svg';
import tomPeriode from '@fpsak-frontend/assets/images/tom_periode.svg';
import UttakPeriodeType from './UttakPeriodeType';
import UttakPeriodeInnhold from './UttakPeriodeInnhold';

import styles from './uttakPeriode.less';

const classNames = classnames.bind(styles);

const renderTomPeriode = (intl) => (
  <div className={styles.periodeIconWrapper}>
    <Image src={tomPeriode} alt={intl.formatMessage({ id: 'UttakInfoPanel.PeriodenharTommeDagerFremTilNestePeriode' })} />
    <Normaltekst><FormattedMessage id="UttakInfoPanel.TomPeriode" /></Normaltekst>
  </div>
);

const renderOverlappendePeriode = (intl) => (
  <div className={styles.periodeIconWrapper}>
    <Image src={overlapp} alt={intl.formatMessage({ id: 'UttakInfoPanel.PeriodenErOverlappende' })} />
    <Normaltekst><FormattedMessage id="UttakInfoPanel.OverlappendePeriode" /></Normaltekst>
  </div>
);

const renderValidationGraphic = (perioder, index, isLastIndex, intl) => {
  if (!isLastIndex) {
    const periode = perioder[index];
    const nextPeriode = perioder[index + 1];
    const diff = calcDays(periode.tom, nextPeriode.fom, ISO_DATE_FORMAT);

    if (moment(periode.tom) >= moment(nextPeriode.fom)) {
      return renderOverlappendePeriode(intl);
    }

    if (moment(periode.tom) < moment(nextPeriode.fom) && diff > 2) {
      return renderTomPeriode(intl);
    }
  }

  return null;
};

const getClassName = (periode, readOnly) => {
  if (periode.oppholdÅrsak && periode.oppholdÅrsak.kode !== '-') {
    return classNames('oppholdPeriodeContainer', { active: !periode.bekreftet && !readOnly });
  }
  return classNames('periodeContainer', { active: !periode.bekreftet && !readOnly });
};

const UttakPeriode = ({
  cancelEditPeriode,
  editPeriode,
  endringsdato,
  farSøkerFør6Uker,
  sisteUttakdatoFørsteSeksUker,
  fields,
  inntektsmeldingInfo,
  intl,
  isAnyFormOpen,
  isNyPeriodeFormOpen,
  meta,
  openSlettPeriodeModalCallback,
  perioder,
  getKodeverknavn,
  behandlingId,
  behandlingVersjon,
  behandlingStatus,
  familiehendelse,
  vilkarForSykdomExists,
  readOnly,
  updatePeriode,
}) => (
  <div>
    {meta.error && <AlertStripe className={styles.fullWidth} type="feil">{meta.error}</AlertStripe>}
    {meta.warning && <AlertStripe className={styles.fullWidth} type="info">{meta.warning}</AlertStripe>}

    <FlexContainer fluid wrap>
      {fields.map((fieldId, index, field) => {
        const periode = field.get(index);
        const harEndringsdatoSomErFørFørsteUttaksperiode = endringsdato ? moment(periode.fom).isAfter(endringsdato) : false;
        return (
          <React.Fragment key={fieldId}>
            <FlexRow>
              <FlexColumn className={styles.fullWidth}>
                {index === 0 && harEndringsdatoSomErFørFørsteUttaksperiode && renderTomPeriode(intl)}
                <div className={getClassName(periode, readOnly)}>
                  <UttakPeriodeType
                    bekreftet={periode.bekreftet}
                    tilDato={periode.tom}
                    fraDato={periode.fom}
                    openForm={periode.openForm}
                    uttakPeriodeType={periode.uttakPeriodeType}
                    id={periode.id}
                    arbeidstidprosent={periode.arbeidstidsprosent}
                    arbeidsgiver={periode.arbeidsgiver}
                    utsettelseArsak={periode.utsettelseÅrsak}
                    overforingArsak={periode.overføringÅrsak}
                    isFromSøknad={periode.isFromSøknad}
                    erSelvstendig={periode.erSelvstendig}
                    erFrilanser={periode.erFrilanser}
                    openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
                    editPeriode={editPeriode}
                    isAnyFormOpen={isAnyFormOpen}
                    isNyPeriodeFormOpen={isNyPeriodeFormOpen}
                    readOnly={readOnly}
                    getKodeverknavn={getKodeverknavn}
                    flerbarnsdager={periode.flerbarnsdager}
                    samtidigUttak={periode.samtidigUttak}
                    samtidigUttaksprosent={periode.samtidigUttaksprosent}
                    oppholdArsak={periode.oppholdÅrsak}
                  />
                  <UttakPeriodeInnhold
                    fieldId={fieldId}
                    bekreftet={periode.bekreftet}
                    utsettelseArsak={periode.utsettelseÅrsak}
                    openForm={periode.openForm}
                    arbeidstidprosent={periode.arbeidstidsprosent}
                    id={periode.id}
                    tilDato={periode.tom}
                    fraDato={periode.fom}
                    begrunnelse={periode.begrunnelse}
                    uttakPeriodeType={periode.uttakPeriodeType}
                    overforingArsak={periode.overføringÅrsak}
                    arbeidsgiver={periode.arbeidsgiver}
                    updatePeriode={updatePeriode}
                    cancelEditPeriode={cancelEditPeriode}
                    readOnly={readOnly}
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                    behandlingStatusKode={behandlingStatus.kode}
                    inntektsmeldingInfo={inntektsmeldingInfo[index]}
                    farSøkerFør6Uker={farSøkerFør6Uker}
                    sisteUttakdatoFørsteSeksUker={sisteUttakdatoFørsteSeksUker}
                    familiehendelse={familiehendelse}
                    vilkarForSykdomExists={vilkarForSykdomExists}
                    getKodeverknavn={getKodeverknavn}
                  />
                </div>
                {perioder.length === fields.length
                    && renderValidationGraphic(perioder, index, index === (fields.length - 1), intl)}
              </FlexColumn>
            </FlexRow>
          </React.Fragment>
        );
      })}
    </FlexContainer>
  </div>
);

UttakPeriode.propTypes = {
  intl: PropTypes.shape().isRequired,
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  openSlettPeriodeModalCallback: PropTypes.func.isRequired,
  updatePeriode: PropTypes.func.isRequired,
  editPeriode: PropTypes.func.isRequired,
  cancelEditPeriode: PropTypes.func.isRequired,
  isAnyFormOpen: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isNyPeriodeFormOpen: PropTypes.bool.isRequired,
  inntektsmeldingInfo: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())).isRequired,
  vilkarForSykdomExists: PropTypes.bool.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingStatus: PropTypes.shape().isRequired,
  familiehendelse: PropTypes.shape().isRequired,
  sisteUttakdatoFørsteSeksUker: PropTypes.shape().isRequired,
  endringsdato: PropTypes.string,
  farSøkerFør6Uker: PropTypes.bool,
};

UttakPeriode.defaultProps = {
  endringsdato: undefined,
  farSøkerFør6Uker: false,
};

export default injectIntl(UttakPeriode);
