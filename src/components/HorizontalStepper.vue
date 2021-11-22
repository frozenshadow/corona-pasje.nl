<template>
  <div class="stepper-box">
    <div class="top">
      <div class="divider-line" :style="{width: `${(100/(steps.length) * (steps.length - 1)) - 10}%`}"></div>
      <div class="steps-wrapper">
        <template v-for="(step, index) in steps">
          <div :class="['step align-items-center bg-white px-3 mx-1', isStepActive(index, step)]" :key="index" :style="{maxWidth: `${100 / steps.length}%`}">
            <div class="circle rounded-circle border border-2 text-center fs-4">
              <i v-if="step.completed" class="bi bi-check-lg"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="ms-3 step-title overflow-hidden">
              <div class="font-weight-medium fs-5 text-truncate text-wrap">{{step.title}}</div>
              <div class="step-subtitle text-black-50 text-truncate">{{step.subtitle}}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="content m-4">
      <transition :enter-active-class="enterAnimation" :leave-active-class="leaveAnimation" mode="out-in">
        <keep-alive v-if="keepAliveData">
            <component :is="steps[currentStep.index].component" :current-step-data="currentStepData" :clicked-next="nextButton[currentStep.name]" @can-continue="proceed" @change-next="changeNextBtnValue" @back="backStep()" :current-step="currentStep"></component>
        </keep-alive>
        <component v-else :is="steps[currentStep.index].component" :current-step-data="currentStepData" :clicked-next="nextButton[currentStep.name]" @can-continue="proceed" @change-next="changeNextBtnValue" @back="backStep()" :current-step="currentStep"></component>
      </transition>
    </div>
    <div :class="['modal-footer bottom', (currentStep.index > 0 && !isFinalStep ) ? '' : 'only-next']">
      <button v-if="currentStep.index > 0 && !isFinalStep" type="button" class="btn btn-outline-secondary stepper-button previous" @click="backStep()">
        <i class="bi bi-chevron-left"></i> Vorige stap
      </button>
      <button v-if="isFinalStep" type="button" class="btn btn-outline-secondary stepper-button" data-bs-dismiss="modal">
        Sluiten
      </button>
      <button :disabled="!canContinue" class="btn btn-primary stepper-button next" type="button" @click="nextStep()" v-html="nextButtonText"></button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array
    },
    keepAlive: {
      type: Boolean,
      default: true
    },
    reset: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      currentStep: {},
      previousStep: {},
      nextButton: {},
      canContinue: false,
      isFinalStep: false,
      currentStepData: null,
      keepAliveData: this.keepAlive
    };
  },

  computed: {
    enterAnimation() {
      if (this.currentStep.index < this.previousStep.index) {
        return "animate__animated animate__quick animate__fadeInLeft";
      } else {
        return "animate__animated animate__quick animate__fadeInRight";
      }
    },
    leaveAnimation() {
      if (this.currentStep.index > this.previousStep.index) {
        return "animate__animated animate__quick animate__fadeOutLeft";
      } else {
        return "animate__animated animate__quick animate__fadeOutRight";
      }
    },
    nextButtonText() {
      return this.isFinalStep ? 'Nieuw pasje maken' : `Volgende stap <i class="bi bi-chevron-right"></i>`;
    }
  },

  methods: {
    isStepActive(index) {
      return this.currentStep.index === index ? "activated" : "deactivated";
    },

    activateStep(index, back = false) {
      if (this.steps[index]) {
        this.previousStep = this.currentStep;
        this.currentStep = {
          name: this.steps[index].name,
          index: index
        };

        this.isFinalStep = index + 1 === this.steps.length;

        if (!back) this.$emit("completed-step", this.previousStep);
      }

      this.$emit("active-step", this.currentStep);
    },

    nextStepAction() {
      this.nextButton[this.currentStep.name] = true;
      if (this.canContinue) {
        if (this.isFinalStep) this.$emit("stepper-finished", this.currentStep);
        let currentIndex = this.currentStep.index + 1;

        this.activateStep(currentIndex);
      }

      this.canContinue = false;
      this.$forceUpdate();
    },

    nextStep () {
      if (!this.$listeners || !this.$listeners['before-next-step']) this.nextStepAction()

      this.canContinue = false;

      this.$emit("before-next-step", { currentStep: this.currentStep }, (next = true) => {
        this.canContinue = true;
        if (next) this.nextStepAction()
      });
    },
    backStep() {
      this.canContinue = true;
      this.currentStepData = null;

      this.$emit("clicking-back");
      let currentIndex = this.currentStep.index - 1;
      if (currentIndex >= 0) this.activateStep(currentIndex, true);
    },

    proceed(payload) {
      this.canContinue = payload.value;
      this.currentStepData = payload.data ?? null;
    },

    changeNextBtnValue(payload) {
      this.nextButton[this.currentStep.name] = payload.nextBtnValue;
      this.$forceUpdate();
    },

    init() {
      // Initiate stepper
      this.activateStep(0);
      this.steps.forEach(step => this.nextButton[step.name] = false);
    },
  },

  watch: {
    reset(val) {
      if(!val) return;

      this.keepAliveData = false;
      this.init();
      this.previousStep = {};

      this.$nextTick(() => {
        this.keepAliveData = this.keepAlive;
        this.$emit('reset', true);
      });
    }
  },

  created() {
    this.init();
  }
};
</script>
