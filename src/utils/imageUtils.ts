import { ref } from 'vue'
import { V1Resource } from '@/api/schema/api'
import { getAuthToken, getHost } from '@/api/client'
import { api as viewerApi } from 'v-viewer'

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
        return `${getHost()}/file/${resource.name}/${resource.filename}${
            isNeedThumbnail ? '?thumbnail=true' : ''
        }`
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
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const blob = await response.blob()
            imageUrl = URL.createObjectURL(blob)
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
