<template>
  <div>
    <h4>Voorbereiding</h4>
    <p>Om een <i>Corona Pasje</i> te kunnen maken heb je de gegevens nodig van jouw coronabewijs. Deze gegevens zijn het gemakkelijkst te verkrijgen via de overheidswebsite: CoronaCheck.nl.<br>Dit kun je doen door de volgende stappen te doorlopen:</p>
    <p><b>Lees de stappen eerst goed door!</b></p>
    <ol>
      <li><b>Ga naar</b> <a href="https://coronacheck.nl/nl/print" target="_blank">https://coronacheck.nl/nl/print</a><br>Let op: dit opent de overheidswebsite!</li>
      <li><b>Accepteer de privacyverklaring</b> en klik op de <b>‘Volgende’-knop</b>.</li>
      <li><b>Kies het soort bewijs</b> waarvan je een <i>Corona Pasje</i> wilt maken.</li>
      <li><b>Log in</b> met je DigiD.</li>
      <li>Klik op de <b>‘Maak bewijs’-knop</b>.</li>
      <li>Onder het kopje <b>‘Nederlands bewijs’</b>, Klik op de <b>‘Download PDF’-knop</b>.</li>
      <li><b>Sla de PDF op</b>.</li>
      <li>Keer terug naar deze site (<i>Corona Pasje</i>) en klik op <b>'Volgende stap'</b>.</li>
    </ol>
  </div>
</template>

<script>
export default {
  props: ['clickedNext', 'currentStep'],

  mounted() {
    this.$emit('can-continue', {value: true});
  }
}
</script>
