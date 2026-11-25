import * as migration_20261103_111926_initial from './20261103_111926_initial';
import * as migration_20261103_112844_localization_es_pt from './20261103_112844_localization_es_pt';
import * as migration_20261112_152254_place_gallery_position from './20261112_152254_place_gallery_position';
import * as migration_20261124_224556_instagram from './20261124_224556_instagram';
import * as migration_20261124_235019_home_and_season from './20261124_235019_home_and_season';
import * as migration_20261125_002948_zone_page_fields from './20261125_002948_zone_page_fields';
import * as migration_20261125_004141_placements from './20261125_004141_placements';
import * as migration_20261125_011134_remove_old_featuring from './20261125_011134_remove_old_featuring';

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
    name: '20261112_152254_place_gallery_position',
  },
  {
    up: migration_20261124_224556_instagram.up,
    down: migration_20261124_224556_instagram.down,
    name: '20261124_224556_instagram',
  },
  {
    up: migration_20261124_235019_home_and_season.up,
    down: migration_20261124_235019_home_and_season.down,
    name: '20261124_235019_home_and_season',
  },
  {
    up: migration_20261125_002948_zone_page_fields.up,
    down: migration_20261125_002948_zone_page_fields.down,
    name: '20261125_002948_zone_page_fields',
  },
  {
    up: migration_20261125_004141_placements.up,
    down: migration_20261125_004141_placements.down,
    name: '20261125_004141_placements',
  },
  {
    up: migration_20261125_011134_remove_old_featuring.up,
    down: migration_20261125_011134_remove_old_featuring.down,
    name: '20261125_011134_remove_old_featuring'
  },
];
