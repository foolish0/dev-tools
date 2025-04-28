<template>
  <div class="base64-encoder">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="input-card">
          <template #header>
            <div class="card-header">
              <span>输入文本</span>
              <div class="button-group">
                <el-radio-group v-model="mode">
                  <el-radio-button label="encode">编码</el-radio-button>
                  <el-radio-button label="decode">解码</el-radio-button>
                </el-radio-group>
                <el-button @click="clearInput">清空</el-button>
              </div>
            </div>
          </template>
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="20"
            :placeholder="mode === 'encode' ? '请输入要编码的文本' : '请输入要解码的Base64字符串'"
            resize="none"
            @input="handleInput"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="output-card">
          <template #header>
            <div class="card-header">
              <span>{{ mode === 'encode' ? 'Base64编码结果' : '解码结果' }}</span>
              <el-button type="primary" @click="copyResult" :disabled="!outputText">
                <el-icon><DocumentCopy /></el-icon>
                复制
              </el-button>
            </div>
          </template>
          <div class="output-content" v-if="outputText">{{ outputText }}</div>
          <div class="empty-placeholder" v-else>
            <el-empty description="暂无数据" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'

const mode = ref('encode') // 使用字符串值而不是联合类型
const inputText = ref('')
const outputText = ref('')

const encode = (text: string): string => {
  try {
    return window.btoa(unescape(encodeURIComponent(text)))
  } catch (error) {
    ElMessage.error('编码失败，请检查输入')
    return ''
  }
}

const decode = (text: string): string => {
  try {
    return decodeURIComponent(escape(window.atob(text)))
  } catch (error) {
    ElMessage.error('解码失败，请检查输入是否为有效的Base64字符串')
    return ''
  }
}

const handleInput = () => {
  if (!inputText.value) {
    outputText.value = ''
    return
  }
  
  outputText.value = mode.value === 'encode' 
    ? encode(inputText.value)
    : decode(inputText.value)
}

watch(mode, () => {
  inputText.value = ''
  outputText.value = ''
})

const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
/* 原有样式保持不变 */
</style>