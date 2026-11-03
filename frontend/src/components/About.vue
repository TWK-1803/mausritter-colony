<template>
  <div class="modal" :class="{ 'is-active': innerShow }">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Mausritter Colony</p>
        <button class="delete" aria-label="close" @click="innerShow = false" />
      </header>
      <section class="modal-card-body">
        <p class="mb-4">
          This application is an independent production by Daniel Coquette and is not affiliated with Losing Games. It is published under the Mausritter Third Party Licence.
        </p>
        <p class="mb-4">Mausritter is copyright Losing Games. This application is copyright Daniel Coquette.</p>
        <p>3D dices from Anton Natarov <a href="http://a.teall.info/mdice/">http://a.teall.info/mdice</a>.</p>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="innerShow = false">Close</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  props: {
    show: { type: Boolean, default: false }
  },
  data () {
    return {
      innerShow: false
    }
  },
  watch: {
    show (newValue) {
      this.innerShow = newValue
    }
  }
}
</script>
