import { expect } from 'chai';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import {
  compareAndeler,
  kanIkkjeHaNullBeregningsgrunnlagError,
  skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding,
  skalVereLikFordelingMessage,
  ulikeAndelerErrorMessage,
  validateFastsattBelop,
  validateSumFastsattBelop,
  validateTotalRefusjonPrArbeidsforhold,
  validateUlikeAndeler,
} from './ValidateAndelerUtils';

const skalValidereMotRapportert = () => true;

describe('<ValidateAndelerUtils>', () => {
  it('skal ikkje gi error når total refusjon er lavere enn inntektsmelding', () => {
    const arbeidsgiverAndersen = {
      arbeidsforholdId: '89r2hf923',
      arbeidsgiverNavn: 'Andersen flyttebyrå',
      arbeidsgiverId: '36363463463',
    };
    const andeler = [{
      ...arbeidsgiverAndersen,
      refusjonskrav: '10 000',
      refusjonskravFraInntektsmelding: 20000,
    },
    {
      ...arbeidsgiverAndersen,
      refusjonskrav: '5 000',
      refusjonskravFraInntektsmelding: 0,
    },
    {
      arbeidsforholdId: '43r34h',
      refusjonskrav: '40 000',
      refusjonskravFraInntektsmelding: 40000,
      arbeidsgiverNavn: 'Torgersen flyttebyrå',
      arbeidsgiverId: '658568568',
    },
    {
      arbeidsforholdId: '', refusjonskrav: null, refusjonskravFraInntektsmelding: 0,
    },
    ];
    const error = validateTotalRefusjonPrArbeidsforhold(andeler);
    expect(error).to.equal(null);
  });

  it('skal ikkje gi error når total refusjon er lavere enn inntektsmelding for arbeidsforholdId lik null', () => {
    const arbeidsgiverAndersen = {
      arbeidsforholdId: null,
      arbeidsgiverNavn: 'Andersen flyttebyrå',
      arbeidsgiverId: '36363463463',
    };
    const andeler = [{
      ...arbeidsgiverAndersen,
      refusjonskrav: '10 000',
      refusjonskravFraInntektsmelding: 20000,
    },
    {
      ...arbeidsgiverAndersen,
      refusjonskrav: '5 000',
      refusjonskravFraInntektsmelding: 0,
    },
    {
      arbeidsforholdId: null,
      refusjonskrav: '40 000',
      refusjonskravFraInntektsmelding: 40000,
      arbeidsgiverNavn: 'Torgersen flyttebyrå',
      arbeidsgiverId: '658568568',
    },
    {
      arbeidsforholdId: '', refusjonskrav: null, refusjonskravFraInntektsmelding: 0,
    },
    ];
    const error = validateTotalRefusjonPrArbeidsforhold(andeler);
    expect(error).to.equal(null);
  });

  it('skal ikkje gi error når total refusjon er lik inntektsmelding', () => {
    const arbeidsgiverAndersen = {
      arbeidsforholdId: '89r2hf923',
      arbeidsgiverNavn: 'Andersen flyttebyrå',
      arbeidsgiverId: '36363463463',
    };
    const andeler = [{
      ...arbeidsgiverAndersen,
      refusjonskrav: '10 000',
      refusjonskravFraInntektsmelding: 20000,
    },
    {
      ...arbeidsgiverAndersen,
      refusjonskrav: '10 000',
      refusjonskravFraInntektsmelding: 0,
    },
    {
      arbeidsforholdId: '43r34h',
      refusjonskrav: '40 000',
      refusjonskravFraInntektsmelding: 40000,
      arbeidsgiverNavn: 'Torgersen flyttebyrå',
      arbeidsgiverId: '658568568',
    },
    {
      arbeidsforholdId: '', refusjonskrav: null, refusjonskravFraInntektsmelding: 0,
    },
    ];
    const error = validateTotalRefusjonPrArbeidsforhold(andeler);
    expect(error).to.equal(null);
  });

  it('skal gi error når total refusjon høyere enn inntektsmelding', () => {
    const arbeidsgiverAndersen = {
      arbeidsforholdId: '89r2hf923',
      arbeidsgiverNavn: 'Andersen flyttebyrå',
      arbeidsgiverId: '36363463463',
    };
    const andeler = [{
      ...arbeidsgiverAndersen,
      refusjonskrav: '10 000',
      refusjonskravFraInntektsmelding: 20000,
    },
    {
      ...arbeidsgiverAndersen,
      refusjonskrav: '20 000',
      refusjonskravFraInntektsmelding: 0,
    },
    {
      arbeidsforholdId: '43r34h',
      refusjonskrav: '40 000',
      refusjonskravFraInntektsmelding: 40000,
      arbeidsgiverNavn: 'Torgersen flyttebyrå',
      arbeidsgiverId: '658568568',
    },
    {
      arbeidsforholdId: '', refusjonskrav: null, refusjonskravFraInntektsmelding: 0,
    },
    ];
    const arbeidsgiverString = 'Andersen flyttebyrå (36363463463) ...f923';
    const error = validateTotalRefusjonPrArbeidsforhold(andeler);
    const expected = skalIkkjeVereHoegereEnnRefusjonFraInntektsmelding(arbeidsgiverString);
    expect(error.id).to.equal(expected.id);
    expect(error.arbeidsgiver).to.equal(expected.arbeidsgiver);
  });

  it('skal returnere 0 for lik andelsinfo og lik inntektskategori', () => {
    const andeler = [{
      andelsinfo: 'Andelsinfo1', inntektskategori: 'Inntektskategori1',
    },
    {
      andelsinfo: 'Andelsinfo1', inntektskategori: 'Inntektskategori1',
    },
    ];
    const compare = compareAndeler(andeler[0], andeler[1]);
    expect(compare).to.equal(0);
  });

  it('skal returnere -1 for lik andelsinfo og ulik inntektskategori', () => {
    const andeler = [{
      andelsinfo: 'Andelsinfo1', inntektskategori: 'Inntektskategori1',
    },
    {
      andelsinfo: 'Andelsinfo1', inntektskategori: 'Inntektskategori2',
    },
    ];
    const compare = compareAndeler(andeler[0], andeler[1]);
    expect(compare).to.equal(-1);
  });

  it('skal returnere 1 for lik andelsinfo og ulik inntektskategori motsatt rekkefølge', () => {
    const andeler = [{
      andelsinfo: 'Andelsinfo1', inntektskategori: 'Inntektskategori1',
    },
    {
      andelsinfo: 'Andelsinfo1', inntektskategori: 'Inntektskategori2',
    },
    ];
    const compare = compareAndeler(andeler[1], andeler[0]);
    expect(compare).to.equal(1);
  });

  it('skal returnere -1 for ulik andelsinfo og lik inntektskategori', () => {
    const andeler = [{
      andelsinfo: 'Andelsinfo1', inntektskategori: 'Inntektskategori1',
    },
    {
      andelsinfo: 'Andelsinfo2', inntektskategori: 'Inntektskategori1',
    },
    ];
    const compare = compareAndeler(andeler[0], andeler[1]);
    expect(compare).to.equal(-1);
  });

  it('skal returnere 1 for ulik andelsinfo og lik inntektskategori motsatt rekkefølge', () => {
    const andeler = [{
      andelsinfo: 'Andelsinfo1', inntektskategori: 'Inntektskategori1',
    },
    {
      andelsinfo: 'Andelsinfo2', inntektskategori: 'Inntektskategori1',
    },
    ];
    const compare = compareAndeler(andeler[1], andeler[0]);
    expect(compare).to.equal(1);
  });

  it('skal returnere -1 for ulik andelsinfo og ulik inntektskategori motsatt rekkefølge', () => {
    const andeler = [{
      andelsinfo: 'Andelsinfo1', inntektskategori: 'Inntektskategori1',
    },
    {
      andelsinfo: 'Andelsinfo2', inntektskategori: 'Inntektskategori2',
    },
    ];
    const compare = compareAndeler(andeler[0], andeler[1]);
    expect(compare).to.equal(-1);
  });

  it('skal returnere 1 for ulik andelsinfo og ulik inntektskategori motsatt rekkefølge', () => {
    const andeler = [{
      andelsinfo: 'Andelsinfo1', inntektskategori: 'Inntektskategori1',
    },
    {
      andelsinfo: 'Andelsinfo2', inntektskategori: 'Inntektskategori2',
    },
    ];
    const compare = compareAndeler(andeler[1], andeler[0]);
    expect(compare).to.equal(1);
  });

  it('skal ikkje gi error om det er ingen andeler lagt til av saksbehandler og ingen har lik inntektskategori og andelsnr', () => {
    const andeler = [{
      andelsnr: 1,
      andel: 'Virksomheten 1',
      nyAndel: false,
      lagtTilAvSaksbehandler: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      inntektskategori: 'ARBEIDSTAKER',
      arbeidsforholdId: '2974239',
    },
    {
      andelsnr: 2,
      andel: 'Virksomheten 2',
      nyAndel: false,
      lagtTilAvSaksbehandler: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      inntektskategori: 'ARBEIDSTAKER',
      arbeidsforholdId: '433f34',
    },
    {
      andelsnr: 3,
      andel: 'Virksomheten 3',
      nyAndel: false,
      lagtTilAvSaksbehandler: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      inntektskategori: 'ARBEIDSTAKER',
      arbeidsforholdId: 'egg4g232',
    },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.equal(null);
  });

  it('skal ikkje gi error om det er andeler lagt til av saksbehandler og ingen har lik inntektskategori og andelsnr', () => {
    const andeler = [{
      andelsnr: 1,
      andel: 'Virksomheten 1',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
      arbeidsforholdId: '433f34',
    },
    {
      andelsnr: 2,
      andel: 'Virksomheten 2',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
      arbeidsforholdId: '34r343f',
    },
    {
      andelsnr: null, andel: '2', nyAndel: true, lagtTilAvSaksbehandler: true, inntektskategori: 'ARBEIDSTAKER_SJØMANN', arbeidsforholdId: '34r343f',
    },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.equal(null);
  });

  it('skal gi error om det er nye andeler to har lik inntektskategori og andelsnr', () => {
    const andeler = [{
      andelsnr: 1,
      andel: 'Virksomheten 1',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
      arbeidsforholdId: '353453',
    },
    {
      andelsnr: 2,
      andel: 'Virksomheten 2',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
      arbeidsforholdId: '433f34',
    },
    {
      andelsnr: null, andel: '2', nyAndel: true, lagtTilAvSaksbehandler: true, inntektskategori: 'ARBEIDSTAKER', arbeidsforholdId: '433f34',
    },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal ikkje gi error om to andeler har lik inntektskategori men ulik arbeidsforholdId', () => {
    const andeler = [{
      andelsnr: 1,
      andel: 'Virksomheten 1',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
      arbeidsforholdId: '353453',
    },
    {
      andelsnr: 2,
      andel: 'Virksomheten 1',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
      arbeidsforholdId: '433f34',
    },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.equal(null);
  });

  it('skal gi error om det er nye andeler to har lik inntektskategori og andelsnr når det finnes to eksisterende andeler med samme virksomhet', () => {
    const andeler = [{
      andelsnr: 1,
      andel: 'Virksomheten 1 (...fesf342334)',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 2,
      andel: 'Virksomheten 2',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 3,
      andel: 'Virksomheten 1 (...fesf342334)',
      aktivitetStatus: 'ARBEIDSTAKER',
      nyAndel: false,
      lagtTilAvSaksbehandler: true,
      inntektskategori: 'SJØMANN',
    },
    {
      andelsnr: null, andel: '1', nyAndel: true, lagtTilAvSaksbehandler: true, inntektskategori: 'SJØMANN',
    },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal ikkje gi error om det er nye andeler der to har lik andelstype og ulik inntektskategori', () => {
    const andeler = [{
      andelsnr: 1,
      andel: 'Virksomheten 1',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 2,
      andel: 'Virksomheten 2',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: null, andel: 'BRUKERS_ANDEL', nyAndel: true, lagtTilAvSaksbehandler: true, inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: null, andel: 'BRUKERS_ANDEL', nyAndel: true, lagtTilAvSaksbehandler: true, inntektskategori: 'FRILANSER',
    },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.equal(null);
  });

  it('skal gi error om det er nye andeler der to har lik inntektskategori og andelstype', () => {
    const andeler = [{
      andelsnr: 1,
      andel: 'Virksomheten 1',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 2,
      andel: 'Virksomheten 2',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: null, andel: 'BRUKERS_ANDEL', nyAndel: true, lagtTilAvSaksbehandler: true, inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: null, andel: 'BRUKERS_ANDEL', nyAndel: true, lagtTilAvSaksbehandler: true, inntektskategori: 'ARBEIDSTAKER',
    },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal gi error om det er ingen nye andeler, men andel lagt til av saksbehandler der to har lik inntektskategori og andelstype', () => {
    const andeler = [{
      andelsnr: 1,
      andel: 'Virksomheten 1',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 2,
      andel: 'Virksomheten 2',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 3, andel: 'Brukers andel', nyAndel: false, aktivitetStatus: 'BA', lagtTilAvSaksbehandler: true, inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 4, andel: 'Brukers andel', nyAndel: false, aktivitetStatus: 'BA', lagtTilAvSaksbehandler: true, inntektskategori: 'ARBEIDSTAKER',
    },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal gi error om det er ein ny brukers andel, og ein eksisterende der begge har lik inntektskategori', () => {
    const andeler = [{
      andelsnr: 1,
      andel: 'Virksomheten 1',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 2,
      andel: 'Virksomheten 2',
      nyAndel: false,
      aktivitetStatus: 'ARBEIDSTAKER',
      lagtTilAvSaksbehandler: false,
      inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 3,
      andel: 'Brukers andel',
      aktivitetStatus: 'BA',
      nyAndel: false,
      lagtTilAvSaksbehandler: true,
      inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 4,
      andel: 'BRUKERS_ANDEL',
      nyAndel: true,
      lagtTilAvSaksbehandler: true,
      inntektskategori: 'ARBEIDSTAKER',
    },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal gi error om det er ein ny egen næring, og ein selvstendig næringsdrivende lagt til tidligere der begge har lik inntektskategori', () => {
    const andeler = [{
      andelsnr: 1, andel: 'Virksomheten 1', nyAndel: false, aktivitetStatus: 'ARBEIDSTAKER', lagtTilAvSaksbehandler: false, inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 2, andel: 'Virksomheten 2', nyAndel: false, aktivitetStatus: 'ARBEIDSTAKER', lagtTilAvSaksbehandler: false, inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 3, andel: 'Selvstendig næringsdrivende', aktivitetStatus: 'SN', nyAndel: false, lagtTilAvSaksbehandler: true, inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 4, andel: 'EGEN_NÆRING', nyAndel: true, lagtTilAvSaksbehandler: true, inntektskategori: 'ARBEIDSTAKER',
    },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal gi error om det er ein ny egen næring, og ein eksisterende selvstendig næringsdrivende der begge har lik inntektskategori', () => {
    const andeler = [{
      andelsnr: 1, andel: 'Virksomheten 1', nyAndel: false, aktivitetStatus: 'ARBEIDSTAKER', lagtTilAvSaksbehandler: false, inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 2, andel: 'Virksomheten 2', nyAndel: false, aktivitetStatus: 'ARBEIDSTAKER', lagtTilAvSaksbehandler: false, inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 3, andel: 'Selvstendig næringsdrivende', aktivitetStatus: 'SN', nyAndel: false, lagtTilAvSaksbehandler: false, inntektskategori: 'ARBEIDSTAKER',
    },
    {
      andelsnr: 4, andel: 'EGEN_NÆRING', nyAndel: true, lagtTilAvSaksbehandler: true, inntektskategori: 'ARBEIDSTAKER',
    },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal gi error om fastsatt beløp er ulik oppgitt sum', () => {
    const values = [{
      fastsattBelop: '10 000',
    },
    {
      fastsattBelop: '20 000',
    },
    {
      fastsattBelop: '10 000',
    },
    {
      fastsattBelop: '10 000',
    },
    ];
    const fastsattError = validateSumFastsattBelop(values, 40000);
    expect(fastsattError).to.have.length(2);
    expect(fastsattError[0].id).to.equal(skalVereLikFordelingMessage()[0].id);
    expect(fastsattError[1].fordeling).to.equal('40 000');
  });

  it('skal ikkje gi error om fastsatt beløp er lik oppgitt sum', () => {
    const values = [{
      skalRedigereInntekt: true,
      fastsattBelop: '10 000',
    },
    {
      skalRedigereInntekt: true,
      fastsattBelop: '20 000',
    },
    {
      skalRedigereInntekt: true,
      fastsattBelop: '10 000',
    },
    {
      skalRedigereInntekt: true,
      fastsattBelop: '10 000',
    },
    ];
    const fastsattError = validateSumFastsattBelop(values, 50000);
    expect(fastsattError).to.equal(null);
  });

  it('skal ikkje gi error om fastsatt beløp og read only beløp er lik sum', () => {
    const values = [{
      andelsnr: 1,
      skalRedigereInntekt: true,
      fastsattBelop: '10 000',
      readOnlyBelop: '50 000',
    },
    {
      skalRedigereInntekt: true,
      andelsnr: 2,
      fastsattBelop: '20 000',
      readOnlyBelop: '100 000',
    },
    {
      skalRedigereInntekt: false,
      andelsnr: 3,
      fastsattBelop: '40 000',
      readOnlyBelop: '10 000',
    },
    {
      skalRedigereInntekt: false,
      andelsnr: 4,
      fastsattBelop: '15 000',
      readOnlyBelop: '10 000',
    },
    ];
    const fastsattError = validateSumFastsattBelop(values, 50000);
    expect(fastsattError).to.equal(null);
  });

  it('skal gi error om fastsatt beløp og read only beløp er ulik sum', () => {
    const skalRedigereInntekt = (andel) => {
      if (andel.andelsnr <= 2) {
        return true;
      }
      return false;
    };

    const values = [{
      andelsnr: 1,
      fastsattBelop: '50 000',
      readOnlyBelop: '10 000',
    },
    {
      andelsnr: 2,
      fastsattBelop: '100 000',
      readOnlyBelop: '20 000',
    },
    {
      andelsnr: 3,
      fastsattBelop: '10 000',
      readOnlyBelop: '40 000',
    },
    {
      andelsnr: 4,
      fastsattBelop: '10 000',
      readOnlyBelop: '15 000',
    },
    ];
    const fastsattError = validateSumFastsattBelop(values, 50000, skalRedigereInntekt);
    expect(fastsattError).to.have.length(2);
    expect(fastsattError[0].id).to.equal(skalVereLikFordelingMessage()[0].id);
    expect(fastsattError[1].fordeling).to.equal('50 000');
  });

  it('skal returnere required error om fastsatt beløp ikkje er satt', () => {
    const andelValue = {
      andel: 'Arbeidsgiver 1',
      arbeidsgiverNavn: 'Arbeidsgiver 1',
      arbeidsgiverId: '2342353525',
      arbeidsforholdId: '3r4h3uihr43',
      fastsattBelop: '',
    };
    const inntektList = [{
      key: 'Arbeidsgiver 1 (2342353525) ...hr43',
      beregningsgrunnlagPrAar: null,
      fastsattBelop: 20000,
    }];
    const fastsattError = validateFastsattBelop(andelValue, inntektList, skalValidereMotRapportert);
    expect(fastsattError[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal returnere error om det er satt 0 i beregningsgrunnlag for andel med gradering og arbeidsforhold ikke opphørt', () => {
    const andelValue = {
      andel: 'Selvstendig næringsgivende',
      fastsattBelop: '0',
      andelIArbeid: '50.00',
      arbeidsperiodeTom: null,
    };
    const inntektList = [{
      key: 'Selvstendig næringsgivende',
      beregningsgrunnlagPrAar: null,
      fastsattBelop: 0,
    }];
    const periodeDato = [{
      fom: '2020-01-01',
      tom: null,
    }];
    const fastsattError = validateFastsattBelop(andelValue, inntektList, () => false, undefined, periodeDato);
    expect(fastsattError[0].id).to.equal(kanIkkjeHaNullBeregningsgrunnlagError()[0].id);
  });

  it('skal returnere error om det er satt 0 i beregningsgrunnlag for andel med gradering i deler av perioden og arbeidsforhold ikke opphørt', () => {
    const andelValue = {
      andel: 'Selvstendig næringsgivende',
      fastsattBelop: '0',
      andelIArbeid: '0 - 50',
      arbeidsperiodeTom: '2020-12-01',
    };
    const inntektList = [{
      key: 'Selvstendig næringsgivende',
      beregningsgrunnlagPrAar: null,
      fastsattBelop: 0,
    }];
    const periodeDato = [{
      fom: '2020-01-01',
      tom: null,
    }];
    const fastsattError = validateFastsattBelop(andelValue, inntektList, () => false, undefined, periodeDato);
    expect(fastsattError[0].id).to.equal(kanIkkjeHaNullBeregningsgrunnlagError()[0].id);
  });

  it('skal ikkje returnere error om det er satt 0 i beregningsgrunnlag for andel med uten gradering og arbeidsforhold ikke opphørt', () => {
    const andelValue = {
      andel: 'Selvstendig næringsgivende',
      fastsattBelop: '0',
      andelIArbeid: '0',
      arbeidsperiodeTom: undefined,
    };
    const inntektList = [{
      key: 'Selvstendig næringsgivende',
      beregningsgrunnlagPrAar: null,
      fastsattBelop: 0,
    }];
    const periodeDato = [{
      fom: '2015-01-01',
      tom: null,
    }];
    const fastsattError = validateFastsattBelop(andelValue, inntektList, () => false, undefined, periodeDato);
    expect(fastsattError).to.equal(null);
  });

  it('skal ikkje returnere error om det er satt 0 i beregningsgrunnlag for andel med tilgjengelig informasjon om gradering', () => {
    const andelValue = {
      andel: 'Selvstendig næringsgivende',
      fastsattBelop: '0',
      andelIArbeid: '',
    };
    const inntektList = [{
      key: 'Selvstendig næringsgivende',
      beregningsgrunnlagPrAar: null,
      fastsattBelop: 0,
    }];
    const fastsattError = validateFastsattBelop(andelValue, inntektList, () => false);
    expect(fastsattError).to.equal(null);
  });

  it('skal ikke returnere error om det er satt 0 i beregningsgrunnlag for andel med gradering i deler av perioden og arbeidsforhold er opphørt', () => {
    const andelValue = {
      andel: 'Selvstendig næringsgivende',
      fastsattBelop: '0',
      andelIArbeid: '0 - 50',
      arbeidsperiodeTom: '2019-12-31',
    };
    const inntektList = [{
      key: 'Selvstendig næringsgivende',
      beregningsgrunnlagPrAar: null,
      fastsattBelop: 0,
    }];
    const periodeDato = [{
      fom: '2020-01-01',
      tom: null,
    }];
    const fastsattError = validateFastsattBelop(andelValue, inntektList, () => false, undefined, periodeDato);
    expect(fastsattError).to.equal(null);
  });
});
