<template>
    <div>
      <div class="text-center mb-4">
        <LoadingIndicator :status="loadingStatus" class="mb-3"></LoadingIndicator>
        <h4 class="h2">{{ loadingText }}</h4>
        <p v-if="failedMessage">
          {{ failedMessage }}
          <br>
          <button class="btn btn-link" @click="previousStep()">Terugkeren en opnieuw proberen</button>
        </p>
        <transition name="fade">
          <div v-show="ready">
            <a :href="pdfObjectURL" target="_blank" class="btn btn-primary my-3" tabindex="-1" role="button">Pasje downloaden <i class="bi bi-download ms-1"></i></a>
            <p><small><i>Niet het gewenste resultaat? Probeer dan de handmatige invoermethode.</i></small></p>
          </div>
        </transition>
      </div>

      <transition name="fade">
        <div v-show="ready">
          <h5 class="mb-3">Tips:</h5>
          <div class="p-3 bg-light border border-1">
            <ul class="m-0">
              <li>Druk pagina 1 en 2 dubbelzijdig af (langs korte rand);</li>
              <li>Print op dikker papier voor extra duurzaam- en stevigheid;</li>
              <li>Lamineer het blauwe pasje;</li>
              <li>Gebruik dubbelzijdig plakband i.p.v. lijm.</li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import pdfGenerator from "@/services/pdfGenerator";

export default {
  components: {
    LoadingIndicator
  },
  props: {
    currentStep: {
      type: Object,
      required: true
    },
    currentStepData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    loadingStatus: '',
    ready: false,
    pdfObjectURL: '#',
    failedMessage: null
  }),
  computed: {
    loadingText() {
      switch (this.loadingStatus) {
        case 'success':
          return 'Gelukt!';
        case 'failed':
          return 'Er is een fout opgetreden';
        default:
          return 'Bezig met het maken van je pasje';
      }
    }
  },
  methods: {
    changeLoadingStatus(status) {
      this.loadingStatus = status;
    },
    resetStatus() {
      self.ready = false;
      this.failedMessage = null;
      this.changeLoadingStatus('');
    },
    createPDF() {
      const self = this;

      this.resetStatus();

      pdfGenerator(this.currentStepData)
          .then(blob => {
            self.pdfObjectURL = URL.createObjectURL(blob);
            self.changeLoadingStatus('success');
            self.ready = true;
          })
          .catch((e) => {
            self.changeLoadingStatus('failed');
            this.failedMessage = e.message;
          });
    },
    previousStep() {
      this.$emit('back');
    }
  },
  activated() {
    const self = this;

    self.createPDF();
    this.$emit('can-continue', {value: true, data: this.currentStepData});
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
