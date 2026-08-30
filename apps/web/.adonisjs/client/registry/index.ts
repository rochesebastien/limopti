/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'lines.index': {
    methods: ["GET","HEAD"],
    pattern: '/lines',
    tokens: [{"old":"/lines","type":0,"val":"lines","end":""}],
    types: placeholder as Registry['lines.index']['types'],
  },
  'favorites.index': {
    methods: ["GET","HEAD"],
    pattern: '/favorites',
    tokens: [{"old":"/favorites","type":0,"val":"favorites","end":""}],
    types: placeholder as Registry['favorites.index']['types'],
  },
  'traffic.index': {
    methods: ["GET","HEAD"],
    pattern: '/traffic',
    tokens: [{"old":"/traffic","type":0,"val":"traffic","end":""}],
    types: placeholder as Registry['traffic.index']['types'],
  },
  'sources.index': {
    methods: ["GET","HEAD"],
    pattern: '/sources',
    tokens: [{"old":"/sources","type":0,"val":"sources","end":""}],
    types: placeholder as Registry['sources.index']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'account.show': {
    methods: ["GET","HEAD"],
    pattern: '/account',
    tokens: [{"old":"/account","type":0,"val":"account","end":""}],
    types: placeholder as Registry['account.show']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
