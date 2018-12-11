import innvilgetHoverIkonUrl from '@fpsak-frontend/assets/images/vedtak_ikon_ok.svg';
import avslattIkonUrl from '@fpsak-frontend/assets/images/vedtak_ikon_ikke_ok.svg';
import avslattValgtIkonUrl from '@fpsak-frontend/assets/images/vedtak_ikon_ikke_ok_valgt.svg';
import behandleIkonUrl from '@fpsak-frontend/assets/images/vedtak_ikon.svg';
import behandleValgtIkonUrl from '@fpsak-frontend/assets/images/vedtak_ikon_valgt.svg';
import innvilgetValgtIkonUrl from '@fpsak-frontend/assets/images/vedtak_ikon_ok_valgt.svg';
import ikkeVurdertIkonUrl from '@fpsak-frontend/assets/images/vedtak_ikon_disable.svg';

import vilkarUtfallType from 'kodeverk/vilkarUtfallType';

const vedtakImages = {
  imageMap: {
    [vilkarUtfallType.OPPFYLT]: innvilgetHoverIkonUrl,
    [vilkarUtfallType.IKKE_VURDERT]: { true: behandleIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avslattIkonUrl,
  },
  selectImageMap: {
    [vilkarUtfallType.OPPFYLT]: innvilgetValgtIkonUrl,
    [vilkarUtfallType.IKKE_VURDERT]: { true: behandleValgtIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avslattValgtIkonUrl,
  },
  hooverImageMap: {
    [vilkarUtfallType.OPPFYLT]: innvilgetHoverIkonUrl,
    [vilkarUtfallType.IKKE_VURDERT]: { true: innvilgetHoverIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avslattValgtIkonUrl,
  },
};

export default vedtakImages;