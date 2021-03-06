import {PixelRatio} from 'react-native';

export default {
  //-- density and base dimenstion
  density: PixelRatio.get(),    //-- TV density
  stageW: 1920,
  stageH: 1080,

  //-- animation related
  stdDuration: 500,             //-- in milliseconds = .5 sec,
  shortDuration: 250,           
  waitToLargeBloomDuration: 3000,

  //-- opacity related
  unselectedOpacity: .6,        //-- .6 -> .5, for testing
  selectedOpacity: 1,

  //-- initial pane yLocation
  initGlobalNavY: 0,
  initHomeHeroY: 165,
  initHomeShelvesY: 738,         

  //-- initial pane height
  initGlobalNavH: 100,
  initHomeHeroH: 606,

  //-- UI element left alignment location
  initX: 200,


  //-- homeShelvesPane location & dimension related
  homeShelves: {
    initShelfY: 92,             //-- distance from the top of homeShelvesPane container to the top of 1st shelf container, 62 ---> 92 (by 30)
    contentX: 20,               //-- marginLeft for the content on a tile

    //-- title related
    baseTitleH: 40,             //-- unselected shelf title height (!!!not same as the font size, 28)
    focusedTitleH: 60,          //-- update!!!
    titleToTileOffset: 10,      //-- distance from the bottom of shelf title to the top of shelf tile
    
    //-- tile related
    baseTileW: 320,             //-- unselected base tile width, 320x180* (original)
    baseTileH: 180,             //-- unselected base tile height
    //
    focusedTileW: 590,          //-- focused tile width, on a selected shelf, 590x332*, 640x360, 800x450 (focused)
    focusedTileH: 332,          //-- focused tile height, on a selected shelf
    focusedBaseTileW: 375,      //-- unfocused tile width, on a selected shelf, 375x210 (expanded)
    focusedBaseTileH: 210,      //-- unfocused tile height, on a selected shelf
    //
    bloomedTileW: 1056,         //-- large bloomed tile width, on a selected shelf, 1056x594* (lgBloomed)
    bloomedTileH: 594,          //-- large bloomed tile height, on a selected shelf
    bloomedBaseTileW: 782,      //-- unbloomed tile width, on a selected shelf, 782x440 (medBloomed)
    bloomedBaseTileH: 440,      //-- unbloomed tile height, on a selected shelf
    
    //-- shelf related
    baseShelfOffsetX: 0,        //-- distance between tiles on an unselected shelf
    baseShelfOffsetY: 106,      //-- distance between unselected shelves
    baseShelfH: 336,            //-- baseTitleH (40) + titleToTileOffset (10) + baseTileH (180) + baseShelfOffsetY (106) = 336

    focusedShelfShiftY: 15,     //-- the y location shift of unselected shelves on selected shelf being focused: (focusedBaseTileH (210) - baseTileH (180))/2 = 15
    bloomedShelfShiftY: 115,    //-- the y location shift of unselected shelves on selected shelf being large bloomed: (bloomedBaseTileH (440) - focusedBaseTileH (210))/2 = 115
    
    focusedShelfOffsetX: 25,    //-- distance between tiles on a focused shelf
    focusedShelfOffsetY: 182,   //-- baseShelfOffsetY (106) + focusedShelfShiftY (76) = 182
    focusedShelfH: 584,         //-- focusedTitleH (60) + titleToTileOffset (10) + focusedTileH (332) + focusedShelfOffsetY (182) = 584

    bloomedShelfOffsetX: 57,    //-- distance between tiles on a bloomed shelf
    bloomedShelfOffsetY: 313,   //-- focusedShelfOffsetY (182) + bloomedShelfShiftY (131) = 313
    bloomedShelfH: 543          //-- focusedTitleH (60) + titleToTileOffset (10) + bloomedTileH (594) + bloomedShelfOffsetY (313) = 977
  }
};
