import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Hovedknapp } from 'nav-frontend-knapper';

import { ariaCheck, isRequiredMessage } from '@fpsak-frontend/utils';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';

import ApprovalField from './ApprovalField';

import styles from './ToTrinnsForm.less';

const allApproved = (formState) => formState
  .reduce((a, b) => a.concat(b.aksjonspunkter), [])
  .every((ap) => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true);

const allSelected = (formState) => formState
  .reduce((a, b) => a.concat(b.aksjonspunkter), [])
  .every((ap) => ap.totrinnskontrollGodkjent !== null);


/*
  * ToTrinnsForm
  *
  * Presentasjonskomponent. Holds the form of the totrinnkontroll
  */
export const ToTrinnsFormImpl = ({
  handleSubmit,
  formState,
  forhandsvisVedtaksbrev,
  readOnly,
  totrinnskontrollContext,
  erBehandlingEtterKlage,
  erKlageWithKA,
  erKlage,
  behandlingKlageVurdering,
  behandlingStatus,
  isForeldrepengerFagsak,
  alleKodeverk,
  ...formProps
}) => {
  if (formState.length !== totrinnskontrollContext.length) {
    return null;
  }
  return (
    <form name="toTrinn" onSubmit={handleSubmit}>
      {totrinnskontrollContext.map(({
        contextCode, skjermlenke, aksjonspunkter, skjermlenkeNavn,
      }, contextIndex) => {
        if (aksjonspunkter.length > 0) {
          return (
            <div key={contextCode}>
              <NavLink to={skjermlenke} className={styles.lenke}>
                {skjermlenkeNavn}
              </NavLink>
              {aksjonspunkter.map((aksjonspunkt, approvalIndex) => (
                <div key={aksjonspunkt.aksjonspunktKode}>
                  <ApprovalField
                    aksjonspunkt={aksjonspunkt}
                    contextIndex={contextIndex}
                    currentValue={formState[contextIndex].aksjonspunkter[approvalIndex]}
                    approvalIndex={approvalIndex}
                    readOnly={readOnly}
                    klageKA={erKlageWithKA}
                    isForeldrepengerFagsak={isForeldrepengerFagsak}
                    behandlingKlageVurdering={behandlingKlageVurdering}
                    behandlingStatus={behandlingStatus}
                    alleKodeverk={alleKodeverk}
                  />
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
      <div className={styles.buttonRow}>
        <Hovedknapp
          mini
          disabled={!allApproved(formState) || !allSelected(formState) || formProps.submitting}
          spinner={formProps.submitting}
        >
          <FormattedMessage id="ToTrinnsForm.Godkjenn" />
        </Hovedknapp>
        <Hovedknapp
          mini
          disabled={allApproved(formState) || !allSelected(formState) || formProps.submitting}
          spinner={formProps.submitting}
          onClick={ariaCheck}
        >
          <FormattedMessage id="ToTrinnsForm.SendTilbake" />
        </Hovedknapp>
        {!erKlage && !erBehandlingEtterKlage
        && (
        <button
          type="button"
          className={styles.buttonLink}
          onClick={forhandsvisVedtaksbrev}
        >
          <FormattedMessage id="ToTrinnsForm.ForhandvisBrev" />
        </button>
        )}
      </div>
    </form>
  );
};

ToTrinnsFormImpl.propTypes = {
  ...formPropTypes,
  totrinnskontrollContext: PropTypes.arrayOf(PropTypes.shape({})),
  formState: PropTypes.arrayOf(PropTypes.shape({})),
  forhandsvisVedtaksbrev: PropTypes.func.isRequired,
  klageVurderingResultatNFP: PropTypes.shape(),
  klageVurderingResultatNK: PropTypes.shape(),
  erBehandlingEtterKlage: PropTypes.bool,
  erKlageWithKA: PropTypes.bool,
  erKlage: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
};

ToTrinnsFormImpl.defaultProps = {
  klageVurderingResultatNFP: undefined,
  klageVurderingResultatNK: undefined,
  totrinnskontrollContext: [],
  formState: [{ aksjonspunkter: [] }],
};

const validate = (values) => {
  const errors = {};

  errors.approvals = values.approvals.map((kontekst) => ({
    aksjonspunkter: kontekst.aksjonspunkter.map((ap) => {
      if (!ap.feilFakta && !ap.feilLov && !ap.feilRegel && !ap.annet) {
        return { missingArsakError: isRequiredMessage() };
      }

      return undefined;
    }),
  }));

  return errors;
};

const formName = 'toTrinnForm';

const mapStateToProps = (state, ownProps) => ({
  formState: behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(state, 'approvals'),
});
const ToTrinnsForm = behandlingForm({ form: formName, validate })(connect(mapStateToProps)(ToTrinnsFormImpl));

ToTrinnsForm.formName = formName;

export default ToTrinnsForm;