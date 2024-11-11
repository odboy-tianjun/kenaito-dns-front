import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
  // { path: '/index', title: '首页', icon: 'home' },
  // {
  //   title: '页面',
  //   icon: 'folder-o',
  //   children: [
  //     { path: '/page1', title: '页面 1' },
  //     { path: '/page2', title: '页面 2' },
  //     { path: '/page3', title: '页面 3' }
  //   ]
  // }
])

// 具体组件查看 'src/router/routes.js'
export const menuAside = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  // {
  //   title: '控制台',
  //   icon: 'folder-o',
  //   children: [
  //     { path: '/resolveRecord', title: '解析记录' },
  //     { path: '/versionRecord', title: '版本记录' },
  //     { path: '/serverStatus', title: '服务状态' }
  //   ]
  // }
  { path: '/resolveRecord', title: '解析记录', icon: 'fa-solid fa-compass' },
  { path: '/versionRecord', title: '版本记录', icon: 'fa-solid fa-compass' },
])
