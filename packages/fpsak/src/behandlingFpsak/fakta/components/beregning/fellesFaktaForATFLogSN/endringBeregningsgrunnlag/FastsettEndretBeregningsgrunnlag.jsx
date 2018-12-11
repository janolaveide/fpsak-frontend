import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getEndringBeregningsgrunnlagPerioder, getFaktaOmBeregningTilfellerKoder } from 'behandlingFpsak/behandlingSelectors';
import EndringBeregningsgrunnlagForm from './EndringBeregningsgrunnlagForm';
import { harKunTilfellerSomStøtterEndringBG } from './EndretBeregningsgrunnlagUtils';

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

FastsettEndretBeregningsgrunnlagImpl.buildInitialValues = (endringBGPerioder, tilfeller) => {
  if (!harKunTilfellerSomStøtterEndringBG(tilfeller)) {
    return {};
  }
  return EndringBeregningsgrunnlagForm
    .buildInitialValues(endringBGPerioder);
};

FastsettEndretBeregningsgrunnlagImpl.transformValues = (values, endringBGPerioder) => EndringBeregningsgrunnlagForm.transformValues(values, endringBGPerioder);

FastsettEndretBeregningsgrunnlagImpl.validate = (values, endringBGPerioder, tilfeller) => {
  if (!harKunTilfellerSomStøtterEndringBG(tilfeller)) {
    return {};
  }
  return EndringBeregningsgrunnlagForm
    .validate(values, endringBGPerioder);
};

FastsettEndretBeregningsgrunnlagImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  skalHaEndretInformasjonIHeader: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const tilfeller = getFaktaOmBeregningTilfellerKoder(state);
  const perioder = getEndringBeregningsgrunnlagPerioder(state);
  return ({
    skalHaEndretInformasjonIHeader: !harKunTilfellerSomStøtterEndringBG(tilfeller),
    perioder: perioder || [],
  });
};


export default connect(mapStateToProps)(FastsettEndretBeregningsgrunnlagImpl);