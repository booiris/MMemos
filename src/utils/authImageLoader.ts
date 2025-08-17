import { App, DirectiveBinding } from 'vue'

// origin source: https://github.com/chenchenwuai/v-auth-image/blob/master/packages/v-auth-image.js
const authImage = {
    // install method
    install(
        app: App,
        options = {
            getHeaders: () => ({}),
        }
    ) {
        const isFunction =
            options.getHeaders &&
            Object.prototype.toString.call(options.getHeaders) ===
                '[object Function]'
        const getHeaders = isFunction ? options.getHeaders : null
        app.directive('auth-image', {
            beforeMount(el: HTMLElement, binding: DirectiveBinding) {
                authImage.init(el, binding, {
                    getHeaders,
                })
            },
            mounted(el: HTMLElement) {
                authImage.load(el)
            },
            updated(el: HTMLElement, binding: DirectiveBinding) {
                if (binding.value !== binding.oldValue) {
                    el.setAttribute('data-src', binding.value)
                    authImage.load(el)
                }
            },
            unmounted(el: HTMLElement, binding: DirectiveBinding) {
                if (binding.arg === 'success') {
                    delete (el as any)._v_auth_image_success
                } else if (binding.arg === 'error') {
                    delete (el as any)._v_auth_image_error
                } else {
                    delete (el as any)._v_auth_image_defaults
                    el.removeAttribute('data-src')
                }
            },
        })
    },
    // initialization
    init(el: HTMLElement, binding: DirectiveBinding, defaults: any) {
        if (binding.arg === 'success') {
            ;(el as any)._v_auth_image_success = binding.value
        } else if (binding.arg === 'error') {
            ;(el as any)._v_auth_image_error = binding.value
        } else {
            ;(el as any)._v_auth_image_defaults = defaults
            el.setAttribute('data-src', binding.value)
            el.setAttribute('src', '')
        }
    },
    // Processing before image loading
    load(el: HTMLElement) {
        const realSrc = el.dataset.src
        const defaults = (el as any)._v_auth_image_defaults
        let headers: Record<string, string> = {}
        if (defaults.getHeaders) {
            const headers2 = defaults.getHeaders()
            Object.assign(headers, headers2)
        }
        if (realSrc && typeof realSrc === 'string') {
            authImage.requestImage(realSrc, el as HTMLImageElement, headers)
            el.removeAttribute('data-src')
        }
    },
    // Get actual image data
    requestImage(
        url: string,
        el: HTMLImageElement,
        headers: Record<string, string>
    ) {
        const request = new XMLHttpRequest()
        request.responseType = 'blob'
        request.open('get', url, true)
        Object.keys(headers).forEach((key) => {
            request.setRequestHeader(key, headers[key]!)
        })
        request.onreadystatechange = (e: Event) => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    el.src = URL.createObjectURL(request.response)
                    const isBuffer =
                        request.response.type.indexOf('application/json') === -1
                    if (isBuffer) {
                        el.onload = () => {
                            URL.revokeObjectURL(el.src)
                            const callback = (el as any)._v_auth_image_success
                            callback && callback(e) // eslint-disable-line
                        }
                        el.onerror = () => {
                            el.alt = 'loading image failed'
                            const callback = (el as any)._v_auth_image_error
                            callback && callback(e) // eslint-disable-line
                        }
                    } else {
                        el.alt = 'loading image failed'
                        const callback = (el as any)._v_auth_image_error
                        callback && callback(e) // eslint-disable-line
                    }
                } else {
                    el.alt = 'loading image failed'
                    const callback = (el as any)._v_auth_image_error
                    callback && callback(e) // eslint-disable-line
                }
            }
        }
        request.send(null)
    },
}
export default authImage
