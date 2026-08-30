import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'lines.index': { paramsTuple?: []; params?: {} }
    'favorites.index': { paramsTuple?: []; params?: {} }
    'traffic.index': { paramsTuple?: []; params?: {} }
    'sources.index': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'account.show': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'lines.index': { paramsTuple?: []; params?: {} }
    'favorites.index': { paramsTuple?: []; params?: {} }
    'traffic.index': { paramsTuple?: []; params?: {} }
    'sources.index': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'account.show': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'lines.index': { paramsTuple?: []; params?: {} }
    'favorites.index': { paramsTuple?: []; params?: {} }
    'traffic.index': { paramsTuple?: []; params?: {} }
    'sources.index': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'account.show': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}