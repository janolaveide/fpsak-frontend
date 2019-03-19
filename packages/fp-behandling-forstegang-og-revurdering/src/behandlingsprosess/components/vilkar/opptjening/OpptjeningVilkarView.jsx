import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';

import VilkarResultPanel from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/VilkarResultPanel';
import {
  getBehandlingFastsattOpptjeningFomDate, getBehandlingFastsattOpptjeningTomDate, getBehandlingFastsattOpptjeningActivities,
  getBehandlingFastsattOpptjeningperiodeMnder, getBehandlingFastsattOpptjeningperiodeDager,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import {
  getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus,
} from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/behandlingsprosessSelectors';
import { getKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { VerticalSpacer, FadingPanel, PeriodLabel } from '@fpsak-frontend/shared-components';
import OpptjeningTimeLineLight from './OpptjeningTimeLineLight';

/**
 * OpptjeningVilkarView
 *
 * Presentasjonskomponent. Viser resultatet av opptjeningsvilkåret.
 */
export const OpptjeningVilkarViewImpl = ({
  erVilkarOk,
  fastsattOpptjeningActivities,
  monthsAndDays,
  opptjeningFomDate,
  opptjeningTomDate,
  hasAksjonspunkt,
  readOnly,
  isAksjonspunktOpen,
  avslagsarsaker,
  status,
  ...formProps
}) => (
  <FadingPanel withoutTopMargin>
    <form onSubmit={formProps.handleSubmit}>
      {isAksjonspunktOpen
        && <VilkarResultPanel status={status} />
      }
      <VerticalSpacer fourPx />
      <FormattedMessage
        id="OpptjeningVilkarView.MonthsAndDays"
        values={{ months: monthsAndDays.months, days: monthsAndDays.days }}
      />
      <Normaltekst>
        <PeriodLabel dateStringFom={opptjeningFomDate} dateStringTom={opptjeningTomDate} />
      </Normaltekst>
      <VerticalSpacer fourPx />
      { fastsattOpptjeningActivities.length > 0
      && (
      <OpptjeningTimeLineLight
        opptjeningPeriods={fastsattOpptjeningActivities}
        opptjeningFomDate={opptjeningFomDate}
        opptjeningTomDate={opptjeningTomDate}
      />
      )
      }
    </form>
  </FadingPanel>
);

OpptjeningVilkarViewImpl.propTypes = {
  erVilkarOk: PropTypes.bool.isRequired,
  fastsattOpptjeningActivities: PropTypes.arrayOf(PropTypes.shape()),
  monthsAndDays: PropTypes.shape().isRequired,
  opptjeningFomDate: PropTypes.string.isRequired,
  opptjeningTomDate: PropTypes.string.isRequired,
  hasAksjonspunkt: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
  status: PropTypes.string.isRequired,
};

OpptjeningVilkarViewImpl.defaultProps = {
  fastsattOpptjeningActivities: [],
  hasAksjonspunkt: false,
};

const monthsAndDays = createSelector(
  [getBehandlingFastsattOpptjeningperiodeMnder, getBehandlingFastsattOpptjeningperiodeDager],
  (opptjeningperiodeMnder, opptjeningperiodeDager) => ({ months: opptjeningperiodeMnder, days: opptjeningperiodeDager }),
);

const mapStateToProps = state => ({
  status: getSelectedBehandlingspunktStatus(state),
  erVilkarOk: getSelectedBehandlingspunktStatus(state) === vilkarUtfallType.OPPFYLT,
  monthsAndDays: monthsAndDays(state),
  hasAksjonspunkt: getSelectedBehandlingspunktAksjonspunkter(state).length > 0,
  fastsattOpptjeningActivities: getBehandlingFastsattOpptjeningActivities(state),
  opptjeningFomDate: getBehandlingFastsattOpptjeningFomDate(state),
  opptjeningTomDate: getBehandlingFastsattOpptjeningTomDate(state),
  avslagsarsaker: getKodeverk(kodeverkTyper.AVSLAGSARSAK)(state)[vilkarType.OPPTJENINGSVILKARET],
});

const OpptjeningVilkarView = connect(mapStateToProps)(behandlingForm({
  form: 'OpptjeningVilkarForm',
})(OpptjeningVilkarViewImpl));

OpptjeningVilkarView.supports = behandlingspunkt => behandlingspunkt === behandlingspunktCodes.OPPTJENING;

export default OpptjeningVilkarView;