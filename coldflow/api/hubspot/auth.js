// HubSpot OAuth Initiation
export default function handler(req, res) {
  const clientId = process.env.HUBSPOT_CLIENT_ID
  const redirectUri = process.env.HUBSPOT_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/hubspot/callback`
  
  if (!clientId) {
    return res.status(500).json({ error: 'HubSpot not configured' })
  }
  
  const scopes = [
    'crm.objects.contacts.read',
    'crm.objects.contacts.write',
    'crm.objects.companies.read',
    'crm.objects.deals.read',
    'crm.objects.deals.write',
    'oauth'
  ].join(' ')
  
  const state = Buffer.from(JSON.stringify({
    userId: req.query.userId,
    timestamp: Date.now()
  })).toString('base64')
  
  const authUrl = `https://app.hubspot.com/oauth/authorize?` + new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    state: state
  }).toString()
  
  res.redirect(authUrl)
}
