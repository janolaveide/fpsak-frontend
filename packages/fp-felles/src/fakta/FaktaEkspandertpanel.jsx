import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';

import styles from './faktaEkspandertpanel.less';


/**
 * FaktaEkspandertpanel
 *
 * Presentasjonskomponent. Wrapper for å slippe å duplisere logikk og styles i de
 * ulike faktapanelene. Avgjør om panelet skal åpnes eller lukkes og viser en
 * gul stripe i penelet om det er åpne aksjonspunkter.
 */

const classNames = classnames.bind(styles);

const FaktaEkspandertpanel = ({
  title,
  hasOpenAksjonspunkter,
  isInfoPanelOpen,
  toggleInfoPanelCallback,
  faktaId,
  readOnly,
  disabled,
  disabledTextCode,
  ekstraClass,
  children,
}) => {
  if (disabled && disabledTextCode) {
    return (
      <Panel className={styles.disabledPanel}>
        <Undertittel className={styles.disabledPanelText}>
          <FormattedMessage id={disabledTextCode} />
        </Undertittel>
      </Panel>
    );
  }

  return (
    <EkspanderbartpanelPure
      className={hasOpenAksjonspunkter && !readOnly ? classNames('statusAksjonspunkt', `aksjonspunkt--${faktaId}`, ekstraClass) : styles.statusOk}
      tittel={title}
      tag="h2"
      apen={isInfoPanelOpen}
      onClick={() => toggleInfoPanelCallback(faktaId)}
    >
      {children}
    </EkspanderbartpanelPure>
  );
};

FaktaEkspandertpanel.propTypes = {
  /**
   * Tittel på faktapanelet
   */
  title: PropTypes.node.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  isInfoPanelOpen: PropTypes.bool,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  /**
   * Indikerer faktatype. For eksempel 'medlemskapsvilkaret'
   */
  faktaId: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  disabledTextCode: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  ekstraClass: PropTypes.string,
};

FaktaEkspandertpanel.defaultProps = {
  isInfoPanelOpen: false,
  disabled: false,
  disabledTextCode: undefined,
  ekstraClass: undefined,
};

export default FaktaEkspandertpanel;