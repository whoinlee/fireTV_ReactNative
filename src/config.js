import {PixelRatio} from 'react-native';

export default {
  //-- base dimension and density
  density: PixelRatio.get(),    //TV density
  stageW: 1920,
  stageH: 1080,

  //-- animation related
  stdDuration: 500,             //in milliseconds = .5 sec,
  shortDuration: 350,           //in milliseconds = .35 sec,
  waitToLargeBloomDuration: 4000,

  //-- pane initial location
  initGlobalNavY: 0,
  initHomeHeroY: 165,
  initHomeShelvesY: 836,

  //-- pane initial dimension
  initGlobalNavH: 100,
  initHomeHeroH: 606,

  //-- homeShelvesPane location & dimension related
  homeShelves: {
    
  }
};
