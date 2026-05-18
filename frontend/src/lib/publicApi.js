import { laravelRequest } from '../utils/laravelApi.js'

/**
 * Public site API calls with Laravel base fallback (XAMPP /api, dev proxy, artisan serve).
 */
export async function fetchPublicApi(path, init = {}) {
  const { res } = await laravelRequest(path, init)
  const data = await res?.json().catch(() => ({}))
  return {
    ok: Boolean(res?.ok),
    status: res?.status ?? 0,
    data,
  }
}
