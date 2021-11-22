<template>
  <div class="modal fade" :id="id" tabindex="-1" :aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div v-if="header" class="modal-header">
          <slot name="header">
            <h2 class="modal-title h5" :id="modalLabel">
              <slot name="title">{{title}}</slot>
            </h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Sluiten"></button>
          </slot>
        </div>

        <div class="modal-body">
          <slot />
        </div>

        <div v-if="footer" class="modal-footer">
          <slot name="footer">
            <button type="button" class="btn btn-primary btn-block" data-bs-dismiss="modal">Sluiten</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    id: {
      type: String,
      required: true
    },
    header: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: 'Modal title'
    },
    footer: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    modalLabel () {
      return `${this.id}Label`
    }
  }
}
</script>
