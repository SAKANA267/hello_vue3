<template>
  <span class="infectious-badge" :style="badgeStyle">
    {{ config.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { InfectiousLevel, INFECTIOUS_LEVEL_CONFIG } from '@/types/disease'

const props = defineProps<{
  level: InfectiousLevel
}>()

const config = computed(() => INFECTIOUS_LEVEL_CONFIG[props.level])

const badgeStyle = computed(() => ({
  backgroundColor: config.value.bgColor,
  color: config.value.color
}))
</script>

<style scoped lang="less">
.infectious-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
}
</style>
