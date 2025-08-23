import { App, DirectiveBinding } from 'vue'
import { useDataCacheStore } from '@/stores/dataCache'

// origin source: https://github.com/chenchenwuai/v-auth-image/blob/master/packages/v-auth-image.js
// Intersection Observer for lazy loading
let intersectionObserver: IntersectionObserver | null = null

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
                // Check if the element has loading="lazy" attribute
                const isLazy = el.getAttribute('loading') === 'lazy'

                if (isLazy) {
                    // Use intersection observer for lazy loading
                    authImage.observeElement(el)
                } else {
                    // Load immediately for non-lazy images
                    authImage.load(el)
                }
            },
            async updated(el: HTMLElement, binding: DirectiveBinding) {
                if (binding.value !== binding.oldValue) {
                    el.setAttribute('data-src', binding.value)

                    // Check if this is a lazy loading element
                    const isLazy = el.getAttribute('loading') === 'lazy'
                    const isObserved = el.hasAttribute('data-lazy-observed')

                    if (isLazy && !isObserved) {
                        // Re-observe the element if it's lazy but not currently observed
                        authImage.observeElement(el)
                    } else if (!isLazy) {
                        // Load immediately for non-lazy images
                        authImage.load(el)
                    }
                    // If it's lazy and already observed, the observer will handle it
                }
            },
            unmounted(el: HTMLElement, binding: DirectiveBinding) {
                // Clean up intersection observer
                if (
                    intersectionObserver &&
                    el.hasAttribute('data-lazy-observed')
                ) {
                    intersectionObserver.unobserve(el)
                    el.removeAttribute('data-lazy-observed')
                }

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
    // Setup lazy loading with intersection observer
    observeElement(el: HTMLElement) {
        // Initialize intersection observer if not exists
        if (!intersectionObserver) {
            intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const target = entry.target as HTMLElement
                            // Load the image when it enters the viewport
                            authImage.load(target)
                            // Stop observing this element
                            intersectionObserver!.unobserve(target)
                            target.removeAttribute('data-lazy-observed')
                        }
                    })
                },
                {
                    // Load images when they are 100px away from entering the viewport
                    rootMargin: '100px',
                    threshold: 0.01,
                }
            )
        }

        // Mark element as being observed and start observing
        el.setAttribute('data-lazy-observed', 'true')
        intersectionObserver.observe(el)
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
