import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { PersonIndex } from '@fpsak-frontend/fp-felles';
import { fagsakPropType } from '@fpsak-frontend/prop-types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { SearchForm } from '@fpsak-frontend/search-form';
import FagsakList from './FagsakList';

import styles from './fagsakSearch.less';

/**
 * FagsakSearch
 *
 * Presentasjonskomponent. Denne setter sammen de ulike komponentene i søkebildet.
 * Er søkeresultat mottatt vises enten trefflisten og relatert person, eller en tekst som viser ingen resultater.
 */
const FagsakSearch = ({
  fagsaker,
  searchFagsakCallback,
  searchResultReceived,
  selectFagsakCallback,
  searchStarted,
  searchResultAccessDenied,
}) => (
  <div className={styles.container}>
    <SearchForm
      onSubmit={searchFagsakCallback}
      searchStarted={searchStarted}
      searchResultAccessDenied={searchResultAccessDenied}
    />

    {searchResultReceived && fagsaker.length === 0
      && <Normaltekst className={styles.label}><FormattedMessage id="FagsakSearch.ZeroSearchResults" /></Normaltekst>}

    {fagsaker.length > 1
    && <PersonIndex person={fagsaker[0].person} />}

    <VerticalSpacer eightPx />

    {fagsaker.length > 1
    && <FagsakList fagsaker={fagsaker} selectFagsakCallback={selectFagsakCallback} />}
  </div>
);

FagsakSearch.propTypes = {
  fagsaker: PropTypes.arrayOf(fagsakPropType),
  searchResultReceived: PropTypes.bool.isRequired,
  searchFagsakCallback: PropTypes.func.isRequired,
  selectFagsakCallback: PropTypes.func.isRequired,
  searchStarted: PropTypes.bool.isRequired,
  searchResultAccessDenied: PropTypes.shape({
    feilmelding: PropTypes.string.isRequired,
  }),
};

FagsakSearch.defaultProps = {
  fagsaker: [],
  searchResultAccessDenied: null,
};

export default FagsakSearch;
