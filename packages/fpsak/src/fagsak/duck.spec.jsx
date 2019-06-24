import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import behandlingOrchestrator from 'behandling/BehandlingOrchestrator';
import fpsakApi, { FpsakApiKeys, reduxRestApi } from 'data/fpsakApi';
import {
  RESET_FAGSAKER, fagsakReducer, setSelectedSaksnummer, resetFagsakContext, doNotResetWhitelist, updateFagsakInfo,
  updateBehandlinger, fetchFagsakInfo,
}
  from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Fagsak-reducer', () => {
  let mockAxios;

  before(() => {
    behandlingOrchestrator.disableTilbakekreving();
    mockAxios = new MockAdapter(reduxRestApi.getHttpClientApi().axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  after(() => {
    mockAxios.restore();
    behandlingOrchestrator.reset();
  });

  it('skal returnere initial state', () => {
    expect(fagsakReducer(undefined, {})).to.eql({
      selectedSaksnummer: null,
    });
  });

  it('skal sette valgt saksnummer i store', () => {
    const action = setSelectedSaksnummer(12345);

    expect(fagsakReducer(undefined, action)).to.eql({
      selectedSaksnummer: 12345,
    });
  });

  it('skal resette fagsak-context', () => {
    const store = mockStore();

    store.dispatch(resetFagsakContext());

    const allRestApisToReset = Object.values(FpsakApiKeys)
      .filter(value => !doNotResetWhitelist.includes(value))
      .map(api => (`@@REST/${api} RESET`));
    const types = store.getActions().map(action => action.type);

    expect(types).to.includes(RESET_FAGSAKER);
    expect(types.filter(type => type !== RESET_FAGSAKER)).to.include.members(allRestApisToReset);
  });

  it('skal oppdatere fagsak-context', () => {
    const fagsak = { saksnummer: 1 };
    const behandlinger = [{ id: 2 }];
    mockAxios
      .onGet(fpsakApi.FETCH_FAGSAK.path)
      .replyOnce(200, fagsak);
    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPSAK.path)
      .replyOnce(200, behandlinger);
    mockAxios
      .onGet(fpsakApi.ALL_DOCUMENTS.path)
      .replyOnce(200, { dokId: 1 });
    mockAxios
      .onGet(fpsakApi.HISTORY_FPSAK.path)
      .replyOnce(200, { histId: 3 });
    mockAxios
      .onGet(fpsakApi.ANNEN_PART_BEHANDLING.path)
      .replyOnce(200, { url: '' });

    const store = mockStore();

    return store.dispatch(updateFagsakInfo(1))
      .then(() => {
        expect(store.getActions()).to.have.length(10);
        expect(store.getActions()[0].type).to.contain('fpsak/api/fagsak STARTED');
        expect(store.getActions()[1].type).to.contain('fpsak/api/behandlinger/alle STARTED');
        expect(store.getActions()[2].type).to.contain('fpsak/api/behandlinger/annen-part-behandling STARTED');
        expect(store.getActions()[3].type).to.contain('fpsak/api/dokument/hent-dokumentliste STARTED');
        expect(store.getActions()[4].type).to.contain('fpsak/api/fagsak FINISHED');
        expect(store.getActions()[5].type).to.contain('fpsak/api/behandlinger/alle FINISHED');
        expect(store.getActions()[6].type).to.contain('fpsak/api/behandlinger/annen-part-behandling FINISHED');
        expect(store.getActions()[7].type).to.contain('fpsak/api/dokument/hent-dokumentliste FINISHED');
        expect(store.getActions()[8].type).to.contain('fpsak/api/historikk STARTED');
        expect(store.getActions()[9].type).to.contain('fpsak/api/historikk FINISHED');
      });
  });

  it('skal hente fagsak', () => {
    const fagsak = { saksnummer: 1 };
    const behandlinger = [{ id: 2 }];
    mockAxios
      .onGet(fpsakApi.FETCH_FAGSAK.path)
      .replyOnce(200, fagsak);
    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPSAK.path)
      .replyOnce(200, behandlinger);
    mockAxios
      .onGet(fpsakApi.ALL_DOCUMENTS.path)
      .replyOnce(200, { dokId: 1 });
    mockAxios
      .onGet(fpsakApi.HISTORY_FPSAK.path)
      .replyOnce(200, { histId: 3 });
    mockAxios
      .onGet(fpsakApi.ANNEN_PART_BEHANDLING.path)
      .replyOnce(200, { url: '' });

    const store = mockStore();

    return store.dispatch(fetchFagsakInfo(1))
      .then(() => {
        expect(store.getActions()).to.have.length(15);
        expect(store.getActions()[0].type).to.contain('/FETCH_FAGSAK RESET');
        expect(store.getActions()[1].type).to.contain('/BEHANDLINGER_FPSAK RESET');
        expect(store.getActions()[2].type).to.contain('/ALL_DOCUMENTS RESET');
        expect(store.getActions()[3].type).to.contain('/HISTORY_FPSAK RESET');
        expect(store.getActions()[4].type).to.contain('/ANNEN_PART_BEHANDLING RESET');
        expect(store.getActions()[5].type).to.contain('fpsak/api/fagsak STARTED');
        expect(store.getActions()[6].type).to.contain('fpsak/api/behandlinger/alle STARTED');
        expect(store.getActions()[7].type).to.contain('fpsak/api/behandlinger/annen-part-behandling STARTED');
        expect(store.getActions()[8].type).to.contain('fpsak/api/dokument/hent-dokumentliste STARTED');
        expect(store.getActions()[9].type).to.contain('fpsak/api/fagsak FINISHED');
        expect(store.getActions()[10].type).to.contain('fpsak/api/behandlinger/alle FINISHED');
        expect(store.getActions()[11].type).to.contain('fpsak/api/behandlinger/annen-part-behandling FINISHED');
        expect(store.getActions()[12].type).to.contain('fpsak/api/dokument/hent-dokumentliste FINISHED');
        expect(store.getActions()[13].type).to.contain('fpsak/api/historikk STARTED');
        expect(store.getActions()[14].type).to.contain('fpsak/api/historikk FINISHED');
      });
  });

  it('skal hente behandlinger', () => {
    const behandlinger = [{ id: 1 }];
    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPSAK.path)
      .reply(200, behandlinger);

    const store = mockStore();

    const saksnummer = 1;

    return store.dispatch(updateBehandlinger(saksnummer))
      .then(() => {
        expect(store.getActions()).to.have.length(2);
        const [hentBehandlingerStartedAction, hentBehandlingerFinishedAction] = store.getActions();

        expect(hentBehandlingerStartedAction.type).to.contain('fpsak/api/behandlinger/alle STARTED');
        expect(hentBehandlingerStartedAction.payload.params).is.eql({ saksnummer });
        expect(hentBehandlingerStartedAction.meta).is.eql({ options: { keepData: true } });

        expect(hentBehandlingerFinishedAction.type).to.contain('fpsak/api/behandlinger/alle FINISHED');
        expect(hentBehandlingerFinishedAction.payload).is.eql(behandlinger);
      });
  });
});
