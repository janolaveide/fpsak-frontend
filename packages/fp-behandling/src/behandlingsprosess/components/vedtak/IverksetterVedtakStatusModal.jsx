import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Modal, Image } from '@fpsak-frontend/shared-components';

import { getFagsakYtelseType } from 'behandlingFpsak/src/duck';
import { getResolveProsessAksjonspunkterSuccess } from 'behandlingFpsak/src/behandlingsprosess/duck';
import { getResolveFaktaAksjonspunkterSuccess } from 'behandlingFpsak/src/fakta/duck';
import {
  getBehandlingResultatstruktur,
  getBehandlingsresultat,
  getBehandlingStatus,
  getBehandlingType,
} from 'behandlingFpsak/src/behandlingSelectors';
import {
  getBehandlingsresultatFraOriginalBehandling,
  getResultatstrukturFraOriginalBehandling,
} from 'behandlingFpsak/src/selectors/originalBehandlingSelectors';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import styles from './iverksetterVedtakStatusModal.less';

/**
 * IverksetterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir den NAV-ansatte tatt tilbake til sokesiden.
 */
class IverksetterVedtakStatusModal extends Component {
  constructor() {
    super();
    this.showModal = false;
  }

  render() {
    const {
      intl, closeEvent, modalTextId, behandlingsresultat, behandlingStatusKode,
      resolveProsessAksjonspunkterSuccess, resolveFaktaAksjonspunkterSuccess,
    } = this.props;
    const rejected = behandlingsresultat
      && behandlingsresultat.type.kode === behandlingResultatType.AVSLATT;

    if (!this.showModal && behandlingStatusKode === behandlingStatus.IVERKSETTER_VEDTAK) {
      this.showModal = resolveProsessAksjonspunkterSuccess || resolveFaktaAksjonspunkterSuccess;
    }

    return (
      <Modal
        className={styles.modal}
        isOpen={this.showModal}
        closeButton={false}
        contentLabel={intl.formatMessage({ id: 'IverksetterVedtakStatusModal.ModalDescription' })}
        onRequestClose={closeEvent}
      >
        <Row>
          <Column xs="1">
            <Image
              className={styles.image}
              altCode={rejected ? 'IverksetterVedtakStatusModal.Avslatt' : 'IverksetterVedtakStatusModal.Innvilget'}
              src={innvilgetImageUrl}
            />
            <div className={styles.divider} />
          </Column>
          <Column xs="9">
            <Normaltekst>
              <FormattedMessage id={modalTextId} />
            </Normaltekst>
            <Normaltekst>
              <FormattedMessage id="IverksetterVedtakStatusModal.GoToSearchPage" />
            </Normaltekst>
          </Column>
          <Column xs="2">
            <Hovedknapp
              mini
              className={styles.button}
              onClick={closeEvent}
              autoFocus
            >
              {intl.formatMessage({ id: 'IverksetterVedtakStatusModal.Ok' })}
            </Hovedknapp>
          </Column>

        </Row>
      </Modal>
    );
  }
}

IverksetterVedtakStatusModal.propTypes = {
  intl: intlShape.isRequired,
  closeEvent: PropTypes.func.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  resolveFaktaAksjonspunkterSuccess: PropTypes.bool.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingsresultat: PropTypes.shape(),
  modalTextId: PropTypes.string.isRequired,
};

IverksetterVedtakStatusModal.defaultProps = {
  behandlingsresultat: undefined,
};

const erSammeResultatPåEngangsstønad = (behandlingsresultat,
  originalBehandlingsresultat,
  originaltBeregningResultat,
  resultatstruktur) => {
  const sameResult = behandlingsresultat && behandlingsresultat.type.kode === originalBehandlingsresultat.type.kode;
  if (sameResult && resultatstruktur && resultatstruktur.antallBarn && behandlingsresultat.type.kode === behandlingResultatType.INNVILGET) {
    return resultatstruktur.antallBarn === originaltBeregningResultat.antallBarn;
  }
  return false;
};

const erSammeResultatForForeldrepenger = (behandlingsresultat) => {
  if (!behandlingsresultat || !behandlingsresultat.konsekvensForYtelsen) {
    return false;
  }
  return behandlingsresultat.konsekvensForYtelsen.map(({ kode }) => kode).includes(konsekvensForYtelsen.INGEN_ENDRING);
};

const getIsSameResultAsOriginalBehandling = createSelector(
  [getBehandlingType, getBehandlingsresultat, getBehandlingResultatstruktur,
    getBehandlingsresultatFraOriginalBehandling, getResultatstrukturFraOriginalBehandling, getFagsakYtelseType],
  (type, behandlingsresultat, resultatstruktur, originalBehandlingsresultat, originaltBeregningResultat, ytelseType) => {
    if (type !== behandlingType.REVURDERING) {
      return false;
    }
    if (ytelseType === fagsakYtelseType.ENGANGSSTONAD) {
      return erSammeResultatPåEngangsstønad(behandlingsresultat, originalBehandlingsresultat, originaltBeregningResultat, resultatstruktur);
    }
    if (ytelseType === fagsakYtelseType.FORELDREPENGER) {
      return erSammeResultatForForeldrepenger(behandlingsresultat);
    }
    return false;
  },
);


const getModalTextId = createSelector(
  [getFagsakYtelseType, getBehandlingsresultat, getIsSameResultAsOriginalBehandling],
  (ytelseType, behandlingsresultat, isSameResultAsOriginalBehandling) => {
    if (isSameResultAsOriginalBehandling) {
      return 'IverksetterVedtakStatusModal.UendretUtfall';
    }
    if (!(behandlingsresultat
      && behandlingsresultat.type.kode === behandlingResultatType.AVSLATT)) {
      return 'IverksetterVedtakStatusModal.InnvilgetOgIverksatt';
    }
    return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
      ? 'IverksetterVedtakStatusModal.AvslattOgIverksattES' : 'IverksetterVedtakStatusModal.AvslattOgIverksattFP';
  },
);

const mapStateToProps = state => ({
  behandlingsresultat: getBehandlingsresultat(state),
  behandlingStatusKode: getBehandlingStatus(state).kode,
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  resolveFaktaAksjonspunkterSuccess: getResolveFaktaAksjonspunkterSuccess(state),
  modalTextId: getModalTextId(state),

});

export default connect(mapStateToProps)(injectIntl(IverksetterVedtakStatusModal));