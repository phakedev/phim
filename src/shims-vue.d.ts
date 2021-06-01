declare module "*.vue" {
  import { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "*.svg?component" {
  const content: any
  export default content
}

declare interface Window {
  // extend the window
}
