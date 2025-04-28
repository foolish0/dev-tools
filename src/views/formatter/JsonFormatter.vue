<template>
  <div class="json-formatter">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="input-card">
          <template #header>
            <div class="card-header">
              <span>输入JSON</span>
              <div class="button-group">
                <el-button type="primary" @click="formatJson" :disabled="!inputJson">格式化</el-button>
                <el-button @click="clearInput">清空</el-button>
              </div>
            </div>
          </template>
          <el-input
            v-model="inputJson"
            type="textarea"
            :rows="20"
            placeholder="请输入要格式化的JSON字符串"
            resize="none"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="output-card">
          <template #header>
            <div class="card-header">
              <span>格式化结果</span>
              <el-button type="primary" @click="copyResult" :disabled="!formattedJson">
                <el-icon><DocumentCopy /></el-icon>
                复制
              </el-button>
            </div>
          </template>
          <pre class="json-output" v-if="formattedJson">{{ formattedJson }}</pre>
          <div class="empty-placeholder" v-else>
            <el-empty description="暂无数据" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'

const inputJson = ref('')
const formattedJson = ref('')

const formatJson = () => {
  try {
    const parsed = JSON.parse(inputJson.value)
    formattedJson.value = JSON.stringify(parsed, null, 2)
  } catch (error) {
    ElMessage.error('JSON格式错误，请检查输入')
  }
}

const clearInput = () => {
  inputJson.value = ''
  formattedJson.value = ''
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.json-formatter {
  height: 100%;
}

.input-card,
.output-card {
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 10px;
}

:deep(.el-card__body) {
  flex: 1;
  overflow: auto;
  padding: 0;
}

.el-textarea {
  height: 100%;
}

:deep(.el-textarea__inner) {
  height: 100% !important;
  font-family: monospace;
  padding: 10px;
}

.json-output {
  height: 100%;
  margin: 0;
  padding: 10px;
  font-family: monospace;
  white-space: pre-wrap;
  overflow: auto;
}

.empty-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>