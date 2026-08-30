/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  lines: {
    index: typeof routes['lines.index']
  }
  favorites: {
    index: typeof routes['favorites.index']
  }
  traffic: {
    index: typeof routes['traffic.index']
  }
  sources: {
    index: typeof routes['sources.index']
  }
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  account: {
    show: typeof routes['account.show']
  }
}
