<template>
  <nav class="nav-fixed">
    <div class="nav-inner">
      <a href="#" class="nav-logo">WANG WEI</a>
      <div class="nav-links">
        <a href="#experience" class="nav-link nav-item" @mouseenter="setActiveLink($event, 'experience')" @mouseleave="resetLink($event)">经历</a>
        <a href="#skills" class="nav-link nav-item" @mouseenter="setActiveLink($event, 'skills')" @mouseleave="resetLink($event)">技能</a>
        <a href="#education" class="nav-link nav-item" @mouseenter="setActiveLink($event, 'education')" @mouseleave="resetLink($event)">教育</a>
        <a href="#projects" class="nav-link nav-item" @mouseenter="setActiveLink($event, 'projects')" @mouseleave="resetLink($event)">项目</a>
        <a href="#contact" class="nav-link nav-item" @mouseenter="setActiveLink($event, 'contact')" @mouseleave="resetLink($event)">联系</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

// 跟踪当前活动的链接
const activeLink = ref(null)

// 设置活动链接的 3D 效果
const setActiveLink = (event, linkName) => {
  const element = event.currentTarget
  activeLink.value = linkName
  
  // 添加 3D 凸镜效果
  element.classList.add('active')
  
  // 添加鼠标移动事件监听器
  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // 计算相对于元素中心的位置
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const posX = (x - centerX) / centerX
    const posY = (y - centerY) / centerY
    
    // 应用 3D 变形效果
    element.style.transform = `perspective(500px) rotateX(${posY * 5}deg) rotateY(${posX * 5}deg) scale3d(1.1, 1.1, 1.1)`
    element.style.zIndex = '10'
  }
  
  // 添加鼠标移出事件监听器
  const handleMouseLeave = () => {
    element.classList.remove('active')
    element.style.transform = 'perspective(500px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
    element.style.zIndex = '1'
    element.removeEventListener('mousemove', handleMouseMove)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
  
  element.addEventListener('mousemove', handleMouseMove)
  element.addEventListener('mouseleave', handleMouseLeave)
}

// 重置链接样式
const resetLink = (event) => {
  const element = event.currentTarget
  element.classList.remove('active')
  element.style.transform = 'perspective(500px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
  element.style.zIndex = '1'
}
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
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  display: inline-block;
  transform-style: preserve-3d;
  transform: perspective(500px);
  z-index: 1;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  background: radial-gradient(
    circle at center,
    rgba(0, 113, 227, 0.1) 0%,
    rgba(0, 113, 227, 0.05) 40%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  transform: translateZ(-5px);
}

.nav-link.active::before {
  opacity: 1;
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
  transition: all 0.2s ease;
  backface-visibility: hidden;
  transform-origin: center;
}
</style>