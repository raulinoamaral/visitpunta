import * as migration_20261103_111926_initial from './20261103_111926_initial';
import * as migration_20261103_112844_localization_es_pt from './20261103_112844_localization_es_pt';

export const migrations = [
  {
    up: migration_20261103_111926_initial.up,
    down: migration_20261103_111926_initial.down,
    name: '20261103_111926_initial',
  },
  {
    up: migration_20261103_112844_localization_es_pt.up,
    down: migration_20261103_112844_localization_es_pt.down,
    name: '20261103_112844_localization_es_pt'
  },
];
