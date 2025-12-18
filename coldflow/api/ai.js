// Vercel Serverless Function - AI Proxy
// Keeps API keys secure on server side

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { provider, model, prompt, type } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' })
  }

  // Check for API keys (support both VITE_ and non-VITE_ prefixes)
  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY

  try {
    let result

    if (provider === 'anthropic') {
      if (!anthropicKey) {
        return res.status(500).json({ error: 'Anthropic API key not configured' })
      }
      
      // Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model || 'claude-3-haiku-20240307',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Anthropic API error: ${error}`)
      }

      const data = await response.json()
      result = data.content[0].text

    } else {
      if (!openaiKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured' })
      }
      
      // OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024
        })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`OpenAI API error: ${error}`)
      }

      const data = await response.json()
      result = data.choices[0].message.content
    }

    return res.status(200).json({ result, provider, model })

  } catch (error) {
    console.error('AI API Error:', error)
    return res.status(500).json({ error: error.message })
  }
}
