import type { ConfigType } from '@plone/registry';
import installRoutes from './config/routes';
import installSlots from './config/slots';
import installBlocks from './config/blocks';

export default function install(config: ConfigType) {
  installRoutes(config);
  installSlots(config);
  installBlocks(config);

  return config;
}
