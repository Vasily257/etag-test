import axios, { type AxiosPromise } from 'axios'
import type { NotificationCase, Notification } from '@/types'

const baseApi = axios.create({
  baseURL: 'https://e-tag.pro/testjob/',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

export const getNotificationCases = async (): NotificationAPI.GET.GetNotificationCases.Response => {
  return await baseApi.get(`/cases.json`)
}

export const getNotificationItems = async (): NotificationAPI.GET.GetNotificationItems.Response => {
  return await baseApi.get(`/list.json`)
}

export namespace NotificationAPI {
  export namespace GET {
    export namespace GetNotificationCases {
      export type Response = AxiosPromise<NotificationCase[]>
    }

    export namespace GetNotificationItems {
      export type Response = AxiosPromise<Notification[]>
    }
  }
}
