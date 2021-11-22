<template>
    <div>
      <h4>Gegevens invoeren</h4>
      <p>Nu je de gegevens van je coronabewijs hebt, kunnen we deze gaan verwerken tot een <i>Corona Pasje</i>. De verwerking kan automatisch met behulp van de PDF uit de vorige stap, maar je kunt ook handmatig de gegevens invoeren.</p>

      <div class="text-center nav-tabs pb-4">
        <div class="nav btn-group d-inline-flex" role="tablist">
          <button type="button" class="btn btn-outline-primary active" id="automatic-tab" data-bs-toggle="pill" data-bs-target="#automatic" role="tab" aria-controls="automatic" aria-selected="true">Automatisch</button>
          <button type="button" class="btn btn-outline-primary" id="manual-tab" data-bs-toggle="pill" data-bs-target="#manual" role="tab" aria-controls="manual" aria-selected="false">Handmatig</button>
        </div>
      </div>
      <ValidationObserver ref="formObserver" class="tab-content bg-light p-4 rounded-bottom" tag="div">
        <div class="tab-pane show active" id="automatic" role="tabpanel" aria-labelledby="automatic-tab">
          <transition name="fade" mode="out-in">
          <form key="1" v-if="activeTab === '#automatic'" @change="canContinue">
            <ValidationProvider rules="required|mimes:application/pdf" ref="automaticFileprovider" vid="automaticFormFile" v-slot="{ valid, errors, classes }" tag="div">
              <label for="automaticFormFile" class="form-label">Selecteer je coronabewijs (PDF) uit de vorige stap</label>
              <input id="automaticFormFile" class="form-control" :class="classes" type="file" aria-describedby="fileHelp" @change="processPDFInput" accept="application/pdf">
              <div class="invalid-feedback">
                {{ errors[0] }}
              </div>
              <div id="fileHelp" class="form-text">Verwerking gebeurt geheel lokaal. De ingevoerde informatie verlaat dus nooit je apparaat.</div>
            </ValidationProvider>
          </form>
          </transition>
        </div>
        <div class="tab-pane" id="manual" role="tabpanel" aria-labelledby="manual-tab">
          <transition name="fade" mode="out-in">
          <form key="2" v-if="activeTab === '#manual'" @change="canContinue">
            <ValidationProvider rules="required|mimes:image/jpeg,image/png" ref="manualFileprovider" vid="inputQRCode" v-slot="{ valid, errors, classes }" tag="div" class="row mb-3">
              <label for="inputQRCode" class="col-sm-3 col-form-label">QR-code afbeelding</label>
              <div class="col">
                <div class="col-sm-9">
                  <input id="inputQRCode" class="form-control" :class="classes" type="file" aria-describedby="QRCodeHelp" @change="processImageFile" accept="image/jpeg,image/png">
                  <div id="QRCodeHelp" class="form-text">
                    Toegestane bestandstypes: jpeg, jpg, png.
                    <br>
                    Gebruik een vierkante afbeelding voor het beste resultaat.
                  </div>
                </div>
                <div class="invalid-feedback" :style="{ display: errors[0] ? 'block' : null }">
                  {{ errors[0] }}
                </div>
              </div>
            </ValidationProvider>

            <ValidationProvider rules="required" v-slot="{ valid, errors, classes }" tag="div" class="row mb-3">
              <label for="inputInitials" class="col-sm-3 col-form-label">Initialen</label>
              <div class="col">
                <div class="col-sm-5 col-lg-3">
                  <input id="inputInitials" class="form-control" :class="classes" type="text" v-model="formFields.initials">
                </div>
                <div class="invalid-feedback" :style="{ display: errors[0] ? 'block' : null }">
                  {{ errors[0] }}
                </div>
              </div>
            </ValidationProvider>

            <ValidationProvider rules="required" v-slot="{ valid, errors, classes }" tag="div" class="row mb-3">
              <label for="inputBirthday" class="col-sm-3 col-form-label">Geboortedag</label>
              <div class="col">
                <div class="col-sm-5 col-lg-3">
                  <input id="inputBirthday" class="form-control" :class="classes" type="text" v-model="formFields.birthday">
                </div>
                <div class="invalid-feedback" :style="{ display: errors[0] ? 'block' : null }">
                  {{ errors[0] }}
                </div>
              </div>
            </ValidationProvider>

            <ValidationProvider rules="required" v-slot="{ valid, errors, classes }" tag="div" class="row mb-3">
              <label for="inputValidFrom" class="col-sm-3 col-form-label">Geldig vanaf</label>
              <div class="col">
                <div class="col-sm-10 col-lg-6">
                  <input id="inputValidFrom" class="form-control" :class="classes" type="text" v-model="formFields.validFrom">
                </div>
                <div class="invalid-feedback" :style="{ display: errors[0] ? 'block' : null }">
                  {{ errors[0] }}
                </div>
              </div>
            </ValidationProvider>

            <ValidationProvider rules="required" v-slot="{ valid, errors, classes }" tag="div" class="row">
              <label for="inputValidTo" class="col-sm-3 col-form-label">Geldig tot</label>
              <div class="col">
                <div class="col-sm-10 col-lg-6">
                  <input id="inputValidTo" class="form-control" :class="classes" type="text" v-model="formFields.validTo">
                </div>
                <div class="invalid-feedback" :style="{ display: errors[0] ? 'block' : null }">
                  {{ errors[0] }}
                </div>
              </div>
            </ValidationProvider>
          </form>
          </transition>
        </div>
      </ValidationObserver>
    </div>
