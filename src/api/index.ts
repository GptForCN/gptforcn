import { SHA256 } from 'crypto-js'
import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const dataParams = { prompt: params.prompt, options: params.options, systemMessage: settingStore.systemMessage }
  // Sign GPTFORCN
  const json = JSON.stringify(dataParams)
  const timenow = Date.now()
  const unSignStr = `appId=${import.meta.env.VITE_APP_API_ID}&appSecret=${import.meta.env.VITE_APP_API_SECRET}&data=${json}&timestamp=${timenow}`
  return post<T>({
    url: '/chat-process',
    data: dataParams,
    headers: { appId: import.meta.env.VITE_APP_API_ID, timestamp: timenow, sign: SHA256(unSignStr).toString() },
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  // Sign GPTFORCN
  const timenow = Date.now()
  const unSignStr = `appId=${import.meta.env.VITE_APP_API_ID}&appSecret=${import.meta.env.VITE_APP_API_SECRET}&data=&timestamp=${timenow}`

  return post<T>({
    url: '/session',
    headers: { appId: import.meta.env.VITE_APP_API_ID, timestamp: timenow, sign: SHA256(unSignStr).toString() },
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}
