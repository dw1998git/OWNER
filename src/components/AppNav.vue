<template>
  <nav class="nav-fixed">
    <div class="nav-inner">
      <a href="#" class="nav-logo">WANG WEI</a>
      <div class="nav-links">
        <a href="#experience" class="nav-link nav-item">经历</a>
        <a href="#skills" class="nav-link nav-item">技能</a>
        <a href="#education" class="nav-link nav-item">教育</a>
        <a href="#projects" class="nav-link nav-item">项目</a>
        <a href="#contact" class="nav-link nav-item">联系</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 为导航项添加悬停放大动效
const initNavAnimations = () => {
  const navItems = document.querySelectorAll('.nav-item')
  
  navItems.forEach(item => {
    let animationId = null
    
    const handleMouseEnter = () => {
      // 悬停时放大效果
      item.style.transform = 'scale(1.15)'
      item.style.transition = 'transform 0.2s ease, color 0.2s ease'
      item.style.color = 'var(--color-accent)' // 改变颜色为强调色
    }
    
    const handleMouseLeave = () => {
      // 离开时恢复原状
      item.style.transform = 'scale(1)'
      item.style.color = 'var(--color-text-primary)' // 恢复原色
    }
    
    item.addEventListener('mouseenter', handleMouseEnter)
    item.addEventListener('mouseleave', handleMouseLeave)
    
    // 保存事件处理器引用以便后续清理
    item._navHandlers = { handleMouseEnter, handleMouseLeave }
  })
}

onMounted(() => {
  // 延迟执行以确保DOM已渲染
  setTimeout(initNavAnimations, 100)
})

onUnmounted(() => {
  // 清理事件监听器
  const navItems = document.querySelectorAll('.nav-item')
  navItems.forEach(item => {
    if (item._navHandlers) {
      item.removeEventListener('mouseenter', item._navHandlers.handleMouseEnter)
      item.removeEventListener('mouseleave', item._navHandlers.handleMouseLeave)
    }
  })
})
</script>

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
  transition: transform 0.2s ease;
}

.nav-logo:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-link {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 1px;
  background: var(--color-accent);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 80%;
}

.nav-item {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, color 0.2s ease;
}
</style>