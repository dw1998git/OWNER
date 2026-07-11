<template>
  <nav class="nav-fixed">
    <div class="nav-inner">
      <a href="#" class="nav-logo">WANG WEI</a>
      <div class="nav-links">
        <a href="#experience" class="nav-link">经历</a>
        <a href="#skills" class="nav-link">技能</a>
        <a href="#education" class="nav-link">教育</a>
        <a href="#projects" class="nav-link">项目</a>
        <a href="#contact" class="nav-link">联系</a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
}
.nav-logo {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  text-decoration: none;
  letter-spacing: 0.05em;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}
</style>
