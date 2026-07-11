<template>
  <section id="contact" class="section-padding">
    <div class="contact-inner">
      <h2 class="section-headline reveal">取得联系。</h2>
      <p class="section-sub reveal reveal-delay-1">开放合作机会，期待与您交流</p>
      <div class="contact-list">
        <div class="contact-item reveal reveal-delay-2">
          <Phone :size="18" />
          <span>15195285026</span>
        </div>
        <div class="contact-item reveal reveal-delay-3">
          <Mail :size="18" />
          <span>779625581@qq.com</span>
        </div>
        <div class="contact-item reveal reveal-delay-4">
          <MapPin :size="18" />
          <span>无锡, 江苏</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Phone, Mail, MapPin } from 'lucide-vue-next'
</script>

<style scoped>
.section-padding {
  padding: 128px 32px;
}
.contact-inner {
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
}
.contact-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 48px;
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
}
.contact-item :deep(svg) {
  color: var(--color-text-muted);
  width: 18px;
  height: 18px;
}
</style>
