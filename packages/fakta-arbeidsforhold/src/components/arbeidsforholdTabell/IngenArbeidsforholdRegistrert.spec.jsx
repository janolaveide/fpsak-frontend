import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import TableColumn from '@fpsak-frontend/shared-components/src/table/TableColumn';
import { FormattedMessage } from 'react-intl';
import IngenArbeidsforholdRegistrert from './IngenArbeidsforholdRegistrert';

describe('<IngenArbeidsforholdRegistrert>', () => {
  const headerTextCodes = [
    'PersonArbeidsforholdTable.Arbeidsforhold',
    'PersonArbeidsforholdTable.Periode',
    'PersonArbeidsforholdTable.Kilde',
    'PersonArbeidsforholdTable.Stillingsprosent',
    'PersonArbeidsforholdTable.MottattDato',
    'EMPTY_2',
  ];
  it('Skal sjekke at IngenArbeidsforholdRegistrert rendrer korrekt', () => {
    const wrapper = shallow(
      <IngenArbeidsforholdRegistrert
        headerTextCodes={headerTextCodes}
      />,
    );
    expect(wrapper.find(TableColumn)).has.length(6);
    expect(wrapper.find(FormattedMessage).props().id).to.eql('PersonArbeidsforholdTable.IngenArbeidsforholdRegistrert');
  });
});