import { App, DirectiveBinding } from 'vue'
import { useDataCacheStore } from '@/stores/data_cache'

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
            async mounted(el: HTMLElement) {
                authImage.load(el)
            },
            async updated(el: HTMLElement, binding: DirectiveBinding) {
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
        ;(el as any)._v_auth_image_defaults = defaults
        el.setAttribute('data-src', binding.value)
        el.setAttribute('src', '')
    },
    // Processing before image loading
    async load(el: HTMLElement) {
        const realSrc = el.dataset.src
        if (realSrc && typeof realSrc === 'string') {
            const dataCacheStore = useDataCacheStore()
            const data = await dataCacheStore.getImageCache(realSrc)
            if (data) {
                console.log('hit image cache, url: ' + realSrc)
                const elImage = el as HTMLImageElement
                elImage.src = URL.createObjectURL(new Blob([data]))
                elImage.onload = () => {
                    URL.revokeObjectURL(elImage.src)
                }
                el.removeAttribute('data-src')
                return
            }
        }

        const defaults = (el as any)._v_auth_image_defaults
        let headers: Record<string, string> = {}
        if (defaults.getHeaders) {
            const headers2 = defaults.getHeaders()
            Object.assign(headers, headers2)
        }
        if (realSrc && typeof realSrc === 'string') {
            await authImage.requestImage(
                realSrc,
                el as HTMLImageElement,
                headers
            )
            el.removeAttribute('data-src')
        }
    },
    // Get actual image data
    async requestImage(
        url: string,
        el: HTMLImageElement,
        headers: Record<string, string>
    ) {
        const response = await fetch(url, {
            headers: headers,
        }).catch((e) => {
            console.error(e)
        })
        if (!response) {
            return
        }
        const blob = await response.blob()
        el.src = URL.createObjectURL(blob)
        const dataCacheStore = useDataCacheStore()
        dataCacheStore.setImageCache(
            url,
            new Uint8Array(await blob.arrayBuffer())
        )
        el.removeAttribute('data-src')
        el.onload = () => {
            URL.revokeObjectURL(el.src)
        }
        el.onerror = () => {
            el.alt = 'loading image failed'
        }
    },
}

export default authImage
