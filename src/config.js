import {PixelRatio} from 'react-native';

export default {
  density: PixelRatio.get(),  //TV density
  //
  initGlobalNavY: 0,
  initHomeHeroY: 165,
  initHomeShelvesY: 836,
  //
  initGlobalNavH: 100,
  initHomeHeroH: 606,
  //
  stageW: 1920,
  stageH: 1080,
  
  //-- animation related
  stdDuration: 500,		      //in milliseconds = .5 sec,
  shortDuration: 350,	      //in milliseconds = .35 sec,
  waitToLargeBloomDuration: 4000,
};
