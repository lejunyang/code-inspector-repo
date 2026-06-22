<template>
  <main class="page">
    <section class="static-card">
      <div class="col-header">Static header</div>
      <div class="col-header">Metric A</div>
      <div class="col-header">Metric B</div>
      <div class="col-header">Metric C</div>
      <div class="col-header">Metric D</div>
      <div class="col-header">Action</div>
    </section>

    <section class="dynamic-card">
      <button type="button" @click="toggle">Toggle padding</button>
      <p>{{ message }}</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const expanded = ref(false);
const message = computed(() => (expanded.value ? 'expanded' : 'collapsed'));
const headerPaddingRight = computed(() => (expanded.value ? '32px' : '8px'));

function toggle() {
  expanded.value = !expanded.value;
}
</script>

<style scoped lang="less">
.page {
  padding: 24px;
}

.static-card {
  padding: 12px 16px 12px 0;
  padding-right: v-bind(headerPaddingRight);
  background: #f5f7fa;
  border-radius: 8px;

  .col-header:first-child {
    padding-left: 16px;
  }
}

.dynamic-card {
  margin-top: 16px;
}
</style>
