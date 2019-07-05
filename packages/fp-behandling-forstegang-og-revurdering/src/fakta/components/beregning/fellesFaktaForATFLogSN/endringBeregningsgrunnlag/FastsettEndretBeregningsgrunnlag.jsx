import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getEndringBeregningsgrunnlagPerioder, getFaktaOmBeregningTilfellerKoder } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import EndringBeregningsgrunnlagForm from './EndringBeregningsgrunnlagForm';
import { harKunTilfellerSomStøtterEndringBG, skalViseHelptextForEndretBg } from './EndretBeregningsgrunnlagUtils';

// For visning av saker med tilfelle FASTSETT_ENDRET_BEREGNINGSGRUNNLAG
// Opprettelse av FASTSETT_ENDRET_BEREGNINGSGRUNNLAG er fjernet og håndteres nå i aksjonspunkt FORDEL_BEREGNINGSGRUNNLAG
// Migrer data til nytt aksjonspunkt før sletting

export const FastsettEndretBeregningsgrunnlagImpl = ({
  isAksjonspunktClosed,
  readOnly,
  perioder,
  skalHaEndretInformasjonIHeader,
}) => (
  <EndringBeregningsgrunnlagForm
    perioder={perioder}
    readOnly={readOnly}
    isAksjonspunktClosed={isAksjonspunktClosed}
    skalHaEndretInformasjonIHeader={skalHaEndretInformasjonIHeader}
  />
);

export const buildValues = (tilfeller, build) => {
  if (!harKunTilfellerSomStøtterEndringBG(tilfeller)) {
    return {};
  }
  return build();
};


FastsettEndretBeregningsgrunnlagImpl.buildInitialValues = (endringBGPerioder, tilfeller, bg, getKodeverknavn, featureToggles) => {
  const build = () => EndringBeregningsgrunnlagForm.buildInitialValues(endringBGPerioder, bg, getKodeverknavn, featureToggles);
  return buildValues(tilfeller, build);
};

FastsettEndretBeregningsgrunnlagImpl.transformValues = (values, endringBGPerioder) => EndringBeregningsgrunnlagForm.transformValues(values,
  endringBGPerioder, false, false);

export const validateValues = (tilfeller, validateBg) => {
  if (!harKunTilfellerSomStøtterEndringBG(tilfeller)) {
    return {};
  }
  return validateBg();
};

FastsettEndretBeregningsgrunnlagImpl.validate = (values, endringBGPerioder, tilfeller, faktaOmBeregning, beregningsgrunnlag, getKodeverknavn) => {
  const validateBg = () => EndringBeregningsgrunnlagForm
    .validate(values, endringBGPerioder, faktaOmBeregning, beregningsgrunnlag, getKodeverknavn);
  return validateValues(tilfeller, validateBg);
};

FastsettEndretBeregningsgrunnlagImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  skalHaEndretInformasjonIHeader: PropTypes.bool.isRequired,
};

const emptyArray = [];

const mapStateToProps = (state) => {
  const tilfeller = getFaktaOmBeregningTilfellerKoder(state);
  const perioder = getEndringBeregningsgrunnlagPerioder(state);
  return ({
    skalHaEndretInformasjonIHeader: !skalViseHelptextForEndretBg(tilfeller),
    perioder: perioder || emptyArray,
  });
};


export default connect(mapStateToProps)(FastsettEndretBeregningsgrunnlagImpl);
