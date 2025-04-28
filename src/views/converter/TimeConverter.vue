<template>
  <div class="time-converter">
    <el-card class="converter-card">
      <template #header>
        <div class="card-header">
          <span>时间格式转换</span>
          <el-radio-group v-model="mode" size="small">
            <el-radio-button label="single">单条转换</el-radio-button>
            <el-radio-button label="batch">批量转换</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <!-- 单条转换模式 -->
      <div v-if="mode === 'single'" class="single-converter">
        <el-form :model="form" label-width="120px">
          <el-form-item label="日期时间">
            <el-date-picker
              v-model="form.datetime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="handleDatetimeChange"
            />
          </el-form-item>

          <el-form-item label="时间戳">
            <el-input-number
              v-model="form.timestamp"
              :min="0"
              controls-position="right"
              placeholder="输入时间戳(秒)"
              @change="handleTimestampChange"
            />
            <el-button @click="getCurrentTimestamp">当前时间</el-button>
          </el-form-item>

          <el-form-item label="目标格式">
            <el-select v-model="form.targetFormat" placeholder="选择格式">
              <el-option
                v-for="format in formatOptions"
                :key="format.value"
                :label="format.label"
                :value="format.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="convertToTargetFormat">转换</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>

          <el-form-item label="转换结果" v-if="result">
            <el-input
              v-model="result"
              type="textarea"
              :rows="3"
              readonly
            />
            <el-button @click="copyResult">复制结果</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 批量转换模式 -->
      <div v-else class="batch-converter">
        <el-steps :active="batchStep" finish-status="success">
          <el-step title="上传文件" />
          <el-step title="设置转换" />
          <el-step title="完成" />
        </el-steps>

        <div v-if="batchStep === 0" class="upload-section">
          <el-upload
            action=""
            :auto-upload="false"
            :on-change="handleFileChange"
            accept=".xlsx,.xls"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽Excel文件到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                请上传Excel文件（支持.xlsx, .xls格式）
              </div>
            </template>
          </el-upload>
        </div>

        <div v-if="batchStep === 1" class="mapping-section">
          <el-form label-width="120px">
            <el-form-item label="选择时间列">
              <el-select v-model="batchConfig.timeColumn" placeholder="选择包含时间的列">
                <el-option
                  v-for="col in fileHeaders"
                  :key="col"
                  :label="col"
                  :value="col"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="时间格式">
              <el-select v-model="batchConfig.inputFormat" placeholder="选择原始格式">
                <el-option label="时间戳(秒)" value="timestamp" />
                <el-option label="时间戳(毫秒)" value="timestampMs" />
                <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
                <el-option label="YYYY/MM/DD" value="YYYY/MM/DD" />
                <el-option label="自定义..." value="custom" />
              </el-select>
              <el-input 
                v-if="batchConfig.inputFormat === 'custom'"
                v-model="batchConfig.customInputFormat"
                placeholder="输入自定义格式"
              />
            </el-form-item>

            <el-form-item label="目标格式">
              <el-select v-model="batchConfig.outputFormat" placeholder="选择目标格式">
                <el-option
                  v-for="format in formatOptions"
                  :key="format.value"
                  :label="format.label"
                  :value="format.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="startBatchConvert">开始转换</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div v-if="batchStep === 2" class="result-section">
          <el-alert title="转换完成" type="success" show-icon />
          <div class="action-buttons">
            <el-button type="primary" @click="downloadResult">下载结果</el-button>
            <el-button @click="resetBatch">新的转换</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

// 单条转换相关状态
const mode = ref<'single' | 'batch'>('single')
const form = ref({
  datetime: '',
  timestamp: null,
  targetFormat: 'YYYY-MM-DD HH:mm:ss'
})
const result = ref('')
const autoConverting = ref(false)

// 批量转换相关状态
const batchStep = ref(0)
const uploadedFile = ref<File | null>(null)
const fileHeaders = ref<string[]>([])
const convertedData = ref<any[]>([])

const batchConfig = reactive({
  timeColumn: '',
  inputFormat: 'timestamp',
  customInputFormat: '',
  outputFormat: 'YYYY-MM-DD HH:mm:ss'
})

