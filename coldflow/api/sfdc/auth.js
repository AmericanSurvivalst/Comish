// Salesforce OAuth Initiation
// Redirects user to Salesforce login

export default function handler(req, res) {
  const clientId = process.env.SFDC_CLIENT_ID
  const redirectUri = process.env.SFDC_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/sfdc/callback`
  
  if (!clientId) {
    return res.status(500).json({ error: 'Salesforce not configured' })
  }
  
  // Salesforce OAuth 2.0 authorization URL
  // Use login.salesforce.com for production, test.salesforce.com for sandbox
  const baseUrl = process.env.SFDC_SANDBOX === 'true' 
    ? 'https://test.salesforce.com'
    : 'https://login.salesforce.com'
  
  const scopes = [
    'api',           // REST API access
    'refresh_token', // Offline access
    'id',            // OpenID user info
  ].join(' ')
  
  const state = Buffer.from(JSON.stringify({
    userId: req.query.userId,
    timestamp: Date.now()
  })).toString('base64')
  
  const authUrl = `${baseUrl}/services/oauth2/authorize?` + new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    state: state,
    prompt: 'consent'
  }).toString()
  
  res.redirect(authUrl)
}
