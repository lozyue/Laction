/**
 * laction JS 插件管理
 *  装载插件管理模块
 * laction 的 use 方法需要在加载目标插件实例化前调用
 * 也即laction实例化后调用，自身实例化前调用
 * 也即插件内部install方法会在实例化前调用
 * eg: 
 * import laction;
 * var la = new laction({...});
 * laction.use(lzycabinet, {period: 3000,});
 */

export function InitUse(laction){
  // laction.prototype._installedPlugins = [];
  // laction.use = function (plugin: Function | Object) {
  laction.prototype.use = function (plugin, ...option) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    };

    // additional parameters
    const args = option;
    args.unshift(this); // 这里传递实例化对象还是原型需要看是否已经`new`关键字进行了实例化
    // 需要维持this域的插件，灵活性的可挂载和可单独使用
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    // 无需维持this域，是专门化的类，直接调用构造方法
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }else{
      console.warn(`The provided option [${plugin+''}] is not a plugin.`);
    }
    installedPlugins.push(plugin);
    return this;
  };
  // 初始化插件系统
  laction.prototype._pluginInit = function(options){
    for(let k in options){
      
      // console.log(k, options, this.$settings[k])
      
      if(this.$settings[k]) this.$settings[k] = options[k]; // 选项覆盖内核自带配置
      // 非组件内配置则自动默认为插件
      else{
        // 应用插件及其设置
        this.use(options[k] );
      }
    }
  };
};
