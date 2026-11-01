<template>
  <div ref="host" class="chat-assistant" />
</template>

<script>
// The Dialogflow Messenger chat. The agent (Dialogflow ES) recognizes the question; answers about the model are
// computed here from the viewer (utils/assistant.js) and added to the conversation with renderCustomText.
import { loadScript } from '~/utils/load-script'
import { answer, suggestionsFor } from '~/utils/assistant'

const MESSENGER_SCRIPT = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1'
const AGENT_ID = '7f4325ae-c139-4a5e-9aa7-78f5e0f92326'

export default {
  name: 'ChatAssistant',
  props: {
    viewer: { type: Object, default: null },
    index: { type: Object, default: null }
  },
  watch: {
    index(value) {
      if (value && this.loaded && !this.chipsShown) this.renderChips()
    }
  },
  mounted() {
    const el = document.createElement('df-messenger')
    el.setAttribute('agent-id', AGENT_ID)
    el.setAttribute('chat-title', 'BIM Assistant')
    el.setAttribute('language-code', 'en')
    el.setAttribute('chat-icon', '/images/chat-icon.svg')
    el.addEventListener('df-messenger-loaded', this.onLoaded)
    el.addEventListener('df-response-received', this.onResponse)
    this.messenger = el
    this.$refs.host.appendChild(el)
    loadScript(MESSENGER_SCRIPT).catch(() => {
      // The chat stays unavailable; the viewer and the summary panel still work.
    })
  },
  beforeDestroy() {
    clearTimeout(this.chipTimer)
    if (this.messenger) {
      this.messenger.removeEventListener('df-messenger-loaded', this.onLoaded)
      this.messenger.removeEventListener('df-response-received', this.onResponse)
      this.messenger.remove()
    }
  },
  methods: {
    onLoaded() {
      this.messenger.renderCustomText('Hi, I am the BIM assistant. Ask me about the model open in the viewer, for example:')
      this.loaded = true
      // The questions to offer depend on what the open model holds, which is known a moment after the chat loads.
      if (this.index) this.renderChips()
      else this.chipTimer = setTimeout(() => !this.chipsShown && this.renderChips(), 8000)
      this.$emit('ready')
    },
    renderChips() {
      this.chipsShown = true
      clearTimeout(this.chipTimer)
      this.messenger.renderCustomCard([{ type: 'chips', options: suggestionsFor(this.index).map((text) => ({ text })) }])
    },
    onResponse(event) {
      const result = (event.detail && event.detail.response && event.detail.response.queryResult) || {}
      const intent = result.intent && result.intent.displayName
      const reply = answer(intent, result.queryText, this.index)
      if (!reply) return
      // Let the agent's own message render first.
      setTimeout(() => {
        this.messenger.renderCustomText(reply.text)
        if (reply.chips) this.renderChips()
        this.apply(reply.action)
      }, 0)
    },
    apply(action) {
      const viewer = this.viewer
      if (!action || !viewer) return
      if (action.isolate) {
        viewer.isolate(action.isolate)
        viewer.fitToView(action.isolate)
        this.$emit('isolated')
      } else if (action.focus) {
        viewer.isolate([action.focus])
        viewer.fitToView([action.focus])
        viewer.select([action.focus])
        this.$emit('isolated')
      } else if (action.explode) {
        viewer.showAll()
        if (this.index && this.index.groups.rooms.length) viewer.hide(this.index.groups.rooms)
        viewer.explode(0.5)
        this.$emit('isolated')
      }
    },
    // Opens the chat and sends a question as if it had been typed.
    ask(question) {
      const el = this.messenger
      if (!el) return
      el.setAttribute('expand', '')
      el.expand = true
      let attempts = 0
      const send = () => {
        const chat = el.shadowRoot && el.shadowRoot.querySelector('df-messenger-chat')
        const input = chat && chat.shadowRoot && chat.shadowRoot.querySelector('df-messenger-user-input')
        const field = input && input.shadowRoot && input.shadowRoot.querySelector('input')
        if (field && typeof input.sendMessage === 'function') {
          field.value = question
          input.sendMessage()
        } else if (attempts++ < 20) {
          setTimeout(send, 100)
        }
      }
      setTimeout(send, 50)
    }
  }
}
</script>

<style>
df-messenger {
  --df-messenger-button-titlebar-color: #2b3990;
  --df-messenger-button-titlebar-font-color: #ffffff;
  --df-messenger-chat-background-color: #ffffff;
  --df-messenger-bot-message: #f0f1f5;
  --df-messenger-user-message: #e3e6f6;
  --df-messenger-font-color: #1d2230;
  --df-messenger-send-icon: #2b3990;
  --df-messenger-chip-color: #ffffff;
  --df-messenger-chip-border-color: #c2c8d4;
  --df-messenger-input-box-color: #ffffff;
  --df-messenger-input-font-color: #1d2230;
  --df-messenger-input-placeholder-font-color: #626a7d;
  --df-messenger-minimized-chat-close-icon-color: #1d2230;
  --df-messenger-focus-color: #2b3990;
  z-index: 1040;
}
</style>
