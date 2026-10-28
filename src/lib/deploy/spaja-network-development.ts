import developmentInput from '../../../ops/spaja-network/development.json';
import { buildNetworkMapping, publicNetworkMapping } from './spaja-network';

/** Read-only development configuration; separate from existing Vercel releases. */
export function getDevelopmentNetworkMapping() {
  return publicNetworkMapping(buildNetworkMapping(developmentInput));
}