</template>

<script>
import { extend, ValidationProvider, configure, ValidationObserver } from 'vee-validate';
import { required, mimes } from 'vee-validate/dist/rules';

configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  }
})
extend('required', {
  ...required,
  message: "Dit veld is vereist maar nog niet ingevuld."
});
extend('mimes', {
  ...mimes,
  message: "Het gekozen bestand is geen geldig bestandstype."
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: ['currentStep'],
  data: () => ({
    formFields: {
      file: null,
      initials: '',
      birthday: '',
      validFrom: '',
      validTo: '',
    },
    activeTab: '#automatic'
  }),
  methods: {
    resetActiveForm() {
      // Reset values
      for (let formFieldsKey in this.formFields) {
        this.formFields[formFieldsKey] = null;
      }

      // Wait until the models are updated in the UI
      // and reset validation
      this.$nextTick(() => {
        this.$refs.formObserver.reset();
        this.canContinue();
      });
    },
    onTabChange(event) {
      this.activeTab = event.target.dataset.bsTarget;
      this.resetActiveForm();
    },
    canContinue() {
      this.$refs.formObserver.validate({silent: true}).then(valid => {
        this.$emit('can-continue', {value: valid, data: this.formFields});
      });
    },
    async processImageFile(event) {
      const {valid} = await this.$refs.manualFileprovider.validate(event);

      if (valid) {
        const reader = new FileReader();

        reader.onerror = () => {
          console.error(reader.error);

          this.$refs.formObserver.setErrors({
            inputQRCode: [`Er is een fout opgetreden: "${reader.error.message}"`]
          });
        };
        reader.onload = () => {
          this.formFields.file = reader.result;
        };

        reader.readAsDataURL(event.target.files[0]);
      }
    },
    async processPDFInput(event) {
      const {valid} = await this.$refs.automaticFileprovider.validate(event);

      if (valid) {
        const reader = new FileReader();

        reader.onerror = () => {
          console.error(reader.error);

          this.$refs.formObserver.setErrors({
            automaticFormFile: [`Er is een fout opgetreden: "${reader.error.message}"`]
          });
        };
        reader.onload = () => {
          this.formFields.file = reader.result;
        };

        reader.readAsDataURL(event.target.files[0]);
      }
    }
  },
  mounted() {
    const self = this;
    const allTabTogglersOnThePage = document.querySelectorAll('button[data-bs-toggle="tab"], button[data-bs-toggle="pill"]');

    Array.prototype.forEach.call(allTabTogglersOnThePage, function(element) {
      element.addEventListener('show.bs.tab', self.onTabChange);
    });
  },
  activated() {
    this.canContinue();
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
