<template>
  <div class="typing-indicator">
    <div class="typing-avatar">
      <img :src="aiAvatar" />
    </div>
    <div class="typing-content">
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const aiAvatar = new URL('../../assets/images/user.svg', import.meta.url).href
</script>

<style scoped lang="less">
.typing-indicator {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.typing-avatar {
  width: 36px;
  height: 36px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.typing-content {
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
}

.typing-dots {
  display: flex;
  gap: 4px;

  span {
    width: 8px;
    height: 8px;
    background: #409eff;
    border-radius: 50%;
    animation: typing 1.4s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
}
</style>
