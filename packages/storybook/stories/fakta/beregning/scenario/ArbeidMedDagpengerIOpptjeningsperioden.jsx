export const beregningsgrunnlag = {
  skjaeringstidspunktBeregning: '2020-01-13',
  skjæringstidspunkt: '2020-01-13',
  aktivitetStatus: [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }],
  beregningsgrunnlagPeriode: [{
    beregningsgrunnlagPeriodeFom: '2020-01-13',
    beregningsgrunnlagPeriodeTom: null,
    beregnetPrAar: 0,
    bruttoPrAar: 0,
    bruttoInkludertBortfaltNaturalytelsePrAar: 0,
    avkortetPrAar: 0,
    redusertPrAar: null,
    periodeAarsaker: [],
    dagsats: null,
    beregningsgrunnlagPrStatusOgAndel: [{
      beregningsgrunnlagFom: '2019-10-01',
      beregningsgrunnlagTom: '2019-12-31',
      aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
      beregningsperiodeFom: '2019-10-01',
      beregningsperiodeTom: '2019-12-31',
      beregnetPrAar: null,
      overstyrtPrAar: null,
      bruttoPrAar: null,
      avkortetPrAar: null,
      redusertPrAar: null,
      erTidsbegrensetArbeidsforhold: null,
      erNyIArbeidslivet: null,
      lonnsendringIBeregningsperioden: null,
      andelsnr: 1,
      besteberegningPrAar: null,
      inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
      arbeidsforhold: {
        arbeidsgiverNavn: 'BEDRIFT AS',
        arbeidsgiverId: '910909088',
        startdato: '2019-02-03',
        opphoersdato: '2020-02-03',
        arbeidsforholdId: null,
        eksternArbeidsforholdId: null,
        arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
        aktørId: null,
        refusjonPrAar: null,
        belopFraInntektsmeldingPrMnd: 30000.00,
        organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
        naturalytelseBortfaltPrÅr: null,
        naturalytelseTilkommetPrÅr: null,
      },
      fastsattAvSaksbehandler: false,
      lagtTilAvSaksbehandler: false,
      belopPrMndEtterAOrdningen: 10000.0000000000,
      belopPrAarEtterAOrdningen: 120000.000000000000,
      dagsats: null,
      originalDagsatsFraTilstøtendeYtelse: null,
      fordeltPrAar: null,
      erTilkommetAndel: false,
      skalFastsetteGrunnlag: false,
    }],
  }],
  sammenligningsgrunnlag: null,
  sammenligningsgrunnlagPrStatus: [],
  ledetekstBrutto: 'Brutto beregningsgrunnlag',
  ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
  ledetekstRedusert: 'Redusert beregningsgrunnlag (100%)',
  halvG: 49929.0,
  grunnbeløp: 99858,
  faktaOmBeregning: {
    kortvarigeArbeidsforhold: null,
    frilansAndel: null,
    kunYtelse: null,
    faktaOmBeregningTilfeller: [{ kode: 'VURDER_BESTEBEREGNING', kodeverk: 'FAKTA_OM_BEREGNING_TILFELLE' }],
    arbeidstakerOgFrilanserISammeOrganisasjonListe: null,
    arbeidsforholdMedLønnsendringUtenIM: null,
    besteberegningAndeler: null,
    vurderMottarYtelse: null,
    avklarAktiviteter: {
      skjæringstidspunktOpptjening: '2020-01-13',
      aktiviteterTomDatoMapping: [{
        tom: '2020-01-13',
        aktiviteter: [{
          arbeidsgiverNavn: 'BEDRIFT AS',
          arbeidsgiverId: '910909088',
          eksternArbeidsforholdId: null,
          fom: '2019-02-03',
          tom: '2020-02-03',
          arbeidsforholdId: null,
          arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørIdString: null,
          skalBrukes: null,
        }],
      }, {
        tom: '2019-11-12',
        aktiviteter: [{
          arbeidsgiverNavn: null,
          arbeidsgiverId: null,
          eksternArbeidsforholdId: null,
          fom: '2019-02-03',
          tom: '2019-11-11',
          arbeidsforholdId: null,
          arbeidsforholdType: { kode: 'DAGPENGER', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørIdString: null,
          skalBrukes: null,
        }],
      }],
    },
    vurderBesteberegning: { skalHaBesteberegning: null },
    andelerForFaktaOmBeregning: [{
      belopReadOnly: 30000.00,
      fastsattBelop: null,
      inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
      aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
      refusjonskrav: null,
      visningsnavn: 'BEDRIFT AS (910909088)',
      arbeidsforhold: {
        arbeidsgiverNavn: 'BEDRIFT AS',
        arbeidsgiverId: '910909088',
        startdato: '2019-02-03',
        opphoersdato: '2020-02-03',
        arbeidsforholdId: null,
        eksternArbeidsforholdId: null,
        arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
        aktørId: null,
        refusjonPrAar: null,
        belopFraInntektsmeldingPrMnd: 30000.00,
        organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
        naturalytelseBortfaltPrÅr: null,
        naturalytelseTilkommetPrÅr: null,
      },
      andelsnr: 1,
      skalKunneEndreAktivitet: false,
      lagtTilAvSaksbehandler: false,
    }],
    vurderMilitaer: { harMilitaer: null },
    refusjonskravSomKommerForSentListe: null,
  },
  andelerMedGraderingUtenBG: null,
  hjemmel: { kode: '-', kodeverk: 'BG_HJEMMEL' },
  faktaOmFordeling: null,
  årsinntektVisningstall: 0,
  dekningsgrad: 100,
};


export const aksjonspunkt = [
  {
    definisjon: { kode: '5058', kodeverk: 'AKSJONSPUNKT_DEF' },
    status: { kode: 'OPPR', kodeverk: 'AKSJONSPUNKT_STATUS' },
    begrunnelse: null,
    vilkarType: null,
    toTrinnsBehandling: true,
    toTrinnsBehandlingGodkjent: null,
    vurderPaNyttArsaker: null,
    besluttersBegrunnelse: null,
    aksjonspunktType: { kode: 'MANU', kodeverk: 'AKSJONSPUNKT_TYPE' },
    kanLoses: true,
    erAktivt: true,
    fristTid: null,
    endretTidspunkt: null,
    endretAv: null,
  }];
