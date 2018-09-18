import { expect } from 'chai';
import { sortArbeidsforholdList, getUniqueListOfArbeidsforhold, createArbeidsperiodeString } from './ArbeidsforholdHelper';

const createArbeidsforhold = (virksomhetNavn, virksomhetId, startdato, opphoersdato, arbeidsforholdId) => ({
  virksomhetNavn,
  virksomhetId,
  startdato,
  opphoersdato,
  arbeidsforholdId,
});

const createAndel = (andelsnr, arbeidsforhold, fordelingForrigeYtelse, refusjonskrav, overstyrtPrAar, inntektskategori, aktivitetstatus) => ({
  andelsnr,
  arbeidsforhold,
  fordelingForrigeYtelse,
  refusjonskrav,
  overstyrtPrAar,
  inntektskategori,
  aktivitetstatus,
});


const arbeidsforholdList = [createArbeidsforhold('Sopra Steria AS', '213456789', '1995-01-01', null, '2142324235'),
  createArbeidsforhold('Acando AS', '8439347348', '1999-01-01', null, '872489238'),
  createArbeidsforhold('Espens byggvarer AS', '1234342342', '2001-01-01', '2003-01-01', '1231414'),
  createArbeidsforhold('Petters fiskeutstyr AS', '4646234', '1991-03-21', '2010-01-01', '5462242'),
  createArbeidsforhold('Espens byggvarer AS', '1234342342', '2001-01-01', '2003-01-01', '1231414'),
];

const andeler = [
  createAndel(1, arbeidsforholdList[0], 100000, 20000, null, { kode: 'ARBEIDSTAKER' }, { kode: 'ARBEIDSTAKER' }),
  createAndel(2, arbeidsforholdList[1], 100000, 20000, null, { kode: 'ARBEIDSTAKER' }, { kode: 'ARBEIDSTAKER' }),
  createAndel(3, arbeidsforholdList[2], 100000, 20000, null, { kode: 'ARBEIDSTAKER' }, { kode: 'ARBEIDSTAKER' }),
  createAndel(4, arbeidsforholdList[3], 100000, 20000, null, { kode: 'ARBEIDSTAKER' }, { kode: 'ARBEIDSTAKER' }),
  createAndel(5, arbeidsforholdList[4], 100000, 20000, null, { kode: 'ARBEIDSTAKER' }, { kode: 'ARBEIDSTAKER' }),
];


describe('<ArbeidsforholdHelper>', () => {
  it('skal sortere arbeidsforhold på startdato', () => {
    const sorted = sortArbeidsforholdList(arbeidsforholdList);
    expect(sorted).has.length(arbeidsforholdList.length);
    expect(sorted[0]).to.equal(arbeidsforholdList[3]);
    expect(sorted[1]).to.equal(arbeidsforholdList[0]);
    expect(sorted[2]).to.equal(arbeidsforholdList[1]);
    expect(sorted[3]).to.equal(arbeidsforholdList[2]);
    expect(sorted[4]).to.equal(arbeidsforholdList[4]);
  });

  it('skal hente unik liste av arbeidsforhold', () => {
    const unikListe = getUniqueListOfArbeidsforhold(andeler);
    expect(unikListe).has.length(4);
  });

  it('skal lage arbeidsperiodestring for periode med slutt', () => {
    const periodeString = createArbeidsperiodeString(arbeidsforholdList[2]);
    expect(periodeString).to.equal('2001-01-01 - 2003-01-01');
  });

  it('skal lage arbeidsperiodestring for periode uten slutt', () => {
    const periodeString = createArbeidsperiodeString(arbeidsforholdList[0]);
    expect(periodeString).to.equal('1995-01-01 - ');
  });
});
