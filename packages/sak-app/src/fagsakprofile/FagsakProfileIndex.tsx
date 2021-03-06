import React, {
  FunctionComponent, useState, useEffect, useCallback,
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Location } from 'history';
import { createSelector } from 'reselect';
import { Redirect, withRouter } from 'react-router-dom';

import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import BehandlingVelgerSakIndex from '@fpsak-frontend/sak-behandling-velger';
import FagsakProfilSakIndex from '@fpsak-frontend/sak-fagsak-profil';
import { Kodeverk, KodeverkMedNavn, Behandling } from '@fpsak-frontend/types';
import { DataFetcher, DataFetcherTriggers, EndpointOperations } from '@fpsak-frontend/rest-api-redux';

import {
  getLocationWithDefaultProsessStegAndFakta,
  pathToBehandling,
  pathToBehandlinger,
} from '../app/paths';
import { getEnabledApplicationContexts } from '../app/duck';
import ApplicationContextPath from '../behandling/ApplicationContextPath';
import BehandlingMenuDataResolver from '../behandlingmenu/BehandlingMenuDataResolver';
import fpsakApi from '../data/fpsakApi';
import {
  getFagsakYtelseType,
  getSelectedFagsakStatus,
  getSelectedSaksnummer,
  getSelectedFagsakDekningsgrad,
} from '../fagsak/fagsakSelectors';
import { getNoExistingBehandlinger } from '../behandling/selectors/behandlingerSelectors';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../behandling/duck';
import RisikoklassifiseringIndex from './risikoklassifisering/RisikoklassifiseringIndex';
import { getAlleKodeverk } from '../kodeverk/duck';

import styles from './fagsakProfileIndex.less';

const risikoklassifiseringData = [fpsakApi.RISIKO_AKSJONSPUNKT, fpsakApi.KONTROLLRESULTAT];

const behandlingerRestApis = {
  [ApplicationContextPath.FPSAK]: fpsakApi.BEHANDLINGER_FPSAK,
  [ApplicationContextPath.FPTILBAKE]: fpsakApi.BEHANDLINGER_FPTILBAKE,
};

export const getAlleBehandlinger = createSelector<{ behandlingerFpsak?: Behandling[]; behandlingerFptilbake?: Behandling[] }, Behandling[], Behandling[]>(
  [(props) => props.behandlingerFpsak, (props) => props.behandlingerFptilbake],
  (behandlingerFpsak = [], behandlingerFptilbake = []) => behandlingerFpsak.concat(behandlingerFptilbake),
);

const findPathToBehandling = (saksnummer, location, alleBehandlinger) => {
  if (alleBehandlinger.length === 1) {
    return getLocationWithDefaultProsessStegAndFakta({
      ...location,
      pathname: pathToBehandling(saksnummer, alleBehandlinger[0].id),
    });
  }
  return pathToBehandlinger(saksnummer);
};

interface OwnProps {
  enabledApis: EndpointOperations[];
  saksnummer: number;
  sakstype: Kodeverk;
  fagsakStatus: Kodeverk;
  selectedBehandlingId?: number;
  noExistingBehandlinger: boolean;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
  behandlingVersjon?: number;
  shouldRedirectToBehandlinger: boolean;
  location: Location;
  dekningsgrad: number;
}

export const FagsakProfileIndex: FunctionComponent<OwnProps> = ({
  sakstype,
  selectedBehandlingId,
  behandlingVersjon,
  alleKodeverk,
  noExistingBehandlinger,
  fagsakStatus,
  saksnummer,
  location,
  enabledApis,
  shouldRedirectToBehandlinger,
  dekningsgrad,
}) => {
  const [showAll, setShowAll] = useState(!selectedBehandlingId);
  const toggleShowAll = useCallback(() => setShowAll(!showAll), [showAll]);

  useEffect(() => {
    setShowAll(!selectedBehandlingId);
  }, [selectedBehandlingId]);

  const getBehandlingLocation = useCallback((behandlingId) => getLocationWithDefaultProsessStegAndFakta({
    ...location,
    pathname: pathToBehandling(saksnummer, behandlingId),
  }), [saksnummer]);

  return (
    <div className={styles.panelPadding}>
      <DataFetcher
        fetchingTriggers={new DataFetcherTriggers({ behandlingId: selectedBehandlingId, behandlingVersion: behandlingVersjon }, false)}
        endpointParams={{
          [fpsakApi.BEHANDLINGER_FPSAK.name]: { saksnummer },
          [fpsakApi.BEHANDLINGER_FPTILBAKE.name]: { saksnummer },
        }}
        showOldDataWhenRefetching
        endpoints={enabledApis}
        loadingPanel={<LoadingPanel />}
        render={(dataProps) => {
          const alleBehandlinger = getAlleBehandlinger(dataProps);
          if (shouldRedirectToBehandlinger) {
            return <Redirect to={findPathToBehandling(saksnummer, location, alleBehandlinger)} />;
          }
          return (
            <FagsakProfilSakIndex
              saksnummer={saksnummer}
              sakstype={sakstype}
              dekningsgrad={dekningsgrad}
              fagsakStatus={fagsakStatus}
              alleKodeverk={alleKodeverk}
              renderBehandlingMeny={() => <BehandlingMenuDataResolver />}
              renderBehandlingVelger={() => (
                <BehandlingVelgerSakIndex
                  behandlinger={alleBehandlinger}
                  getBehandlingLocation={getBehandlingLocation}
                  noExistingBehandlinger={noExistingBehandlinger}
                  behandlingId={selectedBehandlingId}
                  showAll={showAll}
                  toggleShowAll={toggleShowAll}
                  alleKodeverk={alleKodeverk}
                />
              )}
            />
          );
        }}
      />
      <DataFetcher
        fetchingTriggers={new DataFetcherTriggers({ behandlingId: selectedBehandlingId, behandlingVersion: behandlingVersjon }, true)}
        showComponent={risikoklassifiseringData.every((d) => d.isEndpointEnabled())}
        endpoints={risikoklassifiseringData}
        showOldDataWhenRefetching
        render={(dataProps) => <RisikoklassifiseringIndex {...dataProps} />}
        loadingPanel={<LoadingPanel />}
      />
    </div>
  );
};

export const getEnabledApis = createSelector(
  [getEnabledApplicationContexts],
  (enabledApplicationContexts) => enabledApplicationContexts.map((c) => behandlingerRestApis[c]),
);

const mapStateToProps = (state) => ({
  enabledApis: getEnabledApis(state),
  saksnummer: getSelectedSaksnummer(state),
  dekningsgrad: getSelectedFagsakDekningsgrad(state),
  sakstype: getFagsakYtelseType(state),
  fagsakStatus: getSelectedFagsakStatus(state),
  selectedBehandlingId: getSelectedBehandlingId(state),
  noExistingBehandlinger: getNoExistingBehandlinger(state),
  alleKodeverk: getAlleKodeverk(state),
  behandlingVersjon: getBehandlingVersjon(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
  },
  dispatch,
);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  shouldRedirectToBehandlinger: ownProps.match.isExact,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(requireProps(['saksnummer'], <LoadingPanel />)(FagsakProfileIndex)),
);
