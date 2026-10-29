<template>
  <div class="accordion is-flex is-flex-direction-column">
    <div class="accordion-heading is-flex is-flex-direction-row is-justify-content-space-between vertical-align">
      <div class="is-clickable vertical-align" @click="expanded = !expanded">
        <mc-icon icon="expand" height="24" class="mr-2" :class="{ 'rotate-once-180': expanded }" />
        <slot name="header" />
      </div>

      <slot name="header-append" />
    </div>

    <div class="background-white-50" :class="expanded ? 'slide-down' : 'slide-up'">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Accordion',
  data () {
    return {
      expanded: true
    }
  }
}
</script>
