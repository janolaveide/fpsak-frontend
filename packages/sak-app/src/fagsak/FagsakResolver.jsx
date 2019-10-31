import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  featureToggle,
  getLocationWithDefaultBehandlingspunktAndFakta,
  pathToBehandling,
  pathToBehandlinger,
  pathToMissingPage,
  requireProps,
} from '@fpsak-frontend/fp-felles';
import { fagsakPropType } from '@fpsak-frontend/prop-types';

import behandlingOrchestrator from '../behandling/BehandlingOrchestrator';
import { getFeatureToggles } from '../app/duck';
import { getBehandlingerIds } from '../behandling/selectors/behandlingerSelectors';
import { resetFagsakSearch as resetFagsakSearchActionCreator } from '../fagsakSearch/duck';
import { fetchKodeverk as fetchKodeverkActionCreator } from '../kodeverk/duck';
import { fetchFagsakInfo as fetchFagsakInfoActionCreator, resetFagsakContext as resetFagsakContextActionCreator } from './duck';
import {
  getAllFagsakInfoResolved, getFetchFagsakInfoFailed, getFetchFagsakInfoFinished, getSelectedFagsak, getSelectedSaksnummer,
} from './fagsakSelectors';

/**
 * FagsakResolver
 *
 * Container-komponent. Har ansvar for å hente info om fagsak med et gitt saksnummer fra serveren.
 * NB: Komponenten henter kun fagsak når den konstrueres. Bruk unik key.
 */
export class FagsakResolver extends Component {
  constructor(props) {
    super(props);
    this.resolveFagsakInfo = this.resolveFagsakInfo.bind(this);
    this.pathToBehandling = this.pathToBehandling.bind(this);

    this.resolveFagsakInfo();
  }

  componentWillUnmount() {
    const { resetFagsakContext, resetFagsakSearch } = this.props;
    resetFagsakContext();
    resetFagsakSearch();
  }

  resolveFagsakInfo() {
    const {
      selectedSaksnummer, fetchFagsakInfo, fetchKodeverk, disableTilbakekreving,
    } = this.props;

    if (disableTilbakekreving) {
      behandlingOrchestrator.disableTilbakekreving();
    }

    fetchKodeverk();
    fetchFagsakInfo(selectedSaksnummer);
  }

  pathToBehandling() {
    const { selectedSaksnummer, behandlingerIds, location } = this.props;
    if (behandlingerIds.length === 1) {
      return getLocationWithDefaultBehandlingspunktAndFakta({ ...location, pathname: pathToBehandling(selectedSaksnummer, behandlingerIds[0]) });
    }
    return pathToBehandlinger(selectedSaksnummer);
  }

  render() {
    const {
      fetchFagsakInfoPending, allFagsakInfoResolved, shouldRedirectToBehandlinger, children, selectedFagsak,
    } = this.props;
    if (!allFagsakInfoResolved) {
      if (fetchFagsakInfoPending) {
        return <LoadingPanel />;
      }
      return <Redirect to={pathToMissingPage()} />;
    }
    if (!selectedFagsak) {
      return <Redirect to={pathToMissingPage()} />;
    }
    if (shouldRedirectToBehandlinger) {
      return <Redirect to={this.pathToBehandling()} />;
    }
    return children;
  }
}

FagsakResolver.propTypes = {
  selectedSaksnummer: PropTypes.number.isRequired,
  selectedFagsak: fagsakPropType,
  behandlingerIds: PropTypes.arrayOf(PropTypes.number),
  fetchFagsakInfo: PropTypes.func.isRequired,
  resetFagsakContext: PropTypes.func.isRequired,
  resetFagsakSearch: PropTypes.func.isRequired,
  fetchKodeverk: PropTypes.func.isRequired,
  fetchFagsakInfoPending: PropTypes.bool.isRequired,
  allFagsakInfoResolved: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  shouldRedirectToBehandlinger: PropTypes.bool.isRequired,
  children: PropTypes.node,
  disableTilbakekreving: PropTypes.bool.isRequired,
};

FagsakResolver.defaultProps = {
  behandlingerIds: [],
  selectedFagsak: null,
  children: null,
};

const mapStateToProps = (state) => ({
  selectedSaksnummer: getSelectedSaksnummer(state),
  selectedFagsak: getSelectedFagsak(state),
  behandlingerIds: getBehandlingerIds(state),
  fetchFagsakInfoPending: !getFetchFagsakInfoFinished(state) || !getFetchFagsakInfoFailed(state),
  allFagsakInfoResolved: getAllFagsakInfoResolved(state),
  disableTilbakekreving: !getFeatureToggles(state)[featureToggle.AKTIVER_TILBAKEKREVINGBEHANDLING],
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchFagsakInfo: fetchFagsakInfoActionCreator,
  resetFagsakContext: resetFagsakContextActionCreator,
  resetFagsakSearch: resetFagsakSearchActionCreator,
  fetchKodeverk: fetchKodeverkActionCreator,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  shouldRedirectToBehandlinger: ownProps.match.isExact,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(requireProps(['selectedSaksnummer'], <LoadingPanel />)(FagsakResolver)));