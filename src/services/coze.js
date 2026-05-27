// Coze AI Agent API Service
// 文档: https://www.coze.cn/docs/developer_guides/chat_v3

const COZE_CONFIG = {
  botId: '7644423795901726726',
  token: 'cztei_qGLRQPQ9r7edwb4N6K664lElqObT1hj8mqn4SnCz6pSo8UhqcJ7EXjSwl65XIFOfE',
  baseUrl: 'https://api.coze.cn/v3',
}

// 根据环境自动选择 base URL
// 国内: https://api.coze.cn
// 国际: https://api.coze.com

/**
 * 创建对话
 */
async function createConversation(messages) {
  const res = await fetch(`${COZE_CONFIG.baseUrl}/conversation`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COZE_CONFIG.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) throw new Error(`创建对话失败: ${res.status}`)
  return res.json()
}

/**
 * 发起聊天（非流式）
 */
async function chat({ botId, userId, additionalMessages }) {
  const res = await fetch(`${COZE_CONFIG.baseUrl}/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COZE_CONFIG.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bot_id: botId || COZE_CONFIG.botId,
      user_id: userId || 'hr-dashboard-user',
      stream: false,
      auto_save_history: true,
      additional_messages: additionalMessages,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.msg || `API 请求失败: ${res.status}`)
  }
  return res.json()
}

/**
 * 获取对话详情（轮询结果）
 */
async function getChatStatus(conversationId, chatId) {
  const res = await fetch(
    `${COZE_CONFIG.baseUrl}/chat/retrieve?conversation_id=${conversationId}&chat_id=${chatId}`,
    {
      headers: {
        'Authorization': `Bearer ${COZE_CONFIG.token}`,
      },
    }
  )
  if (!res.ok) throw new Error(`查询状态失败: ${res.status}`)
  return res.json()
}

/**
 * 获取消息列表
 */
async function getMessages(conversationId, chatId) {
  const res = await fetch(
    `${COZE_CONFIG.baseUrl}/chat/message/list?conversation_id=${conversationId}&chat_id=${chatId}`,
    {
      headers: {
        'Authorization': `Bearer ${COZE_CONFIG.token}`,
      },
    }
  )
  if (!res.ok) throw new Error(`获取消息失败: ${res.status}`)
  return res.json()
}

/**
 * 解析 AI 返回的 JSON 结果
 */
function parseAnalysisResult(rawText) {
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
    return { raw: rawText }
  } catch {
    return { raw: rawText }
  }
}

/**
 * 完整的分析流程
 * @param {string} jd - 岗位描述
 * @param {string} resume - 简历内容
 * @param {function} onProgress - 进度回调
 * @returns {object} 结构化的分析结果
 */
export async function analyzeCandidate(jd, resume, onProgress) {
  onProgress?.('submitting')

  // 构建发送给 Coze 的消息
  const prompt = `你是一位资深的 HR 招聘专家和人才评估顾问。请根据以下岗位描述和候选人简历，进行全面的匹配分析。

【岗位描述】
${jd}

【候选人简历】
${resume}

请严格按照以下 JSON 格式返回分析结果（不要包含其他文字）：

{
  "overallScore": 85,
  "dimensions": [
    { "name": "技能匹配", "score": 90, "maxScore": 100 },
    { "name": "经验匹配", "score": 80, "maxScore": 100 },
    { "name": "学历匹配", "score": 85, "maxScore": 100 },
    { "name": "薪资预期", "score": 70, "maxScore": 100 },
    { "name": "文化契合", "score": 88, "maxScore": 100 },
    { "name": "稳定性", "score": 75, "maxScore": 100 }
  ],
  "riskPoints": [
    { "level": "high/medium/low", "content": "风险描述" }
  ],
  "interviewQuestions": [
    { "category": "技术能力", "question": "面试问题" }
  ],
  "hrSuggestions": {
    "summary": "综合评价摘要",
    "strengths": ["优势1", "优势2", "优势3"],
    "weaknesses": ["不足1", "不足2"],
    "recommendation": "建议进入下一轮 / 建议备选 / 建议淘汰",
    "nextSteps": ["下一步行动1", "下一步行动2"]
  }
}`

  const additionalMessages = [
    {
      role: 'user',
      content: prompt,
      content_type: 'text',
    },
  ]

  // 发起对话
  onProgress?.('analyzing')
  const chatRes = await chat({
    additionalMessages,
  })

  const { conversation_id: conversationId, id: chatId } = chatRes.data

  // 轮询等待结果
  let attempts = 0
  const maxAttempts = 60 // 最多等 60 次 (约 2 分钟)
  while (attempts < maxAttempts) {
    await new Promise(r => setTimeout(r, 2000)) // 每 2 秒查询一次
    attempts++

    const statusRes = await getChatStatus(conversationId, chatId)
    const status = statusRes.data.status

    if (status === 'completed') {
      onProgress?.('parsing')
      const msgRes = await getMessages(conversationId, chatId)
      const answerMsg = msgRes.data.find(m => m.type === 'answer')
      if (answerMsg) {
        return parseAnalysisResult(answerMsg.content)
      }
      throw new Error('未找到 AI 回复')
    }

    if (status === 'failed') {
      throw new Error('AI 分析失败，请重试')
    }

    onProgress?.('waiting', attempts)
  }

  throw new Error('分析超时，请重试')
}

/**
 * 检查 Coze 配置是否有效
 */
export function isCozeConfigured() {
  return (
    COZE_CONFIG.botId !== 'YOUR_BOT_ID_HERE' &&
    COZE_CONFIG.token !== 'YOUR_API_TOKEN_HERE'
  )
}

/**
 * 更新 Coze 配置
 */
export function updateCozeConfig({ botId, token }) {
  if (botId) COZE_CONFIG.botId = botId
  if (token) COZE_CONFIG.token = token
}

export default {
  analyzeCandidate,
  isCozeConfigured,
  updateCozeConfig,
}
