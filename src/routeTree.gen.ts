/* eslint-disable */
// @ts-nocheck

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AiUnderstandingRouteImport } from './routes/ai-understanding'
import { Route as DestinationResultRouteImport } from './routes/destination-result'
import { Route as NavigationConfirmationRouteImport } from './routes/navigation-confirmation'
import { Route as SettingsRouteImport } from './routes/settings'

const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const AiUnderstandingRoute = AiUnderstandingRouteImport.update({ id: '/ai-understanding', path: '/ai-understanding', getParentRoute: () => rootRouteImport } as any)
const DestinationResultRoute = DestinationResultRouteImport.update({ id: '/destination-result', path: '/destination-result', getParentRoute: () => rootRouteImport } as any)
const NavigationConfirmationRoute = NavigationConfirmationRouteImport.update({ id: '/navigation-confirmation', path: '/navigation-confirmation', getParentRoute: () => rootRouteImport } as any)
const SettingsRoute = SettingsRouteImport.update({ id: '/settings', path: '/settings', getParentRoute: () => rootRouteImport } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/ai-understanding': typeof AiUnderstandingRoute
  '/destination-result': typeof DestinationResultRoute
  '/navigation-confirmation': typeof NavigationConfirmationRoute
  '/settings': typeof SettingsRoute
}
export interface FileRoutesByTo extends FileRoutesByFullPath {}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/ai-understanding': typeof AiUnderstandingRoute
  '/destination-result': typeof DestinationResultRoute
  '/navigation-confirmation': typeof NavigationConfirmationRoute
  '/settings': typeof SettingsRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/ai-understanding' | '/destination-result' | '/navigation-confirmation' | '/settings'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/ai-understanding' | '/destination-result' | '/navigation-confirmation' | '/settings'
  id: '__root__' | '/' | '/ai-understanding' | '/destination-result' | '/navigation-confirmation' | '/settings'
  fileRoutesById: FileRoutesById
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/ai-understanding': { id: '/ai-understanding'; path: '/ai-understanding'; fullPath: '/ai-understanding'; preLoaderRoute: typeof AiUnderstandingRouteImport; parentRoute: typeof rootRouteImport }
    '/destination-result': { id: '/destination-result'; path: '/destination-result'; fullPath: '/destination-result'; preLoaderRoute: typeof DestinationResultRouteImport; parentRoute: typeof rootRouteImport }
    '/navigation-confirmation': { id: '/navigation-confirmation'; path: '/navigation-confirmation'; fullPath: '/navigation-confirmation'; preLoaderRoute: typeof NavigationConfirmationRouteImport; parentRoute: typeof rootRouteImport }
    '/settings': { id: '/settings'; path: '/settings'; fullPath: '/settings'; preLoaderRoute: typeof SettingsRouteImport; parentRoute: typeof rootRouteImport }
  }
}

const rootRouteChildren = {
  IndexRoute,
  AiUnderstandingRoute,
  DestinationResultRoute,
  NavigationConfirmationRoute,
  SettingsRoute,
}

export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()

import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}
