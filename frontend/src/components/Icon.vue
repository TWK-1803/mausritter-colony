<template>
  <IconifyIcon v-bind="$attrs" :icon="icons[icon]" class="icon-middle" :class="{ 'is-clickable': isButton }" />
</template>

<script>
import { Icon as IconifyIcon } from '@iconify/vue'
import icons from '@/services/icons'

export default {
  name: 'McIcon',
  components: { IconifyIcon },
  props: {
    icon: { type: String, required: true },
    isButton: { type: Boolean, default: false }
  },
  data () {
    return {
      icons
    }
  }
}
</script>
