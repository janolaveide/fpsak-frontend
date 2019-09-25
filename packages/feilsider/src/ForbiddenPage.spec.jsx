import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import ForbiddenPage from './ForbiddenPage';
import ErrorPageWrapper from './components/ErrorPageWrapper';

describe('<ForbiddenPage>', () => {
  it('skal rendre ForbiddenPage korrekt', () => {
    const wrapper = shallow(<ForbiddenPage />);
    expect(wrapper.find(ErrorPageWrapper)).to.have.length(1);
    expect(wrapper.find(FormattedMessage)).to.have.length(1);
    const undertittel = wrapper.find(Undertittel);
    expect(undertittel).to.have.length(1);
  });
});
