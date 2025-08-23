import { ref } from 'vue'
import { V1Resource } from '@/api/schema/api'
import { useAuthStore } from '@/stores/auth'
import { useDataCacheStore } from '@/stores/dataCache'
import { api as viewerApi } from 'v-viewer'

const authStore = useAuthStore()
const dataCacheStore = useDataCacheStore()

export const getImageResources = (resources: V1Resource[]): V1Resource[] => {
    return resources.filter(
        (resource) =>
            resource.type?.startsWith('image/') ||
            (resource.filename &&
                /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(resource.filename))
    )
}

export const getImageUrl = (
    resource: V1Resource,
    isNeedThumbnail: boolean = false
): string => {
    if (resource.externalLink) {
        return resource.externalLink
    }

    if (resource.name) {
        return `${authStore.serverUrl}/file/${resource.name}/${
            resource.filename
        }${isNeedThumbnail ? '?thumbnail=true' : ''}`
    }

    return ''
}

export const useImageViewer = () => {
    const viewImageLoading = ref(false)

    const showImageViewer = async (resource: V1Resource) => {
        if (viewImageLoading.value) {
            return
        }

        viewImageLoading.value = true
        const url = getImageUrl(resource, false)

        let imageUrl: string

        if (url.startsWith('blob:')) {
            imageUrl = url
        } else {
            const data = await dataCacheStore.getImageCache(url)
            if (data) {
                console.log('[show image viewer] hit image cache, url: ' + url)
                imageUrl = URL.createObjectURL(new Blob([data]))
            } else {
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`,
                    },
                })
                const blob = await response.blob()
                imageUrl = URL.createObjectURL(blob)
                dataCacheStore.setImageCache(
                    url,
                    new Uint8Array(await blob.arrayBuffer())
                )
            }
        }

        await new Promise((resolve) => setTimeout(resolve, 200))
        viewImageLoading.value = false

        viewerApi({
            options: {
                button: false,
                keyboard: false,
                toolbar: false,
                title: false,
                navbar: false,
            },
            images: [imageUrl],
        })
    }

    return {
        viewImageLoading,
        showImageViewer,
    }
}