// 常用时间格式选项
const formatOptions = [
  { value: 'YYYY-MM-DD HH:mm:ss', label: '标准格式' },
  { value: 'YYYY/MM/DD HH:mm:ss', label: '斜杠格式' },
  { value: 'YYYY年MM月DD日 HH时mm分ss秒', label: '中文格式' },
  { value: 'YYYY-MM-DD', label: '仅日期' },
  { value: 'HH:mm:ss', label: '仅时间' },
  { value: 'X', label: '时间戳(秒)' },
  { value: 'x', label: '时间戳(毫秒)' }
]

// 单条转换方法
const getCurrentTimestamp = () => {
  autoConverting.value = true
  form.value.timestamp = Math.floor(Date.now() / 1000)
  form.value.datetime = dayjs.unix(form.value.timestamp).format('YYYY-MM-DD HH:mm:ss')
  autoConverting.value = false
}

const handleDatetimeChange = (val: string) => {
  if (autoConverting.value) return
  autoConverting.value = true
  if (val) {
    form.value.timestamp = dayjs(val).unix()
  } else {
    form.value.timestamp = null
  }
  autoConverting.value = false
}

const handleTimestampChange = (val: number | null) => {
  if (autoConverting.value) return
  autoConverting.value = true
  if (val) {
    form.value.datetime = dayjs.unix(val).format('YYYY-MM-DD HH:mm:ss')
  } else {
    form.value.datetime = ''
  }
  autoConverting.value = false
}

const convertToTargetFormat = () => {
  try {
    if (!form.value.datetime && !form.value.timestamp) {
      ElMessage.warning('请至少输入日期时间或时间戳')
      return
    }

    let date
    if (form.value.datetime) {
      date = dayjs(form.value.datetime)
    } else {
      date = dayjs.unix(form.value.timestamp!)
    }

    result.value = date.format(form.value.targetFormat)
  } catch (error) {
    ElMessage.error('转换失败: ' + (error as Error).message)
  }
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(result.value)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const resetForm = () => {
  form.value = {
    datetime: '',
    timestamp: null,
    targetFormat: 'YYYY-MM-DD HH:mm:ss'
  }
  result.value = ''
}

// 批量转换方法
const handleFileChange = (file: any) => {
  uploadedFile.value = file.raw
  readExcelHeaders(file.raw)
  batchStep.value = 1
}

const readExcelHeaders = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    
    if (jsonData.length > 0) {
      fileHeaders.value = jsonData[0] as string[]
    }
  }
  reader.readAsArrayBuffer(file)
}

const startBatchConvert = async () => {
  if (!uploadedFile.value) return
  
  try {
    const data = await readExcelData(uploadedFile.value)
    convertedData.value = data.map(row => {
      const newRow = {...row}
      const timeValue = row[batchConfig.timeColumn]
      
      let date
      if (batchConfig.inputFormat === 'timestamp') {
        date = dayjs.unix(timeValue)
      } else if (batchConfig.inputFormat === 'timestampMs') {
        date = dayjs(timeValue)
      } else {
        const format = batchConfig.inputFormat === 'custom' 
          ? batchConfig.customInputFormat 
          : batchConfig.inputFormat
        date = dayjs(timeValue, format)
      }

      newRow[batchConfig.timeColumn] = date.format(batchConfig.outputFormat)
      return newRow
    })
    
    batchStep.value = 2
  } catch (error) {
    ElMessage.error('批量转换失败: ' + (error as Error).message)
  }
}

const readExcelData = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsArrayBuffer(file)
  })
}

const downloadResult = () => {
  const worksheet = XLSX.utils.json_to_sheet(convertedData.value)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '转换结果')
  XLSX.writeFile(workbook, '时间转换结果.xlsx')
}

const resetBatch = () => {
  batchStep.value = 0
  uploadedFile.value = null
  fileHeaders.value = []
  convertedData.value = []
}
</script>

<style scoped>
.time-converter {
  padding: 20px;
}

.converter-card {
  max-width: 800px;
  margin: 0 auto;
}

.single-converter {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 22px;
}

.el-date-editor, .el-input-number {
  width: 100%;
}

.batch-converter {
  padding: 20px;
}

.upload-section {
  margin: 20px auto;
  max-width: 500px;
}

.mapping-section {
  margin-top: 30px;
}

.result-section {
  text-align: center;
  padding: 40px 0;
}

.action-buttons {
  margin-top: 30px;
}
</style>