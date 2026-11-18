(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('hel-lib-proxy')) :
  typeof define === 'function' && define.amd ? define(['exports', 'hel-lib-proxy'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["comps-vue2-ele-vea"] = {}, global.HelLibProxy));
})(this, (function (exports, helLibProxy) { 'use strict';

  /*
  |--------------------------------------------------------------------------
  |
  | 对应 package.json/appGroupName
  |
  |--------------------------------------------------------------------------
  */

  const LIB_NAME = 'comps-vue2-ele-vea';

  /*
  |--------------------------------------------------------------------------
  |
  | 组件类型导出文件，同时也作为 rollup 的打包入口文件，rollup 打包后是一个
  | 仅包含 hel-lib-proxy 的轻量代理文件，不包含组件实现
  | 模块使用方 通过 npm i xxx-lib 后，只要在头文件处执行过 preFetchLib
  | 则整个项目项使用本地模块一样载入提供方的组件，并可以点击到 node_modules 查看源码
  |
  | 本包只收 vue-element-admin 来源的页面级组件与 Excel 导出工具；
  | think-vuele 的 Tc* 组件库与 App/HelloWorld/TierRanking 留在 @melt-js/comps-vue2-ele。
  |
  |--------------------------------------------------------------------------
  */
  /**
   * 将提供给用户的lib暴露出去（同时也暴露了类型）
   */
  var dtlib = helLibProxy.exposeLib(LIB_NAME);
  var Pagination = dtlib.Pagination;
  var Sticky = dtlib.Sticky;
  var BackToTop = dtlib.BackToTop;
  var DndList = dtlib.DndList;
  var Kanban = dtlib.Kanban;
  var DragSelect = dtlib.DragSelect;
  var UploadExcel = dtlib.UploadExcel;
  var AdminChart = dtlib.AdminChart;
  var RouteTabs = dtlib.RouteTabs;
  var exportJsonToExcel = dtlib.exportJsonToExcel;

  exports.AdminChart = AdminChart;
  exports.BackToTop = BackToTop;
  exports.DndList = DndList;
  exports.DragSelect = DragSelect;
  exports.Kanban = Kanban;
  exports.Pagination = Pagination;
  exports.RouteTabs = RouteTabs;
  exports.Sticky = Sticky;
  exports.UploadExcel = UploadExcel;
  exports["default"] = dtlib;
  exports.dtlib = dtlib;
  exports.exportJsonToExcel = exportJsonToExcel;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
