/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/mobility/controllers/journey_planner_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/mobility/controllers/journey_planner_controller').default['render']>>>
    }
  }
  'lines.index': {
    methods: ["GET","HEAD"]
    pattern: '/lines'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/mobility/controllers/lines_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/mobility/controllers/lines_controller').default['render']>>>
    }
  }
  'favorites.index': {
    methods: ["GET","HEAD"]
    pattern: '/favorites'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/mobility/controllers/favorites_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/mobility/controllers/favorites_controller').default['render']>>>
    }
  }
  'traffic.index': {
    methods: ["GET","HEAD"]
    pattern: '/traffic'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/mobility/controllers/traffic_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/mobility/controllers/traffic_controller').default['render']>>>
    }
  }
  'sources.index': {
    methods: ["GET","HEAD"]
    pattern: '/sources'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/mobility/controllers/sources_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/mobility/controllers/sources_controller').default['render']>>>
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/register_user_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/register_user_controller').default['render']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/identity/controllers/register_user_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/identity/controllers/register_user_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/register_user_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/register_user_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/login_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/login_controller').default['render']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/identity/controllers/login_controller').default)['validator']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/identity/controllers/login_controller').default)['validator']>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/login_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/login_controller').default['execute']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'account.show': {
    methods: ["GET","HEAD"]
    pattern: '/account'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/account_controller').default['render']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/account_controller').default['render']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/identity/controllers/logout_controller').default['execute']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/identity/controllers/logout_controller').default['execute']>>>
    }
  }
  'health': {
    methods: ["GET","HEAD"]
    pattern: '/healthz'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
}
