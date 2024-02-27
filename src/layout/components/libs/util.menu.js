/**
 * @description 创建菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function elMenuItem (h, menu) {
    let icon = ''
    if (menu.meta.icon) icon = <i class={`menu-prex-ico vsd-menu-${menu.meta.icon}`} name={ `${menu.meta.icon}` }/>
  return <el-menu-item
    key={ menu.path }
    index={ menu.path }>
    { icon }
    <span slot="title">{ menu?.meta?.title || '未命名菜单' }</span>
  </el-menu-item>
}

/**
 * @description 创建子菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function elSubmenu (h, menu) {
  let icon = null
  
  if (menu.meta.icon) icon = <i slot="title" class={`menu-prex-ico vsd-menu-${menu.meta.icon}`}/>
  else icon = ''
  return <el-submenu
    key={ menu.path }
    index={ menu.path }>
    { icon }
    <span slot="title">{ menu?.meta?.title || '未命名菜单1' }</span>
    { menu.children.map(child => createMenu.call(this, h, child)) }
  </el-submenu>
}



/**
 * @description 在组件中调用此方法渲染菜单项目
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function createMenu (h, menu) {
    if(menu.children === undefined){
        return elMenuItem.call(this, h, menu)
    }else{
        const hasMenu = menu.children.some(item => item.meta.isMenu)
        if(hasMenu){
            return elSubmenu.call(this, h, menu)
        }else{
            return elMenuItem.call(this, h, menu)
        }
    }
}
