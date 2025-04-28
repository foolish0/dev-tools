<template>
  <div class="uuid-generator">
    <el-card class="control-card">
      <div class="controls">
        <el-form :model="options" label-width="100px" inline>
          <el-form-item label="生成数量">
            <el-input-number
              v-model="options.count"
              :min="1"
              :max="100"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="大小写">
            <el-radio-group v-model="options.case">
              <el-radio-button label="lower">小写</el-radio-button>
              <el-radio-button label="upper">大写</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分隔符">
            <el-radio-group v-model="options.separator">
              <el-radio-button label="-">连字符</el-radio-button>
              <el-radio-button label="">无分隔符</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="generateUuids">
              生成UUID
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="result-card" v-if="uuids.length">
      <template #header>
        <div class="card-header">
          <span>生成结果</span>
          <div class="button-group">
            <el-button type="primary" @click="copyAll">
              <el-icon><DocumentCopy /></el-icon>
              复制全部
            </el-button>
            <el-button @click="clearAll">
              清空
            </el-button>
          </div>
        </div>
      </template>
      <div class="uuid-list">
        <div
          v-for="(uuid, index) in uuids"
          :key="index"
          class="uuid-item"
        >
          <span class="uuid-text">{{ uuid }}</span>
          <el-button
            type="primary"
            link
            @click="copyUuid(uuid)"
          >
            复制
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'

interface Options {
  count: number
  case: string  // 改为字符串类型
  separator: string  // 改为字符串类型
}

const options = ref<Options>({
  count: 1,
  case: 'lower',
  separator: '-'
})

const uuids = ref<string[]>([])

const generateUuid = (): string => {
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

  if (options.value.separator === '') {
    uuid = uuid.replace(/-/g, '')
  }

  return options.value.case === 'upper' ? uuid.toUpperCase() : uuid
}

const generateUuids = () => {
  uuids.value = Array(options.value.count)
    .fill(null)
    .map(() => generateUuid())
}

const copyUuid = async (uuid: string) => {
  try {
    await navigator.clipboard.writeText(uuid)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const copyAll = async () => {
  try {
    await navigator.clipboard.writeText(uuids.value.join('\n'))
    ElMessage.success('全部复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const clearAll = () => {
  uuids.value = []
}
</script>

<style scoped>
/* 原有样式保持不变 */
</style>