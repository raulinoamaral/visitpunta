import * as migration_20261103_111926_initial from './20261103_111926_initial';
import * as migration_20261103_112844_localization_es_pt from './20261103_112844_localization_es_pt';
import * as migration_20261112_152254_place_gallery_position from './20261112_152254_place_gallery_position';

export const migrations = [
  {
    up: migration_20261103_111926_initial.up,
    down: migration_20261103_111926_initial.down,
    name: '20261103_111926_initial',
  },
  {
    up: migration_20261103_112844_localization_es_pt.up,
    down: migration_20261103_112844_localization_es_pt.down,
    name: '20261103_112844_localization_es_pt',
  },
  {
    up: migration_20261112_152254_place_gallery_position.up,
    down: migration_20261112_152254_place_gallery_position.down,
    name: '20261112_152254_place_gallery_position'
  },
];
