import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingForm } from 'behandlingFpsak/src/behandlingForm';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { PersonIndex, faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import Panel from 'nav-frontend-paneler';
import { Hovedknapp } from 'nav-frontend-knapper';
import styles from './PersonIndexPanel.less';

const personAksjonspunkter = [aksjonspunktCodes.INNHENT_DOKUMENTASJON_FRA_UTENLANDS_TRYGDEMYNDIGHET];
const erMarkertUtenlandssak = aksjonspunkter => aksjonspunkter.some(ap => ap.definisjon.kode === personAksjonspunkter[0]);

/**
 * Container component. Viser grunnleggende personinformasjon. Dette panelet blir
 * vist som del av søkeresultatet, når fagsaken ikke har behandling eller ved papirsøknad
 */
const PersonIndexPanelImpl = ({
  person,
  aksjonspunkter,
  readOnly,
  ...formProps
}) => (
  <Panel>
    {person
    && <PersonIndex person={person} />
    }
    {erMarkertUtenlandssak(aksjonspunkter)
    && (
      <form onSubmit={formProps.handleSubmit}>
        <div className={styles.bekreftAksjonspunktContainer}>
          <AksjonspunktHelpText isAksjonspunktOpen={erMarkertUtenlandssak(aksjonspunkter)}>
            {[<FormattedMessage key="OpptjeningUtland" id="PersonInfoPanel.OpptjeningUtland" />]}
          </AksjonspunktHelpText>
          {!readOnly
            && (
            <Hovedknapp mini className={styles.button} spinner={formProps.submitting} disabled={readOnly || formProps.submitting}>
              <FormattedMessage id="OkAvbrytModal.Ok" />
            </Hovedknapp>
            )
          }
        </div>
      </form>
    )}
  </Panel>
);

PersonIndexPanelImpl.propTypes = {
  person: PropTypes.shape(),
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  readOnly: PropTypes.bool.isRequired,
};

PersonIndexPanelImpl.defaultProps = {
  person: undefined,
};

const mapStateToProps = (state, initialProps) => ({
  onSubmit: () => initialProps.submitCallback([{
    kode: personAksjonspunkter[0],
    begrunnelse: '',
  }]),
});

const ConnectedComponent = connect(mapStateToProps)(behandlingForm({
  form: 'PersonIndexPanel',
})(PersonIndexPanelImpl));

const PersonIndexPanel = withDefaultToggling(faktaPanelCodes.PERSON, personAksjonspunkter)(ConnectedComponent);

export default PersonIndexPanel;