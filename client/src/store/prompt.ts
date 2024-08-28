import { defineStore } from 'pinia'
import { queryPromptList, removePrompt } from '@/views/chat/api'
import type { Prompt } from '@/views/chat/types'

interface PromptState {
  promptList: Prompt[]
}

export const usePromptStore = defineStore('prompt-store', {
  state: (): PromptState => ({
    promptList: [],
  }),

  actions: {
    async getPromptList() {
      const res = await queryPromptList()
      this.promptList = res.data
      return this.promptList
    },

    async removePrompt(promptId: string) {
      await removePrompt(promptId)
      await this.getPromptList()
    },
  },
})
