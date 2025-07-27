<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
    initialText?: string
}

const props = withDefaults(defineProps<Props>(), {
    initialText: `好的，这是一篇关于音乐的中英双语内容，总计约1000字（中文字符与英文字词结合），旨在探讨音乐的普世力量与个人共鸣。

***

音乐，是一种跨越疆界的语言，是人类灵魂共通的低语。它无需翻译，便能触动心弦；它不拘形式，却能承载最复杂的情感。从远古先民的鼓点，到现代交响乐的华章，音乐伴随着人类文明的脚步，记录着时代的脉搏，也慰藉着每一个孤独或欢腾的灵魂。

Music is a language that transcends borders, a universal whisper of the human soul. It needs no translation to touch the heartstrings; it is not confined by form, yet it can carry the most complex emotions. From the drumbeats of ancient ancestors to the grand movements of modern symphonies, music has accompanied the progress of human civilization, chronicling the pulse of the times and comforting every soul in its solitude or celebration.

音乐的核心在于其情感的共鸣。一段旋律，可以描绘出旭日东升的壮丽，也能勾勒出月夜下的静谧。激昂的节奏，能点燃我们内心的火焰，让我们在困境中奋起；而温柔的乐章，则如和煦的春风，抚平我们灵魂的褶皱。快乐时，音乐是分享的伙伴；悲伤时，音乐是无声的慰藉。它是一种情感的容器，我们向其中倾注自己的故事，它则以和谐的振动回应我们，让我们知道，我们并非孤单一人。

At the core of music lies its emotional resonance. A melody can paint the splendor of a sunrise or sketch the tranquility of a moonlit night. An impassioned rhythm can ignite the fire within us, inspiring us to rise up in the face of adversity, while a gentle composition can be like a warm spring breeze, smoothing the creases of our souls. In happiness, music is a companion for sharing; in sorrow, it is a silent solace. It is a vessel for emotion. We pour our own stories into it, and it responds with harmonious vibrations, letting us know that we are not alone.

音乐亦是文化的载体与历史的回响。每一种文化，都有其独特的音乐声景。东方的五声音阶，流淌着古典的禅意与诗情；西方的和声体系，构建出精密的逻辑与戏剧性的张力。民谣里，唱的是乡土的记忆与生活的悲欢；摇滚中，呐喊的是一代人的反叛与理想。通过音乐，我们得以窥见不同民族的精神世界，触摸到历史长河中那些早已远去的瞬间。它是活着的历史，是流动的文化遗产。

Music is also a carrier of culture and an echo of history. Every culture possesses its own unique soundscape. The pentatonic scales of the East flow with classical Zen and poetry; the harmonic systems of the West construct intricate logic and dramatic tension. Folk songs sing of pastoral memories and the joys and sorrows of life; rock and roll shouts the rebellion and ideals of a generation. Through music, we can glimpse into the spiritual worlds of different peoples and touch moments in the long river of history that have long since passed. It is a living history, a fluid cultural heritage.

对每个人而言，音乐都是一份极其私人的礼物。我们的生命中，总有那么几首歌，与特定的记忆紧密相连。可能是年少时第一次心动的背景音乐，可能是与挚友在旅途中反复播放的曲调，也可能是在人生低谷时，单曲循环用以自愈的旋ax律。这些歌曲，构成了我们个人的“原声带”，在时间的流转中，成为我们身份的一部分。它们提醒我们曾经是谁，经历过什么，又梦想成为怎样的人。

For each individual, music is an incredibly personal gift. In our lives, there are always a few songs intimately linked to specific memories. It might be the background music to a first crush in our youth, a tune played on repeat during a journey with a dear friend, or a melody looped endlessly for self-healing during a low point in life. These songs form our personal "soundtrack," becoming a part of our identity as time goes by. They remind us of who we were, what we have experienced, and who we dream of becoming.

最终，音乐是关于连接的艺术——连接情感与理智，连接个人与集体，连接过去与未来。它以无形的方式，塑造着我们的感知，丰富着我们的世界。无论你身在何方，属于何种文化，总有一种旋律能让你驻足，让你感动，让你在纷繁复杂的世界中，找到片刻的和谐与安宁。这，就是音乐永恒的魅力。

Ultimately, music is an art of connection—connecting emotion and intellect, the individual and the collective, the past and the future. In its intangible way, it shapes our perceptions and enriches our world. No matter where you are or what culture you belong to, there is always a melody that can make you pause, move you, and allow you to find a moment of harmony and peace in this complex world. This is the eternal charm of music.`,
})

interface Emits {
    close: []
    send: [text: string]
    textChange: [text: string]
}

const emit = defineEmits<Emits>()

const textContent = ref<string>('')

const handleClose = () => {
    emit('close')
}

const handleSend = () => {
    if (textContent.value.trim()) {
        emit('send', textContent.value)
    }
}

const textareaRef = ref<HTMLTextAreaElement>()

const handleInput = () => {
    emit('textChange', textContent.value)
}

onMounted(() => {
    textContent.value = props.initialText

    // 自动聚焦textarea以打开手机键盘
    // nextTick(() => {
    //     if (textareaRef.value) {
    //         textareaRef.value.focus()
    //     }
    // })
})
</script>

<template>
    <div class="flex flex-col h-screen bg-background">
        <div
            class="flex items-center justify-between py-3 bg-gray-50 border-b border-gray-200">
            <button
                @click="handleClose"
                class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors">
                <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>

            <h1 class="text-lg font-medium text-gray-900">编辑文本</h1>

            <button
                @click="handleSend"
                :disabled="!textContent.trim()"
                class="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                发送
            </button>
        </div>

        <div class="flex-1 overflow-hidden">
            <textarea
                ref="textareaRef"
                v-model="textContent"
                :placeholder="t('main.editPage.placeholder')"
                class="w-full h-full resize-none border-none outline-none text-base leading-relaxed text-gray-900 placeholder-gray-400 overflow-y-auto overscroll-none px-4"
                @input="handleInput"></textarea>
        </div>

        <div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div
                class="flex items-center justify-between text-sm text-gray-500">
                <span>字数: {{ textContent.length }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
    display: block !important;
}
</style>
