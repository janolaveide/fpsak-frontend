/* @flow */
import type { ErrorFlowType } from './errorFlowType';

/**
 * Feiltyper til differensiering av framvisning i GUI
 * Skal speile FeilType.java en-til-en
 */
export const ErrorTypes = {
  MANGLER_TILGANG_FEIL: 'MANGLER_TILGANG_FEIL',
  TOMT_RESULTAT_FEIL: 'TOMT_RESULTAT_FEIL',
  BEHANDLING_ENDRET_FEIL: 'BEHANDLING_ENDRET_FEIL',
  GENERELL_FEIL: 'GENERELL_FEIL',
};

export const handledErrorTypes = [ErrorTypes.MANGLER_TILGANG_FEIL];

export const getErrorResponseData = (error: ErrorFlowType) => (error && error.response && error.response.data ? error.response.data : error);
export const errorOfType = (error: ErrorFlowType, errorType: string) => error && (getErrorResponseData(error).type === errorType);

export const isHandledError = (errorType?: string) => errorType && handledErrorTypes.includes(errorType);

const hasStatusCode = statusCode => (errorStatus?: number) => errorStatus === statusCode;

export const is401Error = hasStatusCode(401);

export const is418Error = hasStatusCode(418);