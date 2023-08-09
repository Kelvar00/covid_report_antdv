import mitt, { type Emitter } from 'mitt'
import type { App } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $eventBus: Emitter<Events>
  }
}

type Events = {
  'clickUpdate:selectedIndex': number
}

class MittPlugin {
  install(app: App<any>): App<any> {
    app.config.globalProperties.$eventBus = $eventBus
    return app
  }
}

const plugin = new MittPlugin()
const $eventBus = mitt<Events>()!
export default plugin
export { $eventBus }
