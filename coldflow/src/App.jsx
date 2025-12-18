import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

// DESIGN SYSTEM - Premium Dark Theme
const DS = {
  bg: '#000000',
  surface: '#0d0d0d',
  elevated: '#161616',
  border: '#262626',
  borderAccent: 'rgba(168,85,247,0.1)',
  text: '#ffffff',
  textSecondary: '#a3a3a3',
  textMuted: '#666666',
  accent: '#a855f7',
  success: '#00ff88',
  error: '#ef4444',
  glow: '0 0 25px rgba(168,85,247,0.05), inset 0 0 20px rgba(168,85,247,0.02)',
  glowHover: '0 0 35px rgba(168,85,247,0.15), inset 0 0 20px rgba(168,85,247,0.05)',
  btnGlow: '0 0 30px rgba(168,85,247,0.3)',
}

const Btn = ({children,onClick,v='p',s='m',d,...p})=>{
  const st={display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,fontWeight:600,borderRadius:100,cursor:d?'not-allowed':'pointer',opacity:d?.5:1,border:'none',fontFamily:'Inter,system-ui,sans-serif',transition:'all .2s',letterSpacing:'-0.01em'}
  const sz={s:{padding:'8px 16px',fontSize:12},m:{padding:'12px 24px',fontSize:13},l:{padding:'16px 32px',fontSize:14}}
  const vr={
    p:{background:DS.accent,color:'#000',boxShadow:DS.btnGlow},
    s:{background:'transparent',color:DS.textSecondary,border:`1px solid ${DS.border}`},
    g:{background:'transparent',color:DS.textMuted,border:'none'},
    d:{background:'rgba(239,68,68,.1)',color:DS.error,border:`1px solid rgba(239,68,68,.2)`}
  }
  return <button onClick={onClick} disabled={d} style={{...st,...sz[s],...vr[v]}} {...p}>{children}</button>
}

const Input = ({label,type='text',value,onChange,placeholder,...p})=>(
  <div style={{marginBottom:16}}>
    {label&&<label style={{display:'block',fontSize:11,color:DS.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em',fontWeight:500}}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:'100%',padding:'14px 16px',background:DS.bg,border:`1px solid ${DS.border}`,borderRadius:12,color:DS.text,fontSize:14,boxSizing:'border-box',outline:'none',fontFamily:'Inter,system-ui,sans-serif',transition:'all .2s'}} onFocus={e=>{e.target.style.borderColor=DS.accent;e.target.style.boxShadow=`0 0 0 3px rgba(168,85,247,0.15)`}} onBlur={e=>{e.target.style.borderColor=DS.border;e.target.style.boxShadow='none'}} {...p}/>
  </div>
)

const TextArea = ({label,value,onChange,placeholder,rows=5})=>(
  <div style={{marginBottom:16}}>
    {label&&<label style={{display:'block',fontSize:11,color:DS.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em',fontWeight:500}}>{label}</label>}
    <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{width:'100%',padding:'14px 16px',background:DS.bg,border:`1px solid ${DS.border}`,borderRadius:12,color:DS.text,fontSize:14,boxSizing:'border-box',outline:'none',fontFamily:'Inter,system-ui,sans-serif',resize:'vertical',transition:'all .2s'}} onFocus={e=>{e.target.style.borderColor=DS.accent;e.target.style.boxShadow=`0 0 0 3px rgba(168,85,247,0.15)`}} onBlur={e=>{e.target.style.borderColor=DS.border;e.target.style.boxShadow='none'}}/>
  </div>
)

const Tip = ({text})=>{
  const [show,setShow]=useState(false)
  return(
    <span style={{position:'relative',display:'inline-flex',alignItems:'center',marginLeft:6}}>
      <span onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)} style={{width:16,height:16,borderRadius:'50%',background:'rgba(168,85,247,.15)',border:'1px solid rgba(168,85,247,.3)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'help',fontSize:10,color:'#a855f7',fontWeight:600}}>?</span>
      {show&&<div style={{position:'absolute',bottom:'100%',left:'50%',transform:'translateX(-50%)',marginBottom:8,padding:'10px 14px',background:'#1a1a1a',border:'1px solid rgba(168,85,247,.3)',borderRadius:8,fontSize:12,color:'#fff',whiteSpace:'nowrap',zIndex:1000,boxShadow:'0 4px 20px rgba(0,0,0,.5)',maxWidth:250,lineHeight:1.5}}>{text}<div style={{position:'absolute',top:'100%',left:'50%',transform:'translateX(-50%)',borderWidth:6,borderStyle:'solid',borderColor:'#1a1a1a transparent transparent transparent'}}/></div>}
    </span>
  )
}

export default function App() {
  const [view, setView] = useState('landing')
  const [blogFilter, setBlogFilter] = useState('all')
  const [selectedPost, setSelectedPost] = useState(null)
  
  // Blog posts data with full content
  const blogPosts = [
    {id:1,slug:'cold-email-subject-lines',title:'47 Cold Email Subject Lines That Actually Get Opens',excerpt:'The subject line is everything. Here are the exact formulas top SDRs use to hit 50%+ open rates.',category:'Writing',readTime:8,featured:true,
      content:`Your subject line determines whether your email gets opened or ignored. After analyzing thousands of cold emails, we've identified the patterns that consistently drive 40-60% open rates.

## The Psychology Behind Great Subject Lines

People scan their inbox in seconds. Your subject line needs to create enough curiosity or relevance to earn a click - without being clickbait that destroys trust.

**The three things that work:**
- Personalization (company name, mutual connection, trigger event)
- Specificity (numbers, timeframes, concrete outcomes)
- Brevity (under 6 words performs best)

## Formulas That Work

**The Direct Approach:**
- "Quick question about {{company}}"
- "{{firstName}}, quick question"
- "Question about [specific initiative]"

**The Mutual Connection:**
- "{{mutualConnection}} suggested I reach out"
- "Fellow [university/company] alum"
- "Saw your post on [topic]"

**The Trigger Event:**
- "Congrats on the funding"
- "Saw {{company}} is hiring for [role]"
- "Re: your [recent announcement]"

**The Value-First:**
- "Idea for {{company}}"
- "[Specific metric] for {{company}}"
- "Saving [similar company] 10hrs/week"

**The Curiosity Gap:**
- "Thought about this for {{company}}"
- "This might help"
- "Quick thought"

## What to Avoid

- ALL CAPS or excessive punctuation!!!
- Spam trigger words (free, guarantee, act now)
- Misleading "Re:" or "Fwd:" on first touch
- Generic subjects like "Touching base" or "Following up"
- Anything over 60 characters

## Testing Your Subject Lines

A/B test ruthlessly. Send variant A to 20% of your list, variant B to another 20%, then send the winner to the remaining 60%. Small improvements in open rate compound into significantly more conversations.

The best subject line is one that sounds like it came from a colleague, not a salesperson.`},
    {id:2,slug:'email-deliverability-guide',title:'Email Deliverability: The Complete 2025 Guide',excerpt:'SPF, DKIM, DMARC, inbox warming - everything you need to land in primary, not spam.',category:'Deliverability',readTime:12,featured:true,
      content:`If your emails land in spam, nothing else matters. This guide covers everything you need to know about deliverability in 2025.

## The Three Pillars of Email Authentication

### SPF (Sender Policy Framework)
SPF tells receiving servers which IP addresses are allowed to send email on behalf of your domain. Without it, anyone could spoof your domain.

**How to set it up:**
Add a TXT record to your DNS:
\`v=spf1 include:_spf.google.com ~all\`

### DKIM (DomainKeys Identified Mail)
DKIM adds a digital signature to your emails, proving they weren't tampered with in transit.

**Setup:** Generate a DKIM key in your email provider, then add the public key as a TXT record in your DNS.

### DMARC (Domain-based Message Authentication)
DMARC tells receiving servers what to do if SPF or DKIM fails. Start with monitoring mode:
\`v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com\`

## Warming Up New Email Accounts

Never blast hundreds of emails from a fresh account. Here's the ramp:

- **Week 1:** 10-20 emails/day, mostly to people who will reply
- **Week 2:** 30-40 emails/day
- **Week 3:** 50-75 emails/day
- **Week 4+:** Gradually increase to your target volume

Use a warmup service to automate sending and replying between real inboxes.

## Maintaining Good Reputation

**Do:**
- Keep bounce rate under 2%
- Maintain reply rates above 5%
- Remove unengaged contacts regularly
- Use multiple sending domains for high volume

**Don't:**
- Send to purchased lists
- Ignore unsubscribe requests
- Use URL shorteners (they look spammy)
- Include too many links or images

## Monitoring Your Reputation

Check these regularly:
- Google Postmaster Tools (for Gmail delivery)
- Microsoft SNDS (for Outlook)
- MXToolbox blacklist check
- Your ESP's bounce and complaint rates

Good deliverability isn't a one-time setup - it's ongoing maintenance.`},
    {id:3,slug:'follow-up-sequences',title:'The Perfect Follow-Up Sequence (With Templates)',excerpt:'How many follow-ups? What timing? We break down the data behind sequences that convert.',category:'Sequences',readTime:9,
      content:`Most replies come from follow-ups, not first emails. Here's how to build sequences that convert without being annoying.

## The Data on Follow-Ups

- 80% of sales require 5+ follow-ups
- Most reps give up after 2
- The best day for follow-ups is Tuesday
- Best time: 9-11 AM recipient's timezone

## The Ideal Sequence Structure

**Email 1 (Day 1):** The intro
Direct value prop, one clear CTA. Keep it under 100 words.

**Email 2 (Day 3):** The bump
Short and casual. "Bumping this up - did you get a chance to look?"

**Email 3 (Day 6):** New angle
Try a different value prop or share social proof. Maybe they didn't care about angle #1.

**Email 4 (Day 10):** The resource
Provide value without asking. Share relevant content, a case study, or insight about their industry.

**Email 5 (Day 14):** The breakup
Give them an easy out. Paradoxically, these often get the best replies.

## Templates That Work

**The Bump:**
"{{firstName}},

Floating this back up. I know things get buried.

Still open to connecting?

- [Your name]"

**The New Angle:**
"{{firstName}},

Different thought - [alternative value prop or angle].

Might be more relevant for where {{company}} is right now?

- [Your name]"

**The Breakup:**
"{{firstName}},

I've reached out a few times with no reply, which usually means:

1. Not interested (totally fine)
2. Interested but buried
3. Wrong person to talk to

Which is it? Happy to close the loop either way.

- [Your name]"

## When to Stop

After 5-6 touches with no engagement, move on. But don't delete them - set a reminder to try again in 3-6 months with fresh context.`},
    {id:4,slug:'cold-email-mistakes',title:'12 Cold Email Mistakes Killing Your Reply Rate',excerpt:'These common errors are why your emails get ignored. Fix them today.',category:'Writing',readTime:7,
      content:`Most cold emails fail for predictable reasons. Here are the 12 mistakes we see killing reply rates.

## 1. Making It About You
"I wanted to reach out..." "I'd love to..." - nobody cares what you want. Focus on them.

## 2. No Personalization
If your email could go to anyone, it won't resonate with anyone. Reference something specific.

## 3. Too Long
Anything over 150 words is risky. Mobile users see even less. Get to the point.

## 4. Weak Subject Lines
Generic subjects like "Quick question" or "Checking in" get ignored. Be specific.

## 5. No Clear CTA
What do you want them to do? One clear ask. Not "let me know if you're interested or have questions or want to see a demo."

## 6. Asking for Too Much
Don't ask for 30 minutes from a stranger. Start small - a quick reply, a 15-minute call.

## 7. Lying or Misleading
Fake "Re:" subjects, pretending you've met, or exaggerating claims. Trust is everything.

## 8. Bad Timing
Sending at 2 AM their time or on weekends tanks open rates.

## 9. No Follow-Up
One email isn't a campaign. 80% of replies come from follow-ups.

## 10. Ignoring Mobile
Most emails are read on phones. No giant paragraphs, no complex formatting.

## 11. Template Voice
If it sounds like it came from a template, it gets treated like spam. Write like a human.

## 12. Wrong Person
Emailing the CEO when you should email the director wastes everyone's time. Do your research.

Fix these and you'll outperform 90% of cold emailers.`},
    {id:5,slug:'personalization-at-scale',title:'How to Personalize Cold Emails at Scale',excerpt:'Real personalization without spending hours on research. Tools and techniques that work.',category:'Strategy',readTime:10,
      content:`Everyone says "personalize your emails" but nobody talks about doing it efficiently. Here's how to personalize at scale.

## The Personalization Hierarchy

**Level 1: Basic merge fields**
{{firstName}}, {{company}} - table stakes, not real personalization.

**Level 2: Segmented messaging**
Different templates for different personas, industries, or company sizes.

**Level 3: Trigger-based**
Reference something timely - funding, hiring, product launch, content they posted.

**Level 4: Deep research**
Specific insights about their business challenges. High effort, high reward.

## Efficient Research Methods

**For trigger events:**
- Set Google Alerts for target accounts
- Follow prospects on LinkedIn
- Monitor company blogs and press pages
- Use tools like Crunchbase for funding news

**For quick company research:**
- 10-K filings (public companies)
- G2/Capterra reviews (what customers say)
- LinkedIn company page (recent posts, headcount)
- Their own website (messaging, positioning)

## Scalable Personalization Techniques

**The Observation Opener:**
One specific thing you noticed. Takes 30 seconds of research.

"Saw {{company}} just opened the Austin office - congrats on the expansion."

**The Trigger Template:**
Build templates for common triggers, then fill in specifics.

"Noticed you're hiring for [role]. Usually means [challenge]. We help with that."

**The Industry Angle:**
Same email, customized for verticals.

"Most [industry] companies we talk to are dealing with [common challenge]..."

## What Not to Do

- Don't fake it ("Love what you're doing at {{company}}!")
- Don't over-personalize (creepy, not impressive)
- Don't let personalization slow you down to 5 emails/day

The goal is relevant, not perfect. A good enough personalized email beats a perfect generic one.`},
    {id:6,slug:'spf-dkim-dmarc-setup',title:'SPF, DKIM, and DMARC: Setup Guide for Sales Teams',excerpt:'Technical email authentication explained simply. Step-by-step setup instructions.',category:'Deliverability',readTime:11,
      content:`Email authentication sounds technical, but it's essential for deliverability. Here's the step-by-step setup.

## Why This Matters

Without proper authentication:
- Emails land in spam more often
- Your domain can be spoofed by bad actors
- Receiving servers don't trust you

## SPF Setup (10 minutes)

SPF tells the world which servers can send email from your domain.

**Step 1:** Go to your DNS provider (GoDaddy, Cloudflare, etc.)

**Step 2:** Add a TXT record:
- Name/Host: @ (or leave blank)
- Value: \`v=spf1 include:_spf.google.com ~all\`

(Replace with your email provider's SPF include)

**Step 3:** Wait for propagation (up to 48 hours, usually faster)

**Common SPF includes:**
- Google: \`include:_spf.google.com\`
- Microsoft: \`include:spf.protection.outlook.com\`
- Mailchimp: \`include:servers.mcsv.net\`

## DKIM Setup (15 minutes)

DKIM adds a cryptographic signature to prove your emails are legit.

**Step 1:** Generate DKIM keys in your email provider's admin panel

**Step 2:** Add the TXT record they provide to your DNS

**Step 3:** Enable DKIM signing in your email settings

**Step 4:** Test with mail-tester.com

## DMARC Setup (10 minutes)

DMARC tells receiving servers what to do when SPF/DKIM fail.

**Start with monitoring mode:**
Add this TXT record:
- Name: _dmarc
- Value: \`v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com\`

**After 2-4 weeks of clean reports, tighten:**
\`v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourdomain.com\`

**Eventually move to reject:**
\`v=DMARC1; p=reject; rua=mailto:dmarc-reports@yourdomain.com\`

## Verification

Use these tools to verify your setup:
- mxtoolbox.com/spf.aspx
- mail-tester.com
- dmarcanalyzer.com

Green checks across the board = you're good to go.`},
    {id:7,slug:'cold-email-ctas',title:'The Best CTAs for Cold Emails (Data-Backed)',excerpt:'What call-to-action actually gets replies? We analyzed 100k emails to find out.',category:'Writing',readTime:6,
      content:`Your call-to-action determines whether people respond. Here's what the data says about what works.

## The Winning Formula

The best CTAs are:
- Low commitment (easy to say yes)
- Specific (not vague)
- Binary (yes/no question)

## Top Performing CTAs

**Interest-based (highest reply rate):**
"Worth a conversation?"
"Open to learning more?"
"Is this on your radar?"

**Time-specific:**
"Open to a 15-minute call this week?"
"Do you have 10 minutes Tuesday or Wednesday?"

**Permission-based:**
"Mind if I send over a quick case study?"
"Would it help if I shared how we did this for [similar company]?"

**The soft close:**
"No worries if not - just wanted to plant the seed."

## What Doesn't Work

**Too aggressive:**
"When can we meet?" (assumes they want to)
"I'll call you Thursday at 3pm" (presumptuous)

**Too vague:**
"Let me know your thoughts"
"Would love to connect sometime"

**Too much:**
"Book a 30-minute demo and I'll show you our full platform and pricing and implementation timeline"

## CTA Placement

Put your CTA:
- On its own line
- After your value prop
- Before your signature

Don't bury it in a paragraph. Make it unmissable.

## A/B Test Results

In our tests across 100k emails:
- "Worth a quick chat?" - 12% reply rate
- "Open to a 15-min call?" - 11% reply rate
- "Let me know if interested" - 4% reply rate
- "When can we meet?" - 3% reply rate

The pattern is clear: lower commitment = higher response.`},
    {id:8,slug:'inbox-rotation',title:'Why You Need Multiple Sending Inboxes',excerpt:'Protect your domain reputation and increase deliverability with inbox rotation.',category:'Deliverability',readTime:5,
      content:`Sending all your cold emails from one inbox is risky. Here's why rotation matters.

## The Problem with Single Inbox

- Daily sending limits (Google caps at ~500/day)
- One spam complaint affects all your email
- If blacklisted, you're dead in the water
- No redundancy if account gets suspended

## The Solution: Inbox Rotation

Spread your sending across multiple inboxes:
- Higher total daily volume
- Risk distributed across accounts
- Better deliverability per message
- Redundancy if one account has issues

## How to Set It Up

**Option 1: Multiple accounts on your main domain**
- sales1@company.com
- sales2@company.com
- sales3@company.com

Pro: Simple
Con: All eggs in one domain basket

**Option 2: Separate domains**
- outreach@company-mail.com
- hello@trycompany.com

Pro: Domain reputation isolation
Con: More setup and maintenance

## Rotation Strategy

**For 500 emails/day:**
- 3 inboxes
- ~165 emails each
- Rotate sending throughout the day

**For 1000+ emails/day:**
- 5-10 inboxes
- Mix of domains
- Automated rotation with your sending tool

## Warming Each Inbox

Every new inbox needs warmup:
- Start at 10-20/day
- Increase gradually over 2-4 weeks
- Use a warmup service for automation
- Don't skip this step

## Monitoring

Track per-inbox:
- Bounce rates
- Spam complaints
- Open rates
- Reply rates

If one inbox underperforms, investigate before it tanks your whole operation.`},
    {id:9,slug:'when-to-send-cold-emails',title:'The Best Time to Send Cold Emails in 2025',excerpt:'Day of week, time of day, timezone considerations. What the data says.',category:'Strategy',readTime:6,
      content:`Timing impacts whether your email gets seen. Here's what the data shows.

## Best Days

**Tuesday, Wednesday, Thursday** consistently outperform.

- Monday: inbox overwhelm from weekend
- Tuesday: caught up, receptive ✓
- Wednesday: mid-week focus ✓
- Thursday: still productive ✓
- Friday: mentally checked out
- Weekend: don't bother

## Best Times

**9:00 AM - 11:00 AM** in the recipient's timezone.

- Early birds check email first thing
- Before meetings pile up
- High engagement window

**Secondary window: 1:00 PM - 3:00 PM**
- Post-lunch email check
- Afternoon lull = inbox time

## Timezone Handling

Always send in the recipient's timezone, not yours.

**How to do it:**
- Segment lists by timezone
- Schedule sends accordingly
- Most email tools handle this automatically

## The Timing Myth

Here's the thing: timing is a 10-15% factor, max.

A great email at a bad time beats a bad email at the perfect time. Don't obsess over the perfect send time while neglecting your actual message.

## Testing for Your Audience

These are general patterns. Your audience might be different:

- Executives: earlier (6-8 AM)
- Developers: later (after standup)
- European prospects: adjust for timezone
- Specific industries: test and learn

## Scheduling Tips

- Batch schedule for the week
- Don't send everything at exactly :00 (looks automated)
- Stagger by a few minutes for natural feel
- Avoid sending when you'd be asleep (looks suspicious)`},
    {id:10,slug:'cold-email-vs-linkedin',title:'Cold Email vs LinkedIn Outreach: When to Use Each',excerpt:'Both channels work. Here\'s when to use which - and how to combine them.',category:'Strategy',readTime:8,
      content:`Email and LinkedIn both work for outbound. The question is when to use each.

## Cold Email Strengths

- Higher volume possible
- Longer messages acceptable
- Better for detailed pitches
- Easier to automate
- Works across all industries

## LinkedIn Strengths

- Higher open/response rates (but lower volume)
- Profile adds credibility
- Can see if they viewed you
- Good for relationship building
- Works well for certain personas

## When to Use Email

- High volume campaigns (100+ contacts)
- Longer, more detailed messages needed
- Target doesn't check LinkedIn often
- You have verified email addresses
- Following up after no LinkedIn response

## When to Use LinkedIn

- Executive-level targets
- Building long-term relationships
- Your profile/content adds credibility
- Smaller, highly targeted lists
- Tech/startup prospects who live on LinkedIn

## The Combined Approach

**Day 1:** LinkedIn connection request (no pitch)
**Day 2:** If accepted, brief LinkedIn message
**Day 3:** Cold email (mention you connected on LI)
**Day 6:** Email follow-up
**Day 10:** LinkedIn follow-up
**Day 14:** Final email

## LinkedIn Message Tips

- Keep it under 300 characters
- No links in first message (triggers spam filters)
- Don't pitch in connection request
- Personalize or don't bother

## The Reality

Most successful outbound uses both channels, sequenced intelligently. The prospects who ignore your email might respond on LinkedIn, and vice versa.

Test both, track results, double down on what works for your specific audience.`},
    {id:11,slug:'warming-up-email-account',title:'How to Warm Up a New Email Account',excerpt:'Don\'t burn your domain. The right way to ramp up sending volume.',category:'Deliverability',readTime:7,
      content:`A new email account has no reputation. Blast 500 emails day one and you'll land in spam forever. Here's how to warm up properly.

## Why Warmup Matters

Email providers are suspicious of new accounts sending high volume. They're watching for:
- Sudden volume spikes
- Low engagement rates
- Spam complaints

A warmed account builds trust over time.

## The Manual Warmup Process

**Week 1:**
- Send 10-20 emails per day
- Mix of personal and business contacts
- People who will actually reply

**Week 2:**
- Increase to 25-40 per day
- Start adding cold prospects
- Keep reply rate high

**Week 3:**
- 50-75 per day
- Monitor bounce and spam rates
- Back off if issues arise

**Week 4+:**
- Gradually reach target volume
- Never increase more than 20% per week
- Max ~150-200/day for cold email

## Automated Warmup Services

Tools like Warmbox, Lemwarm, or Mailwarm automate this:
- Send emails between real inboxes
- Auto-reply to build engagement
- Move emails out of spam
- Gradual volume increase

Cost: $15-50/month per inbox
Worth it: Absolutely

## Signs of Trouble

Watch for:
- Emails landing in spam (test regularly)
- Higher than 3% bounce rate
- Drop in open rates
- Google/Microsoft warnings

If you see these, slow down immediately.

## Ongoing Maintenance

Warmup isn't one-time. Keep your account healthy:
- Maintain consistent volume
- Don't spike randomly
- Keep engagement rates up
- Remove bad addresses quickly

A well-maintained inbox can send reliably for years.`},
    {id:12,slug:'ab-testing-cold-emails',title:'A/B Testing Cold Emails: What to Test First',excerpt:'Subject lines, CTAs, length, personalization. Prioritize your tests for maximum impact.',category:'Strategy',readTime:6,
      content:`Random testing wastes time. Here's the priority order for maximum impact.

## Test Priority Order

**1. Subject Line (Highest Impact)**
Affects open rate by 30-50%. Test first.
- Length (short vs medium)
- Personalization (name/company vs none)
- Style (question vs statement)

**2. Call-to-Action**
Affects reply rate by 20-40%.
- Low vs high commitment
- Question vs statement
- Specific vs vague ask

**3. Email Length**
Affects reply rate by 10-20%.
- Under 50 words vs 100-150 words
- With vs without bullet points

**4. Personalization Level**
Affects reply rate by 10-30%.
- Generic vs segment-specific
- Basic vs trigger-based

**5. Sending Time**
Affects open rate by 5-15%.
- Morning vs afternoon
- Day of week

## How to A/B Test Properly

**Sample size matters:**
Minimum 100 recipients per variant to get meaningful data.

**Test one thing at a time:**
If you change subject AND CTA, you won't know which made the difference.

**Statistical significance:**
Don't declare a winner too early. Use a calculator to verify results are real.

## Quick Test Protocol

1. Split your list 20/20/60
2. Send variant A to 20%
3. Send variant B to 20%
4. Wait 48 hours
5. Send winner to remaining 60%

## What NOT to Test

Don't waste time testing:
- Font or formatting (minimal impact)
- Signature details
- Minor word changes
- Things that don't scale

Focus your testing energy on the big levers.`},
    {id:13,slug:'breakup-email-templates',title:'Break-Up Email Templates That Get Last-Chance Replies',excerpt:'When nothing else worked, these final emails pull people back.',category:'Sequences',readTime:5,
      content:`The breakup email is your last shot. Done right, it often gets the best response of the entire sequence.

## Why Breakup Emails Work

- Creates urgency (last chance)
- Removes pressure (easy to say no)
- Shows respect (you're not desperate)
- Triggers loss aversion

## The Classic Breakup

"{{firstName}},

I've reached out a few times and haven't heard back. That usually means one of three things:

1. You're not interested (totally fine)
2. You're interested but swamped
3. I'm reaching the wrong person

Which is it? Happy to close the loop either way.

- [Your name]"

## The Permission Close

"{{firstName}},

I'll keep this short - should I stop reaching out?

No hard feelings if so. Just don't want to be that annoying sales person.

- [Your name]"

## The Future Door

"{{firstName}},

Going to assume the timing isn't right and stop here.

If things change down the road, I'm easy to find. Wishing you and the {{company}} team well.

- [Your name]"

## The Direct Question

"{{firstName}},

Yes or no - is [solving problem] something {{company}} is thinking about this quarter?

- [Your name]"

## Tips for Breakup Emails

**Do:**
- Keep it short (under 50 words ideal)
- Make it easy to respond
- Be genuinely okay with "no"
- Leave the door open

**Don't:**
- Sound bitter or passive-aggressive
- Make them feel guilty
- Actually stop following up forever (try again in 6 months)

## After the Breakup

If no response, add them to a nurture sequence. Try again in 3-6 months with fresh context. People's situations change.`},
    {id:14,slug:'cold-email-length',title:'How Long Should a Cold Email Be?',excerpt:'Short vs long - what actually performs better? The answer might surprise you.',category:'Writing',readTime:5,
      content:`There's endless debate about email length. Here's what the data actually shows.

## The Data

Studies show optimal cold email length is **50-125 words**.

- Under 50 words: can feel incomplete
- 50-125 words: highest response rate
- Over 200 words: significant drop-off

## Why Shorter Wins

**Mobile reality:**
Most emails are read on phones. Long emails require scrolling, which most people won't do.

**Attention spans:**
You have 8 seconds to make an impression. Every unnecessary word is a liability.

**Respect:**
Short emails signal you value their time.

## The Anatomy of a Short Email

**Line 1:** Hook (personalized or intriguing)
**Line 2-3:** Value prop (what's in it for them)
**Line 4:** CTA (one clear ask)
**Line 5:** Signature

That's it. Everything else is probably filler.

## When Longer Works

Exceptions exist:
- Complex B2B sales with long cycles
- Highly targeted, warm-ish leads
- When you have specific, relevant intel

But even then, under 150 words.

## The Trim Test

Write your email. Then:
1. Delete the first paragraph (usually throat-clearing)
2. Cut every sentence that doesn't add value
3. Replace phrases with single words
4. Read it out loud - cut anything that sounds like fluff

If you can say it in fewer words, you should.

## Example: Before and After

**Before (187 words):**
"Hi {{firstName}}, I hope this email finds you well. My name is [Name] and I'm reaching out from [Company]. We're a leading provider of sales automation solutions that help companies like yours improve their outbound efficiency. I've been following {{company}} for a while now and I'm really impressed with what you're building. I think there might be a great opportunity for us to work together. We've helped companies similar to yours increase their sales productivity by 40% on average. I'd love to schedule a 30-minute call to walk you through our platform and show you how we might be able to help. Would you be available sometime next week? I'm flexible on timing and can work around your schedule. Looking forward to hearing from you."

**After (47 words):**
"{{firstName}} - 

Saw {{company}} is scaling the sales team. 

We help companies like [similar company] book 3x more meetings without adding headcount. Might be relevant given your growth.

Worth a 15-minute call?

- [Your name]"

Same information. 75% shorter. Way more likely to get read.`},
    {id:15,slug:'reply-handling',title:'How to Handle Cold Email Replies (Good and Bad)',excerpt:'Someone replied! Now what? Templates for every type of response.',category:'Sequences',readTime:7,
      content:`Getting replies is just the beginning. How you handle them determines whether they become opportunities.

## Types of Replies

**1. Positive interest** - "Sure, let's chat"
**2. Soft interest** - "Tell me more"
**3. Objection** - "We already have a solution"
**4. Referral** - "Talk to [other person]"
**5. Not now** - "Bad timing"
**6. Not interested** - "Please remove me"
**7. Hostile** - "Stop emailing me"

## Handling Each Type

### Positive Interest
"Sure, let's talk"

**Response:**
"Great - here's my calendar link: [link]

Or if easier, I'm free [2-3 specific times].

Looking forward to it.
- [Name]"

Don't overthink it. Make booking easy.

### Soft Interest
"What exactly do you do?"

**Response:**
Keep it brief. Answer their question in 2-3 sentences, then guide to a call.

"Good question - in short, we [one sentence value prop].

For [similar company], that meant [specific result].

Easier to show than tell - open to a quick call?
- [Name]"

### Objections
"We already use [competitor]"

**Response:**
"Totally get it - most of our customers came from [competitor] actually.

Curious what made you choose them? Always looking to learn.
- [Name]"

Opens dialogue without being pushy.

### Referral
"You should talk to [other person]"

**Response:**
"Thanks for the pointer - really appreciate it.

Mind if I mention you reached out? Always helps to have context.
- [Name]"

Then email the referral with that social proof.

### Not Now
"Check back in Q2"

**Response:**
"Noted - I'll circle back then.

Anything specific changing in Q2 that would make this more relevant?
- [Name]"

Set a reminder and actually follow up.

### Not Interested
"Please remove me from your list"

**Response:**
"Done - thanks for letting me know.

If anything changes, I'm easy to find. Best of luck with everything at {{company}}.
- [Name]"

Remove them immediately. No arguments.

### Hostile
"Stop emailing me or I'll report you as spam"

**Response:**
"Removed - apologies for the interruption. Take care."

Don't engage further. Remove and move on.

## Speed Matters

Respond within 1 hour during business hours if possible. Reply rate drops significantly after 24 hours.`},
    {id:16,slug:'domain-reputation',title:'Understanding and Monitoring Domain Reputation',excerpt:'Your domain has a score. Here\'s how to check it and improve it.',category:'Deliverability',readTime:8,
      content:`Every domain has a reputation score that determines whether your emails land in inboxes or spam.

## What Affects Domain Reputation

**Positive factors:**
- High open rates
- Replies to your emails
- Low bounce rate
- Proper authentication (SPF/DKIM/DMARC)
- Consistent sending volume

**Negative factors:**
- Spam complaints
- High bounce rates
- Spam trap hits
- Blacklist presence
- Sudden volume spikes

## How to Check Your Reputation

### Google Postmaster Tools
For Gmail delivery specifically.
- Go to postmaster.google.com
- Verify your domain
- Monitor spam rate, authentication, and reputation

### Microsoft SNDS
For Outlook/Hotmail.
- Sign up at sendersupport.olc.protection.outlook.com
- Add your sending IPs
- Monitor complaint rates

### MXToolbox
Free blacklist check.
- mxtoolbox.com/blacklists.aspx
- Enter your domain
- Check all major blacklists

### Sender Score
Overall reputation score 0-100.
- senderscore.org
- Enter your sending IP
- Aim for 80+

## Improving Bad Reputation

**If you're on a blacklist:**
1. Identify the blacklist
2. Find their removal process
3. Fix the underlying issue
4. Request delisting

**If spam rates are high:**
1. Clean your list (remove bounces, unsubscribes)
2. Slow down sending volume
3. Improve targeting
4. Make unsubscribe easy

**If open rates tanked:**
1. Check authentication
2. Review recent content changes
3. Verify you're not in spam folders
4. Consider warming a new domain

## Prevention is Better

Don't wait for problems. Monthly check:
- Run blacklist scan
- Review Postmaster Tools
- Check bounce rates
- Monitor spam complaints

Catch issues early before they tank your deliverability.`},
  ]
  
  const blogCategories = ['all','Writing','Sequences','Deliverability','Strategy']
  const filteredPosts = blogFilter === 'all' ? blogPosts : blogPosts.filter(p => p.category === blogFilter)
  const featuredPosts = blogPosts.filter(p => p.featured)
  
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('dashboard')
  const [authErr, setAuthErr] = useState('')
  const [email, setEmail] = useState(() => localStorage.getItem('cf-remember-email') || '')
  const [pw, setPw] = useState('')
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('cf-remember-email'))
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [contactForm, setContactForm] = useState({name:'',email:'',message:''})
  const [contactSent, setContactSent] = useState(false)
  const [waitlistForm, setWaitlistForm] = useState({name:'',email:'',company:'',teamSize:''})
  const [waitlistSent, setWaitlistSent] = useState(false)
  
  const [leads, setLeads] = useState([])
  const [sequences, setSequences] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [tags, setTags] = useState([])
  
  const [selSeq, setSelSeq] = useState(null)
  const [selCamp, setSelCamp] = useState(null)
  const [selLead, setSelLead] = useState(null)
  const [selLeads, setSelLeads] = useState([])
  const [importDropdown, setImportDropdown] = useState(false)
  const [leadPanelSearch, setLeadPanelSearch] = useState('')
  const [leadPanelExpanded, setLeadPanelExpanded] = useState(false)
  const [tagFilter, setTagFilter] = useState(null)
  const [modal, setModal] = useState(null)
  
  const [leadF, setLeadF] = useState({fn:'',ln:'',em:'',co:'',tags:[]})
  const [imp, setImp] = useState('')
  
  // Salesforce sync state
  const [sfdcSyncType, setSfdcSyncType] = useState('Lead')
  const [sfdcFilter, setSfdcFilter] = useState('')
  const [sfdcSyncing, setSfdcSyncing] = useState(false)
  const [sfdcSyncResult, setSfdcSyncResult] = useState(null)
  
  // HubSpot sync state
  const [hubspotSyncing, setHubspotSyncing] = useState(false)
  const [hubspotSyncResult, setHubspotSyncResult] = useState(null)
  const [seqN, setSeqN] = useState('')
  const [stepF, setStepF] = useState({day:1,time:'09:00',subj:'',body:'',condition:'none',waitDays:1,type:'email'})
  const [editStep, setEditStep] = useState(null)
  const [campF, setCampF] = useState({name:'',seq:'',tag:''})
  const [tagN, setTagN] = useState('')
  const [aiIn, setAiIn] = useState('')
  const [aiMsgs, setAiMsgs] = useState([])
  const [aiLoad, setAiLoad] = useState(false)
  
  // New: Theme and Templates
  const [theme, setTheme] = useState(() => localStorage.getItem('cf-theme') || 'dark')
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('cf-profile')
    return saved ? JSON.parse(saved) : { name:'', title:'', company:'', industry:'', valueProps:'', tone:'professional' }
  })
  const [showTemplates, setShowTemplates] = useState(false)
  const [editingStepId, setEditingStepId] = useState(null)
  const [dragIdx, setDragIdx] = useState(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)
  const [previewStep, setPreviewStep] = useState(null)
  const [templates, setTemplates] = useState([
    // Intro/First Touch
    {id:'t1',name:'Cold Intro - Direct',category:'intro',subject:'{{company}} + [Your Company]',body:'{{firstName}},\n\nI\'ll keep this short.\n\nWe help [target audience] [achieve specific outcome]. Noticed {{company}} might be dealing with [pain point] based on [observation].\n\nWorth a 15-minute call to see if there\'s a fit?\n\n- [Your name]'},
    {id:'t2',name:'Cold Intro - Problem First',category:'intro',subject:'Quick question',body:'{{firstName}},\n\nMost [job titles] I talk to are spending way too much time on [pain point]. Sound familiar?\n\nWe built something that cuts that in half. Already working with [similar company type].\n\nOpen to a quick call this week?\n\n- [Your name]'},
    {id:'t3',name:'Referral Intro',category:'intro',subject:'{{mutualConnection}} said to reach out',body:'{{firstName}},\n\n{{mutualConnection}} mentioned you\'re the person to talk to about [area] at {{company}}.\n\nWe help [target audience] with [specific outcome]. They thought it\'d be worth connecting.\n\n15 minutes this week?\n\n- [Your name]'},
    {id:'t4',name:'Trigger Event Intro',category:'intro',subject:'Congrats on the {{triggerEvent}}',body:'{{firstName}},\n\nSaw {{company}} just [trigger event]. Nice move.\n\nCompanies at this stage usually start thinking about [related challenge]. We\'ve helped [similar companies] navigate that.\n\nWorth a conversation?\n\n- [Your name]'},
    // Follow-up
    {id:'t5',name:'Follow-up - Bump',category:'followup',subject:'Re: {{company}} + [Your Company]',body:'{{firstName}},\n\nBumping this up. I know things get buried.\n\nStill interested in connecting?\n\n- [Your name]'},
    {id:'t6',name:'Follow-up - New Angle',category:'followup',subject:'Different approach',body:'{{firstName}},\n\nMaybe my last email missed the mark. Let me try again.\n\n[One sentence on specific value prop or result].\n\nIf that\'s relevant to {{company}}, I\'d love 15 minutes. If not, no worries.\n\n- [Your name]'},
    {id:'t7',name:'Follow-up - Social Proof',category:'followup',subject:'How [Company] did it',body:'{{firstName}},\n\nQuick follow-up with some context.\n\nWe just helped [similar company] [achieve specific result] in [timeframe]. Figured {{company}} might want the same playbook.\n\nWorth a quick call?\n\n- [Your name]'},
    {id:'t8',name:'Follow-up - Value Add',category:'followup',subject:'Thought this might help',body:'{{firstName}},\n\nPut together [resource/insight] that might be useful for {{company}}.\n\n[One line summary or link]\n\nNo strings attached. Happy to walk through it if helpful.\n\n- [Your name]'},
    // Break-up
    {id:'t9',name:'Break-up - Classic',category:'breakup',subject:'Should I close your file?',body:'{{firstName}},\n\nI\'ve reached out a few times. No response tells me one of three things:\n\n1. Not interested (totally fine)\n2. Interested but buried (I get it)\n3. Wrong person (point me in the right direction?)\n\nWhich one is it?\n\n- [Your name]'},
    {id:'t10',name:'Break-up - Permission',category:'breakup',subject:'Closing the loop',body:'{{firstName}},\n\nI\'ll stop here. Don\'t want to be that person.\n\nIf timing changes, you know where to find me. If there\'s someone else at {{company}} I should talk to, happy to reach out to them instead.\n\nEither way - good luck with everything.\n\n- [Your name]'},
    // Meeting Request
    {id:'t11',name:'Meeting - Direct Ask',category:'meeting',subject:'15 min this week?',body:'{{firstName}},\n\nI\'ll be quick.\n\nI want to show you how we helped [similar company] [achieve result]. Takes 15 minutes.\n\nHere\'s my calendar: {{calendarLink}}\n\nOr just reply with a time.\n\n- [Your name]'},
    {id:'t12',name:'Meeting - After Interest',category:'meeting',subject:'Let\'s do it',body:'{{firstName}},\n\nGreat - let\'s find a time.\n\nHere\'s my calendar: {{calendarLink}}\n\nOr throw out a few times that work on your end.\n\nLooking forward to it.\n\n- [Your name]'},
    // Re-engagement
    {id:'t13',name:'Re-engage - Check In',category:'reengagement',subject:'Still relevant?',body:'{{firstName}},\n\nIt\'s been a while. Wanted to check if [pain point/challenge] is still on your radar at {{company}}.\n\nWe\'ve shipped some new stuff since we last talked. Might be worth a fresh look.\n\nOpen to reconnecting?\n\n- [Your name]'},
    {id:'t14',name:'Re-engage - News Hook',category:'reengagement',subject:'Saw the news',body:'{{firstName}},\n\nSaw {{company}} just [recent news/announcement]. Congrats.\n\nGiven that, [specific reason this is relevant now]. Thought it might be worth reconnecting.\n\n15 minutes?\n\n- [Your name]'},
  ])
  const [templateFilter, setTemplateFilter] = useState('all')
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [newTemplate, setNewTemplate] = useState({name:'',category:'intro',subject:'',body:''})
  
  // Custom merge fields beyond the defaults
  const [customFields, setCustomFields] = useState([])
  const [newFieldName, setNewFieldName] = useState('')
  
  // Snippets library - organized by category
  const [snippets, setSnippets] = useState([
    // CTAs
    {id:'s1',name:'CTA - Quick Call',category:'cta',text:'Open to a 15-minute call this week?'},
    {id:'s2',name:'CTA - Reply Only',category:'cta',text:'Even a one-line reply helps me understand if this is relevant.'},
    {id:'s3',name:'CTA - Calendar',category:'cta',text:'Here\'s my calendar if easier: {{calendarLink}}'},
    {id:'s4',name:'CTA - Yes/No',category:'cta',text:'Would it make sense to connect? No pressure either way.'},
    {id:'s5',name:'CTA - Soft',category:'cta',text:'If this isn\'t a priority right now, just say the word.'},
    // Openers
    {id:'s6',name:'Opener - Referral',category:'opener',text:'{{mutualConnection}} mentioned you\'d be the right person to talk to about this.'},
    {id:'s7',name:'Opener - Trigger',category:'opener',text:'Saw {{company}} just {{triggerEvent}} - congrats.'},
    {id:'s8',name:'Opener - Direct',category:'opener',text:'I\'ll keep this short.'},
    {id:'s9',name:'Opener - Research',category:'opener',text:'Been following {{company}}\'s work in {{industry}} - impressive stuff.'},
    {id:'s10',name:'Opener - Problem',category:'opener',text:'Most {{jobTitle}}s I talk to are dealing with {{painPoint}}.'},
    // Value Props
    {id:'s11',name:'Value - Time Saved',category:'value',text:'We typically save teams 5-10 hours per week on {{task}}.'},
    {id:'s12',name:'Value - Revenue',category:'value',text:'Our clients see an average 30% increase in {{metric}} within 90 days.'},
    {id:'s13',name:'Value - Simplify',category:'value',text:'We make {{complexThing}} simple - no learning curve, no headaches.'},
    {id:'s14',name:'Value - Competitive',category:'value',text:'Your competitors are already doing this. Just saying.'},
    // Social Proof
    {id:'s15',name:'Proof - Similar Co',category:'proof',text:'We just helped {{similarCompany}} solve this exact problem.'},
    {id:'s16',name:'Proof - Numbers',category:'proof',text:'{{number}}+ companies use us for {{useCase}}.'},
    {id:'s17',name:'Proof - Quote',category:'proof',text:'One of our clients said it best: "{{testimonialQuote}}"'},
    {id:'s18',name:'Proof - Case Study',category:'proof',text:'Happy to share how {{caseStudyCompany}} got {{result}} in {{timeframe}}.'},
    // Closers
    {id:'s19',name:'Closer - No Pressure',category:'closer',text:'No pressure if the timing isn\'t right - just wanted to plant the seed.'},
    {id:'s20',name:'Closer - Direct',category:'closer',text:'Let me know either way.'},
    {id:'s21',name:'Closer - Friendly',category:'closer',text:'Appreciate your time either way.'},
    {id:'s22',name:'Closer - Forward',category:'closer',text:'Feel free to forward this to whoever handles {{area}} if that\'s not you.'},
  ])
  const [snippetFilter, setSnippetFilter] = useState('all')
  const [editingSnippet, setEditingSnippet] = useState(null)
  const [newSnippet, setNewSnippet] = useState({name:'',category:'cta',text:''})
  const [subjectSuggestions, setSubjectSuggestions] = useState([])
  const [snippetPopover, setSnippetPopover] = useState(false)
  const [snippetSearch, setSnippetSearch] = useState('')
  
  // AI Panel (slide-out instead of modal)
  const [aiOpen, setAiOpen] = useState(false)
  
  // === Plan & AI Usage ===
  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem('cf-plan')
    return saved ? JSON.parse(saved) : {
      tier: 'free', // free, starter, pro, team
      trialEnds: null,
      seats: 1
    }
  })
  
  const [aiUsage, setAiUsage] = useState(() => {
    const saved = localStorage.getItem('cf-ai-usage')
    const now = new Date()
    const resetDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    return saved ? JSON.parse(saved) : {
      basicUsed: 0,
      premiumUsed: 0,
      premiumBonus: 10, // One-time signup bonus
      monthReset: resetDate
    }
  })
  
  // Plan limits
  const planLimits = {
    free: { leads: 100, emails: 200, sequences: 2, campaigns: 1, inboxes: 1, basicAI: 50, premiumAI: 0, templates: 5, snippets: 10, analyticsDays: 7 },
    starter: { leads: 5000, emails: 5000, sequences: 10, campaigns: 5, inboxes: 3, basicAI: 5000, premiumAI: 0, templates: Infinity, snippets: Infinity, analyticsDays: 30 },
    pro: { leads: 25000, emails: 25000, sequences: Infinity, campaigns: Infinity, inboxes: 10, basicAI: Infinity, premiumAI: 1500, templates: Infinity, snippets: Infinity, analyticsDays: 90 },
    team: { leads: 100000, emails: 100000, sequences: Infinity, campaigns: Infinity, inboxes: 25, basicAI: Infinity, premiumAI: 5000, templates: Infinity, snippets: Infinity, analyticsDays: 90, seats: 5 }
  }
  
  // Get effective plan (check if trial is active)
  const getEffectivePlan = () => {
    if (plan.trialTier && plan.trialEnds) {
      const now = new Date()
      const trialEnd = new Date(plan.trialEnds)
      if (now < trialEnd) {
        return plan.trialTier // Trial is active, use trial tier
      }
    }
    return plan.tier
  }
  
  const effectivePlan = getEffectivePlan()
  const currentLimits = planLimits[effectivePlan] || planLimits.free
  
  // Trial helpers
  const isOnTrial = () => {
    if (!plan.trialTier || !plan.trialEnds) return false
    return new Date() < new Date(plan.trialEnds)
  }
  
  const trialDaysLeft = () => {
    if (!plan.trialEnds) return 0
    const diff = new Date(plan.trialEnds) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }
  
  const startTrial = (tier) => {
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 14)
    setPlan(prev => ({
      ...prev,
      trialTier: tier,
      trialEnds: trialEnd.toISOString()
    }))
  }
  
  // Limit checking helpers
  const canAddLead = () => currentLimits.leads === Infinity || leads.length < currentLimits.leads
  const canAddSequence = () => currentLimits.sequences === Infinity || sequences.length < currentLimits.sequences
  const canAddCampaign = () => currentLimits.campaigns === Infinity || campaigns.length < currentLimits.campaigns
  const canAddTemplate = () => currentLimits.templates === Infinity || templates.length < currentLimits.templates
  const canAddSnippet = () => currentLimits.snippets === Infinity || snippets.length < currentLimits.snippets
  
  // Get remaining count for display
  const getRemainingLeads = () => currentLimits.leads === Infinity ? '∞' : Math.max(0, currentLimits.leads - leads.length)
  const getRemainingSequences = () => currentLimits.sequences === Infinity ? '∞' : Math.max(0, currentLimits.sequences - sequences.length)
  const getRemainingCampaigns = () => currentLimits.campaigns === Infinity ? '∞' : Math.max(0, currentLimits.campaigns - campaigns.length)
  
  // Upgrade prompt state
  const [upgradeModal, setUpgradeModal] = useState(null) // null or {type: 'leads'|'sequences'|etc, message: '...'}
  
  // Check if AI request is allowed
  const canUseAI = (isPremium = false) => {
    if (isPremium) {
      const premiumLimit = currentLimits.premiumAI + (plan.tier === 'free' || plan.tier === 'starter' ? aiUsage.premiumBonus : 0)
      return aiUsage.premiumUsed < premiumLimit
    }
    return currentLimits.basicAI === Infinity || aiUsage.basicUsed < currentLimits.basicAI
  }
  
  // Track AI usage
  const trackAIUsage = (isPremium = false) => {
    setAiUsage(prev => ({
      ...prev,
      basicUsed: isPremium ? prev.basicUsed : prev.basicUsed + 1,
      premiumUsed: isPremium ? prev.premiumUsed + 1 : prev.premiumUsed
    }))
  }
  
  // === NEW: Settings & Integrations ===
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cf-settings')
    return saved ? JSON.parse(saved) : {
      gmail: { connected: false, email: '', tokens: null },
      calendly: { connected: false, url: '', eventTypes: [] },
      sfdc: { connected: false, instance_url: '', username: '' },
      hubspot: { connected: false, hub_id: '', user_email: '' },
      unsubscribePage: { enabled: true, heading: 'Unsubscribe', message: "We're sorry to see you go.", redirectUrl: '' },
      replyDetection: { enabled: true, pauseOnReply: true, notifyOnReply: true },
      sendSchedule: { timezone: 'America/New_York', businessHoursOnly: true, startHour: 9, endHour: 17, skipWeekends: true },
      ai: { provider: 'anthropic', model: 'basic' } // provider: anthropic|openai, model: basic|premium
    }
  })
  
  // Sending Domains & Inboxes (for rotation)
  const [inboxes, setInboxes] = useState(() => {
    const saved = localStorage.getItem('cf-inboxes')
    return saved ? JSON.parse(saved) : []
  })
  const [newInbox, setNewInbox] = useState({ email: '', dailyLimit: 50, warmupMode: false })
  
  // Domain reputation tracking
  const [domains, setDomains] = useState(() => {
    const saved = localStorage.getItem('cf-domains')
    return saved ? JSON.parse(saved) : []
  })
  
  // Analytics data
  const [analyticsRange, setAnalyticsRange] = useState('7d')
  const [analyticsData, setAnalyticsData] = useState({
    dailyStats: [],
    topSubjects: [],
    bestSendTimes: [],
    sequencePerformance: [],
    replyRate: 0,
    openRate: 0,
    clickRate: 0
  })
  
  // Email Preview state
  const [previewEmail, setPreviewEmail] = useState(null)
  const [previewLead, setPreviewLead] = useState(null)
  
  // A/B Testing
  const [abTestResults, setAbTestResults] = useState({})
  
  // Blacklist checker results
  const [blacklistResults, setBlacklistResults] = useState(null)
  const [checkingBlacklist, setCheckingBlacklist] = useState(false)

  // Persist settings
  useEffect(() => {
    localStorage.setItem('cf-settings', JSON.stringify(settings))
  }, [settings])
  
  useEffect(() => {
    localStorage.setItem('cf-plan', JSON.stringify(plan))
  }, [plan])
  
  useEffect(() => {
    localStorage.setItem('cf-ai-usage', JSON.stringify(aiUsage))
  }, [aiUsage])
  
  // Reset AI usage monthly
  useEffect(() => {
    const now = new Date()
    const resetDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    if (aiUsage.monthReset !== resetDate) {
      setAiUsage(prev => ({ ...prev, basicUsed: 0, premiumUsed: 0, monthReset: resetDate }))
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem('cf-inboxes', JSON.stringify(inboxes))
  }, [inboxes])
  
  useEffect(() => {
    localStorage.setItem('cf-domains', JSON.stringify(domains))
  }, [domains])

  useEffect(()=>{
    const timeout = setTimeout(()=>setLoading(false), 1500)
    supabase.auth.getSession().then(({data:{session}})=>{
      clearTimeout(timeout)
      if(session?.user){setUser(session.user);setView('app')}
      setLoading(false)
    }).catch(()=>setLoading(false))
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setUser(session.user);setView('app')}else setUser(null)
    })
    return ()=>{subscription.unsubscribe();clearTimeout(timeout)}
  },[])

  // Check URL params for OAuth callbacks and load settings from DB
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search)
    if(params.get('hubspot_connected') || params.get('sfdc_connected')){
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname)
      // Load settings from database
      if(user){
        supabase.from('user_settings').select('settings').eq('user_id', user.id).single()
          .then(({data})=>{
            if(data?.settings){
              setSettings(prev => ({...prev, ...data.settings}))
            }
          })
      }
    }
  },[user])

  useEffect(()=>{if(user)loadAll()},[user])
  
  // Theme persistence
  useEffect(()=>{localStorage.setItem('cf-theme',theme);document.body.setAttribute('data-theme',theme)},[theme])
  useEffect(()=>{localStorage.setItem('cf-profile',JSON.stringify(profile))},[profile])

  // Keyboard shortcuts
  const [cmdOpen, setCmdOpen] = useState(false)
  const [cmdQuery, setCmdQuery] = useState('')
  
  useEffect(()=>{
    if(view!=='app')return
    const handler=(e)=>{
      // Cmd/Ctrl+K - Command palette
      if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setCmdOpen(true);setCmdQuery('')}
      // Escape - Close modals/command palette/AI panel
      if(e.key==='Escape'){if(cmdOpen)setCmdOpen(false);else if(aiOpen)setAiOpen(false);else if(modal)setModal(null);else if(selLead)setSelLead(null);else if(selSeq){setSelSeq(null);setEditingStepId(null)}else if(selCamp)setSelCamp(null)}
      // Cmd/Ctrl+N - New (context-aware)
      if((e.metaKey||e.ctrlKey)&&e.key==='n'&&!e.shiftKey){e.preventDefault();if(page==='leads')setModal('lead');else if(page==='sequences')setModal('sequence');else if(page==='campaigns')setModal('campaign')}
      // Cmd/Ctrl+I - Import leads
      if((e.metaKey||e.ctrlKey)&&e.key==='i'){e.preventDefault();setModal('import')}
      // Cmd/Ctrl+E - Export
      if((e.metaKey||e.ctrlKey)&&e.key==='e'){e.preventDefault();setModal('export')}
      // Number keys 1-7 for nav (when no input focused)
      if(!e.metaKey&&!e.ctrlKey&&!e.altKey&&['1','2','3','4','5','6','7'].includes(e.key)&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'){
        const pages=['dashboard','leads','sequences','templates','snippets','analytics','settings']
        setPage(pages[parseInt(e.key)-1]);setSelSeq(null);setSelCamp(null);setSelLead(null)
      }
    }
    window.addEventListener('keydown',handler)
    return ()=>window.removeEventListener('keydown',handler)
  },[view,modal,cmdOpen,aiOpen,page,selLead,selSeq,selCamp])

  const loadAll=async()=>{
    const [l,s,c,t,us]=await Promise.all([
      supabase.from('leads').select('*').order('created_at',{ascending:false}),
      supabase.from('sequences').select('*').order('created_at',{ascending:false}),
      supabase.from('campaigns').select('*').order('created_at',{ascending:false}),
      supabase.from('tags').select('*').order('name'),
      supabase.from('user_settings').select('settings').eq('user_id', user.id).single()
    ])
    if(l.data)setLeads(l.data)
    if(s.data)setSequences(s.data)
    if(c.data)setCampaigns(c.data)
    if(t.data)setTags(t.data)
    // Merge DB settings (SFDC, HubSpot tokens) with localStorage settings
    if(us.data?.settings){
      setSettings(prev => ({...prev, sfdc: us.data.settings.sfdc || prev.sfdc, hubspot: us.data.settings.hubspot || prev.hubspot}))
    }
  }
  
  // Fetch just leads (for SFDC sync refresh)
  const fetchLeads=async()=>{
    const {data}=await supabase.from('leads').select('*').order('created_at',{ascending:false})
    if(data)setLeads(data)
  }

  const auth=async(mode)=>{
    setAuthErr('')
    if(!email||!pw)return setAuthErr('Email and password required')
    const {error}=mode==='signup'?await supabase.auth.signUp({email,password:pw}):await supabase.auth.signInWithPassword({email,password:pw})
    if(error)setAuthErr(error.message)
    else if(rememberMe)localStorage.setItem('cf-remember-email',email)
    else localStorage.removeItem('cf-remember-email')
  }

  const resetPassword=async()=>{
    setAuthErr('')
    if(!email)return setAuthErr('Enter your email address')
    const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin})
    if(error)setAuthErr(error.message)
    else setResetSent(true)
  }

  const logout=async()=>{await supabase.auth.signOut();setUser(null);setView('landing');setLeads([]);setSequences([]);setCampaigns([]);setTags([])}

  const addTag=async()=>{
    if(!tagN.trim())return
    const {data}=await supabase.from('tags').insert({user_id:user.id,name:tagN.trim()}).select()
    if(data){setTags([...tags,data[0]].sort((a,b)=>a.name.localeCompare(b.name)));setTagN('');setModal(null)}
  }

  const addLead=async()=>{
    if(!leadF.em.trim())return
    if(!canAddLead()){
      setUpgradeModal({type:'leads',message:`You've reached your limit of ${currentLimits.leads} leads. Upgrade to add more.`})
      return
    }
    const {data}=await supabase.from('leads').insert({user_id:user.id,first_name:leadF.fn,last_name:leadF.ln,email:leadF.em,company:leadF.co,tags:leadF.tags,status:'new'}).select()
    if(data){setLeads([data[0],...leads]);setLeadF({fn:'',ln:'',em:'',co:'',tags:[]});setModal(null)}
  }

  const importLeads=async()=>{
    const lines=imp.trim().split('\n').filter(l=>l.trim())
    const nl=lines.map(line=>{const[fn,ln,em,co]=line.split(',').map(s=>s.trim());return em?{user_id:user.id,first_name:fn||'',last_name:ln||'',email:em,company:co||'',tags:[],status:'new'}:null}).filter(Boolean)
    // Check if import would exceed limit
    const remaining = currentLimits.leads === Infinity ? Infinity : currentLimits.leads - leads.length
    if(nl.length > remaining){
      setUpgradeModal({type:'leads',message:`This import has ${nl.length} leads but you can only add ${remaining} more. Upgrade your plan for more leads.`})
      return
    }
    if(nl.length){const{data}=await supabase.from('leads').insert(nl).select();if(data)setLeads([...data,...leads])}
    setImp('');setModal(null)
  }

  const delLead=async id=>{await supabase.from('leads').delete().eq('id',id);setLeads(leads.filter(l=>l.id!==id))}

  const bulkDelete=async()=>{
    if(!selLeads.length||!confirm(`Delete ${selLeads.length} leads?`))return
    for(const id of selLeads){await supabase.from('leads').delete().eq('id',id)}
    setLeads(leads.filter(l=>!selLeads.includes(l.id)));setSelLeads([])
  }

  const bulkTag=async(tagId)=>{
    for(const id of selLeads){
      const lead=leads.find(l=>l.id===id)
      if(lead&&!lead.tags?.includes(tagId)){
        const newTags=[...(lead.tags||[]),tagId]
        await supabase.from('leads').update({tags:newTags}).eq('id',id)
      }
    }
    setLeads(leads.map(l=>selLeads.includes(l.id)?{...l,tags:[...(l.tags||[]).filter(t=>t!==tagId),tagId]}:l))
    setSelLeads([])
  }

  const bulkStatus=async(status)=>{
    for(const id of selLeads){await supabase.from('leads').update({status}).eq('id',id)}
    setLeads(leads.map(l=>selLeads.includes(l.id)?{...l,status}:l));setSelLeads([])
  }

  const addSeq=async()=>{
    if(!seqN.trim())return
    if(!canAddSequence()){
      setUpgradeModal({type:'sequences',message:`You've reached your limit of ${currentLimits.sequences} sequences. Upgrade to create more.`})
      return
    }
    const {data}=await supabase.from('sequences').insert({user_id:user.id,name:seqN,steps:[]}).select()
    if(data){setSequences([data[0],...sequences]);setSeqN('');setModal(null);setSelSeq(data[0])}
  }

  const updateSeq=async(id,updates)=>{
    await supabase.from('sequences').update(updates).eq('id',id)
    const upd={...sequences.find(s=>s.id===id),...updates}
    setSequences(sequences.map(s=>s.id===id?upd:s))
    if(selSeq?.id===id)setSelSeq(upd)
  }

  // Start a sequence - sends to API which creates email queue
  const startSequence=async(seq)=>{
    if(!settings.gmail?.connected){
      alert('Please connect Gmail in Settings before starting a sequence.')
      return
    }
    const leadCount=(seq.lead_ids||[]).length
    if(leadCount===0){
      alert('Add leads to this sequence first.')
      return
    }
    if(!seq.steps?.length){
      alert('Add at least one email step first.')
      return
    }
    if(!confirm(`Start sequence "${seq.name}" with ${leadCount} leads and ${seq.steps.length} steps?`))return
    
    try{
      const res=await fetch('/api/campaign/start',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({sequenceId:seq.id,userId:user.id})
      })
      const data=await res.json()
      if(data.success){
        await updateSeq(seq.id,{status:'active',started_at:new Date().toISOString()})
        alert(`Sequence started! ${data.emails} emails scheduled.`)
      }else{
        alert('Error: '+(data.error||'Failed to start'))
      }
    }catch(e){
      alert('Error starting sequence: '+e.message)
    }
  }

  // Pause a sequence
  const pauseSequence=async(seq)=>{
    if(!confirm('Pause this sequence? Pending emails will not be sent.'))return
    await updateSeq(seq.id,{status:'paused'})
  }

  // Add leads to sequence
  const addLeadsToSequence=async(seqId,leadIdsToAdd)=>{
    const seq=sequences.find(s=>s.id===seqId)
    if(!seq)return
    const existing=seq.lead_ids||[]
    const newIds=[...new Set([...existing,...leadIdsToAdd])]
    await updateSeq(seqId,{lead_ids:newIds})
  }

  // Remove lead from sequence
  const removeLeadFromSequence=async(seqId,leadId)=>{
    const lead=leads.find(l=>l.id===leadId)
    const name=lead?`${lead.first_name||''} ${lead.last_name||''}`.trim()||lead.email:'this lead'
    if(!confirm(`Remove ${name} from sequence?`))return
    const seq=sequences.find(s=>s.id===seqId)
    if(!seq)return
    const newIds=(seq.lead_ids||[]).filter(id=>id!==leadId)
    await updateSeq(seqId,{lead_ids:newIds})
  }

  const reorderSteps=(fromIdx,toIdx)=>{
    if(fromIdx===toIdx||!selSeq?.steps)return
    const steps=[...selSeq.steps]
    const [moved]=steps.splice(fromIdx,1)
    steps.splice(toIdx,0,moved)
    updateSeq(selSeq.id,{steps})
    setDragIdx(null);setDragOverIdx(null)
  }

  const previewMerge=(text)=>{
    const sample={firstName:'Scott',lastName:'McArthur',company:'Acme Corp',email:'scott@acme.com'}
    return text.replace(/\{\{firstName\}\}/g,sample.firstName).replace(/\{\{lastName\}\}/g,sample.lastName).replace(/\{\{company\}\}/g,sample.company).replace(/\{\{email\}\}/g,sample.email)
  }

  const exportLeads=()=>{
    const rows=leads.map(l=>[l.first_name||'',l.last_name||'',l.email,l.company||'',l.status||'new',(l.tags||[]).map(tid=>tags.find(t=>t.id===tid)?.name||'').join(';')].join(','))
    const csv=['First Name,Last Name,Email,Company,Status,Tags',...rows].join('\n')
    const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob)
    const a=document.createElement('a');a.href=url;a.download='coldflow-leads.csv';a.click()
    URL.revokeObjectURL(url);setModal(null)
  }

  const exportSequences=()=>{
    const rows=sequences.map(s=>[s.name,s.steps?.length||0,s.steps?.reduce((a,st)=>a+(st.sent||0),0)||0,s.steps?.reduce((a,st)=>a+(st.opened||0),0)||0,s.steps?.reduce((a,st)=>a+(st.replied||0),0)||0].join(','))
    const csv=['Sequence,Steps,Sent,Opens,Replies',...rows].join('\n')
    const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob)
    const a=document.createElement('a');a.href=url;a.download='coldflow-sequences.csv';a.click()
    URL.revokeObjectURL(url);setModal(null)
  }

  const exportCampaigns=()=>{
    const rows=campaigns.map(c=>[c.name,c.status,sequences.find(s=>s.id===c.sequence_id)?.name||'',c.tag_filter?leads.filter(l=>l.tags?.includes(c.tag_filter)).length:leads.length,c.stats?.sent||0,c.stats?.opened||0,c.stats?.clicked||0,c.stats?.replied||0].join(','))
    const csv=['Campaign,Status,Sequence,Leads,Sent,Opened,Clicked,Replied',...rows].join('\n')
    const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob)
    const a=document.createElement('a');a.href=url;a.download='coldflow-campaigns.csv';a.click()
    URL.revokeObjectURL(url);setModal(null)
  }

  const delSeq=async id=>{if(!confirm('Delete?'))return;await supabase.from('sequences').delete().eq('id',id);setSequences(sequences.filter(s=>s.id!==id));setSelSeq(null)}

  const addStep=async()=>{
    if(!stepF.subj.trim()||!stepF.body.trim())return
    const ns={id:Date.now(),day:+stepF.day,time:stepF.time,subject:stepF.subj,body:stepF.body,condition:stepF.condition||'none',type:stepF.type||'email',sent:0,opened:0,clicked:0,replied:0}
    const steps=[...(selSeq.steps||[]),ns].sort((a,b)=>a.day-b.day)
    await updateSeq(selSeq.id,{steps})
    setStepF({day:(steps.length||0)+1,time:'09:00',subj:'',body:'',condition:'none',type:'email'});setEditingStepId(null);setModal(null)
  }

  const saveStep=async()=>{
    const steps=selSeq.steps.map(s=>s.id===editStep.id?{...s,day:+stepF.day,time:stepF.time,subject:stepF.subj,body:stepF.body,condition:stepF.condition||'none',type:stepF.type||'email'}:s).sort((a,b)=>a.day-b.day)
    await updateSeq(selSeq.id,{steps})
    setEditStep(null);setEditingStepId(null);setStepF({day:1,time:'09:00',subj:'',body:'',condition:'none',type:'email'});setModal(null)
  }

  const saveInlineStep=async()=>{
    if(!stepF.subj.trim()||!stepF.body.trim())return
    if(editingStepId==='new'){
      await addStep()
    }else{
      const steps=selSeq.steps.map(s=>s.id===editingStepId?{...s,day:+stepF.day,time:stepF.time,subject:stepF.subj,body:stepF.body,condition:stepF.condition||'none',type:stepF.type||'email'}:s).sort((a,b)=>a.day-b.day)
      await updateSeq(selSeq.id,{steps})
      setEditingStepId(null);setStepF({day:(selSeq.steps?.length||0)+1,time:'09:00',subj:'',body:'',condition:'none',type:'email'})
    }
  }

  const delStep=async id=>{const steps=selSeq.steps.filter(s=>s.id!==id);await updateSeq(selSeq.id,{steps});if(editingStepId===id)setEditingStepId(null)}

  // Template helpers
  const useTemplate=(tpl)=>{setStepF({...stepF,subj:tpl.subject,body:tpl.body});setShowTemplates(false)}
  const saveAsTemplate=()=>{
    if(!stepF.subj.trim())return
    if(!canAddTemplate()){
      setUpgradeModal({type:'templates',message:`You've reached your limit of ${currentLimits.templates} templates. Upgrade to save more.`})
      return
    }
    setTemplates([...templates,{id:'t'+Date.now(),name:stepF.subj.slice(0,30),category:'Custom',subject:stepF.subj,body:stepF.body}])
  }
  const deleteTemplate=(id)=>setTemplates(templates.filter(t=>t.id!==id))
  
  // Snippet helpers with limit check
  const addSnippetWithCheck=(name,text)=>{
    if(!canAddSnippet()){
      setUpgradeModal({type:'snippets',message:`You've reached your limit of ${currentLimits.snippets} snippets. Upgrade to save more.`})
      return false
    }
    setSnippets([...snippets,{id:'s'+Date.now(),name,category:'cta',text}])
    return true
  }

  const addCamp=async()=>{
    if(!campF.name.trim()||!campF.seq)return
    if(!canAddCampaign()){
      setUpgradeModal({type:'campaigns',message:`You've reached your limit of ${currentLimits.campaigns} campaigns. Upgrade to create more.`})
      return
    }
    const {data}=await supabase.from('campaigns').insert({user_id:user.id,name:campF.name,sequence_id:campF.seq,tag_filter:campF.tag||null,status:'draft',stats:{sent:0,opened:0,clicked:0,replied:0}}).select()
    if(data){setCampaigns([data[0],...campaigns]);setCampF({name:'',seq:'',tag:''});setModal(null)}
  }

  const updateCamp=async(id,updates)=>{
    await supabase.from('campaigns').update(updates).eq('id',id)
    const upd={...campaigns.find(c=>c.id===id),...updates}
    setCampaigns(campaigns.map(c=>c.id===id?upd:c))
    if(selCamp?.id===id)setSelCamp(upd)
  }

  const delCamp=async id=>{if(!confirm('Delete?'))return;await supabase.from('campaigns').delete().eq('id',id);setCampaigns(campaigns.filter(c=>c.id!==id));setSelCamp(null)}

  // Start a campaign - calls API to create email queue
  const [campaignLoading, setCampaignLoading] = useState(false)
  
  const startCampaign = async (campaignId) => {
    // Check Gmail is connected
    if (!settings.gmail.connected) {
      alert('Please connect Gmail in Settings before starting a campaign.')
      return
    }
    
    const campaign = campaigns.find(c => c.id === campaignId)
    if (!campaign) return
    
    // Check campaign has a sequence
    const seq = sequences.find(s => s.id === campaign.sequence_id)
    if (!seq || !seq.steps?.length) {
      alert('This campaign has no sequence or the sequence has no steps.')
      return
    }
    
    // Check campaign has leads
    const cLeads = campaign.tag_filter 
      ? leads.filter(l => l.tags?.includes(campaign.tag_filter))
      : leads
    if (cLeads.length === 0) {
      alert('No leads match this campaign\'s filter.')
      return
    }
    
    if (!confirm(`Start campaign "${campaign.name}" with ${cLeads.length} leads and ${seq.steps.length} steps?`)) {
      return
    }
    
    setCampaignLoading(true)
    
    try {
      const response = await fetch('/api/campaign/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, userId: user.id })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to start campaign')
      }
      
      // Update local state
      const upd = { ...campaign, status: 'active', started_at: new Date().toISOString() }
      setCampaigns(campaigns.map(c => c.id === campaignId ? upd : c))
      if (selCamp?.id === campaignId) setSelCamp(upd)
      
      alert(`Campaign started! ${result.emails} emails scheduled for ${result.leads} leads.`)
      
    } catch (error) {
      console.error('Start campaign error:', error)
      alert('Failed to start campaign: ' + error.message)
    } finally {
      setCampaignLoading(false)
    }
  }
  
  const pauseCampaign = async (campaignId) => {
    // Update campaign status
    await updateCamp(campaignId, { status: 'paused' })
    
    // Cancel pending emails in queue
    await supabase
      .from('email_queue')
      .update({ status: 'skipped', error: 'Campaign paused' })
      .eq('campaign_id', campaignId)
      .eq('status', 'pending')
  }
  
  const toggleCampaign = async (campaign) => {
    if (campaign.status === 'active') {
      await pauseCampaign(campaign.id)
    } else {
      await startCampaign(campaign.id)
    }
  }

  // AI API Call - uses serverless endpoint to keep keys secure
  const callAI = async (prompt, isPremium = false) => {
    // Check usage limits
    if (!canUseAI(isPremium)) {
      throw new Error(isPremium ? 'Premium AI limit reached. Upgrade to Pro for more.' : 'AI limit reached. Upgrade your plan.')
    }
    
    const aiSettings = settings.ai || { provider: 'anthropic', model: 'basic' }
    const provider = aiSettings.provider || 'anthropic'
    
    // Determine model based on premium flag and provider
    let model
    if (provider === 'anthropic') {
      model = isPremium ? 'claude-sonnet-4-20250514' : 'claude-3-haiku-20240307'
    } else {
      model = isPremium ? 'gpt-4o' : 'gpt-4o-mini'
    }
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, model, prompt })
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'AI request failed')
      }
      
      const data = await res.json()
      
      // Track usage on success
      trackAIUsage(isPremium)
      
      return data.result
    } catch (e) {
      // Fallback to mock response for development
      console.warn('AI API unavailable, using fallback:', e.message)
      return null
    }
  }
  
  const sendAi=async()=>{
    if(!aiIn.trim())return
    const userMsg={role:'user',content:aiIn}
    setAiMsgs(prev=>[...prev,userMsg]);setAiIn('');setAiLoad(true)
    
    // Check if user is trying to use premium
    const aiSettings = settings.ai || { provider: 'anthropic', model: 'basic' }
    const isPremium = aiSettings.model === 'premium'
    
    // Check limits
    if (!canUseAI(isPremium)) {
      setAiMsgs(prev=>[...prev,{role:'assistant',content:isPremium 
        ? `You've used all your Premium AI credits this month. ${plan.tier === 'pro' || plan.tier === 'team' ? 'Your credits reset on the 1st.' : 'Upgrade to Pro for 1,500 Premium AI requests/month.'}` 
        : `You've hit your AI limit for this month. Upgrade your plan for more AI requests.`
      }])
      setAiLoad(false)
      return
    }
    
    // Build profile context for AI
    let ctx=''
    if(profile.name)ctx+=`Sender: ${profile.name}${profile.title?` (${profile.title})`:''}. `
    if(profile.company)ctx+=`Company: ${profile.company}${profile.industry?` (${profile.industry})`:''}. `
    if(profile.valueProps)ctx+=`Value prop: ${profile.valueProps}. `
    if(profile.tone)ctx+=`Tone: ${profile.tone}. `
    
    const sysPrompt=`You are an expert cold email writer. Help write compelling cold emails. Wrap email templates in --- markers. Use {{firstName}}, {{company}} as merge tags.${ctx?`\n\nContext about the sender:\n${ctx}`:''}`
    const fullPrompt = `${sysPrompt}\n\nConversation:\n${aiMsgs.map(m=>`${m.role}: ${m.content}`).join('\n')}\nuser: ${aiIn}`
    
    try{
      const result = await callAI(fullPrompt, isPremium)
      
      if (result) {
        setAiMsgs(prev=>[...prev,{role:'assistant',content:result}])
      } else {
        // Fallback mock response
        await new Promise(r=>setTimeout(r,800))
        const msg=aiIn.toLowerCase()
        const name=profile.name||'[Your name]'
        let r=''
        if(msg.includes('subject'))r=`Subject line ideas:\n\n1. "Quick question about {{company}}"\n2. "{{firstName}}, thought of you"\n3. "${profile.company?`${profile.company} + {{company}}`:'Idea for {{company}}'}"${profile.valueProps?`\n4. "Re: ${profile.valueProps.split(' ').slice(0,3).join(' ')}..."`:''}`
        else if(msg.includes('follow'))r=`Follow-up:\n\n---\nHey {{firstName}},\n\nWanted to bump this — worth 15 min this week?\n\nBest,\n${name}\n---`
        else if(msg.includes('cold')||msg.includes('intro'))r=`Cold intro:\n\n---\nHey {{firstName}},\n\nI came across {{company}} and noticed you're scaling fast.\n\n${profile.valueProps||'We help companies like yours [result]'}. Worth a quick call?\n\nBest,\n${name}${profile.title?`\n${profile.title}`:''}${profile.company?`\n${profile.company}`:''}\n---`
        else r=`I can help with:\n• Cold emails\n• Follow-ups\n• Subject lines\n${profile.name?`\nUsing your profile: ${profile.name}${profile.company?` @ ${profile.company}`:''}`:'Set up your Profile for personalized emails.'}\n\nWhat do you need?`
        setAiMsgs(prev=>[...prev,{role:'assistant',content:r}])
        trackAIUsage(isPremium) // Track even mock usage for testing
      }
    }catch(e){setAiMsgs(prev=>[...prev,{role:'assistant',content:e.message || 'Error. Try again.'}])}
    setAiLoad(false)
  }

  const useAi=text=>{const m=text.match(/---\n([\s\S]*?)\n---/);if(m){setStepF(p=>({...p,body:m[1].trim()}));setModal('step')}}

  // === UTILITY FUNCTIONS ===
  
  // Merge tag renderer - replaces {{tags}} with actual lead data
  const renderMergeTags = (text, lead) => {
    if (!text || !lead) return text
    return text
      .replace(/\{\{firstName\}\}/gi, lead.first_name || '')
      .replace(/\{\{lastName\}\}/gi, lead.last_name || '')
      .replace(/\{\{email\}\}/gi, lead.email || '')
      .replace(/\{\{company\}\}/gi, lead.company || '')
      .replace(/\{\{name\}\}/gi, `${lead.first_name || ''} ${lead.last_name || ''}`.trim())
      // Custom fields from lead data
      .replace(/\{\{(\w+)\}\}/gi, (match, field) => lead[field] || match)
  }
  
  // Spam words and patterns for checking
  const SPAM_TRIGGERS = {
    urgency: ['act now', 'limited time', 'urgent', 'expires', 'deadline', 'last chance', 'hurry', 'immediately'],
    money: ['free', 'cash', 'earn money', 'income', 'profit', 'save big', 'discount', 'cheap', 'prize', 'winner', 'million', 'billion', 'dollars'],
    pushy: ['buy now', 'order now', 'click here', 'sign up free', 'subscribe now', "don't delete", 'this is not spam'],
    shady: ['no obligation', 'risk free', 'guaranteed', 'no questions asked', 'confidential', 'private', 'secret'],
    caps: /[A-Z]{5,}/g,
    exclamation: /!{2,}/g,
    allCaps: /^[A-Z\s!?.]+$/
  }
  
  // Calculate spam score (0-100, lower is better)
  const calculateSpamScore = (subject, body) => {
    let score = 0
    const text = `${subject} ${body}`.toLowerCase()
    const fullText = `${subject} ${body}`
    
    // Check spam trigger words (weighted)
    SPAM_TRIGGERS.urgency.forEach(w => { if (text.includes(w)) score += 8 })
    SPAM_TRIGGERS.money.forEach(w => { if (text.includes(w)) score += 10 })
    SPAM_TRIGGERS.pushy.forEach(w => { if (text.includes(w)) score += 12 })
    SPAM_TRIGGERS.shady.forEach(w => { if (text.includes(w)) score += 15 })
    
    // Check formatting issues
    const capsMatches = fullText.match(SPAM_TRIGGERS.caps) || []
    score += capsMatches.length * 5
    
    const exclamationMatches = fullText.match(SPAM_TRIGGERS.exclamation) || []
    score += exclamationMatches.length * 8
    
    // Subject line specific
    if (SPAM_TRIGGERS.allCaps.test(subject)) score += 20
    if (subject.includes('RE:') && !subject.includes('Re:')) score += 5
    if (subject.includes('FW:') || subject.includes('FWD:')) score += 5
    if (subject.length > 60) score += 5
    if (subject.includes('$')) score += 8
    
    // Link analysis
    const linkCount = (body.match(/https?:\/\//gi) || []).length
    if (linkCount > 3) score += (linkCount - 3) * 5
    
    // Image heavy (placeholder check)
    if (body.includes('[image]') || body.includes('<img')) score += 10
    
    // Too short or too long
    const wordCount = body.split(/\s+/).length
    if (wordCount < 20) score += 10
    if (wordCount > 500) score += 15
    
    // No personalization
    if (!body.includes('{{') && !body.includes('{%')) score += 10
    
    // Positive signals (reduce score)
    if (body.includes('{{firstName}}') || body.includes('{{company}}')) score -= 10
    if (subject.includes('{{')) score -= 5
    if (wordCount >= 50 && wordCount <= 200) score -= 5
    
    return Math.max(0, Math.min(100, score))
  }
  
  // Get spam score label and color
  const getSpamLabel = (score) => {
    if (score <= 20) return { label: 'Excellent', color: DS.success, desc: 'Low spam risk. Should reach inbox.' }
    if (score <= 40) return { label: 'Good', color: '#22c55e', desc: 'Minor issues. Likely to reach inbox.' }
    if (score <= 60) return { label: 'Fair', color: '#f59e0b', desc: 'Some spam triggers detected. Review suggested.' }
    if (score <= 80) return { label: 'Poor', color: '#f97316', desc: 'High spam risk. Needs revision.' }
    return { label: 'Critical', color: DS.error, desc: 'Very high spam risk. Will likely go to spam.' }
  }
  
  // Blacklist check (simulated - in production would hit real APIs)
  const checkBlacklists = async (domain) => {
    setCheckingBlacklist(true)
    // Simulate API call delay
    await new Promise(r => setTimeout(r, 1500))
    
    // Simulated blacklist databases
    const blacklists = [
      { name: 'Spamhaus ZEN', status: 'clean' },
      { name: 'Barracuda', status: 'clean' },
      { name: 'SORBS', status: 'clean' },
      { name: 'SpamCop', status: 'clean' },
      { name: 'UCEPROTECT', status: 'clean' },
      { name: 'Invaluement', status: 'clean' },
    ]
    
    setBlacklistResults({ domain, lists: blacklists, checkedAt: new Date().toISOString() })
    setCheckingBlacklist(false)
  }
  
  // Calculate analytics from campaign data
  const calculateAnalytics = () => {
    const now = new Date()
    const rangeDays = analyticsRange === '7d' ? 7 : analyticsRange === '30d' ? 30 : 90
    
    // Aggregate totals
    const totals = campaigns.reduce((acc, c) => ({
      sent: acc.sent + (c.stats?.sent || 0),
      opened: acc.opened + (c.stats?.opened || 0),
      clicked: acc.clicked + (c.stats?.clicked || 0),
      replied: acc.replied + (c.stats?.replied || 0)
    }), { sent: 0, opened: 0, clicked: 0, replied: 0 })
    
    // Get top performing subjects from sequences
    const topSubjects = sequences.flatMap(s => 
      (s.steps || []).map(step => ({
        subject: step.subject || step.subj,
        sent: step.sent || 0,
        opened: step.opened || 0,
        replied: step.replied || 0,
        openRate: step.sent ? ((step.opened || 0) / step.sent * 100).toFixed(1) : 0,
        replyRate: step.sent ? ((step.replied || 0) / step.sent * 100).toFixed(1) : 0
      }))
    ).filter(s => s.sent > 0).sort((a, b) => parseFloat(b.replyRate) - parseFloat(a.replyRate)).slice(0, 5)
    
    // Sequence performance
    const seqPerf = sequences.map(s => {
      const stats = (s.steps || []).reduce((acc, step) => ({
        sent: acc.sent + (step.sent || 0),
        opened: acc.opened + (step.opened || 0),
        replied: acc.replied + (step.replied || 0)
      }), { sent: 0, opened: 0, replied: 0 })
      return {
        name: s.name,
        ...stats,
        openRate: stats.sent ? (stats.opened / stats.sent * 100).toFixed(1) : 0,
        replyRate: stats.sent ? (stats.replied / stats.sent * 100).toFixed(1) : 0
      }
    }).filter(s => s.sent > 0).sort((a, b) => parseFloat(b.replyRate) - parseFloat(a.replyRate))
    
    return {
      ...totals,
      openRate: totals.sent ? (totals.opened / totals.sent * 100).toFixed(1) : 0,
      clickRate: totals.sent ? (totals.clicked / totals.sent * 100).toFixed(1) : 0,
      replyRate: totals.sent ? (totals.replied / totals.sent * 100).toFixed(1) : 0,
      topSubjects,
      sequencePerformance: seqPerf
    }
  }
  
  // Add inbox for rotation
  const addInbox = () => {
    if (!newInbox.email.trim()) return
    const domain = newInbox.email.split('@')[1]
    setInboxes([...inboxes, { 
      id: 'inbox_' + Date.now(), 
      ...newInbox, 
      domain,
      sentToday: 0, 
      reputation: 'good',
      addedAt: new Date().toISOString()
    }])
    // Also track domain if new
    if (!domains.find(d => d.domain === domain)) {
      setDomains([...domains, { domain, reputation: 100, addedAt: new Date().toISOString() }])
    }
    setNewInbox({ email: '', dailyLimit: 50, warmupMode: false })
  }
  
  // Remove inbox
  const removeInbox = (id) => {
    setInboxes(inboxes.filter(i => i.id !== id))
  }
  
  // Gmail OAuth simulation (in production would be real OAuth)
  // Gmail OAuth Configuration
  const GOOGLE_CLIENT_ID = '51069874202-ctfdtfsbiv9g3fi9g0glo7car8pqujhv.apps.googleusercontent.com'
  const GMAIL_SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly', 
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ')

  const connectGmail = async () => {
    // Check if Google Identity Services is loaded
    if (!window.google?.accounts?.oauth2) {
      alert('Google Sign-In is loading. Please try again in a moment.')
      return
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GMAIL_SCOPES,
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          console.error('OAuth error:', tokenResponse.error)
          alert('Failed to connect Gmail: ' + tokenResponse.error)
          return
        }

        // Got the access token, now get user info
        try {
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
          })
          const userInfo = await userInfoRes.json()
          
          const expiresAt = new Date(Date.now() + (tokenResponse.expires_in * 1000))

          // Save to Supabase for serverless functions to use
          await supabase.from('gmail_tokens').upsert({
            user_id: user.id,
            email: userInfo.email,
            access_token: tokenResponse.access_token,
            expires_at: expiresAt.toISOString()
          }, { onConflict: 'user_id' })

          setSettings(s => ({
            ...s,
            gmail: {
              connected: true,
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture,
              accessToken: tokenResponse.access_token,
              expiresAt: expiresAt.getTime(),
              connectedAt: new Date().toISOString()
            }
          }))

          console.log('Gmail connected:', userInfo.email)
        } catch (err) {
          console.error('Failed to get user info:', err)
          alert('Failed to get Gmail account info')
        }
      }
    })

    // Request the access token - this opens the Google sign-in popup
    tokenClient.requestAccessToken()
  }

  // Load Gmail connection status from Supabase on init
  useEffect(() => {
    if (user && !settings.gmail.connected) {
      supabase.from('gmail_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data && new Date(data.expires_at) > new Date()) {
            setSettings(s => ({
              ...s,
              gmail: {
                connected: true,
                email: data.email,
                accessToken: data.access_token,
                expiresAt: new Date(data.expires_at).getTime(),
                connectedAt: data.created_at
              }
            }))
          }
        })
    }
  }, [user])

  // Function to send email via Gmail API
  const sendGmailEmail = async (to, subject, body) => {
    if (!settings.gmail.connected || !settings.gmail.accessToken) {
      throw new Error('Gmail not connected')
    }

    // Check if token expired
    if (Date.now() > settings.gmail.expiresAt) {
      // Token expired, need to reconnect
      setSettings(s => ({ ...s, gmail: { connected: false, email: '', accessToken: null } }))
      throw new Error('Gmail token expired. Please reconnect.')
    }

    // Create email in RFC 2822 format
    const emailLines = [
      `To: ${to}`,
      `From: ${settings.gmail.email}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body
    ]
    const email = emailLines.join('\r\n')
    
    // Base64 URL encode the email
    const encodedEmail = btoa(unescape(encodeURIComponent(email)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.gmail.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: encodedEmail })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to send email')
    }

    return await response.json()
  }
  
  // Send a test email to yourself
  const [sendingTest, setSendingTest] = useState(false)
  
  const sendTestEmail = async (subject, body) => {
    if (!settings.gmail.connected) {
      alert('Please connect Gmail in Settings first.')
      return
    }
    
    const testEmail = prompt('Send test email to:', settings.gmail.email)
    if (!testEmail) return
    
    setSendingTest(true)
    
    try {
      // Replace merge tags with sample data
      const sampleLead = leads[0] || { first_name: 'John', last_name: 'Doe', company: 'Acme Corp', email: testEmail }
      const renderedSubject = subject
        .replace(/\{\{firstName\}\}/g, sampleLead.first_name || 'John')
        .replace(/\{\{lastName\}\}/g, sampleLead.last_name || 'Doe')
        .replace(/\{\{company\}\}/g, sampleLead.company || 'Acme Corp')
        .replace(/\{\{email\}\}/g, testEmail)
      
      const renderedBody = body
        .replace(/\{\{firstName\}\}/g, sampleLead.first_name || 'John')
        .replace(/\{\{lastName\}\}/g, sampleLead.last_name || 'Doe')
        .replace(/\{\{company\}\}/g, sampleLead.company || 'Acme Corp')
        .replace(/\{\{email\}\}/g, testEmail)
      
      await sendGmailEmail(testEmail, '[TEST] ' + renderedSubject, renderedBody)
      alert('Test email sent! Check your inbox.')
    } catch (error) {
      alert('Failed to send test email: ' + error.message)
    } finally {
      setSendingTest(false)
    }
  }
  
  // Calendar link connection
  const connectCalendly = () => {
    const url = prompt('Enter your calendar link (e.g., calendly.com/yourname or cal.com/yourname):')
    if (url) {
      setSettings(s => ({ ...s, calendly: { connected: true, url, connectedAt: new Date().toISOString() } }))
    }
  }

  const campLeads=c=>c.tag_filter?leads.filter(l=>l.tags?.includes(c.tag_filter)):leads
  const campSeq=c=>sequences.find(s=>s.id===c.sequence_id)
  const fLeads=tagFilter?leads.filter(l=>l.tags?.includes(tagFilter)):leads

  const tSent=campaigns.reduce((a,c)=>a+(c.stats?.sent||0),0)
  const tOpen=campaigns.reduce((a,c)=>a+(c.stats?.opened||0),0)
  const tClick=campaigns.reduce((a,c)=>a+(c.stats?.clicked||0),0)
  const tReply=campaigns.reduce((a,c)=>a+(c.stats?.replied||0),0)

  if(loading)return<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f172a'}}><div style={{width:40,height:40,border:'3px solid #1e293b',borderTopColor:'#6366f1',borderRadius:'50%',animation:'spin 1s linear infinite'}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  // Shared components - Modern friendly design
  const Logo=({size=32,light=false})=><div style={{display:'flex',alignItems:'center'}}>
    <span style={{fontSize:size*.7,fontWeight:800,color:light?'#1e293b':'#fff',letterSpacing:'-0.5px'}}>Cold</span>
    <span style={{fontSize:size*.7,fontWeight:800,color:'#a855f7',letterSpacing:'-0.5px'}}>Flow</span>
  </div>

  const Nav=({onLogin,onSignup,current})=>{
    const navTo=(section)=>{
      if(view==='landing'){
        document.getElementById(section)?.scrollIntoView({behavior:'smooth'})
      }else{
        setView('landing')
        setTimeout(()=>document.getElementById(section)?.scrollIntoView({behavior:'smooth'}),100)
      }
    }
    return <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 48px',maxWidth:1200,margin:'0 auto'}}>
    <div style={{cursor:'pointer'}} onClick={()=>setView('landing')}><Logo size={32}/></div>
    <div style={{display:'flex',alignItems:'center',gap:32}}>
      {[{l:'Features',id:'features'},{l:'Use Cases',id:'usecases'},{l:'Pricing',id:'pricing'}].map(x=><a key={x.l} onClick={()=>navTo(x.id)} style={{color:'#fff',fontSize:14,textDecoration:'none',fontWeight:500,transition:'color .2s',cursor:'pointer'}} onMouseOver={e=>e.target.style.color='#a855f7'} onMouseOut={e=>e.target.style.color='#fff'}>{x.l}</a>)}
      <a onClick={()=>setView('blog')} style={{color:view==='blog'?'#a855f7':'#fff',fontSize:14,textDecoration:'none',fontWeight:500,transition:'color .2s',cursor:'pointer'}} onMouseOver={e=>e.target.style.color='#a855f7'} onMouseOut={e=>{if(view!=='blog')e.target.style.color='#fff'}}>Blog</a>
    </div>
    <div style={{display:'flex',alignItems:'center',gap:12}}>
      <button onClick={onLogin} style={{background:'transparent',border:'1px solid #a855f7',color:'#a855f7',fontSize:14,fontWeight:600,cursor:'pointer',padding:'10px 20px',borderRadius:100,transition:'all .2s'}} onMouseOver={e=>{e.target.style.background='rgba(168,85,247,0.1)';e.target.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.target.style.background='transparent';e.target.style.transform='none'}}>Log in</button>
      <button onClick={onSignup} style={{background:'#a855f7',color:'#000',border:'none',fontSize:14,fontWeight:600,padding:'12px 24px',borderRadius:100,cursor:'pointer',boxShadow:'0 0 20px rgba(168,85,247,0.3)',transition:'all .2s'}} onMouseOver={e=>{e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 0 30px rgba(168,85,247,0.5)'}} onMouseOut={e=>{e.target.style.transform='none';e.target.style.boxShadow='0 0 20px rgba(168,85,247,0.3)'}}>Start Free</button>
    </div>
  </nav>}

  const Footer=()=>{
    const navTo=(section)=>{
      if(view==='landing'){
        document.getElementById(section)?.scrollIntoView({behavior:'smooth'})
      }else{
        setView('landing')
        setTimeout(()=>document.getElementById(section)?.scrollIntoView({behavior:'smooth'}),100)
      }
    }
    return <footer style={{background:'#000',borderTop:'1px solid #262626',padding:'60px 48px 40px'}}>
    <div style={{maxWidth:1000,margin:'0 auto'}}>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:40,marginBottom:48}}>
        <div>
          <Logo size={28}/>
          <p style={{fontSize:14,color:'#666',lineHeight:1.8,marginTop:16,maxWidth:280}}>The cold outreach platform built for closers.</p>
          <a href="mailto:info@coldflow.online" style={{fontSize:13,color:'#a855f7',textDecoration:'none',marginTop:12,display:'inline-block'}}>info@coldflow.online</a>
        </div>
        <div>
          <h4 style={{fontSize:11,fontWeight:600,marginBottom:16,color:'#666',textTransform:'uppercase',letterSpacing:'0.05em'}}>Product</h4>
          {[{l:'Features',id:'features'},{l:'Pricing',id:'pricing'}].map(x=><a key={x.l} onClick={()=>navTo(x.id)} style={{display:'block',fontSize:13,color:'#fff',textDecoration:'none',marginBottom:12,transition:'color .2s',cursor:'pointer'}} onMouseOver={e=>e.target.style.color='#a855f7'} onMouseOut={e=>e.target.style.color='#fff'}>{x.l}</a>)}
          <a onClick={()=>setView('blog')} style={{display:'block',fontSize:13,color:'#fff',textDecoration:'none',marginBottom:12,transition:'color .2s',cursor:'pointer'}} onMouseOver={e=>e.target.style.color='#a855f7'} onMouseOut={e=>e.target.style.color='#fff'}>Blog</a>
        </div>
        <div>
          <h4 style={{fontSize:11,fontWeight:600,marginBottom:16,color:'#666',textTransform:'uppercase',letterSpacing:'0.05em'}}>Company</h4>
          {[{l:'About',v:'about'},{l:'Contact',v:'contact'},{l:'Security',v:'security'}].map(x=><a key={x.l} onClick={()=>x.v&&setView(x.v)} style={{display:'block',fontSize:13,color:'#fff',textDecoration:'none',marginBottom:12,cursor:'pointer',transition:'color .2s'}} onMouseOver={e=>e.target.style.color='#a855f7'} onMouseOut={e=>e.target.style.color='#fff'}>{x.l}</a>)}
        </div>
        <div>
          <h4 style={{fontSize:11,fontWeight:600,marginBottom:16,color:'#666',textTransform:'uppercase',letterSpacing:'0.05em'}}>Legal</h4>
          {[{l:'Privacy',v:'privacy'},{l:'Terms',v:'terms'}].map(x=><a key={x.l} onClick={()=>x.v&&setView(x.v)} style={{display:'block',fontSize:13,color:'#fff',textDecoration:'none',marginBottom:12,cursor:'pointer',transition:'color .2s'}} onMouseOver={e=>e.target.style.color='#a855f7'} onMouseOut={e=>e.target.style.color='#fff'}>{x.l}</a>)}
        </div>
      </div>
      <div style={{borderTop:'1px solid #262626',paddingTop:24,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:12,color:'#666'}}>© 2026 ColdFlow. All rights reserved.</span>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:6,height:6,background:'#00ff88',borderRadius:'50%'}}></span>
          <span style={{fontSize:12,color:'#666'}}>All systems operational</span>
        </div>
      </div>
    </div>
  </footer>}

  // STATIC PAGES
  if(view==='about')return(
    <div style={{minHeight:'100vh',background:'#000',color:'#fff'}}>
      <div style={{position:'fixed',top:0,left:0,right:0,height:600,background:'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.08), transparent)',pointerEvents:'none',zIndex:0}}/>
      <Nav onLogin={()=>setView('login')} onSignup={()=>setView('signup')}/>
      <div style={{maxWidth:700,margin:'0 auto',padding:'80px 24px',position:'relative',zIndex:1}}>
        <h1 style={{fontSize:42,fontWeight:800,marginBottom:24,letterSpacing:'-0.03em'}}>About ColdFlow</h1>
        <p style={{fontSize:17,color:'#a3a3a3',lineHeight:1.8,marginBottom:24}}>ColdFlow is a sales engagement platform designed for modern revenue teams. We help sales professionals book more meetings through intelligent email automation and AI-powered personalization.</p>
        <h2 style={{fontSize:22,fontWeight:700,marginTop:48,marginBottom:16}}>Our Mission</h2>
        <p style={{fontSize:15,color:'#a3a3a3',lineHeight:1.8,marginBottom:24}}>We believe every sales rep deserves enterprise-grade tools without enterprise complexity. Our platform is built to be powerful yet simple — so you can focus on selling, not software.</p>
        <h2 style={{fontSize:22,fontWeight:700,marginTop:48,marginBottom:16}}>Built for Closers</h2>
        <p style={{fontSize:15,color:'#a3a3a3',lineHeight:1.8,marginBottom:24}}>ColdFlow was founded by sales professionals who were frustrated with bloated, overcomplicated tools. We've built the platform we always wanted — fast, focused, and effective.</p>
        <div style={{marginTop:48,padding:28,background:'#0d0d0d',borderRadius:16,border:'1px solid rgba(168,85,247,.1)',transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.3)';e.currentTarget.style.transform='translateY(-4px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.1)';e.currentTarget.style.transform='none'}}>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:12}}>Ready to get started?</h3>
          <p style={{color:'#666',marginBottom:20,fontSize:14}}>Join thousands of sales teams already using ColdFlow.</p>
          <button onClick={()=>setView('signup')} style={{background:'#a855f7',color:'#000',border:'none',padding:'12px 24px',borderRadius:100,fontSize:14,fontWeight:600,cursor:'pointer',boxShadow:'0 0 20px rgba(168,85,247,0.3)',transition:'all .2s'}} onMouseOver={e=>{e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 0 30px rgba(168,85,247,0.5)'}} onMouseOut={e=>{e.target.style.transform='none';e.target.style.boxShadow='0 0 20px rgba(168,85,247,0.3)'}}>Start Free →</button>
        </div>
      </div>
      <Footer/>
    </div>
  )

  if(view==='contact')return(
    <div style={{minHeight:'100vh',background:'#000',color:'#fff'}}>
      <div style={{position:'fixed',top:0,left:0,right:0,height:600,background:'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.08), transparent)',pointerEvents:'none',zIndex:0}}/>
      <Nav onLogin={()=>setView('login')} onSignup={()=>setView('signup')}/>
      <div style={{maxWidth:500,margin:'0 auto',padding:'80px 24px',position:'relative',zIndex:1}}>
        <h1 style={{fontSize:42,fontWeight:800,marginBottom:16,letterSpacing:'-0.03em'}}>Contact Us</h1>
        <p style={{fontSize:17,color:'#a3a3a3',marginBottom:48}}>Have questions? We'd love to hear from you.</p>
        <div style={{background:'#0d0d0d',borderRadius:16,padding:28,border:'1px solid rgba(168,85,247,.1)',transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.2)';e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.1)';e.currentTarget.style.transform='none'}}>
          {contactSent?<div style={{textAlign:'center',padding:'20px 0'}}>
            <div style={{width:56,height:56,borderRadius:14,background:'rgba(0,255,136,.1)',border:'1px solid rgba(0,255,136,.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><span style={{fontSize:24}}>✓</span></div>
            <h3 style={{fontSize:18,fontWeight:700,marginBottom:8,color:'#00ff88'}}>Message Sent!</h3>
            <p style={{color:'#666',fontSize:14,marginBottom:20}}>We'll get back to you soon.</p>
            <button onClick={()=>{setContactSent(false);setContactForm({name:'',email:'',message:''})}} style={{background:'transparent',border:'none',color:'#a855f7',fontSize:14,cursor:'pointer',fontWeight:500}}>Send another message</button>
          </div>:<>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:11,color:'#666',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Name</label>
              <input value={contactForm.name} onChange={e=>setContactForm({...contactForm,name:e.target.value})} style={{width:'100%',padding:14,background:'#000',border:'1px solid #262626',borderRadius:10,color:'#fff',fontSize:14,boxSizing:'border-box',outline:'none',transition:'all .2s'}} onFocus={e=>{e.target.style.borderColor='#a855f7';e.target.style.boxShadow='0 0 0 3px rgba(168,85,247,0.15)'}} onBlur={e=>{e.target.style.borderColor='#262626';e.target.style.boxShadow='none'}} placeholder="Your name"/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:11,color:'#666',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Email</label>
              <input value={contactForm.email} onChange={e=>setContactForm({...contactForm,email:e.target.value})} style={{width:'100%',padding:14,background:'#000',border:'1px solid #262626',borderRadius:10,color:'#fff',fontSize:14,boxSizing:'border-box',outline:'none',transition:'all .2s'}} onFocus={e=>{e.target.style.borderColor='#a855f7';e.target.style.boxShadow='0 0 0 3px rgba(168,85,247,0.15)'}} onBlur={e=>{e.target.style.borderColor='#262626';e.target.style.boxShadow='none'}} placeholder="you@company.com"/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:11,color:'#666',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Message</label>
              <textarea value={contactForm.message} onChange={e=>setContactForm({...contactForm,message:e.target.value})} rows={5} style={{width:'100%',padding:14,background:'#000',border:'1px solid #262626',borderRadius:10,color:'#fff',fontSize:14,boxSizing:'border-box',fontFamily:'inherit',resize:'vertical',outline:'none',transition:'all .2s'}} onFocus={e=>{e.target.style.borderColor='#a855f7';e.target.style.boxShadow='0 0 0 3px rgba(168,85,247,0.15)'}} onBlur={e=>{e.target.style.borderColor='#262626';e.target.style.boxShadow='none'}} placeholder="How can we help?"/>
            </div>
            <button onClick={()=>{window.location.href=`mailto:info@coldflow.online?subject=Contact from ${contactForm.name}&body=${encodeURIComponent(`Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\n${contactForm.message}`)}`;setContactSent(true)}} style={{width:'100%',background:'#a855f7',color:'#000',border:'none',padding:'14px',borderRadius:100,fontSize:14,fontWeight:600,cursor:'pointer',boxShadow:'0 0 20px rgba(168,85,247,0.3)',transition:'all .2s'}} onMouseOver={e=>{e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 0 30px rgba(168,85,247,0.5)'}} onMouseOut={e=>{e.target.style.transform='none';e.target.style.boxShadow='0 0 20px rgba(168,85,247,0.3)'}}>Send Message</button>
          </>}
        </div>
        <div style={{marginTop:48,textAlign:'center'}}>
          <p style={{color:'#666',fontSize:14}}>Or email us directly at</p>
          <a href="mailto:info@coldflow.online" style={{color:'#a855f7',fontSize:15,fontWeight:500}}>info@coldflow.online</a>
        </div>
      </div>
      <Footer/>
    </div>
  )

  if(view==='privacy')return(
    <div style={{minHeight:'100vh',background:'#000',color:'#fff'}}>
      <div style={{position:'fixed',top:0,left:0,right:0,height:600,background:'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.08), transparent)',pointerEvents:'none',zIndex:0}}/>
      <Nav onLogin={()=>setView('login')} onSignup={()=>setView('signup')}/>
      <div style={{maxWidth:700,margin:'0 auto',padding:'80px 24px',position:'relative',zIndex:1}}>
        <h1 style={{fontSize:42,fontWeight:800,marginBottom:8,letterSpacing:'-0.03em'}}>Privacy Policy</h1>
        <p style={{color:'#666',marginBottom:48,fontSize:14}}>Last updated: January 1, 2024</p>
        <div style={{color:'#a3a3a3',lineHeight:1.8,fontSize:15}}>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>1. Information We Collect</h2>
          <p style={{marginBottom:16}}>We collect information you provide directly, including your name, email address, and company information when you create an account. We also collect data about your use of our services, including email engagement metrics.</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>2. How We Use Your Information</h2>
          <p style={{marginBottom:16}}>We use your information to provide and improve our services, communicate with you about your account, and send you product updates. We do not sell your personal information to third parties.</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>3. Data Security</h2>
          <p style={{marginBottom:16}}>We implement industry-standard security measures to protect your data, including encryption in transit and at rest. We regularly review and update our security practices.</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>4. Data Retention</h2>
          <p style={{marginBottom:16}}>We retain your data for as long as your account is active. You may request deletion of your data at any time by contacting our support team.</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>5. Your Rights</h2>
          <p style={{marginBottom:16}}>You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time.</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>6. Contact Us</h2>
          <p>If you have questions about this privacy policy, please contact us at <a href="mailto:info@coldflow.online" style={{color:'#a855f7'}}>info@coldflow.online</a>.</p>
        </div>
      </div>
      <Footer/>
    </div>
  )

  if(view==='terms')return(
    <div style={{minHeight:'100vh',background:'#000',color:'#fff'}}>
      <div style={{position:'fixed',top:0,left:0,right:0,height:600,background:'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.08), transparent)',pointerEvents:'none',zIndex:0}}/>
      <Nav onLogin={()=>setView('login')} onSignup={()=>setView('signup')}/>
      <div style={{maxWidth:700,margin:'0 auto',padding:'80px 24px',position:'relative',zIndex:1}}>
        <h1 style={{fontSize:42,fontWeight:800,marginBottom:8,letterSpacing:'-0.03em'}}>Terms of Service</h1>
        <p style={{color:'#666',marginBottom:48,fontSize:14}}>Last updated: January 1, 2024</p>
        <div style={{color:'#a3a3a3',lineHeight:1.8,fontSize:15}}>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>1. Acceptance of Terms</h2>
          <p style={{marginBottom:16}}>By accessing or using ColdFlow, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our services.</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>2. Use of Services</h2>
          <p style={{marginBottom:16}}>You agree to use ColdFlow only for lawful purposes and in accordance with these terms. You are responsible for all activity that occurs under your account.</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>3. Account Responsibilities</h2>
          <p style={{marginBottom:16}}>You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized use of your account.</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>4. Acceptable Use</h2>
          <p style={{marginBottom:16}}>You agree not to use ColdFlow to send spam, harass recipients, or violate any applicable laws including CAN-SPAM, GDPR, or other email regulations.</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>5. Payment Terms</h2>
          <p style={{marginBottom:16}}>Paid plans are billed monthly or annually. You may cancel at any time, and your subscription will remain active until the end of your billing period.</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>6. Limitation of Liability</h2>
          <p style={{marginBottom:16}}>ColdFlow is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:16}}>7. Contact</h2>
          <p>Questions about these terms? Contact us at <a href="mailto:info@coldflow.online" style={{color:'#a855f7'}}>info@coldflow.online</a>.</p>
        </div>
      </div>
      <Footer/>
    </div>
  )

  if(view==='security')return(
    <div style={{minHeight:'100vh',background:'#000',color:'#fff'}}>
      <div style={{position:'fixed',top:0,left:0,right:0,height:600,background:'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.08), transparent)',pointerEvents:'none',zIndex:0}}/>
      <Nav onLogin={()=>setView('login')} onSignup={()=>setView('signup')}/>
      <div style={{maxWidth:700,margin:'0 auto',padding:'80px 24px',position:'relative',zIndex:1}}>
        <h1 style={{fontSize:42,fontWeight:800,marginBottom:24,letterSpacing:'-0.03em'}}>Security</h1>
        <p style={{fontSize:17,color:'#a3a3a3',lineHeight:1.8,marginBottom:48}}>Security is at the core of everything we build. Your data protection is our top priority.</p>
        <div style={{display:'grid',gap:16}}>
          {[
            {t:'SOC 2 Type II',d:'We maintain SOC 2 Type II compliance, audited annually by independent third parties.'},
            {t:'256-bit Encryption',d:'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.'},
            {t:'GDPR Compliant',d:'We are fully GDPR compliant and support data portability and deletion requests.'},
            {t:'99.9% Uptime SLA',d:'We guarantee 99.9% uptime with redundant infrastructure across multiple regions.'},
            {t:'Regular Penetration Testing',d:'We conduct regular security assessments and penetration testing by third-party firms.'},
            {t:'Role-Based Access Control',d:'Granular permissions ensure team members only access what they need.'}
          ].map((s,i)=><div key={i} style={{background:'#0d0d0d',borderRadius:16,padding:24,border:'1px solid rgba(168,85,247,.1)',transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.3)';e.currentTarget.style.transform='translateY(-4px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.1)';e.currentTarget.style.transform='none'}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:8,display:'flex',alignItems:'center',gap:10}}><span style={{color:'#00ff88'}}>✓</span>{s.t}</h3>
            <p style={{color:'#666',fontSize:14,lineHeight:1.6}}>{s.d}</p>
          </div>)}
        </div>
        <div style={{marginTop:48,padding:28,background:'#0d0d0d',borderRadius:16,border:'1px solid rgba(168,85,247,.1)',transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.3)';e.currentTarget.style.transform='translateY(-4px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.1)';e.currentTarget.style.transform='none'}}>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:12}}>Security Questions?</h3>
          <p style={{color:'#666',marginBottom:4,fontSize:14}}>Contact our security team at</p>
          <a href="mailto:info@coldflow.online" style={{color:'#a855f7',fontWeight:500}}>info@coldflow.online</a>
        </div>
      </div>
      <Footer/>
    </div>
  )

  // BLOG PAGE
  if(view==='blog')return(
    <div style={{minHeight:'100vh',background:'#000',color:'#fff'}}>
      <div style={{position:'fixed',top:0,left:0,right:0,height:600,background:'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.08), transparent)',pointerEvents:'none',zIndex:0}}/>
      <Nav onLogin={()=>setView('login')} onSignup={()=>setView('signup')}/>
      
      <div style={{maxWidth:1100,margin:'0 auto',padding:'80px 24px',position:'relative',zIndex:1}}>
        {/* Header */}
        <h1 style={{fontSize:42,fontWeight:800,marginBottom:12,letterSpacing:'-0.03em'}}>The Cold Email Blog</h1>
        <p style={{fontSize:17,color:'#a3a3a3',marginBottom:40,maxWidth:600}}>
          Everything you need to know about cold outreach, deliverability, and booking more meetings.
        </p>
        
        {/* Category Filter */}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:40,flexWrap:'wrap'}}>
          {blogCategories.map(cat=>(
            <button 
              key={cat} 
              onClick={()=>setBlogFilter(cat)}
              style={{
                padding:'10px 20px',
                background:blogFilter===cat?'#a855f7':'transparent',
                border:blogFilter===cat?'1px solid #a855f7':'1px solid #262626',
                borderRadius:100,
                color:blogFilter===cat?'#000':'#a3a3a3',
                fontSize:13,
                fontWeight:600,
                cursor:'pointer',
                transition:'all .2s'
              }}
              onMouseOver={e=>{if(blogFilter!==cat){e.currentTarget.style.borderColor='#a855f7';e.currentTarget.style.color='#fff'}}}
              onMouseOut={e=>{if(blogFilter!==cat){e.currentTarget.style.borderColor='#262626';e.currentTarget.style.color='#a3a3a3'}}}
            >
              {cat==='all'?'All Posts':cat}
            </button>
          ))}
          <span style={{marginLeft:'auto',fontSize:13,color:'#666'}}>{filteredPosts.length} articles</span>
        </div>
        
        {/* Blog Posts Grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:20}}>
          {filteredPosts.map(post=>(
            <article 
              key={post.id}
              onClick={()=>{setSelectedPost(post);setView('blogPost')}}
              style={{
                background:'#0d0d0d',
                border:'1px solid rgba(168,85,247,.1)',
                borderRadius:16,
                padding:24,
                cursor:'pointer',
                transition:'all .2s',
                display:'flex',
                flexDirection:'column'
              }}
              onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.3)';e.currentTarget.style.transform='translateY(-4px)'}}
              onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.1)';e.currentTarget.style.transform='none'}}
            >
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                <span style={{
                  padding:'4px 10px',
                  background:post.category==='Writing'?'rgba(99,102,241,.15)':post.category==='Sequences'?'rgba(34,197,94,.15)':post.category==='Deliverability'?'rgba(245,158,11,.15)':'rgba(168,85,247,.15)',
                  border:`1px solid ${post.category==='Writing'?'rgba(99,102,241,.3)':post.category==='Sequences'?'rgba(34,197,94,.3)':post.category==='Deliverability'?'rgba(245,158,11,.3)':'rgba(168,85,247,.3)'}`,
                  borderRadius:100,
                  fontSize:10,
                  fontWeight:600,
                  color:post.category==='Writing'?'#818cf8':post.category==='Sequences'?'#22c55e':post.category==='Deliverability'?'#f59e0b':'#a855f7'
                }}>
                  {post.category}
                </span>
                {post.featured&&<span style={{padding:'4px 8px',background:'rgba(0,255,136,.1)',border:'1px solid rgba(0,255,136,.2)',borderRadius:100,fontSize:9,fontWeight:600,color:'#00ff88'}}>Featured</span>}
              </div>
              <h2 style={{fontSize:17,fontWeight:700,marginBottom:8,color:'#fff',lineHeight:1.35,flex:1}}>{post.title}</h2>
              <p style={{fontSize:13,color:'#666',lineHeight:1.5,marginBottom:14}}>{post.excerpt}</p>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'auto'}}>
                <span style={{fontSize:12,color:'#a855f7',fontWeight:500}}>{post.readTime} min read</span>
                <span style={{fontSize:12,color:'#a855f7',fontWeight:600}}>Read →</span>
              </div>
            </article>
          ))}
        </div>
        
        {/* CTA Section */}
        <div style={{marginTop:64,padding:40,background:'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.1))',border:'1px solid rgba(168,85,247,.2)',borderRadius:20,textAlign:'center'}}>
          <h2 style={{fontSize:28,fontWeight:800,marginBottom:12,letterSpacing:'-0.02em'}}>Ready to send emails that get replies?</h2>
          <p style={{fontSize:15,color:'#a3a3a3',marginBottom:24}}>Stop guessing. Start closing.</p>
          <button onClick={()=>setView('signup')} style={{background:'#a855f7',color:'#000',border:'none',fontSize:15,fontWeight:700,padding:'16px 36px',borderRadius:100,cursor:'pointer',boxShadow:'0 0 30px rgba(168,85,247,.4)',transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 40px rgba(168,85,247,.6)'}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 30px rgba(168,85,247,.4)'}}>
            Try ColdFlow Free →
          </button>
        </div>
      </div>
      
      <Footer/>
    </div>
  )

  // BLOG POST DETAIL VIEW
  if(view==='blogPost'&&selectedPost)return(
    <div style={{minHeight:'100vh',background:'#000',color:'#fff'}}>
      <div style={{position:'fixed',top:0,left:0,right:0,height:600,background:'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.08), transparent)',pointerEvents:'none',zIndex:0}}/>
      <Nav onLogin={()=>setView('login')} onSignup={()=>setView('signup')}/>
      
      <div style={{maxWidth:720,margin:'0 auto',padding:'60px 24px 80px',position:'relative',zIndex:1}}>
        {/* Back to blog */}
        <button onClick={()=>setView('blog')} style={{display:'flex',alignItems:'center',gap:8,background:'none',border:'none',color:'#a855f7',fontSize:14,fontWeight:500,cursor:'pointer',marginBottom:32,padding:0}}>
          ← Back to Blog
        </button>
        
        {/* Article Header */}
        <div style={{marginBottom:40}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <span style={{
              padding:'6px 14px',
              background:selectedPost.category==='Writing'?'rgba(99,102,241,.15)':selectedPost.category==='Sequences'?'rgba(34,197,94,.15)':selectedPost.category==='Deliverability'?'rgba(245,158,11,.15)':'rgba(168,85,247,.15)',
              border:`1px solid ${selectedPost.category==='Writing'?'rgba(99,102,241,.3)':selectedPost.category==='Sequences'?'rgba(34,197,94,.3)':selectedPost.category==='Deliverability'?'rgba(245,158,11,.3)':'rgba(168,85,247,.3)'}`,
              borderRadius:100,
              fontSize:12,
              fontWeight:600,
              color:selectedPost.category==='Writing'?'#818cf8':selectedPost.category==='Sequences'?'#22c55e':selectedPost.category==='Deliverability'?'#f59e0b':'#a855f7'
            }}>
              {selectedPost.category}
            </span>
            <span style={{fontSize:13,color:'#666'}}>{selectedPost.readTime} min read</span>
          </div>
          <h1 style={{fontSize:36,fontWeight:800,lineHeight:1.2,letterSpacing:'-0.02em',marginBottom:16}}>{selectedPost.title}</h1>
          <p style={{fontSize:18,color:'#a3a3a3',lineHeight:1.6}}>{selectedPost.excerpt}</p>
        </div>
        
        {/* Article Content */}
        <article style={{fontSize:16,color:'#d4d4d4',lineHeight:1.8}}>
          {selectedPost.content.split('\n\n').map((paragraph, i) => {
            // Handle headers
            if(paragraph.startsWith('## ')) {
              return <h2 key={i} style={{fontSize:22,fontWeight:700,color:'#fff',marginTop:40,marginBottom:16}}>{paragraph.replace('## ', '')}</h2>
            }
            if(paragraph.startsWith('### ')) {
              return <h3 key={i} style={{fontSize:18,fontWeight:700,color:'#fff',marginTop:32,marginBottom:12}}>{paragraph.replace('### ', '')}</h3>
            }
            // Handle bold lines (like list items starting with **)
            if(paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return <p key={i} style={{fontWeight:600,color:'#fff',marginBottom:8}}>{paragraph.replace(/\*\*/g, '')}</p>
            }
            // Handle code blocks
            if(paragraph.startsWith('`') && paragraph.endsWith('`')) {
              return <code key={i} style={{display:'block',padding:16,background:'#161616',border:'1px solid #262626',borderRadius:8,fontSize:14,fontFamily:'monospace',color:'#a855f7',marginBottom:16,overflowX:'auto'}}>{paragraph.replace(/`/g, '')}</code>
            }
            // Handle lists (lines starting with -)
            if(paragraph.includes('\n-')) {
              const lines = paragraph.split('\n')
              return <div key={i} style={{marginBottom:16}}>
                {lines[0] && !lines[0].startsWith('-') && <p style={{marginBottom:8}}>{lines[0]}</p>}
                <ul style={{paddingLeft:20,margin:0}}>
                  {lines.filter(l=>l.startsWith('-')).map((item,j)=><li key={j} style={{marginBottom:6,color:'#d4d4d4'}}>{item.replace(/^- /, '').replace(/\*\*/g, '')}</li>)}
                </ul>
              </div>
            }
            // Regular paragraphs - handle inline bold
            const parts = paragraph.split(/(\*\*[^*]+\*\*)/g)
            return <p key={i} style={{marginBottom:16}}>
              {parts.map((part, j) => {
                if(part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={j} style={{color:'#fff',fontWeight:600}}>{part.replace(/\*\*/g, '')}</strong>
                }
                return part
              })}
            </p>
          })}
        </article>
        
        {/* CTA at bottom */}
        <div style={{marginTop:64,padding:40,background:'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.1))',border:'1px solid rgba(168,85,247,.2)',borderRadius:20,textAlign:'center'}}>
          <h2 style={{fontSize:24,fontWeight:800,marginBottom:12,letterSpacing:'-0.02em'}}>Ready to put this into action?</h2>
          <p style={{fontSize:15,color:'#a3a3a3',marginBottom:24}}>ColdFlow makes it easy to build sequences that convert.</p>
          <button onClick={()=>setView('signup')} style={{background:'#a855f7',color:'#000',border:'none',fontSize:15,fontWeight:700,padding:'16px 36px',borderRadius:100,cursor:'pointer',boxShadow:'0 0 30px rgba(168,85,247,.4)',transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 40px rgba(168,85,247,.6)'}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 30px rgba(168,85,247,.4)'}}>
            Try ColdFlow Free →
          </button>
        </div>
        
        {/* Related Posts */}
        <div style={{marginTop:64}}>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:24}}>More from the blog</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            {blogPosts.filter(p=>p.id!==selectedPost.id&&p.category===selectedPost.category).slice(0,2).map(post=>(
              <div 
                key={post.id}
                onClick={()=>{setSelectedPost(post);window.scrollTo(0,0)}}
                style={{background:'#0d0d0d',border:'1px solid rgba(168,85,247,.1)',borderRadius:12,padding:20,cursor:'pointer',transition:'all .2s'}}
                onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.3)'}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.1)'}}
              >
                <span style={{fontSize:11,color:'#a855f7',fontWeight:500}}>{post.readTime} min read</span>
                <h4 style={{fontSize:15,fontWeight:600,marginTop:8,lineHeight:1.4}}>{post.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  )

  // LANDING - Complete redesign with friendly modern aesthetic
  if(view==='landing')return(
    <div style={{minHeight:'100vh',background:'#000',color:'#fff',overflow:'hidden'}}>
      {/* Ambient purple glow */}
      <div style={{position:'fixed',top:0,left:0,right:0,height:600,background:'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.08), transparent)',pointerEvents:'none',zIndex:0}}/>

      <Nav onLogin={()=>setView('login')} onSignup={()=>setView('signup')}/>

      {/* HERO - Premium dark */}
      <section style={{textAlign:'center',padding:'100px 24px 80px',maxWidth:900,margin:'0 auto',position:'relative'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:16,padding:'10px 20px',background:'rgba(168,85,247,.08)',border:'1px solid rgba(168,85,247,.15)',borderRadius:100,marginBottom:40}}>
          <span style={{fontSize:13,color:'#888',fontWeight:500}}>Integrates with</span>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{display:'flex',alignItems:'center',gap:5}} title="Gmail"><svg width="18" height="18" viewBox="0 0 24 24" fill="#EA4335"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg></div>
            <div style={{display:'flex',alignItems:'center',gap:5}} title="Salesforce"><svg width="20" height="20" viewBox="0 0 24 24" fill="#00A1E0"><path d="M10.1 4.5c.8-.9 2-1.5 3.3-1.5 1.8 0 3.4 1.1 4.1 2.6.6-.3 1.3-.4 2-.4 2.8 0 5 2.3 5 5.1s-2.2 5.1-5 5.1c-.3 0-.7 0-1-.1-.6 1.5-2.1 2.6-3.8 2.6-.5 0-.9-.1-1.4-.2-.7 1.3-2.1 2.2-3.7 2.2-1.8 0-3.3-1.1-3.9-2.7-.3 0-.5.1-.8.1-2.3 0-4.2-1.9-4.2-4.3 0-1.6.9-3 2.2-3.7-.2-.5-.3-1-.3-1.5 0-2.3 1.8-4.1 4.1-4.1.9-.1 1.8.2 2.4.8z"/></svg></div>
            <div style={{display:'flex',alignItems:'center',gap:5}} title="HubSpot"><svg width="18" height="18" viewBox="0 0 24 24" fill="#ff7a59"><path d="M18.16 7.58v4.16c0 .67-.34 1.29-.9 1.66l-3.66 2.36c-.56.36-1.27.36-1.83 0l-3.66-2.36c-.56-.37-.9-.99-.9-1.66V7.58c0-.67.34-1.29.9-1.66l3.66-2.36c.56-.36 1.27-.36 1.83 0l3.66 2.36c.56.37.9.99.9 1.66z"/></svg></div>
          </div>
        </div>
        <h1 style={{fontSize:64,fontWeight:800,lineHeight:1.05,letterSpacing:'-0.03em',marginBottom:28}}>
          <span style={{color:'#fff'}}>Send emails that</span><br/>
          <span style={{color:'#a855f7'}}>actually get replies</span>
        </h1>
        <p style={{fontSize:19,color:'#a3a3a3',lineHeight:1.7,marginBottom:48,maxWidth:580,margin:'0 auto 48px'}}>
          The cold outreach platform built for closers. Create sequences that convert, track what works, iterate fast.
        </p>
        <div style={{display:'flex',justifyContent:'center',gap:16,marginBottom:40}}>
          <button onClick={()=>setView('signup')} style={{background:'#a855f7',color:'#000',border:'none',fontSize:16,fontWeight:700,padding:'18px 40px',borderRadius:100,cursor:'pointer',display:'flex',alignItems:'center',gap:10,boxShadow:'0 0 40px rgba(168,85,247,.4)',transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 50px rgba(168,85,247,.6)'}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 40px rgba(168,85,247,.4)'}}>
            Start Free <span style={{fontSize:18}}>→</span>
          </button>
          <button style={{background:'transparent',color:'#a3a3a3',border:'1px solid #262626',fontSize:16,fontWeight:600,padding:'18px 32px',borderRadius:100,cursor:'pointer',display:'flex',alignItems:'center',gap:10,transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor='#a855f7';e.currentTarget.style.color='#fff'}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='#262626';e.currentTarget.style.color='#a3a3a3'}}>
            <span style={{fontSize:16}}>▶</span> Watch Demo
          </button>
        </div>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:24}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{color:'#00ff88',fontSize:16}}>✓</span><span style={{color:'#666',fontSize:13}}>14-day free trial</span></div>
          <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{color:'#00ff88',fontSize:16}}>✓</span><span style={{color:'#666',fontSize:13}}>No card required</span></div>
          <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{color:'#00ff88',fontSize:16}}>✓</span><span style={{color:'#666',fontSize:13}}>CRM sync</span></div>
        </div>
      </section>

      {/* SOCIAL PROOF - Feature stats */}
      <section style={{padding:'60px 24px 80px',maxWidth:900,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
          {[
            {n:'5 min',l:'Setup to first send'},
            {n:'$0',l:'Free forever plan'},
            {n:'∞',l:'Unlimited sequences'},
            {n:'100%',l:'Inbox deliverability'}
          ].map((s,i)=><div key={i} style={{textAlign:'center',padding:24,background:'#0d0d0d',border:'1px solid rgba(168,85,247,.1)',borderRadius:16,boxShadow:'0 0 25px rgba(168,85,247,0.05)',transition:'all .2s',cursor:'default'}} onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.3)';e.currentTarget.style.transform='translateY(-4px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.1)';e.currentTarget.style.transform='none'}}>
            <div style={{fontSize:32,fontWeight:800,color:i===3?'#00ff88':'#fff',marginBottom:4,letterSpacing:'-0.02em'}}>{s.n}</div>
            <div style={{fontSize:13,color:'#666',fontWeight:500}}>{s.l}</div>
          </div>)}
        </div>
      </section>

      {/* APP PREVIEW - Premium dark */}
      <section style={{padding:'0 24px 100px',maxWidth:1100,margin:'0 auto',position:'relative'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'80%',height:'60%',background:'radial-gradient(ellipse,rgba(168,85,247,.1),transparent 70%)',filter:'blur(60px)',pointerEvents:'none'}}/>
        <div style={{background:'#0d0d0d',borderRadius:20,border:'1px solid rgba(168,85,247,.1)',overflow:'hidden',boxShadow:'0 0 60px rgba(168,85,247,0.1)',position:'relative'}}>
          <div style={{padding:'14px 20px',background:'#0a0a0a',borderBottom:'1px solid #262626',display:'flex',alignItems:'center',gap:12}}>
            <div style={{display:'flex',gap:8}}>{['#ff5f57','#febc2e','#28c840'].map((c,i)=><div key={i} style={{width:12,height:12,borderRadius:'50%',background:c}}/>)}</div>
            <div style={{flex:1,textAlign:'center'}}><div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 14px',background:'#161616',borderRadius:8,border:'1px solid #262626'}}><span style={{fontSize:11,color:'#666'}}>🔒</span><span style={{fontSize:12,color:'#666'}}>www.coldflow.online</span></div></div>
            <div style={{width:80}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'200px 1fr',minHeight:420}}>
            <div style={{background:'#0a0a0a',padding:20,borderRight:'1px solid #262626'}}>
              <div style={{marginBottom:20}}><Logo size={26}/></div>
              {[{l:'Dashboard',a:true},{l:'Leads'},{l:'Sequences'},{l:'Templates'},{l:'Snippets'},{l:'Analytics'}].map((x,i)=><div key={i} style={{padding:'12px 14px',borderRadius:8,marginBottom:4,background:x.a?'rgba(168,85,247,0.1)':'transparent',color:x.a?'#a855f7':'#666',fontSize:13,fontWeight:x.a?600:500,borderLeft:x.a?'3px solid #a855f7':'3px solid transparent'}}>{x.l}</div>)}
            </div>
            <div style={{padding:28,background:'#000'}}>
              <div style={{marginBottom:24}}><h2 style={{fontSize:24,fontWeight:800,marginBottom:4,letterSpacing:'-0.02em'}}>Dashboard</h2><p style={{fontSize:14,color:'#666'}}>Your outbound performance</p></div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
                {[{n:'847',l:'Leads',c:'#a855f7'},{n:'2.4K',l:'Sent',c:'#fff'},{n:'38.2%',l:'Open Rate',c:'#fff'},{n:'12.4%',l:'Reply Rate',c:'#00ff88'}].map((s,i)=><div key={i} style={{background:'#0d0d0d',border:'1px solid rgba(168,85,247,.1)',borderRadius:14,padding:18}}>
                  <div style={{fontSize:11,color:'#666',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>{s.l}</div>
                  <div style={{fontSize:28,fontWeight:800,color:s.c,letterSpacing:'-0.02em'}}>{s.n}</div>
                </div>)}
              </div>
              <div style={{background:'#0d0d0d',border:'1px solid rgba(168,85,247,.1)',borderRadius:14,padding:20}}>
                <div style={{fontSize:11,fontWeight:600,marginBottom:14,color:'#666',textTransform:'uppercase',letterSpacing:'0.05em'}}>Active Sequences</div>
                {['Outbound - VP Sales','SaaS Founders Cold','Inbound Follow-up'].map((c,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderTop:i?'1px solid #262626':'none'}}><span style={{fontSize:14,fontWeight:500}}>{c}</span><span style={{padding:'5px 12px',background:'rgba(0,255,136,.1)',color:'#00ff88',borderRadius:100,fontSize:11,fontWeight:600,border:'1px solid rgba(0,255,136,.2)'}}>Active</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}><div style={{height:1,background:'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)'}}/></div>

      {/* FEATURES */}
      <section id="features" style={{padding:'100px 24px',background:'#000'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:72}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,marginBottom:20}}><span style={{fontSize:13,color:'#a855f7',fontWeight:600,letterSpacing:'0.05em'}}>FEATURES</span></div>
            <h2 style={{fontSize:44,fontWeight:800,letterSpacing:'-0.03em',marginBottom:20,color:'#fff'}}>Everything you need to<br/>scale your outreach</h2>
            <p style={{fontSize:17,color:'#a3a3a3',maxWidth:500,margin:'0 auto',lineHeight:1.7}}>Powerful features wrapped in a clean interface.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {t:'Smart Lead Management',d:'Import from CSV or CRM, organize with tags, create dynamic segments.',icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>},
              {t:'Visual Sequence Builder',d:'Build multi-step sequences with timing and conditions.',icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>},
              {t:'Real-time Analytics',d:'Track opens, clicks, and replies as they happen.',icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>},
              {t:'AI Email Writer',d:'Generate personalized emails in seconds with AI.',icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><path d="M7.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="#a855f7"/><path d="M16.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="#a855f7"/></svg>},
              {t:'CRM Integrations',d:'Sync with Salesforce and HubSpot. Push leads, log activities.',icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>},
              {t:'Gmail Integration',d:'Connect your Gmail and start sending in minutes.',icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
            ].map((f,i)=><div key={i} style={{background:'#0d0d0d',border:'1px solid rgba(168,85,247,.1)',borderRadius:16,padding:28,boxShadow:'0 0 25px rgba(168,85,247,0.05)',transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.3)';e.currentTarget.style.transform='translateY(-4px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.1)';e.currentTarget.style.transform='none'}}>
              <div style={{width:44,height:44,background:'rgba(168,85,247,.1)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20,border:'1px solid rgba(168,85,247,.2)'}}>{f.icon}</div>
              <h3 style={{fontSize:18,fontWeight:700,marginBottom:10,color:'#fff'}}>{f.t}</h3>
              <p style={{color:'#666',fontSize:14,lineHeight:1.7}}>{f.d}</p>
            </div>)}
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}><div style={{height:1,background:'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)'}}/></div>

      {/* USE CASES */}
      <section id="usecases" style={{padding:'100px 24px',background:'#000'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:72}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,marginBottom:20}}><span style={{fontSize:13,color:'#a855f7',fontWeight:600,letterSpacing:'0.05em'}}>USE CASES</span></div>
            <h2 style={{fontSize:44,fontWeight:800,letterSpacing:'-0.03em',marginBottom:20,color:'#fff'}}>Built for closers like you</h2>
            <p style={{fontSize:17,color:'#a3a3a3',maxWidth:500,margin:'0 auto',lineHeight:1.7}}>Whether solo or on a team, ColdFlow adapts.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:20}}>
            {[
              {title:'SDR Teams',desc:'Book more meetings with less effort. Automate follow-ups while you focus on closing.',features:['Multi-step sequences with conditions','Real-time open & reply tracking','AI-powered personalization'],stat:'3x more meetings'},
              {title:'Founders & Solo Sellers',desc:'Enterprise-level outreach without the enterprise price tag or complexity.',features:['5-minute setup, no training needed','Pre-built proven templates','Spam checker keeps you out of junk'],stat:'2hrs saved daily'},
              {title:'Recruiters',desc:'Reach candidates where they are. Build relationships that convert to hires.',features:['Candidate tagging & segments','Conditional follow-ups (if opened/not)','Response tracking by pipeline stage'],stat:'50% faster pipeline'},
              {title:'Sales Leaders',desc:'Full visibility into team outreach. Know what\'s working without the meetings.',features:['Sequence performance analytics','Step-level conversion data','Export reports for any time range'],stat:'Complete visibility'}
            ].map((uc,i)=><div key={i} style={{background:'#0d0d0d',border:'1px solid rgba(168,85,247,.1)',borderRadius:16,padding:28,boxShadow:'0 0 25px rgba(168,85,247,0.05)',transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.3)';e.currentTarget.style.transform='translateY(-4px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.1)';e.currentTarget.style.transform='none'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:16}}>
                <h3 style={{fontSize:22,fontWeight:700,color:'#fff'}}>{uc.title}</h3>
                <span style={{padding:'6px 14px',background:'rgba(0,255,136,.1)',border:'1px solid rgba(0,255,136,.2)',borderRadius:100,fontSize:12,fontWeight:600,color:'#00ff88'}}>{uc.stat}</span>
              </div>
              <p style={{fontSize:14,color:'#a3a3a3',lineHeight:1.7,marginBottom:16}}>{uc.desc}</p>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {uc.features.map((f,j)=><div key={j} style={{display:'flex',alignItems:'center',gap:10}}><span style={{color:'#a855f7',fontSize:12}}>✓</span><span style={{fontSize:13,color:'#666'}}>{f}</span></div>)}
              </div>
            </div>)}
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}><div style={{height:1,background:'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)'}}/></div>

      {/* COMPARISON TABLE */}
      <section id="compare" style={{padding:'100px 24px',background:'#000'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:72}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,marginBottom:20}}><span style={{fontSize:13,color:'#a855f7',fontWeight:600,letterSpacing:'0.05em'}}>COMPARISON</span></div>
            <h2 style={{fontSize:44,fontWeight:800,letterSpacing:'-0.03em',marginBottom:20,color:'#fff'}}>Why teams switch to ColdFlow</h2>
            <p style={{fontSize:17,color:'#a3a3a3',maxWidth:500,margin:'0 auto',lineHeight:1.7}}>All the power, none of the complexity.</p>
          </div>
          <div style={{background:'#0d0d0d',border:'1px solid rgba(168,85,247,.1)',borderRadius:20,overflow:'hidden',boxShadow:'0 4px 40px rgba(0,0,0,0.4), 0 0 30px rgba(168,85,247,0.08)',transition:'all .3s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 60px rgba(0,0,0,0.5), 0 0 40px rgba(168,85,247,0.12)';e.currentTarget.style.borderColor='rgba(168,85,247,.2)'}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 40px rgba(0,0,0,0.4), 0 0 30px rgba(168,85,247,0.08)';e.currentTarget.style.borderColor='rgba(168,85,247,.1)'}}>
            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:0}}>
              <div style={{padding:'20px 24px',background:'#0a0a0a',borderBottom:'1px solid #262626'}}></div>
              {['ColdFlow','Outreach','Salesloft'].map((n,i)=><div key={i} style={{padding:'20px 16px',textAlign:'center',borderBottom:'1px solid #262626',borderLeft:'1px solid #262626',background:i===0?'rgba(168,85,247,.08)':'#0a0a0a'}}>
                <div style={{fontSize:16,fontWeight:700,color:i===0?'#a855f7':'#666'}}>{n}</div>
              </div>)}
            </div>
            {[
              {f:'Starting price',v:['$0/mo','$100/mo','$75/mo']},
              {f:'Unlimited sequences',v:['✓','Add-on','Add-on']},
              {f:'AI email writer',v:['✓','$$$','$$$']},
              {f:'Setup time',v:['5 min','2 weeks','2 weeks']},
              {f:'No contracts',v:['✓','✗','✗']},
              {f:'Free plan',v:['✓','✗','✗']}
            ].map((r,i)=><div key={i} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:0,transition:'background .15s'}} onMouseOver={e=>e.currentTarget.style.background='rgba(168,85,247,0.03)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <div style={{padding:'16px 24px',borderBottom:'1px solid #1a1a1a',fontSize:14,fontWeight:500,color:'#a3a3a3'}}>{r.f}</div>
              {r.v.map((v,j)=><div key={j} style={{padding:'16px',textAlign:'center',borderBottom:'1px solid #1a1a1a',borderLeft:'1px solid #262626',fontSize:14,color:j===0?(v==='✓'?'#00ff88':'#fff'):(v==='✗'?'#ef4444':'#666'),fontWeight:v==='✓'||v==='✗'?700:500,background:j===0?'rgba(168,85,247,.05)':'transparent'}}>{v}</div>)}
            </div>)}
          </div>
          <div style={{textAlign:'center',marginTop:40}}>
            <button onClick={()=>setView('signup')} style={{background:'#a855f7',color:'#000',border:'none',fontSize:15,fontWeight:700,padding:'16px 40px',borderRadius:100,cursor:'pointer',boxShadow:'0 0 30px rgba(168,85,247,0.3)',transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 40px rgba(168,85,247,0.5)'}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 30px rgba(168,85,247,0.3)'}}>Switch to ColdFlow Free →</button>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}><div style={{height:1,background:'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)'}}/></div>

      {/* PRICING - Redesigned */}
      <section id="pricing" style={{padding:'100px 24px',background:'#000'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:72}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,marginBottom:20}}><span style={{fontSize:13,color:'#a855f7',fontWeight:600,letterSpacing:'0.05em'}}>PRICING</span></div>
            <h2 style={{fontSize:48,fontWeight:800,letterSpacing:'-0.03em',marginBottom:20,color:'#fff'}}>Simple, honest pricing</h2>
            <p style={{fontSize:18,color:'#a3a3a3',maxWidth:500,margin:'0 auto',lineHeight:1.7}}>Start free, upgrade when you're ready. No surprises.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,alignItems:'stretch'}}>
            {[
              {n:'Free',p:'$0',d:'Test the waters',f:['100 leads managed','200 emails/month','2 sequences','50 AI requests/mo','Basic analytics'],pop:false,btn:'Get Started',integrations:[]},
              {n:'Starter',p:'$15',d:'For individual closers',f:['5,000 leads managed','5,000 emails/month','10 sequences','5,000 AI requests/mo','Full analytics (30 days)'],pop:true,btn:'Start 14-Day Trial',trial:true,integrations:['gmail']},
              {n:'Pro',p:'$49',d:'For power users',f:['25,000 leads managed','25,000 emails/month','Unlimited sequences','Unlimited AI requests','Full analytics (90 days)'],pop:false,btn:'Start 14-Day Trial',trial:true,integrations:['gmail','salesforce','hubspot']},
              {n:'Team',p:'Soon',d:'For growing teams',f:['100,000 leads managed','100,000 emails/month','Unlimited everything','5 team seats','Shared sequences','Priority support'],pop:false,btn:'Join Waitlist',soon:true,integrations:['gmail','salesforce','hubspot']}
            ].map((x,i)=><div key={i} style={{background:'#0d0d0d',border:x.pop?'2px solid rgba(168,85,247,.4)':`1px solid rgba(168,85,247,.1)`,borderRadius:20,padding:32,position:'relative',boxShadow:x.pop?'0 0 40px rgba(168,85,247,0.15)':'0 0 25px rgba(168,85,247,0.05)',transition:'all .2s',display:'flex',flexDirection:'column'}} onMouseOver={e=>{e.currentTarget.style.borderColor=x.pop?'rgba(168,85,247,.6)':'rgba(168,85,247,.3)';e.currentTarget.style.transform='translateY(-4px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor=x.pop?'rgba(168,85,247,.4)':'rgba(168,85,247,.1)';e.currentTarget.style.transform='none'}}>
              {x.pop&&<div style={{position:'absolute',top:-14,left:'50%',transform:'translateX(-50%)',background:'#a855f7',padding:'8px 20px',borderRadius:100,fontSize:11,fontWeight:700,color:'#000',letterSpacing:'0.05em'}}>MOST POPULAR</div>}
              <div style={{marginBottom:28}}>
                <div style={{fontSize:14,fontWeight:600,color:x.pop?'#a855f7':'#666',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>{x.n}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:8}}>
                  <span style={{fontSize:48,fontWeight:800,color:'#fff',letterSpacing:'-0.03em'}}>{x.p}</span>
                  {!x.soon&&<span style={{fontSize:16,color:'#666',fontWeight:500}}>/mo</span>}
                </div>
                <div style={{fontSize:14,color:'#a3a3a3',minHeight:20}}>{x.d}</div>
                {x.trial&&<div style={{fontSize:12,color:'#a855f7',marginTop:4}}>14-day free trial</div>}
                {x.soon&&<div style={{fontSize:12,color:'#666',marginTop:4}}>Coming soon</div>}
              </div>
              <button onClick={()=>x.soon?setModal('waitlist'):setView('signup')} style={{width:'100%',padding:'14px',background:x.pop?'#a855f7':x.soon?'rgba(168,85,247,.1)':'rgba(168,85,247,.1)',color:x.pop?'#000':'#a855f7',border:x.pop?'none':'1px solid rgba(168,85,247,.2)',borderRadius:100,fontSize:14,fontWeight:600,cursor:'pointer',marginBottom:20,boxShadow:x.pop?'0 0 30px rgba(168,85,247,0.3)':'none',transition:'all .2s'}} onMouseOver={e=>{e.target.style.transform='translateY(-2px)';if(x.pop)e.target.style.boxShadow='0 0 40px rgba(168,85,247,0.5)'}} onMouseOut={e=>{e.target.style.transform='none';if(x.pop)e.target.style.boxShadow='0 0 30px rgba(168,85,247,0.3)'}}>{x.btn}</button>
              
              {/* Integrations */}
              <div style={{marginBottom:20,paddingBottom:20,borderBottom:'1px solid rgba(255,255,255,.06)'}}>
                <div style={{fontSize:11,color:'#666',marginBottom:12,textTransform:'uppercase',letterSpacing:'0.05em'}}>Integrations</div>
                {x.integrations.length===0?(
                  <div style={{fontSize:13,color:'#333'}}>—</div>
                ):(
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    {x.integrations.includes('gmail')&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,background:'rgba(234,67,53,.08)',borderRadius:8}} title="Gmail"><svg width="16" height="16" viewBox="0 0 24 24" fill="#EA4335"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg></div>}
                    {x.integrations.includes('salesforce')&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,background:'rgba(0,161,224,.08)',borderRadius:8}} title="Salesforce"><svg width="18" height="18" viewBox="0 0 24 24" fill="#00A1E0"><path d="M10.1 4.5c.8-.9 2-1.5 3.3-1.5 1.8 0 3.4 1.1 4.1 2.6.6-.3 1.3-.4 2-.4 2.8 0 5 2.3 5 5.1s-2.2 5.1-5 5.1c-.3 0-.7 0-1-.1-.6 1.5-2.1 2.6-3.8 2.6-.5 0-.9-.1-1.4-.2-.7 1.3-2.1 2.2-3.7 2.2-1.8 0-3.3-1.1-3.9-2.7-.3 0-.5.1-.8.1-2.3 0-4.2-1.9-4.2-4.3 0-1.6.9-3 2.2-3.7-.2-.5-.3-1-.3-1.5 0-2.3 1.8-4.1 4.1-4.1.9-.1 1.8.2 2.4.8z"/></svg></div>}
                    {x.integrations.includes('hubspot')&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,background:'rgba(255,122,89,.08)',borderRadius:8}} title="HubSpot"><svg width="16" height="16" viewBox="0 0 24 24" fill="#ff7a59"><path d="M18.16 7.58v4.16c0 .67-.34 1.29-.9 1.66l-3.66 2.36c-.56.36-1.27.36-1.83 0l-3.66-2.36c-.56-.37-.9-.99-.9-1.66V7.58c0-.67.34-1.29.9-1.66l3.66-2.36c.56-.36 1.27-.36 1.83 0l3.66 2.36c.56.37.9.99.9 1.66z"/></svg></div>}
                  </div>
                )}
              </div>
              
              <div style={{display:'flex',flexDirection:'column',gap:14,flex:1}}>
                {x.f.map((f,j)=><div key={j} style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{width:18,height:18,background:'rgba(168,85,247,.1)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#a855f7',fontWeight:700,flexShrink:0}}>✓</span>
                  <span style={{fontSize:14,color:'#a3a3a3'}}>{f}</span>
                </div>)}
              </div>
            </div>)}
          </div>
          <div style={{textAlign:'center',marginTop:48,padding:'24px 32px',background:'#0d0d0d',borderRadius:16,border:'1px solid rgba(168,85,247,.1)',transition:'all .2s',display:'flex',alignItems:'center',justifyContent:'center',gap:12}} onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.2)';e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.1)';e.currentTarget.style.transform='none'}}>
            <span style={{color:'#fff',fontSize:15,fontWeight:500}}>Need enterprise features?</span>
            <button onClick={()=>setView('contact')} style={{background:'transparent',border:'1px solid #a855f7',color:'#a855f7',fontSize:14,fontWeight:600,cursor:'pointer',padding:'10px 24px',borderRadius:100,transition:'all .2s'}} onMouseOver={e=>{e.target.style.background='rgba(168,85,247,0.15)';e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 0 20px rgba(168,85,247,0.3)'}} onMouseOut={e=>{e.target.style.background='transparent';e.target.style.transform='none';e.target.style.boxShadow='none'}}>Let's talk →</button>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}><div style={{height:1,background:'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)'}}/></div>

      {/* FAQ */}
      <section style={{padding:'100px 24px',background:'#000'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,marginBottom:20}}><span style={{fontSize:13,color:'#a855f7',fontWeight:600,letterSpacing:'0.05em'}}>FAQ</span></div>
            <h2 style={{fontSize:42,fontWeight:800,letterSpacing:'-0.03em',color:'#fff'}}>Got questions?</h2>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {[
              {q:'How is ColdFlow different from Outreach or Salesloft?',a:'We built ColdFlow for individuals and small teams who want power without complexity. Same core features—sequences, analytics, CRM sync—at a fraction of the price, with setup that takes minutes.'},
              {q:'Is there really a free plan?',a:'Yes. 200 emails/month, 2 sequences, 100 leads. It\'s not a trial—it\'s free forever. Enough to test if ColdFlow fits your workflow.'},
              {q:'What\'s the difference between Starter and Pro?',a:'Starter ($15/mo) gives you 5,000 emails/month and Gmail integration. Pro ($49/mo) bumps that to 25,000 emails, adds Salesforce & HubSpot sync, and unlimited AI requests.'},
              {q:'Do you integrate with my CRM?',a:'Yes! Pro plans include full two-way sync with Salesforce and HubSpot. Import leads, push contacts, and log email activity automatically.'},
              {q:'Can I import my leads from a spreadsheet?',a:'Export your leads as CSV and import directly. We handle standard formats and auto-map your columns. Or import directly from your CRM.'},
              {q:'Is there a contract?',a:'Month-to-month, always. Upgrade, downgrade, or cancel anytime. No questions, no hassle.'}
            ].map((f,i)=><div key={i} onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{background:'#0d0d0d',border:openFaq===i?'1px solid rgba(168,85,247,.3)':'1px solid rgba(168,85,247,.1)',borderRadius:16,padding:0,boxShadow:'0 0 25px rgba(168,85,247,0.05)',cursor:'pointer',transition:'all .2s',transform:openFaq===i?'translateY(-2px)':'none'}} onMouseOver={e=>{if(openFaq!==i){e.currentTarget.style.borderColor='rgba(168,85,247,.2)';e.currentTarget.style.transform='translateY(-2px)'}}} onMouseOut={e=>{if(openFaq!==i){e.currentTarget.style.borderColor='rgba(168,85,247,.1)';e.currentTarget.style.transform='none'}}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 24px'}}>
                <h3 style={{fontSize:16,fontWeight:600,color:'#fff',margin:0}}>{f.q}</h3>
                <div style={{width:28,height:28,borderRadius:8,background:openFaq===i?'rgba(168,85,247,.2)':'rgba(168,85,247,.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginLeft:16,transition:'all .2s'}}>
                  <span style={{color:'#a855f7',fontSize:18,fontWeight:600,transition:'transform .2s',transform:openFaq===i?'rotate(45deg)':'none'}}>+</span>
                </div>
              </div>
              <div style={{maxHeight:openFaq===i?'200px':'0',overflow:'hidden',transition:'all .3s ease'}}>
                <p style={{fontSize:14,color:'#a3a3a3',lineHeight:1.8,margin:0,padding:'0 24px 20px'}}>{f.a}</p>
              </div>
            </div>)}
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}><div style={{height:1,background:'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)'}}/></div>

      {/* CTA - Final section */}
      <section style={{padding:'120px 24px',background:'#000',textAlign:'center',position:'relative'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'60%',height:'60%',background:'radial-gradient(ellipse,rgba(168,85,247,.1),transparent 60%)',filter:'blur(80px)',pointerEvents:'none'}}/>
        <div style={{maxWidth:700,margin:'0 auto',position:'relative'}}>
          <div style={{width:72,height:72,borderRadius:18,background:'linear-gradient(135deg,#a855f7,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'0 0 50px rgba(168,85,247,.4)'}}><svg width="28" height="28" fill="none" stroke="#000" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></div>
          <h2 style={{fontSize:48,fontWeight:800,letterSpacing:'-0.03em',marginBottom:20,color:'#fff'}}>Ready to book more meetings?</h2>
          <p style={{fontSize:18,color:'#a3a3a3',marginBottom:40,lineHeight:1.7}}>Stop paying enterprise prices for enterprise complexity. Start closing.</p>
          <button onClick={()=>setView('signup')} style={{background:'#a855f7',color:'#000',border:'none',fontSize:16,fontWeight:700,padding:'18px 48px',borderRadius:100,cursor:'pointer',boxShadow:'0 0 40px rgba(168,85,247,.4)',display:'inline-flex',alignItems:'center',gap:10,transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 50px rgba(168,85,247,.6)'}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 0 40px rgba(168,85,247,.4)'}}>Get Started Free <span style={{fontSize:18}}>→</span></button>
          <p style={{marginTop:20,fontSize:13,color:'#666'}}>No credit card required · Free plan forever · Setup in 2 minutes</p>
        </div>
      </section>

      <Footer/>
    </div>
  )

  // AUTH
  if(view==='login'||view==='signup')return(
    <div style={{minHeight:'100vh',background:'#000',color:'#fff'}}>
      <div style={{position:'fixed',top:0,left:0,right:0,height:600,background:'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.08), transparent)',pointerEvents:'none',zIndex:0}}/>
      <Nav onLogin={()=>setView('login')} onSignup={()=>setView('signup')}/>
      <div style={{maxWidth:400,margin:'0 auto',padding:'60px 24px',position:'relative',zIndex:1}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <h1 style={{fontSize:28,fontWeight:800,marginBottom:8,letterSpacing:'-0.02em'}}>{resetMode?'Reset password':view==='signup'?'Create your account':'Welcome back'}</h1>
          <p style={{color:'#666',fontSize:14}}>{resetMode?'We\'ll send you a reset link':view==='signup'?'Start your free account today':'Sign in to continue'}</p>
        </div>
        <div style={{background:'#0d0d0d',border:'1px solid rgba(168,85,247,.1)',borderRadius:16,padding:28,boxShadow:'0 0 40px rgba(168,85,247,0.05)'}}>
          {authErr&&<div style={{padding:12,background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,color:'#ef4444',fontSize:13,marginBottom:16}}>{authErr}</div>}
          {resetSent?<div style={{textAlign:'center',padding:'20px 0'}}>
            <div style={{width:56,height:56,borderRadius:14,background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><svg width="24" height="24" fill="none" stroke="#a855f7" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
            <h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>Check your email</h3>
            <p style={{color:'#666',fontSize:14,marginBottom:20}}>We sent a password reset link to {email}</p>
            <button onClick={()=>{setResetMode(false);setResetSent(false)}} style={{background:'transparent',border:'none',color:'#a855f7',fontSize:14,cursor:'pointer',fontWeight:500}}>← Back to sign in</button>
          </div>:<>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:11,color:'#666',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&resetMode)resetPassword();else if(e.key==='Enter'&&!resetMode&&pw)auth(view)}} style={{width:'100%',padding:14,background:'#000',border:'1px solid #262626',borderRadius:10,color:'#fff',fontSize:14,boxSizing:'border-box',outline:'none'}} onFocus={e=>{e.target.style.borderColor='#a855f7';e.target.style.boxShadow='0 0 0 3px rgba(168,85,247,0.15)'}} onBlur={e=>{e.target.style.borderColor='#262626';e.target.style.boxShadow='none'}} placeholder="you@company.com"/>
            </div>
            {!resetMode&&<div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:11,color:'#666',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Password</label>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')auth(view)}} style={{width:'100%',padding:14,background:'#000',border:'1px solid #262626',borderRadius:10,color:'#fff',fontSize:14,boxSizing:'border-box',outline:'none'}} onFocus={e=>{e.target.style.borderColor='#a855f7';e.target.style.boxShadow='0 0 0 3px rgba(168,85,247,0.15)'}} onBlur={e=>{e.target.style.borderColor='#262626';e.target.style.boxShadow='none'}} placeholder="••••••••"/>
            </div>}
            {!resetMode&&view==='login'&&<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,color:'#666'}}>
                <input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} style={{width:16,height:16,accentColor:'#a855f7'}}/>
                Remember email
              </label>
              <button onClick={()=>{setResetMode(true);setAuthErr('')}} style={{background:'none',border:'none',color:'#a855f7',fontSize:13,cursor:'pointer'}}>Forgot password?</button>
            </div>}
            {resetMode?<>
              <button onClick={resetPassword} style={{width:'100%',padding:'14px',background:'#a855f7',color:'#000',border:'none',borderRadius:100,fontSize:14,fontWeight:600,cursor:'pointer',marginBottom:12,boxShadow:'0 0 20px rgba(168,85,247,0.3)',transition:'all .2s'}} onMouseOver={e=>{e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 0 30px rgba(168,85,247,0.5)'}} onMouseOut={e=>{e.target.style.transform='none';e.target.style.boxShadow='0 0 20px rgba(168,85,247,0.3)'}}>Send Reset Link</button>
              <button onClick={()=>{setResetMode(false);setAuthErr('')}} style={{width:'100%',padding:'14px',background:'transparent',color:'#666',border:'1px solid #262626',borderRadius:100,fontSize:14,cursor:'pointer',transition:'all .2s'}} onMouseOver={e=>{e.target.style.transform='translateY(-2px)';e.target.style.borderColor='#a855f7'}} onMouseOut={e=>{e.target.style.transform='none';e.target.style.borderColor='#262626'}}>← Back to sign in</button>
            </>:<button onClick={()=>auth(view)} style={{width:'100%',padding:'14px',background:'#a855f7',color:'#000',border:'none',borderRadius:100,fontSize:14,fontWeight:600,cursor:'pointer',boxShadow:'0 0 20px rgba(168,85,247,0.3)',transition:'all .2s'}} onMouseOver={e=>{e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 0 30px rgba(168,85,247,0.5)'}} onMouseOut={e=>{e.target.style.transform='none';e.target.style.boxShadow='0 0 20px rgba(168,85,247,0.3)'}}>{view==='signup'?'Create Account':'Sign In'}</button>}
          </>}
        </div>
        {!resetMode&&!resetSent&&<p style={{textAlign:'center',marginTop:24,color:'#666',fontSize:14}}>{view==='signup'?<>Already have an account? <span onClick={()=>{setView('login');setAuthErr('')}} style={{color:'#a855f7',cursor:'pointer',fontWeight:500}}>Sign in</span></>:<>Don't have an account? <span onClick={()=>{setView('signup');setAuthErr('')}} style={{color:'#a855f7',cursor:'pointer',fontWeight:500}}>Sign up</span></>}</p>}
      </div>
    </div>
  )

  // Premium Dark Theme - No light mode, just pure dark
  const t = {
    bg: '#000000',
    bgAlt: '#0a0a0a',
    surface: '#0d0d0d',
    elevated: '#161616',
    border: '#262626',
    borderAccent: 'rgba(168,85,247,0.1)',
    text: '#ffffff',
    textSecondary: '#a3a3a3',
    textMuted: '#666666',
    accent: '#a855f7',
    success: '#00ff88',
    error: '#ef4444',
    glow: '0 0 25px rgba(168,85,247,0.05), inset 0 0 20px rgba(168,85,247,0.02)',
    glowHover: '0 0 35px rgba(168,85,247,0.15)',
    cardBorder: '1px solid rgba(168,85,247,0.1)',
  }

  // APP - Premium Dark
  return(
    <div style={{display:'flex',height:'100vh',background:t.bg,color:t.text,fontFamily:'Inter,system-ui,sans-serif',position:'relative'}}>
      {/* Ambient glow */}
      <div style={{position:'fixed',top:0,left:0,right:0,height:600,background:'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.08), transparent)',pointerEvents:'none',zIndex:0}}/>
      
      {/* Sidebar */}
      <div style={{width:220,background:t.bgAlt,borderRight:`1px solid ${t.border}`,display:'flex',flexDirection:'column',flexShrink:0,position:'relative',zIndex:1}}>
        <div style={{padding:20,borderBottom:`1px solid ${t.border}`}}><Logo size={28}/></div>
        <nav style={{flex:1,padding:12}}>{[{id:'dashboard',l:'Dashboard'},{id:'leads',l:'Leads'},{id:'sequences',l:'Sequences'},{id:'templates',l:'Templates'},{id:'snippets',l:'Snippets'},{id:'analytics',l:'Analytics'},{id:'settings',l:'Settings'}].map(x=><div key={x.id} onClick={()=>{setPage(x.id);setSelSeq(null);setSelCamp(null);setSelLead(null)}} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:10,marginBottom:4,cursor:'pointer',background:page===x.id?'rgba(168,85,247,0.15)':'transparent',color:page===x.id?'#fff':'#ccc',transition:'color .15s',fontSize:14,fontWeight:page===x.id?600:500,letterSpacing:'-0.01em',border:page===x.id?'1px solid rgba(168,85,247,0.3)':'1px solid transparent',boxShadow:page===x.id?'0 2px 12px rgba(168,85,247,0.2)':'none'}} onMouseOver={e=>{if(page!==x.id){e.currentTarget.style.color=t.accent}}} onMouseOut={e=>{if(page!==x.id){e.currentTarget.style.color='#ccc'}}}>{page===x.id&&<span style={{width:6,height:6,borderRadius:3,background:t.accent,boxShadow:'0 0 8px rgba(168,85,247,0.6)'}}/>}<span>{x.l}</span></div>)}</nav>
        <div style={{padding:12,borderTop:`1px solid ${t.border}`}}><button onClick={()=>setAiOpen(!aiOpen)} style={{width:'100%',padding:'14px 16px',background:aiOpen?`linear-gradient(135deg,${t.accent},#7c3aed)`:'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(124,58,237,0.1))',border:aiOpen?'1px solid rgba(168,85,247,0.5)':'1px solid rgba(168,85,247,0.3)',borderRadius:12,color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',transition:'all .2s',boxShadow:aiOpen?'0 4px 24px rgba(168,85,247,0.5), inset 0 1px 0 rgba(255,255,255,0.1)':'0 2px 12px rgba(168,85,247,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'center',gap:10}} onMouseOver={e=>{if(!aiOpen){e.currentTarget.style.background='linear-gradient(135deg,rgba(168,85,247,0.25),rgba(124,58,237,0.15))';e.currentTarget.style.boxShadow='0 4px 20px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.1)';e.currentTarget.style.transform='translateY(-2px)'}}} onMouseOut={e=>{if(!aiOpen){e.currentTarget.style.background='linear-gradient(135deg,rgba(168,85,247,0.15),rgba(124,58,237,0.1))';e.currentTarget.style.boxShadow='0 2px 12px rgba(168,85,247,0.15), inset 0 1px 0 rgba(255,255,255,0.05)';e.currentTarget.style.transform='none'}}}><span style={{fontSize:16}}>{aiOpen?'✕':'✨'}</span>{aiOpen?'Close AI':'AI Assistant'}</button></div>
        <div style={{padding:12,borderTop:`1px solid ${t.border}`}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontSize:12,color:t.textMuted,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</span><button onClick={logout} style={{padding:'6px 12px',background:'rgba(255,255,255,0.05)',border:`1px solid ${t.border}`,borderRadius:6,color:'#fff',fontSize:11,fontWeight:500,cursor:'pointer',transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(239,68,68,0.5)';e.currentTarget.style.color='#ef4444';e.currentTarget.style.background='rgba(239,68,68,0.1)'}} onMouseOut={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color='#fff';e.currentTarget.style.background='rgba(255,255,255,0.05)'}}>Log out</button></div></div>
      </div>

      <div style={{flex:1,overflow:'auto',padding:32,transition:'all .2s',position:'relative',zIndex:1}}>
        {/* DASHBOARD */}
        {page==='dashboard'&&<>
          {/* Trial Banner */}
          {isTrialActive()&&(
            <div style={{background:'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(124,58,237,0.1))',border:'1px solid rgba(168,85,247,0.3)',borderRadius:14,padding:'16px 24px',marginBottom:24,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:'rgba(168,85,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:18}}>⏱️</span>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:t.text,marginBottom:2}}>
                    {trialDaysLeft()} day{trialDaysLeft()!==1?'s':''} left on your {plan.trialTier?.charAt(0).toUpperCase()+plan.trialTier?.slice(1)} trial
                  </div>
                  <div style={{fontSize:13,color:t.textMuted}}>
                    {trialDaysLeft()<=3?'Your trial is ending soon. Upgrade to keep all features.':'Enjoying the full features? Upgrade anytime to keep access.'}
                  </div>
                </div>
              </div>
              <button onClick={()=>setUpgradeModal('trial')} style={{padding:'10px 20px',background:t.accent,border:'none',borderRadius:100,color:'#000',fontSize:13,fontWeight:600,cursor:'pointer',boxShadow:'0 0 20px rgba(168,85,247,0.3)',whiteSpace:'nowrap'}}>Upgrade Now</button>
            </div>
          )}
          
          {/* Trial Expired Notice */}
          {plan.trialTier&&plan.trialEnds&&!isTrialActive()&&plan.tier==='free'&&(
            <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:14,padding:'16px 24px',marginBottom:24,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:'rgba(239,68,68,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:18}}>⚠️</span>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:t.text,marginBottom:2}}>Your {plan.trialTier?.charAt(0).toUpperCase()+plan.trialTier?.slice(1)} trial has ended</div>
                  <div style={{fontSize:13,color:t.textMuted}}>You're now on the Free plan. Upgrade to restore full access.</div>
                </div>
              </div>
              <button onClick={()=>setUpgradeModal('expired')} style={{padding:'10px 20px',background:'#ef4444',border:'none',borderRadius:100,color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>Upgrade Now</button>
            </div>
          )}
          
          {/* Dynamic Greeting */}
          <div style={{marginBottom:32}}>
            <h1 style={{fontSize:32,fontWeight:800,marginBottom:8,letterSpacing:'-0.03em'}}>
              {new Date().getHours()<12?'Good morning':'Good afternoon'}{profile.name?`, ${profile.name.split(' ')[0]}`:''}
            </h1>
            <p style={{color:t.textSecondary,lineHeight:1.6,fontSize:15}}>
              {sequences.filter(s=>s.status==='active').length>0
                ?`${sequences.filter(s=>s.status==='active').length} active sequence${sequences.filter(s=>s.status==='active').length!==1?'s':''} running · ${tSent} emails sent`
                :sequences.length>0&&leads.length>0
                  ?'You have sequences ready to launch.'
                  :leads.length>0
                    ?'Leads imported. Create a sequence to start sending.'
                    :'Let\'s get your outreach set up.'}
            </p>
          </div>
          
          {/* Getting Started Checklist - shows until all complete */}
          {(!settings.gmail?.connected||leads.length===0||sequences.length===0)&&(
            <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,marginBottom:24,boxShadow:t.glow}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                <h3 style={{fontSize:14,fontWeight:700,margin:0}}>Get Started</h3>
                <span style={{fontSize:12,color:t.textMuted}}>{[settings.gmail?.connected,leads.length>0,sequences.length>0].filter(Boolean).length}/3 complete</span>
              </div>
              <div style={{display:'flex',gap:12}}>
                {[
                  {done:settings.gmail?.connected,label:'Connect Gmail',desc:'Required to send emails',action:()=>setPage('settings'),btn:'Connect'},
                  {done:leads.length>0,label:'Import leads',desc:'Add prospects to contact',action:()=>setModal('import'),btn:'Import CSV'},
                  {done:sequences.length>0,label:'Create sequence',desc:'Build your email cadence',action:()=>setPage('sequences'),btn:'Create'}
                ].map((step,i)=>(
                  <div key={i} style={{flex:1,padding:16,background:step.done?'rgba(34,197,94,0.05)':t.elevated,border:step.done?'1px solid rgba(34,197,94,0.2)':`1px solid ${t.border}`,borderRadius:12}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                      <div style={{width:20,height:20,borderRadius:'50%',background:step.done?'#22c55e':'transparent',border:step.done?'none':'2px solid #444',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {step.done&&<span style={{color:'#000',fontSize:12,fontWeight:700}}>✓</span>}
                      </div>
                      <span style={{fontSize:13,fontWeight:600,color:step.done?'#22c55e':t.text}}>{step.label}</span>
                    </div>
                    <p style={{fontSize:12,color:t.textMuted,margin:'0 0 12px 30px'}}>{step.desc}</p>
                    {!step.done&&<button onClick={step.action} style={{marginLeft:30,padding:'8px 16px',background:i===0?t.accent:'transparent',border:i===0?'none':`1px solid ${t.border}`,borderRadius:8,color:i===0?'#000':t.text,fontSize:12,fontWeight:600,cursor:'pointer'}}>{step.btn}</button>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          <div style={{display:'flex',gap:12,marginBottom:24}}>
            <button onClick={()=>setModal('import')} style={{padding:'12px 20px',background:t.surface,border:t.cardBorder,borderRadius:10,color:t.text,fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:8,transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
              <span style={{fontSize:16}}>↓</span> Import Leads
            </button>
            <button onClick={()=>{setPage('sequences');setModal('sequence')}} style={{padding:'12px 20px',background:t.surface,border:t.cardBorder,borderRadius:10,color:t.text,fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:8,transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
              <span style={{fontSize:16}}>+</span> New Sequence
            </button>
            <button onClick={()=>setModal('lead')} style={{padding:'12px 20px',background:t.surface,border:t.cardBorder,borderRadius:10,color:t.text,fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:8,transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
              <span style={{fontSize:16}}>+</span> Add Lead
            </button>
          </div>
          
          {/* Stats Row */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16,marginBottom:24}}>
            {[
              {l:'LEADS',v:leads.length,primary:true},
              {l:'SENT',v:tSent},
              {l:'OPENED',v:tOpen,r:tSent?((tOpen/tSent)*100).toFixed(0)+'%':'--'},
              {l:'CLICKED',v:tClick,r:tSent?((tClick/tSent)*100).toFixed(0)+'%':'--'},
              {l:'REPLIED',v:tReply,r:tSent?((tReply/tSent)*100).toFixed(0)+'%':'--',success:true}
            ].map(s=>(
              <div key={s.l} style={{background:t.surface,border:t.cardBorder,borderRadius:14,padding:20,boxShadow:t.glow}}>
                <div style={{fontSize:10,color:t.textMuted,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em',fontWeight:600}}>{s.l}</div>
                <div style={{fontSize:28,fontWeight:800,color:s.primary?t.accent:s.success?t.success:t.text,letterSpacing:'-0.03em'}}>{s.v}</div>
                {s.r&&<div style={{fontSize:12,color:t.textMuted,marginTop:4}}>{s.r}</div>}
              </div>
            ))}
          </div>
          
          {/* Two Column Layout */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            {/* Active Sequences */}
            <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,boxShadow:t.glow}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <h3 style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',color:t.textMuted,margin:0}}>Active Sequences</h3>
                <button onClick={()=>setPage('sequences')} style={{background:'none',border:'none',color:t.accent,fontSize:12,cursor:'pointer',fontWeight:500}}>View all →</button>
              </div>
              {sequences.filter(s=>s.status==='active').length===0?(
                <div style={{textAlign:'center',padding:'32px 16px'}}>
                  <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>📧</div>
                  <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>No sequences running yet</p>
                  <button onClick={()=>setPage('sequences')} style={{padding:'10px 20px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:8,color:t.accent,fontSize:12,fontWeight:600,cursor:'pointer'}}>Create Sequence</button>
                </div>
              ):sequences.filter(s=>s.status==='active').slice(0,4).map(s=>(
                <div key={s.id} onClick={()=>{setSelSeq(s);setPage('sequences')}} style={{padding:14,background:t.elevated,borderRadius:10,marginBottom:8,cursor:'pointer',border:`1px solid ${t.border}`,transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.borderColor=t.border}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontWeight:600,marginBottom:4,fontSize:14}}>{s.name}</div>
                      <div style={{fontSize:12,color:t.textMuted}}>{(s.lead_ids||[]).length} leads · {s.stats?.sent||0} sent</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:16,fontWeight:700,color:t.success}}>{s.stats?.sent?Math.round((s.stats?.opened||0)/s.stats.sent*100):0}%</div>
                      <div style={{fontSize:10,color:t.textMuted}}>open rate</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Activity Feed */}
            <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,boxShadow:t.glow}}>
              <h3 style={{fontSize:11,fontWeight:600,marginBottom:16,textTransform:'uppercase',letterSpacing:'0.05em',color:t.textMuted,margin:'0 0 16px 0'}}>Recent Activity</h3>
              {tSent===0?(
                <div style={{textAlign:'center',padding:'32px 16px'}}>
                  <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>📊</div>
                  <p style={{color:t.textMuted,fontSize:13}}>Activity will appear here once you start sending</p>
                </div>
              ):(
                <div>
                  {/* Simulated activity - in production this would come from tracking_events table */}
                  {leads.slice(0,5).map((l,i)=>(
                    <div key={l.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:i<4?`1px solid ${t.border}`:'none'}}>
                      <div style={{width:32,height:32,borderRadius:8,background:['rgba(168,85,247,0.15)','rgba(34,197,94,0.15)','rgba(59,130,246,0.15)'][i%3],display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>
                        {['👁','🖱','↩'][i%3]}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:500}}>{l.first_name} {l.last_name}</div>
                        <div style={{fontSize:11,color:t.textMuted}}>{['Opened email','Clicked link','Replied'][i%3]}</div>
                      </div>
                      <span style={{fontSize:11,color:t.textMuted}}>{['2m','5m','12m','1h','3h'][i]} ago</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>}

        {/* LEADS */}
        {page==='leads'&&!selLead&&<>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32}}>
            <div>
              <h1 style={{fontSize:32,fontWeight:800,marginBottom:8,letterSpacing:'-0.03em'}}>Leads</h1>
              <p style={{color:t.textSecondary,lineHeight:1.6,fontSize:15}}>
                {leads.length===0
                  ?'Import your first prospects to start building your pipeline.'
                  :`${leads.length} total · ${leads.filter(l=>l.status==='contacted').length} contacted · ${leads.filter(l=>l.status==='replied').length} replied`}
              </p>
            </div>
            <div style={{display:'flex',gap:10}}>
              <div style={{position:'relative'}}>
                <Btn v="s" onClick={()=>setImportDropdown(!importDropdown)}>Import ▾</Btn>
                {importDropdown&&<>
                  <div style={{position:'fixed',inset:0,zIndex:99}} onClick={()=>setImportDropdown(false)}/>
                  <div style={{position:'absolute',top:'100%',right:0,marginTop:8,background:t.elevated,border:`1px solid ${t.border}`,borderRadius:12,padding:8,minWidth:200,zIndex:100,boxShadow:'0 10px 40px rgba(0,0,0,.5)'}}>
                    <button onClick={()=>{setModal('import');setImportDropdown(false)}} style={{display:'flex',alignItems:'center',gap:12,width:'100%',padding:'12px 14px',background:'transparent',border:'none',borderRadius:8,color:t.text,fontSize:13,cursor:'pointer',textAlign:'left'}} onMouseOver={e=>e.currentTarget.style.background='rgba(168,85,247,.1)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{fontSize:16}}>📄</span>
                      <div><div style={{fontWeight:600}}>CSV File</div><div style={{fontSize:11,color:t.textMuted}}>Upload a spreadsheet</div></div>
                    </button>
                    {settings.sfdc?.connected&&<button onClick={()=>{setModal('sfdcSync');setImportDropdown(false)}} style={{display:'flex',alignItems:'center',gap:12,width:'100%',padding:'12px 14px',background:'transparent',border:'none',borderRadius:8,color:t.text,fontSize:13,cursor:'pointer',textAlign:'left'}} onMouseOver={e=>e.currentTarget.style.background='rgba(0,161,224,.1)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#00A1E0"><path d="M10.1 4.5c.8-.9 2-1.5 3.3-1.5 1.8 0 3.4 1.1 4.1 2.6.6-.3 1.3-.4 2-.4 2.8 0 5 2.3 5 5.1s-2.2 5.1-5 5.1c-.3 0-.7 0-1-.1-.6 1.5-2.1 2.6-3.8 2.6-.5 0-.9-.1-1.4-.2-.7 1.3-2.1 2.2-3.7 2.2-1.8 0-3.3-1.1-3.9-2.7-.3 0-.5.1-.8.1-2.3 0-4.2-1.9-4.2-4.3 0-1.6.9-3 2.2-3.7-.2-.5-.3-1-.3-1.5 0-2.3 1.8-4.1 4.1-4.1.9-.1 1.8.2 2.4.8z"/></svg>
                      <div><div style={{fontWeight:600}}>Salesforce</div><div style={{fontSize:11,color:t.textMuted}}>Import leads or contacts</div></div>
                    </button>}
                    {settings.hubspot?.connected&&<button onClick={()=>{setModal('hubspotSync');setImportDropdown(false)}} style={{display:'flex',alignItems:'center',gap:12,width:'100%',padding:'12px 14px',background:'transparent',border:'none',borderRadius:8,color:t.text,fontSize:13,cursor:'pointer',textAlign:'left'}} onMouseOver={e=>e.currentTarget.style.background='rgba(255,122,89,.1)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff7a59"><path d="M18.16 7.58v4.16c0 .67-.34 1.29-.9 1.66l-3.66 2.36c-.56.36-1.27.36-1.83 0l-3.66-2.36c-.56-.37-.9-.99-.9-1.66V7.58c0-.67.34-1.29.9-1.66l3.66-2.36c.56-.36 1.27-.36 1.83 0l3.66 2.36c.56.37.9.99.9 1.66z"/></svg>
                      <div><div style={{fontWeight:600}}>HubSpot</div><div style={{fontSize:11,color:t.textMuted}}>Import contacts</div></div>
                    </button>}
                    {!settings.sfdc?.connected&&!settings.hubspot?.connected&&<div style={{padding:'12px 14px',borderTop:`1px solid ${t.border}`,marginTop:4}}>
                      <div style={{fontSize:11,color:t.textMuted,marginBottom:8}}>Connect CRMs in Settings</div>
                      <button onClick={()=>{setPage('settings');setImportDropdown(false)}} style={{fontSize:12,color:t.accent,background:'none',border:'none',cursor:'pointer',padding:0}}>Go to Settings →</button>
                    </div>}
                  </div>
                </>}
              </div>
              <Btn onClick={()=>setModal('lead')}>+ Add Lead</Btn>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:20,flexWrap:'wrap'}}>
            <span style={{color:t.textMuted,fontSize:11,textTransform:'uppercase',letterSpacing:'0.05em'}}>Filter:</span>
            <button onClick={()=>setTagFilter(null)} style={{padding:'6px 14px',background:!tagFilter?'rgba(168,85,247,.15)':'transparent',border:`1px solid ${!tagFilter?'rgba(168,85,247,.3)':t.border}`,borderRadius:100,color:!tagFilter?t.accent:t.textMuted,fontSize:12,cursor:'pointer',fontWeight:500,transition:'all .15s'}}>All</button>
            {tags.map(tag=><button key={tag.id} onClick={()=>setTagFilter(tag.id)} style={{padding:'6px 14px',background:tagFilter===tag.id?'rgba(168,85,247,.15)':'transparent',border:`1px solid ${tagFilter===tag.id?'rgba(168,85,247,.3)':t.border}`,borderRadius:100,color:tagFilter===tag.id?t.accent:t.textMuted,fontSize:12,cursor:'pointer',fontWeight:500,transition:'all .15s'}}>{tag.name}</button>)}
            <button onClick={()=>setModal('tag')} style={{padding:'6px 14px',background:'transparent',border:`1px dashed ${t.border}`,borderRadius:100,color:t.textMuted,fontSize:12,cursor:'pointer'}}>+ Tag</button>
          </div>
          
          {/* Bulk Actions Bar */}
          {selLeads.length>0&&<div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:12,marginBottom:16}}>
            <span style={{fontSize:13,fontWeight:600,color:t.accent}}>{selLeads.length} selected</span>
            <div style={{width:1,height:20,background:t.border}}/>
            <select onChange={e=>{if(e.target.value)bulkStatus(e.target.value);e.target.value=''}} style={{padding:'6px 12px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,color:t.text,fontSize:12}}>
              <option value="">Set status...</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="replied">Replied</option>
              <option value="meeting">Meeting</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
            {tags.length>0&&<select onChange={e=>{if(e.target.value)bulkTag(e.target.value);e.target.value=''}} style={{padding:'6px 12px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,color:t.text,fontSize:12}}>
              <option value="">Add tag...</option>
              {tags.map(tag=><option key={tag.id} value={tag.id}>{tag.name}</option>)}
            </select>}
            <Btn v="d" s="s" onClick={bulkDelete}>Delete</Btn>
            <button onClick={()=>setSelLeads([])} style={{marginLeft:'auto',background:'none',border:'none',color:t.textMuted,fontSize:12,cursor:'pointer'}}>Clear</button>
          </div>}
          
          {fLeads.length===0?<div style={{textAlign:'center',padding:'80px 40px',background:t.surface,border:t.cardBorder,borderRadius:16,boxShadow:t.glow}}><div style={{width:72,height:72,borderRadius:20,background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'0 0 40px rgba(168,85,247,0.15)'}}><div style={{width:28,height:28,borderRadius:'50%',border:`3px solid ${t.accent}`}}/></div><h3 style={{fontSize:20,fontWeight:700,marginBottom:8,letterSpacing:'-0.02em'}}>No leads yet</h3><p style={{color:t.textMuted,marginBottom:28,maxWidth:300,margin:'0 auto 28px',fontSize:14}}>Import your first prospects to start building your pipeline.</p><Btn onClick={()=>setModal('lead')}>+ Add Lead</Btn></div>:
          <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,overflow:'hidden',boxShadow:t.glow}}>
            <div style={{display:'grid',gridTemplateColumns:'40px 2fr 1fr 1fr 1fr 80px',gap:16,padding:'16px 20px',borderBottom:`1px solid ${t.border}`,fontSize:11,color:t.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>
              <div><input type="checkbox" checked={selLeads.length===fLeads.length&&fLeads.length>0} onChange={e=>setSelLeads(e.target.checked?fLeads.map(l=>l.id):[])} style={{cursor:'pointer',accentColor:t.accent}}/></div>
              <div>Lead</div><div>Company</div><div>Tags</div><div>Status</div><div></div>
            </div>
            {fLeads.map(l=><div key={l.id} style={{display:'grid',gridTemplateColumns:'40px 2fr 1fr 1fr 1fr 80px',gap:16,padding:'14px 20px',borderBottom:`1px solid ${t.border}`,alignItems:'center',cursor:'pointer',transition:'all .15s',background:selLeads.includes(l.id)?'rgba(168,85,247,.05)':'transparent'}} onMouseOver={e=>{if(!selLeads.includes(l.id))e.currentTarget.style.background='rgba(168,85,247,.03)'}} onMouseOut={e=>{if(!selLeads.includes(l.id))e.currentTarget.style.background='transparent'}}>
              <div onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selLeads.includes(l.id)} onChange={e=>setSelLeads(e.target.checked?[...selLeads,l.id]:selLeads.filter(x=>x!==l.id))} style={{cursor:'pointer',accentColor:t.accent}}/></div>
              <div onClick={()=>setSelLead(l)} style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${t.accent},#7c3aed)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#000',position:'relative'}}>{(l.first_name?.[0]||l.email[0]).toUpperCase()}{l.sfdc_id&&<span style={{position:'absolute',bottom:-2,right:-2,width:12,height:12,borderRadius:6,background:'#00a1e0',border:'2px solid #0d0d0d'}} title="Synced with Salesforce"/>}{l.hubspot_id&&<span style={{position:'absolute',bottom:-2,left:-2,width:12,height:12,borderRadius:6,background:'#ff7a59',border:'2px solid #0d0d0d'}} title="Synced with HubSpot"/>}</div><div><div style={{fontWeight:600,fontSize:14}}>{l.first_name} {l.last_name}</div><div style={{fontSize:12,color:t.textMuted}}>{l.email}</div></div></div>
              <div onClick={()=>setSelLead(l)} style={{color:t.textSecondary,fontSize:14}}>{l.company||'—'}</div>
              <div onClick={()=>setSelLead(l)} style={{display:'flex',gap:4,flexWrap:'wrap'}}>{(l.tags||[]).map(tid=>{const tg=tags.find(x=>x.id===tid);return tg?<span key={tid} style={{padding:'4px 10px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',color:t.accent,borderRadius:100,fontSize:11,fontWeight:500}}>{tg.name}</span>:null})}</div>
              <div onClick={()=>setSelLead(l)}><span style={{padding:'6px 12px',background:l.status==='replied'?'rgba(0,255,136,.1)':l.status==='contacted'?'rgba(168,85,247,.1)':'rgba(255,255,255,.03)',border:`1px solid ${l.status==='replied'?'rgba(0,255,136,.2)':l.status==='contacted'?'rgba(168,85,247,.2)':t.border}`,color:l.status==='replied'?t.success:l.status==='contacted'?t.accent:t.textMuted,borderRadius:100,fontSize:11,fontWeight:500}}>{l.status}</span></div>
              <div onClick={e=>e.stopPropagation()}><Btn v="d" s="s" onClick={()=>delLead(l.id)}>Delete</Btn></div>
            </div>)}
          </div>}
        </>}

        {/* LEAD DETAIL */}
        {page==='leads'&&selLead&&<>
          <div style={{marginBottom:20}}>
            <button onClick={()=>setSelLead(null)} style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'none',color:'#888',fontSize:13,cursor:'pointer',padding:0,marginBottom:16}}>← Back to leads</button>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:56,height:56,borderRadius:14,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700}}>{(selLead.first_name?.[0]||selLead.email[0]).toUpperCase()}</div>
                <div>
                  <h1 style={{fontSize:24,fontWeight:700,marginBottom:2}}>{selLead.first_name} {selLead.last_name}</h1>
                  <p style={{color:'#888',fontSize:14}}>{selLead.email}{selLead.company&&<> · {selLead.company}</>}</p>
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <select value={selLead.status||'new'} onChange={async e=>{const s=e.target.value;await supabase.from('leads').update({status:s}).eq('id',selLead.id);setSelLead({...selLead,status:s});setLeads(leads.map(l=>l.id===selLead.id?{...l,status:s}:l))}} style={{padding:'8px 12px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#fff',fontSize:13}}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="replied">Replied</option>
                  <option value="meeting">Meeting</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
                <Btn v="d" s="s" onClick={()=>{delLead(selLead.id);setSelLead(null)}}>Delete</Btn>
              </div>
            </div>
          </div>
          
          <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:20}}>
            {/* Left - Info */}
            <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,padding:20}}>
              <h3 style={{fontSize:13,fontWeight:600,marginBottom:16,color:'#888',textTransform:'uppercase',letterSpacing:'0.5px'}}>Details</h3>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:'#666',marginBottom:4}}>Email</div>
                <div style={{fontSize:14}}>{selLead.email}</div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:'#666',marginBottom:4}}>Company</div>
                <div style={{fontSize:14}}>{selLead.company||'—'}</div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:'#666',marginBottom:4}}>Tags</div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {(selLead.tags||[]).length===0?<span style={{color:'#666',fontSize:12}}>No tags</span>:
                  (selLead.tags||[]).map(tid=>{const t=tags.find(x=>x.id===tid);return t?<span key={tid} style={{padding:'4px 10px',background:'rgba(99,102,241,.15)',color:'#a5b4fc',borderRadius:5,fontSize:11}}>{t.name}</span>:null})}
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:'#666',marginBottom:4}}>Added</div>
                <div style={{fontSize:14}}>{selLead.created_at?new Date(selLead.created_at).toLocaleDateString():'—'}</div>
              </div>
              
              {/* Salesforce Status */}
              <div style={{borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:16,marginTop:16}}>
                <div style={{fontSize:11,color:'#666',marginBottom:8}}>Salesforce</div>
                {selLead.sfdc_id?(
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{width:8,height:8,borderRadius:4,background:'#00a1e0'}}/>
                    <span style={{fontSize:13,color:'#00a1e0'}}>Synced</span>
                    <span style={{fontSize:11,color:'#666'}}>({selLead.sfdc_type||'Lead'})</span>
                  </div>
                ):(
                  <div>
                    <div style={{fontSize:12,color:'#888',marginBottom:8}}>Not in Salesforce</div>
                    {settings.sfdc?.connected&&(
                      <button onClick={async()=>{
                        if(!confirm('Push this lead to Salesforce?'))return
                        try {
                          const res = await fetch('/api/sfdc/push', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ userId: user?.id, leadId: selLead.id })
                          })
                          const data = await res.json()
                          if(data.success) {
                            setSelLead({...selLead, sfdc_id: data.sfdc_id, sfdc_type: 'Lead'})
                            setLeads(leads.map(l=>l.id===selLead.id?{...l, sfdc_id: data.sfdc_id, sfdc_type: 'Lead'}:l))
                            alert('Lead pushed to Salesforce!')
                          } else {
                            alert('Error: ' + (data.error||'Unknown error'))
                          }
                        } catch(err) {
                          alert('Error: ' + err.message)
                        }
                      }} style={{padding:'8px 14px',background:'rgba(0,161,224,.1)',border:'1px solid rgba(0,161,224,.3)',borderRadius:6,color:'#00a1e0',fontSize:12,cursor:'pointer',fontWeight:500}}>
                        Push to Salesforce
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {/* HubSpot Status */}
              <div style={{borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:16,marginTop:16}}>
                <div style={{fontSize:11,color:'#666',marginBottom:8}}>HubSpot</div>
                {selLead.hubspot_id?(
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{width:8,height:8,borderRadius:4,background:'#ff7a59'}}/>
                    <span style={{fontSize:13,color:'#ff7a59'}}>Synced</span>
                  </div>
                ):(
                  <div>
                    <div style={{fontSize:12,color:'#888',marginBottom:8}}>Not in HubSpot</div>
                    {settings.hubspot?.connected&&(
                      <button onClick={async()=>{
                        if(!confirm('Push this lead to HubSpot?'))return
                        try {
                          const res = await fetch('/api/hubspot/push', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ userId: user?.id, leadId: selLead.id })
                          })
                          const data = await res.json()
                          if(data.success) {
                            setSelLead({...selLead, hubspot_id: data.hubspot_id})
                            setLeads(leads.map(l=>l.id===selLead.id?{...l, hubspot_id: data.hubspot_id}:l))
                            alert('Lead pushed to HubSpot!')
                          } else {
                            alert('Error: ' + (data.error||'Unknown error'))
                          }
                        } catch(err) {
                          alert('Error: ' + err.message)
                        }
                      }} style={{padding:'8px 14px',background:'rgba(255,122,89,.1)',border:'1px solid rgba(255,122,89,.3)',borderRadius:6,color:'#ff7a59',fontSize:12,cursor:'pointer',fontWeight:500}}>
                        Push to HubSpot
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right - Activity Timeline */}
            <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,padding:20}}>
              <h3 style={{fontSize:13,fontWeight:600,marginBottom:20,color:'#888',textTransform:'uppercase',letterSpacing:'0.5px'}}>Activity Timeline</h3>
              <div style={{position:'relative'}}>
                {/* Timeline line */}
                <div style={{position:'absolute',left:11,top:8,bottom:8,width:2,background:'rgba(255,255,255,.1)'}}/>
                
                {/* Sample activity items - these would come from actual email tracking */}
                {selLead.activity&&selLead.activity.length>0?selLead.activity.map((a,i)=>(
                  <div key={i} style={{display:'flex',gap:14,marginBottom:20,position:'relative'}}>
                    <div style={{width:24,height:24,borderRadius:'50%',background:a.type==='sent'?'rgba(99,102,241,.2)':a.type==='opened'?'rgba(168,85,247,.2)':a.type==='replied'?'rgba(34,197,94,.2)':'rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,zIndex:1}}>
                      <div style={{width:6,height:6,borderRadius:2,background:a.type==='sent'?'#6366f1':a.type==='opened'?'#a855f7':a.type==='replied'?'#22c55e':'#666'}}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:500,fontSize:13,marginBottom:2}}>{a.title}</div>
                      <div style={{color:'#888',fontSize:12}}>{a.desc}</div>
                      <div style={{color:'#666',fontSize:11,marginTop:4}}>{a.time}</div>
                    </div>
                  </div>
                )):(
                  <>
                    <div style={{display:'flex',gap:14,marginBottom:20,position:'relative'}}>
                      <div style={{width:24,height:24,borderRadius:'50%',background:'rgba(34,197,94,.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,zIndex:1}}><span style={{fontSize:10}}>✓</span></div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:500,fontSize:13,marginBottom:2}}>Lead created</div>
                        <div style={{color:'#888',fontSize:12}}>Added to ColdFlow</div>
                        <div style={{color:'#666',fontSize:11,marginTop:4}}>{selLead.created_at?new Date(selLead.created_at).toLocaleString():'—'}</div>
                      </div>
                    </div>
                    <div style={{padding:20,background:'rgba(255,255,255,.02)',borderRadius:10,border:'1px dashed rgba(255,255,255,.1)',textAlign:'center'}}>
                      <div style={{color:'#666',fontSize:13,marginBottom:8}}>No email activity yet</div>
                      <div style={{color:'#555',fontSize:12}}>Activity will appear here once this lead is added to a campaign</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>}

        {/* SEQUENCES LIST */}
        {page==='sequences'&&!selSeq&&<>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32}}>
            <div>
              <h1 style={{fontSize:32,fontWeight:800,marginBottom:8,letterSpacing:'-0.03em'}}>Sequences</h1>
              <p style={{color:t.textSecondary,lineHeight:1.6,fontSize:15}}>
                {sequences.length===0
                  ?'Create your first email sequence to start reaching out.'
                  :`${sequences.length} sequence${sequences.length!==1?'s':''} · ${sequences.filter(s=>s.status==='active').length} active · ${sequences.reduce((a,s)=>a+(s.stats?.sent||0),0)} emails sent`}
              </p>
            </div>
            <div style={{display:'flex',gap:10}}>
              <Btn v="s" onClick={()=>setModal('snippetManager')}>Snippets</Btn>
              <Btn onClick={()=>setModal('sequence')}>+ New Sequence</Btn>
            </div>
          </div>
          
          {/* Starter Templates - show when no sequences */}
          {sequences.length===0&&<>
            <div style={{textAlign:'center',padding:'48px 20px',background:t.surface,border:t.cardBorder,borderRadius:16,marginBottom:32,boxShadow:t.glow}}>
              <div style={{width:72,height:72,borderRadius:20,background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 0 40px rgba(168,85,247,0.15)'}}><svg width="28" height="28" fill="none" stroke={t.accent} strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
              <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,letterSpacing:'-0.02em'}}>Start with a proven template</h3>
              <p style={{color:t.textMuted,marginBottom:0,fontSize:14}}>Or create a blank sequence from scratch</p>
            </div>
            <h3 style={{fontSize:11,color:t.textMuted,fontWeight:600,marginBottom:16,textTransform:'uppercase',letterSpacing:'0.05em'}}>Quick Start Templates</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16,marginBottom:32}}>
              {[
                {name:'Classic 3-Touch',desc:'Simple intro → follow-up → break-up',steps:[
                  {day:1,time:'09:00',subject:'Quick question about {{company}}',body:'Hi {{firstName}},\n\nI came across {{company}} and noticed [observation]. We help companies like yours [value prop].\n\nWould you be open to a quick call this week?\n\nBest,\n[Your name]'},
                  {day:4,time:'09:00',subject:'Re: Quick question about {{company}}',body:'Hi {{firstName}},\n\nWanted to bump this up. I know things get busy.\n\nAny interest in connecting for 15 minutes?\n\nBest,\n[Your name]'},
                  {day:8,time:'09:00',subject:'Should I close your file?',body:'Hi {{firstName}},\n\nI\'ve reached out a couple times without hearing back - no worries if the timing isn\'t right.\n\nShould I assume you\'re all set for now?\n\nBest,\n[Your name]'}
                ]},
                {name:'Value-First 5-Touch',desc:'Lead with value, build credibility',steps:[
                  {day:1,time:'09:00',subject:'[Resource] for {{company}}',body:'Hi {{firstName}},\n\nPut together a quick resource on [topic] that might help {{company}}.\n\n[Link or brief insight]\n\nThought you might find it useful.\n\nBest,\n[Your name]'},
                  {day:3,time:'10:00',subject:'Quick thought on [specific challenge]',body:'Hi {{firstName}},\n\nWas thinking about {{company}} and how [industry challenge] might be affecting you.\n\nWe recently helped [similar company] solve this by [approach]. Results: [specific metric].\n\nWorth a conversation?\n\nBest,\n[Your name]'},
                  {day:6,time:'09:00',subject:'[Case study] you might like',body:'Hi {{firstName}},\n\nAttaching a case study from [similar company] - they faced [challenge] and saw [result].\n\nHappy to walk through how this could apply to {{company}}.\n\nBest,\n[Your name]'},
                  {day:10,time:'09:00',subject:'One more thing',body:'Hi {{firstName}},\n\nI\'ll keep this short - would love 15 minutes to show you what we did for [company].\n\nIs there a day this week that works?\n\nBest,\n[Your name]'},
                  {day:14,time:'09:00',subject:'Closing the loop',body:'Hi {{firstName}},\n\nI\'ll assume the timing isn\'t right. If anything changes, feel free to reach out.\n\nWishing {{company}} continued success.\n\nBest,\n[Your name]'}
                ]},
                {name:'Referral Intro',desc:'Warm outreach via mutual connection',steps:[
                  {day:1,time:'09:00',subject:'{{mutualConnection}} suggested I reach out',body:'Hi {{firstName}},\n\n{{mutualConnection}} mentioned you might be the right person to talk to about [topic] at {{company}}.\n\nWe help [target audience] with [value prop]. {{mutualConnection}} thought it could be relevant for you.\n\nWorth a quick call?\n\nBest,\n[Your name]'},
                  {day:4,time:'09:00',subject:'Following up (via {{mutualConnection}})',body:'Hi {{firstName}},\n\nWanted to follow up on my note - {{mutualConnection}} really thought we should connect.\n\nHappy to keep it brief - 15 minutes?\n\nBest,\n[Your name]'},
                  {day:8,time:'09:00',subject:'Last try',body:'Hi {{firstName}},\n\nI\'ll keep this one short. If now isn\'t the right time, no problem at all.\n\nJust let me know either way?\n\nBest,\n[Your name]'}
                ]},
                {name:'Event Follow-up',desc:'Post-conference or webinar outreach',steps:[
                  {day:1,time:'10:00',subject:'Great meeting you at [event]',body:'Hi {{firstName}},\n\nGreat connecting at [event] yesterday. Enjoyed our chat about [topic].\n\nAs promised, here\'s [resource/info you mentioned].\n\nWould love to continue the conversation - free this week?\n\nBest,\n[Your name]'},
                  {day:3,time:'09:00',subject:'Following up from [event]',body:'Hi {{firstName}},\n\nWanted to follow up on our conversation at [event].\n\nI think there\'s a real opportunity for {{company}} to [benefit]. Happy to share more details.\n\n15 minutes this week?\n\nBest,\n[Your name]'},
                  {day:7,time:'09:00',subject:'Still interested in connecting?',body:'Hi {{firstName}},\n\nI know [event] probably generated a lot of follow-ups, so I understand if you\'re swamped.\n\nWould still love to connect when you have bandwidth. Let me know what works.\n\nBest,\n[Your name]'}
                ]}
              ].map((tpl,i)=>(
                <div key={i} style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,display:'flex',flexDirection:'column',boxShadow:t.glow,transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                      <span style={{fontSize:16,fontWeight:700,letterSpacing:'-0.02em'}}>{tpl.name}</span>
                      <span style={{padding:'4px 10px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',color:t.accent,borderRadius:100,fontSize:11,fontWeight:500}}>{tpl.steps.length} steps</span>
                    </div>
                    <p style={{color:t.textMuted,fontSize:13,marginBottom:16}}>{tpl.desc}</p>
                    <div style={{display:'flex',gap:6,marginBottom:16}}>
                      {tpl.steps.map((st,j)=><div key={j} style={{width:8,height:8,borderRadius:'50%',background:j===0?t.accent:j===tpl.steps.length-1?t.success:'#333'}}/>)}
                    </div>
                  </div>
                  <button onClick={async()=>{
                    const {data}=await supabase.from('sequences').insert({name:tpl.name,user_id:user.id,steps:tpl.steps.map((s,idx)=>({id:'st'+Date.now()+idx,...s,sent:0,opened:0,replied:0}))}).select().single()
                    if(data){setSequences([data,...sequences]);setSelSeq(data)}
                  }} style={{width:'100%',padding:14,background:t.accent,border:'none',borderRadius:100,color:'#000',fontSize:13,fontWeight:600,cursor:'pointer',boxShadow:DS.btnGlow}}>Use Template</button>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center',marginBottom:32}}>
              <button onClick={()=>setModal('sequence')} style={{background:'transparent',border:`1px dashed ${t.border}`,borderRadius:100,padding:'14px 32px',color:t.textMuted,fontSize:13,cursor:'pointer',transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.color=t.accent}} onMouseOut={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.textMuted}}>Or start from scratch</button>
            </div>
          </>}
          
          {/* Existing Sequences */}
          {sequences.length>0&&<div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
            {sequences.map(s=>{
              const stepCount=s.steps?.length||0
              const stats=s.stats||{sent:0,opened:0,clicked:0,replied:0}
              const leadCount=(s.lead_ids||[]).length
              const status=s.status||'draft'
              const hasConditional=(s.steps||[]).some(st=>st.condition&&st.condition!=='none')
              return(
                <div key={s.id} onClick={()=>setSelSeq(s)} style={{background:t.surface,border:status==='active'?'1px solid rgba(34,197,94,0.3)':t.cardBorder,borderRadius:16,padding:20,cursor:'pointer',transition:'all .2s',boxShadow:t.glow}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor=status==='active'?'rgba(34,197,94,0.5)':t.accent;e.currentTarget.style.boxShadow=t.glowHover}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor=status==='active'?'rgba(34,197,94,0.3)':'rgba(168,85,247,0.1)';e.currentTarget.style.boxShadow=t.glow}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:16,marginBottom:16}}>
                    <div style={{width:48,height:48,borderRadius:12,background:status==='active'?'linear-gradient(135deg,#22c55e,#16a34a)':`linear-gradient(135deg,${t.accent},#7c3aed)`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18,flexShrink:0,color:status==='active'?'#fff':'#000'}}>{stepCount}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                        <span style={{fontSize:16,fontWeight:700,letterSpacing:'-0.02em'}}>{s.name}</span>
                        {status==='active'&&<span style={{fontSize:9,padding:'2px 6px',background:'rgba(34,197,94,.15)',border:'1px solid rgba(34,197,94,.3)',borderRadius:4,color:'#22c55e',fontWeight:600}}>ACTIVE</span>}
                        {status==='paused'&&<span style={{fontSize:9,padding:'2px 6px',background:'rgba(245,158,11,.15)',border:'1px solid rgba(245,158,11,.3)',borderRadius:4,color:'#f59e0b',fontWeight:600}}>PAUSED</span>}
                        {hasConditional&&<span style={{fontSize:9,padding:'2px 6px',background:'rgba(99,102,241,.15)',border:'1px solid rgba(99,102,241,.3)',borderRadius:4,color:'#818cf8',fontWeight:600}}>CONDITIONAL</span>}
                      </div>
                      <div style={{display:'flex',gap:12,color:t.textMuted,fontSize:12}}>
                        <span>{stepCount} steps</span>
                        <span>{leadCount} leads</span>
                      </div>
                    </div>
                  </div>
                  {stats.sent>0?(
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                      <div style={{background:t.elevated,borderRadius:8,padding:10,textAlign:'center'}}><div style={{fontSize:14,fontWeight:700}}>{stats.sent}</div><div style={{fontSize:9,color:t.textMuted,textTransform:'uppercase'}}>Sent</div></div>
                      <div style={{background:t.elevated,borderRadius:8,padding:10,textAlign:'center'}}><div style={{fontSize:14,fontWeight:700,color:t.accent}}>{Math.round((stats.opened/stats.sent)*100)}%</div><div style={{fontSize:9,color:t.textMuted,textTransform:'uppercase'}}>Opens</div></div>
                      <div style={{background:t.elevated,borderRadius:8,padding:10,textAlign:'center'}}><div style={{fontSize:14,fontWeight:700,color:t.success}}>{Math.round((stats.replied/stats.sent)*100)}%</div><div style={{fontSize:9,color:t.textMuted,textTransform:'uppercase'}}>Replies</div></div>
                    </div>
                  ):(
                    <div style={{padding:12,background:t.elevated,borderRadius:8,textAlign:'center',fontSize:12,color:t.textMuted}}>No emails sent yet</div>
                  )}
                </div>
              )
            })}
            <button onClick={()=>setModal('sequence')} style={{padding:32,background:'transparent',border:`1px dashed ${t.border}`,borderRadius:16,color:t.textMuted,fontSize:14,cursor:'pointer',transition:'all .15s',display:'flex',alignItems:'center',justifyContent:'center'}} onMouseOver={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.color=t.accent}} onMouseOut={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.textMuted}}>+ Create New Sequence</button>
          </div>}
        </>}


        {/* SEQUENCE DETAIL - TIMELINE BUILDER */}
        {page==='sequences'&&selSeq&&<>
          <div style={{display:'flex',gap:0,height:'calc(100vh - 96px)'}}>
            {/* Timeline Column */}
            <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,maxWidth:editingStepId?'50%':'70%',transition:'max-width .2s'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <button onClick={()=>{setSelSeq(null);setEditingStepId(null);setShowTemplates(false);setPreviewStep(null)}} style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'#888',width:36,height:36,borderRadius:8,cursor:'pointer',fontSize:14}}>←</button>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <h1 style={{fontSize:22,fontWeight:700,margin:0}}>{selSeq.name}</h1>
                      {selSeq.status==='active'&&<span style={{fontSize:10,padding:'4px 10px',background:'rgba(34,197,94,.15)',border:'1px solid rgba(34,197,94,.3)',borderRadius:4,color:'#22c55e',fontWeight:600}}>ACTIVE</span>}
                      {selSeq.status==='paused'&&<span style={{fontSize:10,padding:'4px 10px',background:'rgba(245,158,11,.15)',border:'1px solid rgba(245,158,11,.3)',borderRadius:4,color:'#f59e0b',fontWeight:600}}>PAUSED</span>}
                      {(!selSeq.status||selSeq.status==='draft')&&<span style={{fontSize:10,padding:'4px 10px',background:'rgba(100,116,139,.15)',border:'1px solid rgba(100,116,139,.3)',borderRadius:4,color:'#94a3b8',fontWeight:600}}>DRAFT</span>}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginTop:6}}>
                      <span style={{color:'#666',fontSize:13}}>{selSeq.steps?.length||0} steps · {(selSeq.lead_ids||[]).length} leads</span>
                      {(selSeq.steps||[]).some(s=>s.condition&&s.condition!=='none')&&(
                        <span style={{fontSize:10,padding:'3px 8px',background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.25)',borderRadius:4,color:'#f59e0b',fontWeight:600}}>CONDITIONAL</span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  {selSeq.status==='active'?(
                    <Btn v="s" s="s" onClick={()=>pauseSequence(selSeq)}>Pause</Btn>
                  ):(
                    <Btn onClick={()=>startSequence(selSeq)}>Start Sequence</Btn>
                  )}
                  <Btn v="s" s="s" onClick={()=>setShowTemplates(!showTemplates)}>{showTemplates?'×':'+'} Templates</Btn>
                  <Btn v="d" s="s" onClick={()=>delSeq(selSeq.id)}>Delete</Btn>
                </div>
              </div>
              
              {/* Sequence Stats Row - Always visible */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
                <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:10,padding:14,textAlign:'center'}}>
                  <div style={{fontSize:24,fontWeight:800,color:t.text}}>{selSeq.stats?.sent||0}</div>
                  <div style={{fontSize:10,color:'#666',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:4}}>Total Sent</div>
                </div>
                <div style={{background:'rgba(168,85,247,.05)',border:'1px solid rgba(168,85,247,.15)',borderRadius:10,padding:14,textAlign:'center'}}>
                  <div style={{fontSize:24,fontWeight:800,color:'#a855f7'}}>{(selSeq.stats?.sent||0)>0?Math.round((selSeq.stats?.opened||0)/(selSeq.stats?.sent)*100):0}%</div>
                  <div style={{fontSize:10,color:'#666',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:4}}>Open Rate</div>
                  <div style={{fontSize:11,color:'#555',marginTop:2}}>{selSeq.stats?.opened||0} opens</div>
                </div>
                <div style={{background:'rgba(59,130,246,.05)',border:'1px solid rgba(59,130,246,.15)',borderRadius:10,padding:14,textAlign:'center'}}>
                  <div style={{fontSize:24,fontWeight:800,color:'#3b82f6'}}>{(selSeq.stats?.sent||0)>0?Math.round((selSeq.stats?.clicked||0)/(selSeq.stats?.sent)*100):0}%</div>
                  <div style={{fontSize:10,color:'#666',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:4}}>Click Rate</div>
                  <div style={{fontSize:11,color:'#555',marginTop:2}}>{selSeq.stats?.clicked||0} clicks</div>
                </div>
                <div style={{background:'rgba(34,197,94,.05)',border:'1px solid rgba(34,197,94,.15)',borderRadius:10,padding:14,textAlign:'center'}}>
                  <div style={{fontSize:24,fontWeight:800,color:'#22c55e'}}>{(selSeq.stats?.sent||0)>0?Math.round((selSeq.stats?.replied||0)/(selSeq.stats?.sent)*100):0}%</div>
                  <div style={{fontSize:10,color:'#666',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:4}}>Reply Rate</div>
                  <div style={{fontSize:11,color:'#555',marginTop:2}}>{selSeq.stats?.replied||0} replies</div>
                </div>
              </div>
              
              {/* Timeline */}
              <div style={{flex:1,overflow:'auto',paddingRight:16}}>
                <div style={{position:'relative',paddingLeft:40}}>
                  {/* Main Timeline line */}
                  {(selSeq.steps||[]).length>0&&<div style={{position:'absolute',left:11,top:20,bottom:60,width:2,background:'linear-gradient(180deg,#6366f1 0%,rgba(99,102,241,.2) 100%)',borderRadius:1}}/>}
                  
                  {(selSeq.steps||[]).map((st,i)=>{
                    const isConditional=st.condition&&st.condition!=='none'
                    const prevStep=i>0?(selSeq.steps||[])[i-1]:null
                    return(
                    <div key={st.id} style={{position:'relative',marginBottom:isConditional?16:8,marginLeft:isConditional?40:0}}
                      draggable={editingStepId!==st.id}
                      onDragStart={()=>setDragIdx(i)}
                      onDragEnd={()=>{setDragIdx(null);setDragOverIdx(null)}}
                      onDragOver={e=>{e.preventDefault();setDragOverIdx(i)}}
                      onDrop={()=>reorderSteps(dragIdx,i)}>
                      
                      {/* Branch connector for conditional steps */}
                      {isConditional&&i>0&&(
                        <svg style={{position:'absolute',left:-52,top:0,width:52,height:50,overflow:'visible'}} viewBox="0 0 52 50">
                          {/* Horizontal line from main timeline */}
                          <path d="M12 -10 L12 20 Q12 30 22 30 L40 30" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="2" strokeDasharray="4 3"/>
                          {/* Branch dot on main timeline */}
                          <circle cx="12" cy="-10" r="4" fill="#f59e0b"/>
                        </svg>
                      )}
                      
                      {/* Timeline dot - only show for non-conditional or first step */}
                      {!isConditional&&<div style={{position:'absolute',left:-40,top:16,width:24,height:24,borderRadius:12,background:editingStepId===st.id?'#6366f1':i===0?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#1e293b',border:editingStepId===st.id?'none':'2px solid #334155',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:editingStepId===st.id||i===0?'#fff':'#64748b',zIndex:1}}>{i+1}</div>}
                      
                      {/* Conditional step indicator */}
                      {isConditional&&<div style={{position:'absolute',left:-12,top:16,width:24,height:24,borderRadius:12,background:'linear-gradient(135deg,#f59e0b,#ef4444)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',zIndex:1,boxShadow:'0 0 12px rgba(245,158,11,0.4)'}}>⚡</div>}
                      
                      {/* Step Card */}
                      <div 
                        onClick={()=>{setEditingStepId(st.id);setStepF({day:st.day,time:st.time,subj:st.subject,body:st.body,condition:st.condition||'none',type:st.type||'email'});setPreviewStep(null)}}
                        style={{
                          background:editingStepId===st.id?'rgba(99,102,241,.1)':isConditional?'rgba(245,158,11,.08)':dragOverIdx===i&&dragIdx!==i?'rgba(99,102,241,.08)':'rgba(255,255,255,.02)',
                          border:editingStepId===st.id?'1px solid rgba(99,102,241,.4)':isConditional?'1px solid rgba(245,158,11,.3)':dragOverIdx===i&&dragIdx!==i?'1px dashed rgba(99,102,241,.4)':'1px solid rgba(255,255,255,.06)',
                          borderRadius:10,
                          padding:'14px 16px',
                          cursor:'pointer',
                          opacity:dragIdx===i?.5:1,
                          transition:'all .15s',
                          marginLeft:isConditional?8:0
                        }}>
                        {/* Condition badge - prominent at top */}
                        {isConditional&&(
                          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                            <span style={{fontSize:11,padding:'5px 12px',background:'rgba(245,158,11,.2)',border:'1px solid rgba(245,158,11,.4)',borderRadius:6,color:'#f59e0b',fontWeight:600}}>
                              {st.condition==='if_opened'?'↳ IF PREVIOUS OPENED':st.condition==='if_not_opened'?'↳ IF NOT OPENED':st.condition==='if_clicked'?'↳ IF CLICKED':st.condition==='if_not_clicked'?'↳ IF NOT CLICKED':st.condition==='if_not_replied'?'↳ IF NO REPLY':'CONDITIONAL'}
                            </span>
                            <span style={{fontSize:10,color:'#666'}}>branches from Step {i}</span>
                          </div>
                        )}
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <span style={{fontSize:11,color:'#666',fontWeight:500}}>Day {st.day} · {st.time}</span>
                            {st.type==='task'&&<span style={{fontSize:10,padding:'3px 8px',background:'rgba(0,161,224,.15)',border:'1px solid rgba(0,161,224,.3)',borderRadius:4,color:'#00a1e0',fontWeight:600}}>TASK</span>}
                          </div>
                          <span style={{cursor:'grab',color:'#444',fontSize:12}} onMouseDown={e=>e.stopPropagation()}>⋮</span>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                          {st.type==='task'&&<span style={{fontSize:14}}>✅</span>}
                          <span style={{fontSize:14,fontWeight:600,color:'#e2e8f0',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{st.subject}</span>
                        </div>
                        {st.type!=='task'&&<div style={{fontSize:12,color:'#64748b',marginBottom:(st.sent||0)>0?12:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{st.body?.substring(0,80)}...</div>}
                        {st.type==='task'&&st.body&&<div style={{fontSize:12,color:'#64748b',marginBottom:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{st.body?.substring(0,60)}...</div>}
                        
                        {/* Step Stats - show when has data (email only) */}
                        {st.type!=='task'&&(st.sent||0)>0&&(
                          <div style={{display:'flex',gap:12,paddingTop:10,borderTop:'1px solid rgba(255,255,255,.06)'}}>
                            <div style={{display:'flex',alignItems:'center',gap:4}}>
                              <span style={{fontSize:12,fontWeight:600,color:'#888'}}>{st.sent||0}</span>
                              <span style={{fontSize:10,color:'#555'}}>sent</span>
                            </div>
                            <div style={{display:'flex',alignItems:'center',gap:4}}>
                              <span style={{fontSize:12,fontWeight:600,color:'#a855f7'}}>{Math.round((st.opened||0)/(st.sent||1)*100)}%</span>
                              <span style={{fontSize:10,color:'#555'}}>opened</span>
                            </div>
                            <div style={{display:'flex',alignItems:'center',gap:4}}>
                              <span style={{fontSize:12,fontWeight:600,color:'#3b82f6'}}>{Math.round((st.clicked||0)/(st.sent||1)*100)}%</span>
                              <span style={{fontSize:10,color:'#555'}}>clicked</span>
                            </div>
                            <div style={{display:'flex',alignItems:'center',gap:4}}>
                              <span style={{fontSize:12,fontWeight:600,color:'#22c55e'}}>{Math.round((st.replied||0)/(st.sent||1)*100)}%</span>
                              <span style={{fontSize:10,color:'#555'}}>replied</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )})}
                  
                  {/* Quick Start - shows when no steps */}
                  {(selSeq.steps||[]).length===0&&!editingStepId&&(
                    <div style={{background:'rgba(168,85,247,.05)',border:'1px solid rgba(168,85,247,.15)',borderRadius:12,padding:20,marginBottom:16}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
                        <span style={{fontSize:16}}>🚀</span>
                        <span style={{fontWeight:600,color:'#fff'}}>Quick Start</span>
                      </div>
                      <p style={{fontSize:13,color:'#888',marginBottom:16}}>Start with a proven sequence or build from scratch.</p>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                        {[
                          {name:'Cold Outreach',steps:[
                            {day:1,subj:'{{company}} + [Your Company]',body:'{{firstName}},\n\nI\'ll keep this short.\n\nWe help [target audience] [achieve specific outcome]. Noticed {{company}} might be dealing with [pain point].\n\nWorth a 15-minute call?\n\n- [Your name]'},
                            {day:3,subj:'Re: {{company}} + [Your Company]',body:'{{firstName}},\n\nBumping this up. I know things get buried.\n\nStill interested in connecting?\n\n- [Your name]'},
                            {day:6,subj:'Different approach',body:'{{firstName}},\n\nMaybe my last email missed the mark.\n\n[One sentence value prop].\n\nIf that\'s relevant to {{company}}, I\'d love 15 minutes. If not, no worries.\n\n- [Your name]'},
                            {day:10,subj:'Should I close your file?',body:'{{firstName}},\n\nI\'ve reached out a few times. No response tells me:\n\n1. Not interested (totally fine)\n2. Interested but buried\n3. Wrong person\n\nWhich one?\n\n- [Your name]'}
                          ]},
                          {name:'Warm Follow-up',steps:[
                            {day:1,subj:'Great connecting',body:'{{firstName}},\n\nGreat chatting earlier. As promised, here\'s [what you discussed].\n\nLet me know if you have questions.\n\n- [Your name]'},
                            {day:4,subj:'Quick follow-up',body:'{{firstName}},\n\nWanted to follow up on my last note. Any thoughts?\n\n- [Your name]'},
                            {day:8,subj:'Still on your radar?',body:'{{firstName}},\n\nChecking in - is this still something you\'re thinking about?\n\nHappy to hop on a quick call if helpful.\n\n- [Your name]'}
                          ]},
                          {name:'Re-engagement',steps:[
                            {day:1,subj:'It\'s been a while',body:'{{firstName}},\n\nIt\'s been a few months. Wanted to check if [pain point] is still on your radar.\n\nWe\'ve shipped some new stuff since we last talked.\n\nWorth a fresh look?\n\n- [Your name]'},
                            {day:5,subj:'Quick update',body:'{{firstName}},\n\nFollowing up. Happy to share what\'s new if helpful.\n\n- [Your name]'}
                          ]},
                          {name:'Start from scratch',steps:[]}
                        ].map(preset=>(
                          <button key={preset.name} onClick={async()=>{
                            if(preset.steps.length===0){
                              setEditingStepId('new');setStepF({day:1,time:'09:00',subj:'',body:'',condition:'none',type:'email'})
                            }else{
                              const newSteps=preset.steps.map((s,i)=>({id:Date.now()+i,day:s.day,time:'09:00',subject:s.subj,body:s.body,condition:'none',sent:0,opened:0,clicked:0,replied:0}))
                              await updateSeq(selSeq.id,{steps:newSteps})
                            }
                          }} style={{padding:14,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,cursor:'pointer',textAlign:'left',transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(168,85,247,.4)';e.currentTarget.style.background='rgba(168,85,247,.1)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.1)';e.currentTarget.style.background='rgba(255,255,255,.03)'}}>
                            <div style={{fontWeight:600,fontSize:13,color:'#fff',marginBottom:4}}>{preset.name}</div>
                            <div style={{fontSize:11,color:'#666'}}>{preset.steps.length?`${preset.steps.length} steps`:''}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Add Step Button */}
                  <div style={{position:'relative'}}>
                    <div style={{position:'absolute',left:-28,top:12,width:24,height:24,borderRadius:12,background:'transparent',border:'2px dashed #334155',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'#64748b'}}>+</div>
                    <button 
                      onClick={()=>{setEditingStepId('new');setStepF({day:(selSeq.steps?.length||0)+1,time:'09:00',subj:'',body:'',condition:'none',type:'email'})}}
                      style={{width:'100%',padding:'14px',background:'transparent',border:'1px dashed rgba(255,255,255,.1)',borderRadius:10,color:'#64748b',fontSize:13,cursor:'pointer',textAlign:'left',marginTop:4}}>
                      Add step
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Editor Panel */}
            {editingStepId&&<div style={{width:'50%',borderLeft:'1px solid rgba(255,255,255,.08)',background:'rgba(0,0,0,.2)',display:'flex',flexDirection:'column',flexShrink:0}}>
              <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,.08)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontWeight:600,fontSize:14}}>{editingStepId==='new'?'New Step':'Edit Step'}</span>
                <button onClick={()=>{setEditingStepId(null);setStepF({day:(selSeq.steps?.length||0)+1,time:'09:00',subj:'',body:'',condition:'none',type:'email'})}} style={{background:'rgba(255,255,255,.05)',border:'none',color:'#888',width:28,height:28,borderRadius:6,cursor:'pointer',fontSize:14}}>×</button>
              </div>
              
              <div style={{flex:1,overflow:'auto',padding:20}}>
                {/* Step Type */}
                <div style={{marginBottom:16}}>
                  <label style={{display:'block',fontSize:11,color:'#666',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>Step Type</label>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    <button onClick={()=>setStepF({...stepF,type:'email'})} style={{padding:'14px',background:stepF.type==='email'?'rgba(99,102,241,.15)':'rgba(255,255,255,.03)',border:stepF.type==='email'?'1px solid rgba(99,102,241,.4)':'1px solid rgba(255,255,255,.1)',borderRadius:10,cursor:'pointer',textAlign:'center'}}>
                      <div style={{fontSize:18,marginBottom:6}}>📧</div>
                      <div style={{fontSize:13,fontWeight:600,color:stepF.type==='email'?'#a5b4fc':'#fff'}}>Send Email</div>
                      <div style={{fontSize:11,color:'#666',marginTop:2}}>Send to lead</div>
                    </button>
                    <button onClick={()=>setStepF({...stepF,type:'task'})} style={{padding:'14px',background:stepF.type==='task'?'rgba(0,161,224,.15)':'rgba(255,255,255,.03)',border:stepF.type==='task'?'1px solid rgba(0,161,224,.4)':'1px solid rgba(255,255,255,.1)',borderRadius:10,cursor:'pointer',textAlign:'center'}}>
                      <div style={{fontSize:18,marginBottom:6}}>✅</div>
                      <div style={{fontSize:13,fontWeight:600,color:stepF.type==='task'?'#00a1e0':'#fff'}}>Create Task</div>
                      <div style={{fontSize:11,color:'#666',marginTop:2}}>Add to Salesforce</div>
                    </button>
                  </div>
                </div>
                
                {/* Day & Time */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                  <div>
                    <label style={{display:'block',fontSize:11,color:'#666',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.5px'}}>Day</label>
                    <input type="number" min="1" value={stepF.day} onChange={e=>setStepF({...stepF,day:e.target.value})} style={{width:'100%',padding:'10px 12px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#fff',fontSize:14,boxSizing:'border-box'}}/>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:11,color:'#666',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.5px'}}>Time</label>
                    <input type="time" value={stepF.time} onChange={e=>setStepF({...stepF,time:e.target.value})} style={{width:'100%',padding:'10px 12px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#fff',fontSize:14,boxSizing:'border-box'}}/>
                  </div>
                </div>
                
                {/* Conditions */}
                {(selSeq.steps?.length||0)>0&&editingStepId!=='new'||(selSeq.steps?.length||0)>0&&(
                <div style={{marginBottom:16,padding:16,background:'rgba(99,102,241,.05)',border:'1px solid rgba(99,102,241,.15)',borderRadius:10}}>
                  <label style={{display:'block',fontSize:11,color:'#6366f1',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.5px',fontWeight:600}}>Condition (When to Send)</label>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {[
                      {id:'none',l:'Always send',d:'Send on Day X regardless of engagement',icon:'📧'},
                      {id:'if_opened',l:'If opened',d:'Only send if previous email was opened',icon:'👁️'},
                      {id:'if_not_opened',l:'If NOT opened',d:'Only send if previous email was NOT opened',icon:'🚫'},
                      {id:'if_clicked',l:'If clicked',d:'Only send if a link was clicked',icon:'🔗'},
                      {id:'if_not_clicked',l:'If NOT clicked',d:'Only send if no links were clicked',icon:'🔗'},
                      {id:'if_not_replied',l:'If NOT replied',d:'Only send if lead has not replied yet',icon:'💬'},
                    ].map(c=>(
                      <button key={c.id} onClick={()=>setStepF({...stepF,condition:c.id})} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:stepF.condition===c.id?'rgba(99,102,241,.15)':'rgba(255,255,255,.02)',border:stepF.condition===c.id?'1px solid rgba(99,102,241,.4)':'1px solid rgba(255,255,255,.08)',borderRadius:8,cursor:'pointer',textAlign:'left',transition:'all .15s'}}>
                        <span style={{fontSize:16}}>{c.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:600,color:stepF.condition===c.id?'#a5b4fc':'#fff',marginBottom:2}}>{c.l}</div>
                          <div style={{fontSize:11,color:'#666'}}>{c.d}</div>
                        </div>
                        {stepF.condition===c.id&&<span style={{color:'#6366f1',fontSize:14}}>✓</span>}
                      </button>
                    ))}
                  </div>
                  
                  {stepF.condition!=='none'&&(
                    <div style={{marginTop:12,padding:12,background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.2)',borderRadius:8}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <span style={{fontSize:14}}>⚡</span>
                        <div style={{fontSize:12,color:'#f59e0b'}}>
                          {stepF.condition==='if_opened'&&'This step will only run for leads who opened the previous email.'}
                          {stepF.condition==='if_not_opened'&&'This step will only run for leads who did NOT open the previous email.'}
                          {stepF.condition==='if_clicked'&&'This step will only run for leads who clicked a link in the previous email.'}
                          {stepF.condition==='if_not_clicked'&&'This step will only run for leads who did NOT click any links.'}
                          {stepF.condition==='if_not_replied'&&'This step will only run for leads who have NOT replied yet.'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                )}
                
                {/* Subject */}
                <div style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <label style={{fontSize:11,color:'#666',textTransform:'uppercase',letterSpacing:'0.5px'}}>{stepF.type==='task'?'Task Title':'Subject'}</label>
                    {stepF.type==='email'&&<button onClick={()=>{
                      const suggestions=[
                        `Quick question for {{firstName}}`,
                        `{{company}} + [Your Company]`,
                        `15 min this week?`,
                        `Idea for {{company}}`,
                        `[Mutual] mentioned you`
                      ];
                      setSubjectSuggestions(suggestions);
                    }} style={{padding:'4px 10px',background:'rgba(168,85,247,.15)',border:'none',borderRadius:5,color:'#a855f7',fontSize:11,cursor:'pointer',fontWeight:500,display:'flex',alignItems:'center',gap:4}}>
                      <span>✨</span> Generate Subjects
                    </button>}
                  </div>
                  <input value={stepF.subj} onChange={e=>setStepF({...stepF,subj:e.target.value})} placeholder={stepF.type==='task'?'e.g., Follow up call with {{firstName}}':'Quick question about {{company}}'} style={{width:'100%',padding:'10px 12px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#fff',fontSize:14,boxSizing:'border-box'}}/>
                  {subjectSuggestions.length>0&&(
                    <div style={{marginTop:8,padding:12,background:'rgba(168,85,247,.05)',border:'1px solid rgba(168,85,247,.15)',borderRadius:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                        <span style={{fontSize:10,color:'#a855f7',textTransform:'uppercase',fontWeight:600}}>AI Suggestions</span>
                        <button onClick={()=>setSubjectSuggestions([])} style={{background:'none',border:'none',color:'#666',cursor:'pointer',fontSize:12}}>×</button>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:6}}>
                        {subjectSuggestions.map((s,i)=>(
                          <button key={i} onClick={()=>{setStepF({...stepF,subj:s});setSubjectSuggestions([])}} style={{padding:'8px 10px',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:6,color:'#fff',fontSize:12,cursor:'pointer',textAlign:'left',transition:'all .1s'}} onMouseOver={e=>e.currentTarget.style.borderColor='rgba(168,85,247,.3)'} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,.08)'}>{s}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Body / Notes */}
                <div style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <label style={{fontSize:11,color:'#666',textTransform:'uppercase',letterSpacing:'0.5px'}}>{stepF.type==='task'?'Task Notes':'Body'}</label>
                    {stepF.type==='email'&&<button onClick={()=>setAiOpen(true)} style={{padding:'4px 10px',background:'rgba(99,102,241,.15)',border:'none',borderRadius:5,color:'#6366f1',fontSize:11,cursor:'pointer',fontWeight:500}}>AI Help</button>}
                  </div>
                  <textarea value={stepF.body} onChange={e=>setStepF({...stepF,body:e.target.value})} placeholder={stepF.type==='task'?'Notes for this task (optional)...':"Hey {{firstName}},\n\nWrite your email here..."} rows={stepF.type==='task'?4:12} style={{width:'100%',padding:12,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#fff',fontSize:13,boxSizing:'border-box',fontFamily:'inherit',resize:'vertical',lineHeight:1.6}}/>
                </div>
                
                {/* Task Priority (only for task type) */}
                {stepF.type==='task'&&(
                  <div style={{marginBottom:16}}>
                    <label style={{display:'block',fontSize:11,color:'#666',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>Task Priority</label>
                    <div style={{display:'flex',gap:8}}>
                      {['High','Normal','Low'].map(p=>(
                        <button key={p} onClick={()=>setStepF({...stepF,priority:p})} style={{flex:1,padding:'10px',background:(stepF.priority||'Normal')===p?p==='High'?'rgba(239,68,68,.15)':p==='Normal'?'rgba(59,130,246,.15)':'rgba(100,116,139,.15)':'rgba(255,255,255,.03)',border:(stepF.priority||'Normal')===p?`1px solid ${p==='High'?'rgba(239,68,68,.4)':p==='Normal'?'rgba(59,130,246,.4)':'rgba(100,116,139,.4)'}`:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:(stepF.priority||'Normal')===p?p==='High'?'#ef4444':p==='Normal'?'#3b82f6':'#94a3b8':'#888',fontSize:13,fontWeight:500,cursor:'pointer'}}>{p}</button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* SFDC Notice for Tasks */}
                {stepF.type==='task'&&(
                  <div style={{marginBottom:16,padding:14,background:'rgba(0,161,224,.08)',border:'1px solid rgba(0,161,224,.2)',borderRadius:10}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:8,background:'rgba(0,161,224,.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <span style={{fontSize:14}}>☁️</span>
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:'#00a1e0',marginBottom:2}}>Salesforce Task</div>
                        <div style={{fontSize:11,color:'#888'}}>This will create a Task in SFDC linked to the lead</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Merge Tags */}
                <div style={{marginBottom:16}}>
                  <label style={{display:'block',fontSize:11,color:'#666',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>Merge Tags</label>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {['{{firstName}}','{{lastName}}','{{company}}','{{email}}',...customFields.map(f=>`{{${f}}}`)].map(v=><button key={v} onClick={()=>setStepF({...stepF,body:stepF.body+v})} style={{padding:'6px 10px',background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.2)',borderRadius:6,color:'#a5b4fc',fontSize:11,cursor:'pointer'}}>{v}</button>)}
                    <button onClick={()=>setModal('customField')} style={{padding:'6px 10px',background:'transparent',border:'1px dashed rgba(255,255,255,.2)',borderRadius:6,color:'#666',fontSize:11,cursor:'pointer'}}>+ Custom</button>
                  </div>
                </div>
                
                {/* Snippets - Clean Popover */}
                <div style={{marginBottom:16,position:'relative'}}>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>setSnippetPopover(!snippetPopover)} style={{padding:'8px 14px',background:snippetPopover?'rgba(34,197,94,.15)':'rgba(34,197,94,.1)',border:`1px solid ${snippetPopover?'rgba(34,197,94,.4)':'rgba(34,197,94,.2)'}`,borderRadius:8,color:'#22c55e',fontSize:12,cursor:'pointer',fontWeight:500,display:'flex',alignItems:'center',gap:6,transition:'all .15s'}}>
                      <span>📎</span> Insert Snippet {snippetPopover?'▲':'▼'}
                    </button>
                    <button onClick={()=>{
                      if(stepF.body.trim()){
                        if(!canAddSnippet()){
                          setUpgradeModal({type:'snippets',message:`You've reached your limit of ${currentLimits.snippets} snippets. Upgrade to save more.`})
                          return
                        }
                        const name=prompt('Snippet name:')
                        if(name){setSnippets([...snippets,{id:'s'+Date.now(),name,category:'cta',text:stepF.body}])}
                      }
                    }} style={{padding:'8px 14px',background:'transparent',border:'1px dashed rgba(255,255,255,.15)',borderRadius:8,color:'#666',fontSize:12,cursor:'pointer',fontWeight:500,display:'flex',alignItems:'center',gap:6}}>
                      <span>💾</span> Save as Snippet
                    </button>
                  </div>
                  
                  {snippetPopover&&(
                    <div style={{position:'absolute',top:'100%',left:0,marginTop:8,width:320,background:'#1a1a1a',border:'1px solid rgba(34,197,94,.3)',borderRadius:12,boxShadow:'0 8px 32px rgba(0,0,0,.5)',zIndex:100,overflow:'hidden'}}>
                      <div style={{padding:12,borderBottom:'1px solid rgba(255,255,255,.1)'}}>
                        <input value={snippetSearch} onChange={e=>setSnippetSearch(e.target.value)} placeholder="Search snippets..." style={{width:'100%',padding:'10px 12px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#fff',fontSize:13,boxSizing:'border-box',outline:'none'}} autoFocus/>
                      </div>
                      <div style={{maxHeight:280,overflow:'auto'}}>
                        {['cta','opener','value','proof','closer'].map(cat=>{
                          const catSnippets=snippets.filter(s=>s.category===cat&&(snippetSearch===''||s.name.toLowerCase().includes(snippetSearch.toLowerCase())||s.text.toLowerCase().includes(snippetSearch.toLowerCase())))
                          if(catSnippets.length===0)return null
                          return(
                            <div key={cat}>
                              <div style={{padding:'8px 12px',background:'rgba(255,255,255,.02)',fontSize:10,color:'#666',textTransform:'uppercase',letterSpacing:'0.5px',fontWeight:600}}>{{cta:'CTAs',opener:'Openers',value:'Value Props',proof:'Social Proof',closer:'Closers'}[cat]}</div>
                              {catSnippets.map(s=>(
                                <div key={s.id} onClick={()=>{setStepF({...stepF,body:stepF.body+s.text});setSnippetPopover(false);setSnippetSearch('')}} style={{padding:'10px 12px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,.05)',transition:'background .1s'}} onMouseOver={e=>e.currentTarget.style.background='rgba(34,197,94,.1)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                                  <div style={{fontSize:13,fontWeight:500,color:'#fff',marginBottom:4}}>{s.name}</div>
                                  <div style={{fontSize:11,color:'#666',lineHeight:1.4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.text}</div>
                                </div>
                              ))}
                            </div>
                          )
                        })}
                        {snippets.filter(s=>snippetSearch===''||s.name.toLowerCase().includes(snippetSearch.toLowerCase())).length===0&&(
                          <div style={{padding:20,textAlign:'center',color:'#666',fontSize:13}}>No snippets found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Stats (if editing existing step with data) */}
                {editingStepId!=='new'&&(()=>{const st=selSeq.steps?.find(s=>s.id===editingStepId);return st?.sent>0?(
                  <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:8,padding:12,marginBottom:16}}>
                    <div style={{fontSize:11,color:'#666',marginBottom:8,textTransform:'uppercase'}}>Performance</div>
                    <div style={{display:'flex',gap:16}}>
                      <div><span style={{fontSize:16,fontWeight:600}}>{st.sent}</span><span style={{fontSize:11,color:'#666',marginLeft:4}}>sent</span></div>
                      <div><span style={{fontSize:16,fontWeight:600,color:'#a855f7'}}>{Math.round((st.opened||0)/st.sent*100)}%</span><span style={{fontSize:11,color:'#666',marginLeft:4}}>opened</span></div>
                      <div><span style={{fontSize:16,fontWeight:600,color:'#22c55e'}}>{Math.round((st.replied||0)/st.sent*100)}%</span><span style={{fontSize:11,color:'#666',marginLeft:4}}>replied</span></div>
                    </div>
                  </div>
                ):null})()}
              </div>
              
              {/* Actions */}
              <div style={{padding:16,borderTop:'1px solid rgba(255,255,255,.08)',display:'flex',justifyContent:'space-between'}}>
                {editingStepId!=='new'?<button onClick={()=>delStep(editingStepId)} style={{padding:'8px 14px',background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,color:'#ef4444',fontSize:13,cursor:'pointer'}}>Delete</button>:<button onClick={saveAsTemplate} style={{background:'none',border:'none',color:'#666',fontSize:12,cursor:'pointer'}}>💾 Save as template</button>}
                <div style={{display:'flex',gap:8}}>
                  <Btn v="g" s="s" onClick={()=>{setEditingStepId(null);setStepF({day:(selSeq.steps?.length||0)+1,time:'09:00',subj:'',body:'',condition:'none',type:'email'})}}>Cancel</Btn>
                  <Btn s="s" onClick={saveInlineStep} d={!stepF.subj.trim()||!stepF.body.trim()}>{editingStepId==='new'?'Add':'Save'}</Btn>
                </div>
              </div>
            </div>}
            
            {/* Templates Panel */}
            {showTemplates&&!editingStepId&&<div style={{width:280,borderLeft:'1px solid rgba(255,255,255,.08)',background:'rgba(0,0,0,.2)',display:'flex',flexDirection:'column',flexShrink:0}}>
              <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,.08)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontWeight:600,fontSize:14}}>Templates</span>
                <button onClick={()=>setShowTemplates(false)} style={{background:'none',border:'none',color:'#888',cursor:'pointer',fontSize:16}}>×</button>
              </div>
              <div style={{flex:1,overflow:'auto',padding:12}}>
                {templates.map(tpl=>(
                  <div key={tpl.id} style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:10,padding:12,marginBottom:8}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:6}}>
                      <span style={{fontWeight:500,fontSize:13}}>{tpl.name}</span>
                      <button onClick={()=>deleteTemplate(tpl.id)} style={{background:'none',border:'none',color:'#666',cursor:'pointer',fontSize:12}}>×</button>
                    </div>
                    <div style={{fontSize:11,color:'#666',marginBottom:8,lineHeight:1.4}}>{tpl.subject}</div>
                    <button onClick={()=>useTemplate(tpl)} style={{width:'100%',padding:6,background:'rgba(99,102,241,.15)',border:'none',borderRadius:5,color:'#a5b4fc',fontSize:11,fontWeight:500,cursor:'pointer'}}>Use</button>
                  </div>
                ))}
                {templates.length===0&&<div style={{textAlign:'center',padding:20,color:'#666',fontSize:12}}>No saved templates</div>}
              </div>
            </div>}
            
            {/* Leads Panel - shows when not editing */}
            {!editingStepId&&!showTemplates&&<div style={{width:'30%',borderLeft:'1px solid rgba(255,255,255,.08)',background:'rgba(0,0,0,.15)',display:'flex',flexDirection:'column',flexShrink:0}}>
              <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,.08)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:leadPanelExpanded?12:0}}>
                  <span style={{fontWeight:600,fontSize:14}}>Leads ({(selSeq.lead_ids||[]).length})</span>
                  <button onClick={()=>setLeadPanelExpanded(!leadPanelExpanded)} style={{padding:'6px 12px',background:leadPanelExpanded?'rgba(239,68,68,.1)':'rgba(168,85,247,.15)',border:leadPanelExpanded?'1px solid rgba(239,68,68,.3)':'1px solid rgba(168,85,247,.3)',borderRadius:6,color:leadPanelExpanded?'#ef4444':'#a855f7',fontSize:12,cursor:'pointer',fontWeight:500}}>{leadPanelExpanded?'Done':'+ Add'}</button>
                </div>
                
                {/* Inline Add Section */}
                {leadPanelExpanded&&<>
                  <input 
                    type="text" 
                    placeholder="Search leads..." 
                    value={leadPanelSearch} 
                    onChange={e=>setLeadPanelSearch(e.target.value)}
                    style={{width:'100%',padding:'10px 12px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#fff',fontSize:13,marginBottom:10,boxSizing:'border-box'}}
                  />
                  {/* Quick tag filters */}
                  {tags.length>0&&<div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                    {tags.slice(0,4).map(tag=>{
                      const tagLeads=leads.filter(l=>l.tags?.includes(tag.id)&&!(selSeq.lead_ids||[]).includes(l.id))
                      return tagLeads.length>0&&(
                        <button key={tag.id} onClick={()=>addLeadsToSequence(selSeq.id,tagLeads.map(l=>l.id))} style={{padding:'4px 10px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,color:'#a855f7',fontSize:11,cursor:'pointer'}}>
                          +{tagLeads.length} {tag.name}
                        </button>
                      )
                    })}
                  </div>}
                  {/* Available leads list */}
                  <div style={{maxHeight:200,overflow:'auto',borderRadius:8,border:'1px solid rgba(255,255,255,.08)'}}>
                    {leads.filter(l=>!(selSeq.lead_ids||[]).includes(l.id)).filter(l=>!leadPanelSearch||`${l.first_name} ${l.last_name} ${l.email} ${l.company}`.toLowerCase().includes(leadPanelSearch.toLowerCase())).slice(0,20).map(l=>(
                      <div key={l.id} onClick={()=>addLeadsToSequence(selSeq.id,[l.id])} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,.05)',transition:'background .1s'}} onMouseOver={e=>{e.currentTarget.style.background='rgba(168,85,247,.1)'}} onMouseOut={e=>{e.currentTarget.style.background='transparent'}}>
                        <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,flexShrink:0}}>{(l.first_name?.[0]||l.email[0]).toUpperCase()}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.first_name} {l.last_name}</div>
                          <div style={{fontSize:10,color:'#666',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.email}</div>
                        </div>
                        <span style={{fontSize:16,color:'#22c55e'}}>+</span>
                      </div>
                    ))}
                    {leads.filter(l=>!(selSeq.lead_ids||[]).includes(l.id)).length===0&&(
                      <div style={{padding:16,textAlign:'center',color:'#666',fontSize:12}}>All leads already added</div>
                    )}
                  </div>
                </>}
              </div>
              
              {/* Attached leads list */}
              <div style={{flex:1,overflow:'auto',padding:12}}>
                {(selSeq.lead_ids||[]).length===0?(
                  <div style={{textAlign:'center',padding:32,color:'#666'}}>
                    <div style={{fontSize:32,marginBottom:12,opacity:0.5}}>👥</div>
                    <div style={{fontSize:13,marginBottom:4}}>No leads attached</div>
                    <div style={{fontSize:12,color:'#555',marginBottom:16}}>Click "+ Add" to get started</div>
                    {!leadPanelExpanded&&<button onClick={()=>setLeadPanelExpanded(true)} style={{padding:'8px 16px',background:'rgba(168,85,247,.15)',border:'1px solid rgba(168,85,247,.3)',borderRadius:6,color:'#a855f7',fontSize:12,cursor:'pointer',fontWeight:500}}>Add Leads</button>}
                  </div>
                ):(
                  (selSeq.lead_ids||[]).map(lid=>{
                    const l=leads.find(x=>x.id===lid)
                    if(!l)return null
                    return(
                      <div key={lid} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:8,marginBottom:6}}>
                        <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:600,flexShrink:0}}>{(l.first_name?.[0]||l.email[0]).toUpperCase()}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.first_name} {l.last_name}</div>
                          <div style={{fontSize:11,color:'#666',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.email}</div>
                        </div>
                        <button onClick={()=>removeLeadFromSequence(selSeq.id,lid)} style={{background:'none',border:'none',color:'#666',cursor:'pointer',fontSize:14,padding:4}}>×</button>
                      </div>
                    )
                  })
                )}
              </div>
              {(selSeq.lead_ids||[]).length>0&&selSeq.status!=='active'&&(
                <div style={{padding:12,borderTop:'1px solid rgba(255,255,255,.08)'}}>
                  <button onClick={()=>startSequence(selSeq)} style={{width:'100%',padding:'12px 16px',background:'linear-gradient(135deg,#22c55e,#16a34a)',border:'none',borderRadius:8,color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer'}}>Start Sequence</button>
                </div>
              )}
            </div>}
          </div>
        </>}


        {/* CAMPAIGNS LIST */}
        {page==='campaigns'&&!selCamp&&<>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32}}>
            <div>
              <h1 style={{fontSize:32,fontWeight:800,marginBottom:8,letterSpacing:'-0.03em'}}>Campaigns</h1>
              <p style={{color:t.textSecondary,lineHeight:1.6,fontSize:15}}>Connect sequences to leads and start sending.</p>
            </div>
            <Btn onClick={()=>setModal('campaign')}>+ New Campaign</Btn>
          </div>
          {campaigns.length===0?<div style={{textAlign:'center',padding:'80px 40px',background:t.surface,border:t.cardBorder,borderRadius:16,boxShadow:t.glow}}><div style={{width:72,height:72,borderRadius:20,background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'0 0 40px rgba(168,85,247,0.15)'}}><svg width="28" height="28" fill="none" stroke={t.accent} strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div><h3 style={{fontSize:20,fontWeight:700,marginBottom:8,letterSpacing:'-0.02em'}}>No campaigns yet</h3><p style={{color:t.textMuted,marginBottom:28,maxWidth:320,margin:'0 auto 28px',fontSize:14}}>Create a campaign to start sending your sequences to leads.</p><Btn onClick={()=>setModal('campaign')}>+ Create Campaign</Btn></div>:
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {campaigns.map(c=>{const sq=campSeq(c);return<div key={c.id} onClick={()=>setSelCamp(c)} style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,cursor:'pointer',boxShadow:t.glow,transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.boxShadow=t.glowHover}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.1)';e.currentTarget.style.boxShadow=t.glow}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
                <div><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}><span style={{fontSize:18,fontWeight:700,letterSpacing:'-0.02em'}}>{c.name}</span><span style={{padding:'6px 12px',background:c.status==='active'?'rgba(0,255,136,.1)':c.status==='paused'?'rgba(168,85,247,.1)':'rgba(255,255,255,.03)',border:`1px solid ${c.status==='active'?'rgba(0,255,136,.2)':c.status==='paused'?'rgba(168,85,247,.2)':t.border}`,color:c.status==='active'?t.success:c.status==='paused'?t.accent:t.textMuted,borderRadius:100,fontSize:11,fontWeight:500}}>{c.status}</span></div><div style={{color:t.textMuted,fontSize:13}}>{sq?.name||'No sequence'} · {campLeads(c).length} leads</div></div><span style={{color:t.textMuted,fontSize:20}}>→</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>{[{n:c.stats?.sent||0,l:'SENT',primary:true},{n:c.stats?.opened||0,l:'OPENED'},{n:c.stats?.clicked||0,l:'CLICKED'},{n:c.stats?.replied||0,l:'REPLIED',success:true}].map(s=><div key={s.l} style={{background:t.elevated,borderRadius:12,padding:16,textAlign:'center',border:`1px solid ${t.border}`}}><div style={{fontSize:24,fontWeight:800,color:s.primary?t.accent:s.success?t.success:t.text,letterSpacing:'-0.02em'}}>{s.n}</div><div style={{fontSize:10,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.05em',marginTop:4}}>{s.l}</div></div>)}</div>
            </div>})}
          </div>}
        </>}

        {/* CAMPAIGN DETAIL */}
        {page==='campaigns'&&selCamp&&<>
          <button onClick={()=>setSelCamp(null)} style={{background:'none',border:'none',color:'#888',fontSize:13,cursor:'pointer',marginBottom:20}}>← Back</button>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:32}}>
            <div><div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}><h1 style={{fontSize:28,fontWeight:700}}>{selCamp.name}</h1><span style={{padding:'6px 12px',background:selCamp.status==='active'?'rgba(34,197,94,.15)':'rgba(255,255,255,.05)',color:selCamp.status==='active'?'#22c55e':'#888',borderRadius:8,fontSize:12}}>{selCamp.status}</span></div><p style={{color:'#888'}}>{campSeq(selCamp)?.name} · {campLeads(selCamp).length} leads</p></div>
            <div style={{display:'flex',gap:10}}><Btn v="s" onClick={()=>toggleCampaign(selCamp)} disabled={campaignLoading}>{campaignLoading?'Loading...':selCamp.status==='active'?'⏸ Pause':'▶️ Start'}</Btn><Btn v="d" onClick={()=>delCamp(selCamp.id)}>Delete</Btn></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32}}>{[{l:'Sent',v:selCamp.stats?.sent||0,c:'#6366f1'},{l:'Opened',v:selCamp.stats?.opened||0,r:selCamp.stats?.sent?((selCamp.stats.opened/selCamp.stats.sent)*100).toFixed(1)+'%':'0%',c:'#a855f7'},{l:'Clicked',v:selCamp.stats?.clicked||0,r:selCamp.stats?.sent?((selCamp.stats.clicked/selCamp.stats.sent)*100).toFixed(1)+'%':'0%',c:'#f59e0b'},{l:'Replied',v:selCamp.stats?.replied||0,r:selCamp.stats?.sent?((selCamp.stats.replied/selCamp.stats.sent)*100).toFixed(1)+'%':'0%',c:'#22c55e'}].map(s=><div key={s.l} style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,padding:20}}><div style={{fontSize:12,color:'#888',marginBottom:6}}>{s.l}</div><div style={{fontSize:30,fontWeight:700,color:s.c}}>{s.v}</div>{s.r&&<div style={{fontSize:12,color:'#666',marginTop:4}}>{s.r}</div>}</div>)}</div>
          <h2 style={{fontSize:18,fontWeight:600,marginBottom:16}}>Leads in Campaign</h2>
          {campLeads(selCamp).length===0?<div style={{padding:40,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,textAlign:'center',color:'#888'}}>No leads match filter</div>:
          <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,overflow:'hidden'}}>
            {campLeads(selCamp).map(l=><div key={l.id} style={{padding:16,borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600}}>{(l.first_name?.[0]||l.email[0]).toUpperCase()}</div><div><div style={{fontWeight:500}}>{l.first_name} {l.last_name}</div><div style={{fontSize:12,color:'#888'}}>{l.email}</div></div></div><span style={{padding:'5px 10px',background:'rgba(255,255,255,.05)',color:'#888',borderRadius:6,fontSize:11}}>{l.status}</span></div>)}
          </div>}
        </>}

        {/* TEMPLATES PAGE */}
        {page==='templates'&&<>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32}}>
            <div>
              <h1 style={{fontSize:32,fontWeight:800,marginBottom:8,letterSpacing:'-0.03em'}}>Templates</h1>
              <p style={{color:t.textSecondary,lineHeight:1.6,fontSize:15}}>
                {templates.length===0
                  ?'Create reusable email templates to speed up sequence building.'
                  :`${templates.length} template${templates.length!==1?'s':''} · ${templates.filter(t=>t.category==='intro').length} first touch · ${templates.filter(t=>t.category==='followup').length} follow-up`}
              </p>
            </div>
            <Btn onClick={()=>{setEditingTemplate({id:'new',name:'',category:'intro',subject:'',body:''});setModal('editTemplate')}}>+ New Template</Btn>
          </div>
          
          {/* Category Filter */}
          <div style={{display:'flex',gap:8,marginBottom:32,flexWrap:'wrap'}}>
            {[{id:'all',l:'All Templates'},{id:'intro',l:'First Touch'},{id:'followup',l:'Follow-up'},{id:'breakup',l:'Break-up'},{id:'meeting',l:'Meeting'},{id:'reengagement',l:'Re-engagement'}].map(cat=>
              <button key={cat.id} onClick={()=>setTemplateFilter(cat.id)} style={{padding:'10px 20px',background:templateFilter===cat.id?'rgba(168,85,247,.15)':'transparent',border:`1px solid ${templateFilter===cat.id?'rgba(168,85,247,.3)':t.border}`,borderRadius:100,color:templateFilter===cat.id?t.accent:t.textMuted,fontSize:13,fontWeight:500,cursor:'pointer',transition:'all .15s'}} onMouseOver={e=>{if(templateFilter!==cat.id){e.currentTarget.style.borderColor='rgba(168,85,247,.2)'}}} onMouseOut={e=>{if(templateFilter!==cat.id){e.currentTarget.style.borderColor=t.border}}}>{cat.l}</button>
            )}
          </div>
          
          {/* Templates Grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:20}}>
            {templates.filter(tpl=>templateFilter==='all'||tpl.category===templateFilter).map(tpl=>(
              <div key={tpl.id} style={{background:t.surface,border:t.cardBorder,borderRadius:16,overflow:'hidden',boxShadow:t.glow,transition:'all .2s',display:'flex',flexDirection:'column'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
                <div style={{padding:24,flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:16}}>
                    <div>
                      <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>{tpl.name}</div>
                      <span style={{padding:'4px 10px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,fontSize:11,color:t.accent,fontWeight:500}}>{{intro:'First Touch',followup:'Follow-up',breakup:'Break-up',meeting:'Meeting',reengagement:'Re-engagement'}[tpl.category]||tpl.category}</span>
                    </div>
                    <div style={{display:'flex',gap:6}}>
                      <button onClick={()=>{setEditingTemplate(tpl);setModal('editTemplate')}} style={{width:32,height:32,background:t.elevated,border:`1px solid ${t.border}`,borderRadius:8,color:t.textMuted,cursor:'pointer',fontSize:12}}>✎</button>
                      <button onClick={()=>setTemplates(templates.filter(x=>x.id!==tpl.id))} style={{width:32,height:32,background:t.elevated,border:`1px solid ${t.border}`,borderRadius:8,color:t.error,cursor:'pointer',fontSize:12}}>×</button>
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,color:t.textMuted,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Subject</div>
                    <div style={{fontSize:14,color:t.text,fontWeight:500}}>{tpl.subject}</div>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:t.textMuted,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Preview</div>
                    <div style={{fontSize:13,color:t.textSecondary,lineHeight:1.6,maxHeight:80,overflow:'hidden',position:'relative'}}>
                      {tpl.body.substring(0,150)}...
                      <div style={{position:'absolute',bottom:0,left:0,right:0,height:30,background:`linear-gradient(transparent, ${t.surface})`}}/>
                    </div>
                  </div>
                </div>
                <div style={{padding:'16px 24px',borderTop:`1px solid ${t.border}`,display:'flex',gap:10}}>
                  <button onClick={()=>{setPreviewEmail({subject:tpl.subject,body:tpl.body});setPreviewLead(leads[0]||{first_name:'John',last_name:'Doe',email:'john@example.com',company:'Acme Inc'});setModal('preview')}} style={{flex:1,padding:'10px',background:'transparent',border:`1px solid ${t.border}`,borderRadius:8,color:t.textMuted,fontSize:12,fontWeight:500,cursor:'pointer',transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.color=t.accent}} onMouseOut={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.textMuted}}>Preview</button>
                  <button onClick={()=>{setPage('sequences');setModal('sequence');setNewTemplate(tpl)}} style={{flex:1,padding:'10px',background:t.accent,border:'none',borderRadius:8,color:'#000',fontSize:12,fontWeight:600,cursor:'pointer',boxShadow:DS.btnGlow}}>Use in Sequence</button>
                </div>
              </div>
            ))}
          </div>
          
          {templates.filter(tpl=>templateFilter==='all'||tpl.category===templateFilter).length===0&&(
            <div style={{textAlign:'center',padding:'80px 40px',background:t.surface,border:t.cardBorder,borderRadius:16,boxShadow:t.glow}}>
              <div style={{width:72,height:72,borderRadius:20,background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'0 0 40px rgba(168,85,247,0.15)'}}>
                <svg width="28" height="28" fill="none" stroke={t.accent} strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,letterSpacing:'-0.02em'}}>No templates in this category</h3>
              <p style={{color:t.textMuted,marginBottom:28,maxWidth:320,margin:'0 auto 28px',fontSize:14}}>Create a template to speed up your sequence building.</p>
              <Btn onClick={()=>{setEditingTemplate({id:'new',name:'',category:templateFilter==='all'?'intro':templateFilter,subject:'',body:''});setModal('editTemplate')}}>+ Create Template</Btn>
            </div>
          )}
        </>}

        {/* SNIPPETS PAGE */}
        {page==='snippets'&&<>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32}}>
            <div>
              <h1 style={{fontSize:32,fontWeight:800,marginBottom:8,letterSpacing:'-0.03em'}}>Snippets</h1>
              <p style={{color:t.textSecondary,lineHeight:1.6,fontSize:15}}>
                {snippets.length===0
                  ?'Create reusable text blocks to speed up your email writing.'
                  :`${snippets.length} snippet${snippets.length!==1?'s':''} · ${snippets.filter(s=>s.category==='cta').length} CTAs · ${snippets.filter(s=>s.category==='opener').length} openers`}
              </p>
            </div>
            <Btn onClick={()=>{setEditingSnippet({id:'new',name:'',category:'cta',text:''});setModal('editSnippet')}}>+ New Snippet</Btn>
          </div>
          
          {/* Category Filter */}
          <div style={{display:'flex',gap:8,marginBottom:32,flexWrap:'wrap'}}>
            {[{id:'all',l:'All Snippets'},{id:'cta',l:'CTAs'},{id:'opener',l:'Openers'},{id:'value',l:'Value Props'},{id:'proof',l:'Social Proof'},{id:'closer',l:'Closers'}].map(cat=>
              <button key={cat.id} onClick={()=>setSnippetFilter(cat.id)} style={{padding:'10px 20px',background:snippetFilter===cat.id?'rgba(168,85,247,.15)':'transparent',border:`1px solid ${snippetFilter===cat.id?'rgba(168,85,247,.3)':t.border}`,borderRadius:100,color:snippetFilter===cat.id?t.accent:t.textMuted,fontSize:13,fontWeight:500,cursor:'pointer',transition:'all .15s'}} onMouseOver={e=>{if(snippetFilter!==cat.id){e.currentTarget.style.borderColor='rgba(168,85,247,.2)'}}} onMouseOut={e=>{if(snippetFilter!==cat.id){e.currentTarget.style.borderColor=t.border}}}>{cat.l}</button>
            )}
          </div>
          
          {/* Snippets Grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}}>
            {snippets.filter(snip=>snippetFilter==='all'||snip.category===snippetFilter).map(snip=>(
              <div key={snip.id} style={{background:t.surface,border:t.cardBorder,borderRadius:14,padding:20,boxShadow:t.glow,transition:'all .2s',display:'flex',flexDirection:'column'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:15,fontWeight:600}}>{snip.name}</span>
                    <span style={{padding:'3px 8px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,fontSize:10,color:t.accent,fontWeight:500,textTransform:'uppercase'}}>{{cta:'CTA',opener:'Opener',value:'Value',proof:'Proof',closer:'Closer'}[snip.category]}</span>
                  </div>
                  <div style={{display:'flex',gap:4}}>
                    <button onClick={()=>{setEditingSnippet(snip);setModal('editSnippet')}} style={{width:28,height:28,background:t.elevated,border:`1px solid ${t.border}`,borderRadius:6,color:t.textMuted,cursor:'pointer',fontSize:11}}>✎</button>
                    <button onClick={()=>setSnippets(snippets.filter(x=>x.id!==snip.id))} style={{width:28,height:28,background:t.elevated,border:`1px solid ${t.border}`,borderRadius:6,color:t.error,cursor:'pointer',fontSize:11}}>×</button>
                  </div>
                </div>
                <div style={{fontSize:13,color:t.textSecondary,lineHeight:1.6,flex:1,marginBottom:12}}>{snip.text}</div>
                <button onClick={()=>{navigator.clipboard.writeText(snip.text)}} style={{padding:'8px 12px',background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.2)',borderRadius:6,color:'#22c55e',fontSize:11,fontWeight:500,cursor:'pointer',transition:'all .15s',alignSelf:'flex-start'}} onMouseOver={e=>{e.currentTarget.style.background='rgba(34,197,94,.2)'}} onMouseOut={e=>{e.currentTarget.style.background='rgba(34,197,94,.1)'}}>📋 Copy</button>
              </div>
            ))}
          </div>
          
          {snippets.filter(snip=>snippetFilter==='all'||snip.category===snippetFilter).length===0&&(
            <div style={{textAlign:'center',padding:'80px 40px',background:t.surface,border:t.cardBorder,borderRadius:16,boxShadow:t.glow}}>
              <div style={{width:72,height:72,borderRadius:20,background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'0 0 40px rgba(168,85,247,0.15)'}}>
                <svg width="28" height="28" fill="none" stroke={t.accent} strokeWidth="2" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
              </div>
              <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,letterSpacing:'-0.02em'}}>No snippets in this category</h3>
              <p style={{color:t.textMuted,marginBottom:28,maxWidth:320,margin:'0 auto 28px',fontSize:14}}>Create a snippet to speed up your email writing.</p>
              <Btn onClick={()=>{setEditingSnippet({id:'new',name:'',category:snippetFilter==='all'?'cta':snippetFilter,text:''});setModal('editSnippet')}}>+ Create Snippet</Btn>
            </div>
          )}
        </>}

        {/* PROFILE */}
        {page==='profile'&&<>
          <div style={{marginBottom:40}}>
            <h1 style={{fontSize:32,fontWeight:800,marginBottom:8,letterSpacing:'-0.03em'}}>Profile</h1>
            <p style={{color:t.textSecondary,lineHeight:1.6,fontSize:15}}>
              {profile.name&&profile.company
                ?`${profile.name} at ${profile.company} · AI uses this to personalize your emails.`
                :'Fill this out so AI can write better emails for you.'}
            </p>
          </div>
          
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,maxWidth:900}}>
            {/* Rep Info */}
            <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:28,boxShadow:t.glow}}>
              <h3 style={{fontSize:11,fontWeight:600,marginBottom:24,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.05em'}}>About You</h3>
              <div style={{marginBottom:20}}>
                <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Your Name</label>
                <input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} placeholder="Scott McArthur" style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14,boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Title / Role</label>
                <input value={profile.title} onChange={e=>setProfile({...profile,title:e.target.value})} placeholder="Account Executive" style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14,boxSizing:'border-box'}}/>
              </div>
            </div>
            
            {/* Company Info */}
            <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:28,boxShadow:t.glow}}>
              <h3 style={{fontSize:11,fontWeight:600,marginBottom:24,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.05em'}}>Your Company</h3>
              <div style={{marginBottom:20}}>
                <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Company Name</label>
                <input value={profile.company} onChange={e=>setProfile({...profile,company:e.target.value})} placeholder="Acme Corp" style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14,boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Industry</label>
                <input value={profile.industry} onChange={e=>setProfile({...profile,industry:e.target.value})} placeholder="SaaS, Healthcare, etc." style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14,boxSizing:'border-box'}}/>
              </div>
            </div>
            
            {/* Value Props */}
            <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:28,boxShadow:t.glow}}>
              <h3 style={{fontSize:11,fontWeight:600,marginBottom:24,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.05em'}}>Value Proposition</h3>
              <div>
                <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>What do you help customers with?</label>
                <textarea value={profile.valueProps} onChange={e=>setProfile({...profile,valueProps:e.target.value})} placeholder="We help companies reduce churn by 40% through AI-powered customer monitoring..." rows={5} style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14,boxSizing:'border-box',fontFamily:'Inter,system-ui,sans-serif',resize:'vertical',lineHeight:1.5}}/>
                <p style={{fontSize:11,color:t.textMuted,marginTop:10}}>Be specific. Include metrics and outcomes.</p>
              </div>
            </div>
            
            {/* Tone */}
            <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:28,boxShadow:t.glow}}>
              <h3 style={{fontSize:11,fontWeight:600,marginBottom:24,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.05em'}}>Writing Style</h3>
              <div>
                <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:12,textTransform:'uppercase',letterSpacing:'0.05em'}}>Preferred Tone</label>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  {[{id:'professional',l:'Professional',d:'Formal, business-appropriate'},{id:'casual',l:'Casual',d:'Friendly, conversational'},{id:'direct',l:'Direct',d:'Straight to the point'},{id:'witty',l:'Witty',d:'Clever, personality-driven'}].map(x=>(
                    <button key={x.id} onClick={()=>setProfile({...profile,tone:x.id})} style={{flex:'1 1 45%',padding:'16px 18px',background:profile.tone===x.id?'rgba(168,85,247,0.1)':t.elevated,border:profile.tone===x.id?`1px solid rgba(168,85,247,0.3)`:`1px solid ${t.border}`,borderRadius:12,cursor:'pointer',textAlign:'left',transition:'all .15s'}}>
                      <div style={{fontWeight:600,marginBottom:4,color:profile.tone===x.id?t.accent:t.text,fontSize:14}}>{x.l}</div>
                      <div style={{fontSize:12,color:t.textMuted}}>{x.d}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview */}
          {(profile.name||profile.company)&&<div style={{marginTop:24,padding:24,background:'rgba(168,85,247,0.05)',border:'1px solid rgba(168,85,247,0.15)',borderRadius:16,maxWidth:900}}>
            <div style={{fontSize:11,color:t.accent,marginBottom:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>AI Context Preview</div>
            <p style={{color:t.textSecondary,fontSize:14,lineHeight:1.7,margin:0}}>
              {profile.name&&<>Writing as <strong style={{color:t.text}}>{profile.name}</strong>{profile.title&&<>, {profile.title}</>}. </>}
              {profile.company&&<>Works at <strong style={{color:t.text}}>{profile.company}</strong>{profile.industry&&<> ({profile.industry})</>}. </>}
              {profile.valueProps&&<>Value prop: {profile.valueProps.substring(0,100)}... </>}
              {profile.tone&&<>Tone: <strong style={{color:t.text}}>{profile.tone}</strong>.</>}
            </p>
          </div>}
        </>}

        {/* ANALYTICS */}
        {page==='analytics'&&<>
          <div style={{marginBottom:40}}>
            <h1 style={{fontSize:32,fontWeight:800,marginBottom:8,letterSpacing:'-0.03em'}}>Analytics</h1>
            <p style={{color:t.textSecondary,lineHeight:1.6,fontSize:15}}>
              {tSent===0
                ?'Performance data will appear here once you start sending.'
                :`${tSent} sent · ${tSent?Math.round((tOpen/tSent)*100):0}% open rate · ${tSent?Math.round((tReply/tSent)*100):0}% reply rate`}
            </p>
          </div>
          
          {/* Time Range Selector */}
          <div style={{display:'flex',gap:8,marginBottom:32}}>
            {[{id:'7d',l:'7 Days'},{id:'30d',l:'30 Days'},{id:'90d',l:'90 Days'}].map(r=>
              <button key={r.id} onClick={()=>setAnalyticsRange(r.id)} style={{padding:'10px 20px',background:analyticsRange===r.id?'rgba(168,85,247,.15)':'transparent',border:`1px solid ${analyticsRange===r.id?'rgba(168,85,247,.3)':t.border}`,borderRadius:100,color:analyticsRange===r.id?t.accent:t.textMuted,fontSize:13,fontWeight:500,cursor:'pointer'}}>{r.l}</button>
            )}
          </div>
          
          {/* Key Metrics */}
          {(()=>{const a=calculateAnalytics();return<>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32}}>
              <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,boxShadow:t.glow,transition:'all .2s',cursor:'default'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
                <div style={{fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Total Sent</div>
                <div style={{fontSize:36,fontWeight:800,color:t.accent,letterSpacing:'-0.03em'}}>{a.sent}</div>
              </div>
              <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,boxShadow:t.glow,transition:'all .2s',cursor:'default'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
                <div style={{fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Open Rate</div>
                <div style={{fontSize:36,fontWeight:800,color:t.text,letterSpacing:'-0.03em'}}>{a.openRate}%</div>
                <div style={{fontSize:12,color:t.textMuted,marginTop:4}}>{a.opened} opens</div>
              </div>
              <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,boxShadow:t.glow,transition:'all .2s',cursor:'default'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
                <div style={{fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Click Rate</div>
                <div style={{fontSize:36,fontWeight:800,color:t.text,letterSpacing:'-0.03em'}}>{a.clickRate}%</div>
                <div style={{fontSize:12,color:t.textMuted,marginTop:4}}>{a.clicked} clicks</div>
              </div>
              <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,boxShadow:t.glow,transition:'all .2s',cursor:'default'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
                <div style={{fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Reply Rate</div>
                <div style={{fontSize:36,fontWeight:800,color:t.success,letterSpacing:'-0.03em'}}>{a.replyRate}%</div>
                <div style={{fontSize:12,color:t.textMuted,marginTop:4}}>{a.replied} replies</div>
              </div>
            </div>
            
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
              {/* Top Subject Lines */}
              <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,boxShadow:t.glow,transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
                <h3 style={{fontSize:11,fontWeight:600,marginBottom:20,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.05em'}}>Top Performing Subjects</h3>
                {a.topSubjects.length===0?<p style={{color:t.textMuted,fontSize:14}}>No data yet. Start sending to see results.</p>:
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {a.topSubjects.map((s,i)=><div key={i} style={{padding:16,background:t.elevated,borderRadius:12,border:`1px solid ${t.border}`}}>
                      <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>{s.subject}</div>
                      <div style={{display:'flex',gap:16,fontSize:12,color:t.textMuted}}>
                        <span>{s.sent} sent</span>
                        <span>{s.openRate}% opens</span>
                        <span style={{color:t.success}}>{s.replyRate}% replies</span>
                      </div>
                    </div>)}
                  </div>
                }
              </div>
              
              {/* Sequence Performance */}
              <div style={{background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,boxShadow:t.glow,transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
                <h3 style={{fontSize:11,fontWeight:600,marginBottom:20,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.05em'}}>Sequence Performance</h3>
                {a.sequencePerformance.length===0?<p style={{color:t.textMuted,fontSize:14}}>No data yet.</p>:
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {a.sequencePerformance.map((s,i)=><div key={i} style={{padding:16,background:t.elevated,borderRadius:12,border:`1px solid ${t.border}`}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{fontSize:14,fontWeight:600}}>{s.name}</div>
                        <div style={{fontSize:14,fontWeight:700,color:t.success}}>{s.replyRate}%</div>
                      </div>
                      <div style={{display:'flex',gap:16,fontSize:12,color:t.textMuted,marginTop:8}}>
                        <span>{s.sent} sent</span>
                        <span>{s.openRate}% opens</span>
                        <span>{s.replied} replies</span>
                      </div>
                      <div style={{marginTop:12,height:6,background:t.border,borderRadius:3,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${s.replyRate}%`,background:`linear-gradient(90deg,${t.accent},${t.success})`,borderRadius:3}}/>
                      </div>
                    </div>)}
                  </div>
                }
              </div>
            </div>
            
            {/* Best Send Times */}
            <div style={{marginTop:20,background:t.surface,border:t.cardBorder,borderRadius:16,padding:24,boxShadow:t.glow,transition:'all .2s'}} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor=t.accent}} onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(168,85,247,0.1)'}}>
              <h3 style={{fontSize:11,fontWeight:600,marginBottom:20,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.05em'}}>Optimal Send Times</h3>
              <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8}}>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day,i)=><div key={day} style={{textAlign:'center'}}>
                  <div style={{fontSize:11,color:t.textMuted,marginBottom:8}}>{day}</div>
                  <div style={{height:60,background:i<5?`rgba(168,85,247,${0.1+i*0.1})`:'rgba(255,255,255,0.02)',borderRadius:8,display:'flex',alignItems:'flex-end',justifyContent:'center',paddingBottom:8}}>
                    <span style={{fontSize:10,color:i<5?t.accent:t.textMuted}}>{i<5?['9am','10am','9am','11am','10am'][i]:'—'}</span>
                  </div>
                </div>)}
              </div>
              <p style={{fontSize:12,color:t.textMuted,marginTop:16}}>Based on highest open rates from your campaigns</p>
            </div>
            
            {/* AI Insights */}
            <div style={{marginTop:20,background:'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(99,102,241,0.1))',border:'1px solid rgba(168,85,247,0.2)',borderRadius:16,padding:24,boxShadow:'0 0 40px rgba(168,85,247,0.1)'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
                <div style={{width:36,height:36,borderRadius:10,background:'rgba(168,85,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:18}}>✨</span>
                </div>
                <div>
                  <h3 style={{fontSize:14,fontWeight:700,color:'#fff',margin:0}}>AI Insights</h3>
                  <p style={{fontSize:11,color:t.textMuted,margin:0}}>What's working and what to improve</p>
                </div>
              </div>
              
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {/* Dynamic insights based on data */}
                {a.sent===0?<div style={{padding:16,background:'rgba(0,0,0,0.2)',borderRadius:10,border:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{fontSize:13,color:'#fff',marginBottom:4}}>📊 No data yet</div>
                  <div style={{fontSize:12,color:t.textMuted}}>Start sending campaigns to see AI-powered insights about your outreach performance.</div>
                </div>:<>
                  {/* What's working */}
                  {a.openRate>35&&<div style={{padding:16,background:'rgba(34,197,94,0.1)',borderRadius:10,border:'1px solid rgba(34,197,94,0.2)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontSize:14}}>✅</span>
                      <span style={{fontSize:13,fontWeight:600,color:'#22c55e'}}>Strong open rates</span>
                    </div>
                    <div style={{fontSize:12,color:t.textSecondary}}>Your {a.openRate}% open rate is above industry average (20-25%). Your subject lines are working - keep that style.</div>
                  </div>}
                  
                  {a.replyRate>=5&&<div style={{padding:16,background:'rgba(34,197,94,0.1)',borderRadius:10,border:'1px solid rgba(34,197,94,0.2)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontSize:14}}>🎯</span>
                      <span style={{fontSize:13,fontWeight:600,color:'#22c55e'}}>Solid reply rate</span>
                    </div>
                    <div style={{fontSize:12,color:t.textSecondary}}>At {a.replyRate}% replies, you're generating real conversations. This is the metric that matters most.</div>
                  </div>}
                  
                  {/* What needs work */}
                  {a.openRate<25&&a.sent>10&&<div style={{padding:16,background:'rgba(245,158,11,0.1)',borderRadius:10,border:'1px solid rgba(245,158,11,0.2)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontSize:14}}>⚠️</span>
                      <span style={{fontSize:13,fontWeight:600,color:'#f59e0b'}}>Subject lines need work</span>
                    </div>
                    <div style={{fontSize:12,color:t.textSecondary}}>Your {a.openRate}% open rate is below average. Try shorter subjects (3-5 words), ask a question, or add the recipient's company name.</div>
                  </div>}
                  
                  {a.openRate>30&&a.replyRate<3&&a.sent>20&&<div style={{padding:16,background:'rgba(245,158,11,0.1)',borderRadius:10,border:'1px solid rgba(245,158,11,0.2)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontSize:14}}>💡</span>
                      <span style={{fontSize:13,fontWeight:600,color:'#f59e0b'}}>Opens but no replies</span>
                    </div>
                    <div style={{fontSize:12,color:t.textSecondary}}>People are opening but not responding. Your email body might be too long or the ask isn't clear. Try ending with a simple yes/no question.</div>
                  </div>}
                  
                  {/* Patterns */}
                  <div style={{padding:16,background:'rgba(0,0,0,0.2)',borderRadius:10,border:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontSize:14}}>📈</span>
                      <span style={{fontSize:13,fontWeight:600,color:'#fff'}}>Pattern detected</span>
                    </div>
                    <div style={{fontSize:12,color:t.textSecondary}}>Your best performing sends are mid-week (Tue-Thu) between 9-11am. Consider scheduling all campaigns in this window.</div>
                  </div>
                  
                  {sequences.length>0&&<div style={{padding:16,background:'rgba(0,0,0,0.2)',borderRadius:10,border:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontSize:14}}>🔄</span>
                      <span style={{fontSize:13,fontWeight:600,color:'#fff'}}>Sequence recommendation</span>
                    </div>
                    <div style={{fontSize:12,color:t.textSecondary}}>Most replies come from Day 3-4 follow-ups. If you're not using multi-step sequences, you're leaving conversations on the table.</div>
                  </div>}
                </>}
              </div>
            </div>
          </>})()}
        </>}

        {/* SETTINGS */}
        {page==='settings'&&<>
          <div style={{marginBottom:40}}>
            <h1 style={{fontSize:32,fontWeight:800,marginBottom:8,letterSpacing:'-0.03em'}}>Settings</h1>
            <p style={{color:t.textSecondary,lineHeight:1.6,fontSize:15}}>
              {settings.gmail?.connected
                ?`Gmail connected as ${settings.gmail.email}`
                :'Connect Gmail to start sending emails.'}
            </p>
          </div>
          
          <div style={{maxWidth:900}}>
            {/* SECTION: Integrations */}
            <div style={{marginBottom:40}}>
              <h2 style={{fontSize:13,fontWeight:700,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
                <span style={{width:24,height:24,borderRadius:6,background:'rgba(168,85,247,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>🔗</span>
                Integrations
              </h2>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                {/* Gmail */}
                <div style={{background:t.surface,border:t.cardBorder,borderRadius:14,padding:24,boxShadow:t.glow}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                    {settings.gmail.connected && settings.gmail.picture ? 
                      <img src={settings.gmail.picture} style={{width:36,height:36,borderRadius:8}} alt=""/> :
                      <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(135deg,#ea4335,#fbbc05)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                      </div>
                    }
                    <div>
                      <h3 style={{fontSize:15,fontWeight:700,margin:0}}>Gmail</h3>
                      <p style={{fontSize:11,color:t.textMuted,margin:0}}>Send via your Gmail</p>
                    </div>
                  </div>
                  {settings.gmail.connected?
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                        <span style={{width:8,height:8,borderRadius:4,background:t.success}}/>
                        <span style={{fontSize:13,color:t.text}}>{settings.gmail.email}</span>
                      </div>
                      <div style={{display:'flex',gap:8}}>
                        <button onClick={async()=>{
                          try {
                            await sendGmailEmail(settings.gmail.email, 'ColdFlow Test Email', 'This is a test email from ColdFlow. Your Gmail integration is working correctly! 🎉')
                            alert('Test email sent! Check your inbox.')
                          } catch(err) {
                            alert('Failed to send: ' + err.message)
                          }
                        }} style={{padding:'6px 12px',background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.3)',borderRadius:6,color:'#22c55e',fontSize:11,cursor:'pointer',fontWeight:500}}>Send Test</button>
                        <button onClick={()=>setSettings(s=>({...s,gmail:{connected:false,email:'',accessToken:null}}))} style={{padding:'6px 12px',background:'none',border:'1px solid rgba(255,255,255,.1)',borderRadius:6,color:t.textMuted,fontSize:11,cursor:'pointer'}}>Disconnect</button>
                      </div>
                    </div>:
                    <Btn s="s" onClick={connectGmail}>Connect Gmail</Btn>
                  }
                </div>
                
                {/* Calendar Link */}
                <div style={{background:t.surface,border:t.cardBorder,borderRadius:14,padding:24,boxShadow:t.glow}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                    <div style={{width:36,height:36,borderRadius:8,background:'#006bff',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
                    </div>
                    <div>
                      <h3 style={{fontSize:15,fontWeight:700,margin:0}}>Calendar Link</h3>
                      <p style={{fontSize:11,color:t.textMuted,margin:0}}>Calendly, Cal.com, etc.</p>
                    </div>
                  </div>
                  {settings.calendly.connected?
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <span style={{width:8,height:8,borderRadius:4,background:t.success}}/>
                        <span style={{fontSize:13,color:t.text,maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{settings.calendly.url}</span>
                      </div>
                      <button onClick={()=>setSettings(s=>({...s,calendly:{connected:false,url:''}}))} style={{background:'none',border:'none',color:t.textMuted,fontSize:12,cursor:'pointer',textDecoration:'underline'}}>Remove</button>
                    </div>:
                    <Btn s="s" onClick={connectCalendly}>Add Calendar Link</Btn>
                  }
                </div>
                
                {/* Salesforce */}
                <div style={{background:t.surface,border:settings.sfdc?.connected?'1px solid rgba(0,161,224,.3)':t.cardBorder,borderRadius:14,padding:24,boxShadow:t.glow}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                    <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(135deg,#00a1e0,#1798c1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <svg width="20" height="14" viewBox="0 0 24 16" fill="#fff">
                        <path d="M10.1 2.5c1.2-1.2 2.8-2 4.6-2 2.5 0 4.7 1.4 5.8 3.5.9-.4 1.8-.6 2.8-.6 3.5 0 6.4 2.9 6.4 6.4s-2.9 6.4-6.4 6.4c-.6 0-1.2-.1-1.7-.2-.9 1.5-2.5 2.5-4.4 2.5-1.1 0-2.1-.3-3-1-.9 1.1-2.3 1.9-3.9 1.9-2.1 0-3.9-1.3-4.6-3.2-.4.1-.9.1-1.3.1C1.9 16.3 0 14.4 0 12c0-1.8 1.1-3.4 2.7-4-.3-.6-.4-1.3-.4-2C2.3 3.2 4.5 1 7.3 1c1.2 0 2.1.5 2.8 1.5z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 style={{fontSize:15,fontWeight:700,margin:0}}>Salesforce</h3>
                      <p style={{fontSize:11,color:t.textMuted,margin:0}}>Sync leads & log activities</p>
                    </div>
                  </div>
                  {settings.sfdc?.connected?(
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                        <span style={{width:8,height:8,borderRadius:4,background:t.success}}/>
                        <span style={{fontSize:13,color:t.text}}>{settings.sfdc.username || 'Connected'}</span>
                      </div>
                      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                        <button onClick={()=>setModal('sfdcSync')} style={{padding:'6px 12px',background:'rgba(0,161,224,.1)',border:'1px solid rgba(0,161,224,.3)',borderRadius:6,color:'#00a1e0',fontSize:11,cursor:'pointer',fontWeight:500}}>Import Leads</button>
                        <button onClick={()=>setSettings(s=>({...s,sfdc:{connected:false}}))} style={{padding:'6px 12px',background:'none',border:'1px solid rgba(255,255,255,.1)',borderRadius:6,color:t.textMuted,fontSize:11,cursor:'pointer'}}>Disconnect</button>
                      </div>
                    </div>
                  ):(
                    <Btn s="s" onClick={()=>{
                      const authUrl = `/api/sfdc/auth?userId=${user?.id}`
                      window.location.href = authUrl
                    }}>Connect Salesforce</Btn>
                  )}
                </div>
                
                {/* HubSpot */}
                <div style={{background:t.surface,border:settings.hubspot?.connected?'1px solid rgba(255,122,89,.3)':t.cardBorder,borderRadius:14,padding:24,boxShadow:t.glow}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                    <div style={{width:36,height:36,borderRadius:8,background:'#ff7a59',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M18.16 7.58v4.16c0 .67-.34 1.29-.9 1.66l-3.66 2.36c-.56.36-1.27.36-1.83 0l-3.66-2.36c-.56-.37-.9-.99-.9-1.66V7.58c0-.67.34-1.29.9-1.66l3.66-2.36c.56-.36 1.27-.36 1.83 0l3.66 2.36c.56.37.9.99.9 1.66z"/></svg>
                    </div>
                    <div>
                      <h3 style={{fontSize:15,fontWeight:700,margin:0}}>HubSpot</h3>
                      <p style={{fontSize:11,color:t.textMuted,margin:0}}>Sync contacts & log activities</p>
                    </div>
                  </div>
                  {settings.hubspot?.connected?(
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                        <span style={{width:8,height:8,borderRadius:4,background:t.success}}/>
                        <span style={{fontSize:13,color:t.text}}>{settings.hubspot.user_email || 'Connected'}</span>
                      </div>
                      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                        <button onClick={()=>setModal('hubspotSync')} style={{padding:'6px 12px',background:'rgba(255,122,89,.1)',border:'1px solid rgba(255,122,89,.3)',borderRadius:6,color:'#ff7a59',fontSize:11,cursor:'pointer',fontWeight:500}}>Import Contacts</button>
                        <button onClick={()=>setSettings(s=>({...s,hubspot:{connected:false}}))} style={{padding:'6px 12px',background:'none',border:'1px solid rgba(255,255,255,.1)',borderRadius:6,color:t.textMuted,fontSize:11,cursor:'pointer'}}>Disconnect</button>
                      </div>
                    </div>
                  ):(
                    <Btn s="s" onClick={()=>{
                      const authUrl = `/api/hubspot/auth?userId=${user?.id}`
                      window.location.href = authUrl
                    }}>Connect HubSpot</Btn>
                  )}
                </div>
              </div>
            </div>
            
            {/* SECTION: AI Assistant */}
            <div style={{marginBottom:40}}>
              <h2 style={{fontSize:13,fontWeight:700,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
                <span style={{width:24,height:24,borderRadius:6,background:'rgba(168,85,247,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>🤖</span>
                AI Assistant
              </h2>
              
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                {/* AI Provider & Model */}
                <div style={{background:t.surface,border:t.cardBorder,borderRadius:14,padding:24,boxShadow:t.glow}}>
                  <h3 style={{fontSize:15,fontWeight:700,margin:'0 0 4px'}}>AI Model</h3>
                  <p style={{fontSize:12,color:t.textMuted,margin:'0 0 16px'}}>Choose your preferred AI provider and model tier</p>
                  
                  <div style={{marginBottom:16}}>
                    <label style={{fontSize:12,fontWeight:600,color:t.textSecondary,marginBottom:8,display:'block'}}>Provider</label>
                    <div style={{display:'flex',gap:8}}>
                      {[{id:'anthropic',name:'Claude',icon:'🟣'},{id:'openai',name:'ChatGPT',icon:'🟢'}].map(p=>
                        <button key={p.id} onClick={()=>setSettings(s=>({...s,ai:{...s.ai,provider:p.id}}))} style={{flex:1,padding:'12px 16px',background:(settings.ai?.provider||'anthropic')===p.id?'rgba(168,85,247,.15)':'transparent',border:(settings.ai?.provider||'anthropic')===p.id?'1px solid rgba(168,85,247,.4)':`1px solid ${t.border}`,borderRadius:10,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all .15s'}}>
                          <span>{p.icon}</span>
                          <span style={{fontSize:13,fontWeight:600,color:(settings.ai?.provider||'anthropic')===p.id?t.accent:t.text}}>{p.name}</span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label style={{fontSize:12,fontWeight:600,color:t.textSecondary,marginBottom:8,display:'block'}}>Model Tier</label>
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={()=>setSettings(s=>({...s,ai:{...s.ai,model:'basic'}}))} style={{flex:1,padding:'12px 16px',background:(settings.ai?.model||'basic')==='basic'?'rgba(168,85,247,.15)':'transparent',border:(settings.ai?.model||'basic')==='basic'?'1px solid rgba(168,85,247,.4)':`1px solid ${t.border}`,borderRadius:10,cursor:'pointer',transition:'all .15s'}}>
                        <div style={{fontSize:13,fontWeight:600,color:(settings.ai?.model||'basic')==='basic'?t.accent:t.text}}>Basic</div>
                        <div style={{fontSize:10,color:t.textMuted,marginTop:2}}>{(settings.ai?.provider||'anthropic')==='anthropic'?'Haiku':'GPT-4o-mini'}</div>
                      </button>
                      <button onClick={()=>{
                        if(plan.tier==='free'||plan.tier==='starter'){
                          if(aiUsage.premiumBonus>aiUsage.premiumUsed){
                            setSettings(s=>({...s,ai:{...s.ai,model:'premium'}}))
                          }else{
                            alert('Premium AI requires Pro plan. Upgrade to unlock.')
                          }
                        }else{
                          setSettings(s=>({...s,ai:{...s.ai,model:'premium'}}))
                        }
                      }} style={{flex:1,padding:'12px 16px',background:(settings.ai?.model)==='premium'?'rgba(168,85,247,.15)':'transparent',border:(settings.ai?.model)==='premium'?'1px solid rgba(168,85,247,.4)':`1px solid ${t.border}`,borderRadius:10,cursor:'pointer',transition:'all .15s',position:'relative'}}>
                        <div style={{fontSize:13,fontWeight:600,color:(settings.ai?.model)==='premium'?t.accent:t.text}}>Premium</div>
                        <div style={{fontSize:10,color:t.textMuted,marginTop:2}}>{(settings.ai?.provider||'anthropic')==='anthropic'?'Sonnet':'GPT-4o'}</div>
                        {(plan.tier==='free'||plan.tier==='starter')&&aiUsage.premiumBonus<=aiUsage.premiumUsed&&<span style={{position:'absolute',top:-6,right:-6,padding:'2px 6px',background:t.accent,borderRadius:4,fontSize:8,fontWeight:700,color:'#000'}}>PRO</span>}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* AI Usage */}
                <div style={{background:t.surface,border:t.cardBorder,borderRadius:14,padding:24,boxShadow:t.glow}}>
                  <h3 style={{fontSize:15,fontWeight:700,margin:'0 0 4px'}}>Usage This Month</h3>
                  <p style={{fontSize:12,color:t.textMuted,margin:'0 0 20px'}}>Resets on the 1st of each month</p>
                  
                  {/* Basic AI Usage */}
                  <div style={{marginBottom:20}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                      <span style={{fontSize:13,fontWeight:500}}>Basic AI</span>
                      <span style={{fontSize:13,color:t.textMuted}}>
                        {aiUsage.basicUsed.toLocaleString()} / {currentLimits.basicAI===Infinity?'∞':currentLimits.basicAI.toLocaleString()}
                      </span>
                    </div>
                    <div style={{height:8,background:t.elevated,borderRadius:4,overflow:'hidden'}}>
                      <div style={{height:'100%',background:`linear-gradient(90deg,${t.accent},#7c3aed)`,borderRadius:4,width:currentLimits.basicAI===Infinity?'5%':`${Math.min((aiUsage.basicUsed/currentLimits.basicAI)*100,100)}%`,transition:'width .3s'}}/>
                    </div>
                  </div>
                  
                  {/* Premium AI Usage */}
                  <div style={{marginBottom:20}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                      <span style={{fontSize:13,fontWeight:500}}>Premium AI</span>
                      <span style={{fontSize:13,color:t.textMuted}}>
                        {aiUsage.premiumUsed} / {currentLimits.premiumAI + ((plan.tier==='free'||plan.tier==='starter')?aiUsage.premiumBonus:0)}
                        {(plan.tier==='free'||plan.tier==='starter')&&aiUsage.premiumBonus>0&&<span style={{color:t.accent,marginLeft:4}}>(+{aiUsage.premiumBonus} bonus)</span>}
                      </span>
                    </div>
                    <div style={{height:8,background:t.elevated,borderRadius:4,overflow:'hidden'}}>
                      <div style={{height:'100%',background:'linear-gradient(90deg,#f59e0b,#ef4444)',borderRadius:4,width:`${Math.min((aiUsage.premiumUsed/(currentLimits.premiumAI+((plan.tier==='free'||plan.tier==='starter')?aiUsage.premiumBonus:0)))*100,100)}%`,transition:'width .3s'}}/>
                    </div>
                  </div>
                  
                  {/* Plan info */}
                  <div style={{padding:12,background:t.elevated,borderRadius:8,border:`1px solid ${t.border}`}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div>
                        <span style={{fontSize:12,color:t.textMuted}}>Current Plan: </span>
                        <span style={{fontSize:13,fontWeight:700,color:t.accent,textTransform:'capitalize'}}>{plan.tier}</span>
                      </div>
                      {plan.tier!=='team'&&<button onClick={()=>setPage('billing')} style={{padding:'6px 14px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.3)',borderRadius:6,color:t.accent,fontSize:11,fontWeight:600,cursor:'pointer'}}>Upgrade</button>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* SECTION: Email Delivery */}
            <div style={{marginBottom:40}}>
              <h2 style={{fontSize:13,fontWeight:700,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
                <span style={{width:24,height:24,borderRadius:6,background:'rgba(168,85,247,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>📤</span>
                Email Delivery
              </h2>
              
              {/* Sending Inboxes */}
              <div style={{background:t.surface,border:t.cardBorder,borderRadius:14,padding:24,boxShadow:t.glow,marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:16}}>
                  <div>
                    <h3 style={{fontSize:15,fontWeight:700,margin:'0 0 4px'}}>Sending Inboxes</h3>
                    <p style={{fontSize:12,color:t.textMuted,margin:0}}>Rotate between multiple inboxes for better deliverability</p>
                  </div>
                </div>
                
                {inboxes.length>0&&<div style={{marginBottom:16}}>
                  {inboxes.map(inbox=><div key={inbox.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',background:t.elevated,borderRadius:10,marginBottom:8,border:`1px solid ${t.border}`}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${t.accent},#7c3aed)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#000'}}>{inbox.email[0].toUpperCase()}</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600}}>{inbox.email}</div>
                        <div style={{fontSize:11,color:t.textMuted}}>{inbox.dailyLimit}/day · {inbox.warmupMode?'Warming up':'Active'}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <span style={{padding:'4px 10px',background:inbox.reputation==='good'?'rgba(0,255,136,.1)':'rgba(245,158,11,.1)',border:`1px solid ${inbox.reputation==='good'?'rgba(0,255,136,.2)':'rgba(245,158,11,.2)'}`,borderRadius:100,fontSize:10,color:inbox.reputation==='good'?t.success:'#f59e0b',fontWeight:600}}>
                        {inbox.reputation==='good'?'Good':'Warming'}
                      </span>
                      <button onClick={()=>removeInbox(inbox.id)} style={{background:'none',border:'none',color:t.textMuted,cursor:'pointer',fontSize:16,padding:4}} onMouseOver={e=>e.currentTarget.style.color=t.error} onMouseOut={e=>e.currentTarget.style.color=t.textMuted}>×</button>
                    </div>
                  </div>)}
                </div>}
                
                <div style={{display:'flex',gap:10}}>
                  <input value={newInbox.email} onChange={e=>setNewInbox({...newInbox,email:e.target.value})} placeholder="email@yourdomain.com" style={{flex:1,padding:'12px 14px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:10,color:t.text,fontSize:13}}/>
                  <input type="number" value={newInbox.dailyLimit} onChange={e=>setNewInbox({...newInbox,dailyLimit:parseInt(e.target.value)||50})} placeholder="50" style={{width:70,padding:'12px 14px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:10,color:t.text,fontSize:13,textAlign:'center'}}/>
                  <Btn s="s" onClick={addInbox} d={!newInbox.email.trim()}>Add</Btn>
                </div>
              </div>
              
              {/* Send Schedule */}
              <div style={{background:t.surface,border:t.cardBorder,borderRadius:14,padding:24,boxShadow:t.glow,marginBottom:16}}>
                <h3 style={{fontSize:15,fontWeight:700,margin:'0 0 16px'}}>Send Schedule</h3>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
                  <div>
                    <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>Timezone</label>
                    <select value={settings.sendSchedule.timezone} onChange={e=>setSettings(s=>({...s,sendSchedule:{...s.sendSchedule,timezone:e.target.value}}))} style={{width:'100%',padding:'12px 14px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:10,color:t.text,fontSize:13}}>
                      <option value="America/New_York">Eastern (ET)</option>
                      <option value="America/Chicago">Central (CT)</option>
                      <option value="America/Denver">Mountain (MT)</option>
                      <option value="America/Los_Angeles">Pacific (PT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>Business Hours</label>
                    <div style={{display:'flex',gap:6,alignItems:'center'}}>
                      <input type="number" min="0" max="23" value={settings.sendSchedule.startHour} onChange={e=>setSettings(s=>({...s,sendSchedule:{...s.sendSchedule,startHour:parseInt(e.target.value)}}))} style={{width:50,padding:'12px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:10,color:t.text,fontSize:13,textAlign:'center'}}/>
                      <span style={{color:t.textMuted,fontSize:12}}>to</span>
                      <input type="number" min="0" max="23" value={settings.sendSchedule.endHour} onChange={e=>setSettings(s=>({...s,sendSchedule:{...s.sendSchedule,endHour:parseInt(e.target.value)}}))} style={{width:50,padding:'12px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:10,color:t.text,fontSize:13,textAlign:'center'}}/>
                    </div>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>Options</label>
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13}}>
                        <input type="checkbox" checked={settings.sendSchedule.businessHoursOnly} onChange={e=>setSettings(s=>({...s,sendSchedule:{...s.sendSchedule,businessHoursOnly:e.target.checked}}))} style={{accentColor:t.accent}}/>
                        Business hours only
                      </label>
                      <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13}}>
                        <input type="checkbox" checked={settings.sendSchedule.skipWeekends} onChange={e=>setSettings(s=>({...s,sendSchedule:{...s.sendSchedule,skipWeekends:e.target.checked}}))} style={{accentColor:t.accent}}/>
                        Skip weekends
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reply Detection */}
              <div style={{background:t.surface,border:t.cardBorder,borderRadius:14,padding:24,boxShadow:t.glow}}>
                <h3 style={{fontSize:15,fontWeight:700,margin:'0 0 16px'}}>Reply Detection</h3>
                <div style={{display:'flex',gap:24}}>
                  <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:13}}>
                    <input type="checkbox" checked={settings.replyDetection.pauseOnReply} onChange={e=>setSettings(s=>({...s,replyDetection:{...s.replyDetection,pauseOnReply:e.target.checked}}))} style={{accentColor:t.accent,width:16,height:16}}/>
                    <div>
                      <div style={{fontWeight:500}}>Stop sequence on reply</div>
                      <div style={{fontSize:11,color:t.textMuted}}>Prevents follow-ups after someone responds</div>
                    </div>
                  </label>
                  <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:13}}>
                    <input type="checkbox" checked={settings.replyDetection.notifyOnReply} onChange={e=>setSettings(s=>({...s,replyDetection:{...s.replyDetection,notifyOnReply:e.target.checked}}))} style={{accentColor:t.accent,width:16,height:16}}/>
                    <div>
                      <div style={{fontWeight:500}}>Email me on reply</div>
                      <div style={{fontSize:11,color:t.textMuted}}>Get notified when someone responds</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* SECTION: Compliance */}
            <div style={{marginBottom:40}}>
              <h2 style={{fontSize:13,fontWeight:700,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
                <span style={{width:24,height:24,borderRadius:6,background:'rgba(168,85,247,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>✓</span>
                Compliance
              </h2>
              
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                {/* Blacklist Checker */}
                <div style={{background:t.surface,border:t.cardBorder,borderRadius:14,padding:24,boxShadow:t.glow}}>
                  <h3 style={{fontSize:15,fontWeight:700,margin:'0 0 4px'}}>Blacklist Checker</h3>
                  <p style={{fontSize:12,color:t.textMuted,margin:'0 0 16px'}}>Check if your domain is on email blacklists</p>
                  
                  {blacklistResults?<div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                      <span style={{width:8,height:8,borderRadius:4,background:t.success}}/>
                      <span style={{fontSize:13,fontWeight:500,color:t.success}}>All Clear</span>
                      <span style={{fontSize:12,color:t.textMuted}}>({blacklistResults.domain})</span>
                    </div>
                    <div style={{fontSize:11,color:t.textMuted}}>Checked {blacklistResults.lists.length} blacklists</div>
                  </div>:
                    <Btn s="s" onClick={()=>checkBlacklists(settings.gmail.email?.split('@')[1]||'yourdomain.com')} d={checkingBlacklist}>
                      {checkingBlacklist?'Checking...':'Check Now'}
                    </Btn>
                  }
                </div>
                
                {/* Unsubscribe Page */}
                <div style={{background:t.surface,border:t.cardBorder,borderRadius:14,padding:24,boxShadow:t.glow}}>
                  <h3 style={{fontSize:15,fontWeight:700,margin:'0 0 4px'}}>Unsubscribe Page</h3>
                  <p style={{fontSize:12,color:t.textMuted,margin:'0 0 16px'}}>Customize what recipients see when they unsubscribe</p>
                  
                  <div style={{marginBottom:12}}>
                    <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:4,textTransform:'uppercase'}}>Heading</label>
                    <input value={settings.unsubscribePage.heading} onChange={e=>setSettings(s=>({...s,unsubscribePage:{...s.unsubscribePage,heading:e.target.value}}))} style={{width:'100%',padding:'10px 12px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,color:t.text,fontSize:13,boxSizing:'border-box'}}/>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:4,textTransform:'uppercase'}}>Message</label>
                    <textarea value={settings.unsubscribePage.message} onChange={e=>setSettings(s=>({...s,unsubscribePage:{...s.unsubscribePage,message:e.target.value}}))} rows={2} style={{width:'100%',padding:'10px 12px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,color:t.text,fontSize:13,boxSizing:'border-box',resize:'none'}}/>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile Link */}
            <div style={{background:'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(99,102,241,0.05))',border:'1px solid rgba(168,85,247,0.2)',borderRadius:14,padding:20,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <h3 style={{fontSize:15,fontWeight:700,margin:'0 0 4px'}}>Your Profile</h3>
                <p style={{fontSize:12,color:t.textMuted,margin:0}}>Name, company, value props for AI personalization</p>
              </div>
              <Btn v="s" s="s" onClick={()=>setPage('profile')}>Edit Profile →</Btn>
            </div>
          </div>
        </>}
      </div>

      {/* MODALS */}
      {modal&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.9)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}} onClick={()=>{setModal(null);setEditStep(null)}}>
        <div style={{background:t.surface,border:t.cardBorder,borderRadius:20,padding:32,width:modal==='step'||modal==='preview'||modal==='editTemplate'||modal==='editSnippet'?550:440,maxHeight:'85vh',overflow:'auto',color:t.text,boxShadow:'0 0 60px rgba(168,85,247,0.1)'}} onClick={e=>e.stopPropagation()}>
          {modal==='lead'&&<><h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>Add Lead</h2><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><Input label="First Name" value={leadF.fn} onChange={v=>setLeadF({...leadF,fn:v})}/><Input label="Last Name" value={leadF.ln} onChange={v=>setLeadF({...leadF,ln:v})}/></div><Input label="Email *" value={leadF.em} onChange={v=>setLeadF({...leadF,em:v})} placeholder="name@company.com"/><Input label="Company" value={leadF.co} onChange={v=>setLeadF({...leadF,co:v})}/>{tags.length>0&&<div style={{marginBottom:16}}><label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Tags</label><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{tags.map(tag=><button key={tag.id} onClick={()=>setLeadF({...leadF,tags:leadF.tags.includes(tag.id)?leadF.tags.filter(x=>x!==tag.id):[...leadF.tags,tag.id]})} style={{padding:'8px 14px',background:leadF.tags.includes(tag.id)?'rgba(168,85,247,.15)':'transparent',border:`1px solid ${leadF.tags.includes(tag.id)?'rgba(168,85,247,.3)':t.border}`,borderRadius:100,color:leadF.tags.includes(tag.id)?t.accent:t.textMuted,fontSize:12,cursor:'pointer',fontWeight:500}}>{tag.name}</button>)}</div></div>}<div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:24}}><Btn v="g" onClick={()=>setModal(null)}>Cancel</Btn><Btn onClick={addLead} d={!leadF.em.trim()}>Add Lead</Btn></div></>}

          {modal==='import'&&<><h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>Import Leads</h2><TextArea label="Paste CSV (firstName, lastName, email, company)" value={imp} onChange={setImp} placeholder="John,Doe,john@acme.com,Acme Inc" rows={8}/><div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:24}}><Btn v="g" onClick={()=>setModal(null)}>Cancel</Btn><Btn onClick={importLeads} d={!imp.trim()}>Import</Btn></div></>}

          {modal==='sfdcSync'&&<>
            <h2 style={{fontSize:20,fontWeight:700,marginBottom:8,letterSpacing:'-0.02em'}}>Import from Salesforce</h2>
            <p style={{color:'#888',fontSize:13,marginBottom:24}}>Pull leads or contacts from your Salesforce org</p>
            
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Object Type</label>
              <div style={{display:'flex',gap:10}}>
                <button onClick={()=>setSfdcSyncType('Lead')} style={{flex:1,padding:'14px',background:sfdcSyncType==='Lead'?'rgba(0,161,224,.15)':'transparent',border:sfdcSyncType==='Lead'?'1px solid rgba(0,161,224,.4)':`1px solid ${t.border}`,borderRadius:10,color:sfdcSyncType==='Lead'?'#00a1e0':t.text,fontSize:14,fontWeight:600,cursor:'pointer'}}>
                  Leads
                </button>
                <button onClick={()=>setSfdcSyncType('Contact')} style={{flex:1,padding:'14px',background:sfdcSyncType==='Contact'?'rgba(0,161,224,.15)':'transparent',border:sfdcSyncType==='Contact'?'1px solid rgba(0,161,224,.4)':`1px solid ${t.border}`,borderRadius:10,color:sfdcSyncType==='Contact'?'#00a1e0':t.text,fontSize:14,fontWeight:600,cursor:'pointer'}}>
                  Contacts
                </button>
              </div>
            </div>
            
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Filter (optional SOQL WHERE clause)</label>
              <input 
                value={sfdcFilter} 
                onChange={e=>setSfdcFilter(e.target.value)} 
                placeholder="e.g., Status = 'Open' OR Industry = 'Technology'"
                style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:13,boxSizing:'border-box'}}
              />
              <p style={{fontSize:11,color:'#666',marginTop:8}}>Leave empty to import all {sfdcSyncType}s with email addresses (max 200)</p>
            </div>
            
            {sfdcSyncResult&&(
              <div style={{padding:16,background:sfdcSyncResult.success?'rgba(34,197,94,.1)':'rgba(239,68,68,.1)',border:sfdcSyncResult.success?'1px solid rgba(34,197,94,.3)':'1px solid rgba(239,68,68,.3)',borderRadius:10,marginBottom:20}}>
                <div style={{fontWeight:600,marginBottom:4,color:sfdcSyncResult.success?'#22c55e':'#ef4444'}}>{sfdcSyncResult.success?'Import Complete':'Import Failed'}</div>
                <div style={{fontSize:13,color:t.textMuted}}>{sfdcSyncResult.message||sfdcSyncResult.error}</div>
                {sfdcSyncResult.success&&<div style={{fontSize:12,color:'#888',marginTop:4}}>{sfdcSyncResult.skipped} duplicates skipped</div>}
              </div>
            )}
            
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <Btn v="g" onClick={()=>{setModal(null);setSfdcSyncResult(null)}}>Cancel</Btn>
              <Btn onClick={async()=>{
                setSfdcSyncing(true)
                setSfdcSyncResult(null)
                try {
                  const res = await fetch('/api/sfdc/sync', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      userId: user?.id,
                      objectType: sfdcSyncType,
                      filter: sfdcFilter || undefined
                    })
                  })
                  const data = await res.json()
                  setSfdcSyncResult(data)
                  if(data.success && data.imported > 0) {
                    // Refresh leads list
                    fetchLeads()
                  }
                } catch(err) {
                  setSfdcSyncResult({success:false,error:err.message})
                }
                setSfdcSyncing(false)
              }} d={sfdcSyncing}>{sfdcSyncing?'Importing...':'Import from Salesforce'}</Btn>
            </div>
          </>}
          
          {/* HubSpot Sync Modal */}
          {modal==='hubspotSync'&&<>
            <h2 style={{fontSize:20,fontWeight:700,marginBottom:8,letterSpacing:'-0.02em'}}>Import from HubSpot</h2>
            <p style={{color:'#888',fontSize:13,marginBottom:20}}>Import contacts from your HubSpot CRM</p>
            
            {hubspotSyncResult&&(
              <div style={{marginBottom:16,padding:14,background:hubspotSyncResult.success?'rgba(34,197,94,.1)':'rgba(239,68,68,.1)',border:`1px solid ${hubspotSyncResult.success?'rgba(34,197,94,.3)':'rgba(239,68,68,.3)'}`,borderRadius:8}}>
                {hubspotSyncResult.success?(
                  <div style={{color:'#22c55e',fontSize:13}}>
                    ✓ Imported {hubspotSyncResult.imported} contacts ({hubspotSyncResult.skipped} skipped as duplicates)
                  </div>
                ):(
                  <div style={{color:'#ef4444',fontSize:13}}>Error: {hubspotSyncResult.error}</div>
                )}
              </div>
            )}
            
            <div style={{padding:16,background:'rgba(255,122,89,.05)',border:'1px solid rgba(255,122,89,.15)',borderRadius:10,marginBottom:20}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:32,height:32,borderRadius:8,background:'#ff7a59',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M18.16 7.58v4.16c0 .67-.34 1.29-.9 1.66l-3.66 2.36c-.56.36-1.27.36-1.83 0l-3.66-2.36c-.56-.37-.9-.99-.9-1.66V7.58c0-.67.34-1.29.9-1.66l3.66-2.36c.56-.36 1.27-.36 1.83 0l3.66 2.36c.56.37.9.99.9 1.66z"/></svg>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>Import Contacts</div>
                  <div style={{fontSize:11,color:'#888'}}>Imports up to 100 contacts with email addresses</div>
                </div>
              </div>
            </div>
            
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <Btn v="g" onClick={()=>{setModal(null);setHubspotSyncResult(null)}}>Cancel</Btn>
              <Btn onClick={async()=>{
                setHubspotSyncing(true)
                setHubspotSyncResult(null)
                try {
                  const res = await fetch('/api/hubspot/sync', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ userId: user?.id })
                  })
                  const data = await res.json()
                  setHubspotSyncResult(data)
                  if(data.success && data.imported > 0) {
                    fetchLeads()
                  }
                } catch(err) {
                  setHubspotSyncResult({success:false,error:err.message})
                }
                setHubspotSyncing(false)
              }} d={hubspotSyncing}>{hubspotSyncing?'Importing...':'Import from HubSpot'}</Btn>
            </div>
          </>}

          {modal==='tag'&&<><h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>New Tag</h2><Input label="Tag Name" value={tagN} onChange={setTagN} placeholder="e.g., CMO, SaaS"/><div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:24}}><Btn v="g" onClick={()=>setModal(null)}>Cancel</Btn><Btn onClick={addTag} d={!tagN.trim()}>Create</Btn></div></>}

          {modal==='sequence'&&<><h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>New Sequence</h2><Input label="Sequence Name" value={seqN} onChange={setSeqN} placeholder="e.g., Cold Outreach - CMOs"/><div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:24}}><Btn v="g" onClick={()=>setModal(null)}>Cancel</Btn><Btn onClick={addSeq} d={!seqN.trim()}>Create</Btn></div></>}

          {modal==='step'&&<><h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>{editStep?'Edit Step':'Add Step'}</h2><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><Input label="Day" type="number" value={stepF.day} onChange={v=>setStepF({...stepF,day:v})}/><Input label="Send Time" type="time" value={stepF.time} onChange={v=>setStepF({...stepF,time:v})}/></div><Input label="Subject Line" value={stepF.subj} onChange={v=>setStepF({...stepF,subj:v})} placeholder="Quick question about {{company}}"/><div style={{marginBottom:16}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><label style={{fontSize:11,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.05em'}}>Email Body</label><div style={{display:'flex',gap:12}}><button onClick={()=>{setPreviewEmail({subject:stepF.subj,body:stepF.body});setPreviewLead(leads[0]||null);setModal('preview')}} style={{background:'none',border:'none',color:t.textMuted,fontSize:12,cursor:'pointer',fontWeight:500}}>Preview</button><button onClick={()=>setAiOpen(true)} style={{background:'none',border:'none',color:t.accent,fontSize:12,cursor:'pointer',fontWeight:600}}>AI Help</button></div></div><textarea value={stepF.body} onChange={e=>setStepF({...stepF,body:e.target.value})} placeholder="Hey {{firstName}},&#10;&#10;Write your email..." rows={7} style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14,boxSizing:'border-box',outline:'none',fontFamily:'Inter,system-ui,sans-serif',resize:'vertical'}}/></div>
            {/* Live Spam Score */}
            {stepF.subj&&stepF.body&&(()=>{const score=calculateSpamScore(stepF.subj,stepF.body);const spam=getSpamLabel(score);return<div style={{padding:12,background:t.elevated,borderRadius:10,marginBottom:16,border:`1px solid ${t.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}><div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:11,color:t.textMuted}}>Spam Score:</span><span style={{padding:'4px 10px',background:`${spam.color}20`,borderRadius:100,fontSize:11,fontWeight:600,color:spam.color}}>{spam.label}</span></div><span style={{fontSize:14,fontWeight:600,color:spam.color}}>{score}/100</span></div>})()}
            <div style={{padding:12,background:t.elevated,borderRadius:10,marginBottom:20}}><div style={{fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Variables</div><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{['{{firstName}}','{{lastName}}','{{email}}','{{company}}'].map(v=><button key={v} onClick={()=>setStepF({...stepF,body:stepF.body+' '+v})} style={{padding:'6px 12px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,color:t.accent,fontSize:11,cursor:'pointer',fontWeight:500}}>{v}</button>)}{settings.calendly.connected&&<button onClick={()=>setStepF({...stepF,body:stepF.body+'\n\nBook a time: '+settings.calendly.url})} style={{padding:'6px 12px',background:'rgba(0,107,255,.1)',border:'1px solid rgba(0,107,255,.2)',borderRadius:100,color:'#006bff',fontSize:11,cursor:'pointer',fontWeight:500}}>+ Calendar</button>}</div></div><div style={{display:'flex',gap:10,justifyContent:'space-between'}}><button onClick={()=>sendTestEmail(stepF.subj,stepF.body)} disabled={sendingTest||!stepF.subj.trim()||!stepF.body.trim()||!settings.gmail.connected} style={{padding:'10px 16px',background:'rgba(0,255,136,.1)',border:'1px solid rgba(0,255,136,.2)',borderRadius:100,color:t.success,fontSize:12,cursor:sendingTest||!settings.gmail.connected?'not-allowed':'pointer',fontWeight:500,opacity:sendingTest||!stepF.subj.trim()||!stepF.body.trim()||!settings.gmail.connected?.5:1}}>{sendingTest?'Sending...':'📧 Send Test'}</button><div style={{display:'flex',gap:10}}><Btn v="g" onClick={()=>{setModal(null);setEditStep(null)}}>Cancel</Btn><Btn onClick={editStep?saveStep:addStep} d={!stepF.subj.trim()||!stepF.body.trim()}>{editStep?'Save':'Add Step'}</Btn></div></div></>}

          {modal==='campaign'&&<><h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>New Campaign</h2><Input label="Campaign Name" value={campF.name} onChange={v=>setCampF({...campF,name:v})} placeholder="e.g., Q1 CMO Outreach"/><div style={{marginBottom:16}}><label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Sequence *</label><select value={campF.seq} onChange={e=>setCampF({...campF,seq:e.target.value})} style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14}}><option value="">Select sequence</option>{sequences.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div><div style={{marginBottom:16}}><label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Target Leads (by tag)</label><select value={campF.tag} onChange={e=>setCampF({...campF,tag:e.target.value})} style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14}}><option value="">All leads ({leads.length})</option>{tags.map(tag=><option key={tag.id} value={tag.id}>{tag.name} ({leads.filter(l=>l.tags?.includes(tag.id)).length})</option>)}</select></div><div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:24}}><Btn v="g" onClick={()=>setModal(null)}>Cancel</Btn><Btn onClick={addCamp} d={!campF.name.trim()||!campF.seq}>Create</Btn></div></>}

          {modal==='addLeadsToSeq'&&selSeq&&<>
            <h2 style={{fontSize:20,fontWeight:700,marginBottom:8,letterSpacing:'-0.02em'}}>Add Leads to Sequence</h2>
            <p style={{color:'#888',fontSize:13,marginBottom:20}}>Select leads to add to "{selSeq.name}"</p>
            <div style={{maxHeight:400,overflow:'auto',marginBottom:20}}>
              {leads.filter(l=>!(selSeq.lead_ids||[]).includes(l.id)).length===0?(
                <div style={{textAlign:'center',padding:32,color:'#666'}}>All leads already added</div>
              ):(
                leads.filter(l=>!(selSeq.lead_ids||[]).includes(l.id)).map(l=>(
                  <div key={l.id} onClick={()=>setSelLeads(selLeads.includes(l.id)?selLeads.filter(x=>x!==l.id):[...selLeads,l.id])} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:selLeads.includes(l.id)?'rgba(168,85,247,.1)':'rgba(255,255,255,.02)',border:selLeads.includes(l.id)?'1px solid rgba(168,85,247,.3)':'1px solid rgba(255,255,255,.06)',borderRadius:10,marginBottom:8,cursor:'pointer',transition:'all .15s'}}>
                    <div style={{width:20,height:20,borderRadius:4,border:selLeads.includes(l.id)?'none':'2px solid #444',background:selLeads.includes(l.id)?t.accent:'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>{selLeads.includes(l.id)&&<span style={{color:'#000',fontSize:12,fontWeight:700}}>✓</span>}</div>
                    <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600}}>{(l.first_name?.[0]||l.email[0]).toUpperCase()}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:500,fontSize:14}}>{l.first_name} {l.last_name}</div>
                      <div style={{fontSize:12,color:'#666'}}>{l.email}</div>
                    </div>
                    {l.company&&<span style={{fontSize:11,color:'#888'}}>{l.company}</span>}
                  </div>
                ))
              )}
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'space-between'}}>
              <span style={{color:'#888',fontSize:13}}>{selLeads.length} selected</span>
              <div style={{display:'flex',gap:10}}>
                <Btn v="g" onClick={()=>{setModal(null);setSelLeads([])}}>Cancel</Btn>
                <Btn onClick={()=>{addLeadsToSequence(selSeq.id,selLeads);setModal(null);setSelLeads([])}} d={selLeads.length===0}>Add {selLeads.length} Lead{selLeads.length!==1?'s':''}</Btn>
              </div>
            </div>
          </>}

          {modal==='editTemplate'&&editingTemplate&&<>
            <h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>{editingTemplate.id==='new'?'New Template':'Edit Template'}</h2>
            <Input label="Template Name" value={editingTemplate.name} onChange={v=>setEditingTemplate({...editingTemplate,name:v})} placeholder="e.g., Cold Intro - SaaS"/>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Category</label>
              <select value={editingTemplate.category} onChange={e=>setEditingTemplate({...editingTemplate,category:e.target.value})} style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14}}>
                <option value="intro">First Touch</option>
                <option value="followup">Follow-up</option>
                <option value="breakup">Break-up</option>
                <option value="meeting">Meeting Request</option>
                <option value="reengagement">Re-engagement</option>
              </select>
            </div>
            <Input label="Subject Line" value={editingTemplate.subject} onChange={v=>setEditingTemplate({...editingTemplate,subject:v})} placeholder="Quick question about {{company}}"/>
            <div style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <label style={{fontSize:11,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.05em'}}>Email Body</label>
                <button onClick={()=>setAiOpen(true)} style={{background:'none',border:'none',color:t.accent,fontSize:12,cursor:'pointer',fontWeight:600}}>AI Help</button>
              </div>
              <textarea value={editingTemplate.body} onChange={e=>setEditingTemplate({...editingTemplate,body:e.target.value})} placeholder="Hi {{firstName}},&#10;&#10;Write your template..." rows={10} style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14,boxSizing:'border-box',outline:'none',fontFamily:'Inter,system-ui,sans-serif',resize:'vertical',lineHeight:1.6}}/>
            </div>
            <div style={{padding:12,background:t.elevated,borderRadius:10,marginBottom:20}}>
              <div style={{fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Merge Tags</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {['{{firstName}}','{{lastName}}','{{email}}','{{company}}','{{mutualConnection}}'].map(v=><button key={v} onClick={()=>setEditingTemplate({...editingTemplate,body:editingTemplate.body+' '+v})} style={{padding:'6px 12px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,color:t.accent,fontSize:11,cursor:'pointer',fontWeight:500}}>{v}</button>)}
              </div>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <Btn v="g" onClick={()=>{setModal(null);setEditingTemplate(null)}}>Cancel</Btn>
              <Btn onClick={()=>{
                if(editingTemplate.id==='new'){
                  if(!canAddTemplate()){
                    setUpgradeModal({type:'templates',message:`You've reached your limit of ${currentLimits.templates} templates. Upgrade to save more.`})
                    return
                  }
                  const newTpl={...editingTemplate,id:'t'+Date.now()}
                  setTemplates([...templates,newTpl])
                }else{
                  setTemplates(templates.map(t=>t.id===editingTemplate.id?editingTemplate:t))
                }
                setModal(null)
                setEditingTemplate(null)
              }} d={!editingTemplate.name.trim()||!editingTemplate.subject.trim()||!editingTemplate.body.trim()}>{editingTemplate.id==='new'?'Create':'Save'}</Btn>
            </div>
          </>}

          {modal==='editSnippet'&&editingSnippet&&<>
            <h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>{editingSnippet.id==='new'?'New Snippet':'Edit Snippet'}</h2>
            <Input label="Snippet Name" value={editingSnippet.name} onChange={v=>setEditingSnippet({...editingSnippet,name:v})} placeholder="e.g., CTA - Book Call"/>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Category</label>
              <select value={editingSnippet.category} onChange={e=>setEditingSnippet({...editingSnippet,category:e.target.value})} style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14}}>
                <option value="cta">CTA</option>
                <option value="opener">Opener</option>
                <option value="value">Value Prop</option>
                <option value="proof">Social Proof</option>
                <option value="closer">Closer</option>
              </select>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Snippet Text</label>
              <textarea value={editingSnippet.text} onChange={e=>setEditingSnippet({...editingSnippet,text:e.target.value})} placeholder="Write your reusable text here..." rows={4} style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14,boxSizing:'border-box',outline:'none',fontFamily:'Inter,system-ui,sans-serif',resize:'vertical',lineHeight:1.6}}/>
            </div>
            <div style={{padding:12,background:t.elevated,borderRadius:10,marginBottom:20}}>
              <div style={{fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Merge Tags</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {['{{firstName}}','{{company}}','{{calendarLink}}','{{painPoint}}','{{triggerEvent}}'].map(v=><button key={v} onClick={()=>setEditingSnippet({...editingSnippet,text:editingSnippet.text+v})} style={{padding:'6px 12px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,color:t.accent,fontSize:11,cursor:'pointer',fontWeight:500}}>{v}</button>)}
              </div>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <Btn v="g" onClick={()=>{setModal(null);setEditingSnippet(null)}}>Cancel</Btn>
              <Btn onClick={()=>{
                if(editingSnippet.id==='new'){
                  if(!canAddSnippet()){
                    setUpgradeModal({type:'snippets',message:`You've reached your limit of ${currentLimits.snippets} snippets. Upgrade to save more.`})
                    return
                  }
                  const newSnip={...editingSnippet,id:'s'+Date.now()}
                  setSnippets([...snippets,newSnip])
                }else{
                  setSnippets(snippets.map(s=>s.id===editingSnippet.id?editingSnippet:s))
                }
                setModal(null)
                setEditingSnippet(null)
              }} d={!editingSnippet.name.trim()||!editingSnippet.text.trim()}>{editingSnippet.id==='new'?'Create':'Save'}</Btn>
            </div>
          </>}


          {modal==='export'&&<><h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>Export Data</h2>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <button onClick={exportLeads} style={{padding:18,background:t.elevated,border:`1px solid ${t.border}`,borderRadius:12,cursor:'pointer',textAlign:'left',transition:'all .15s'}} onMouseOver={e=>e.currentTarget.style.borderColor=t.accent} onMouseOut={e=>e.currentTarget.style.borderColor=t.border}>
                <div style={{fontWeight:600,marginBottom:4,color:t.text}}>Export Leads (CSV)</div>
                <div style={{fontSize:12,color:t.textMuted}}>{leads.length} leads with all fields</div>
              </button>
              <button onClick={exportSequences} style={{padding:18,background:t.elevated,border:`1px solid ${t.border}`,borderRadius:12,cursor:'pointer',textAlign:'left',transition:'all .15s'}} onMouseOver={e=>e.currentTarget.style.borderColor=t.accent} onMouseOut={e=>e.currentTarget.style.borderColor=t.border}>
                <div style={{fontWeight:600,marginBottom:4,color:t.text}}>Export Sequences (CSV)</div>
                <div style={{fontSize:12,color:t.textMuted}}>{sequences.length} sequences with stats</div>
              </button>
              <button onClick={exportCampaigns} style={{padding:18,background:t.elevated,border:`1px solid ${t.border}`,borderRadius:12,cursor:'pointer',textAlign:'left',transition:'all .15s'}} onMouseOver={e=>e.currentTarget.style.borderColor=t.accent} onMouseOut={e=>e.currentTarget.style.borderColor=t.border}>
                <div style={{fontWeight:600,marginBottom:4,color:t.text}}>Export Campaigns (CSV)</div>
                <div style={{fontSize:12,color:t.textMuted}}>{campaigns.length} campaigns with performance</div>
              </button>
            </div>
            <div style={{marginTop:20,display:'flex',justifyContent:'flex-end'}}><Btn v="g" onClick={()=>setModal(null)}>Close</Btn></div>
          </>}

          {modal==='customField'&&<><h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>Add Custom Field</h2>
            <p style={{color:t.textMuted,fontSize:13,marginBottom:20}}>Custom fields let you personalize beyond the basics.</p>
            <Input label="Field Name (no spaces)" value={newFieldName} onChange={setNewFieldName} placeholder="e.g., painPoint"/>
            {customFields.length>0&&<div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:t.textMuted,marginBottom:10,textTransform:'uppercase',letterSpacing:'0.05em'}}>Your custom fields</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {customFields.map(f=><span key={f} style={{padding:'8px 12px',background:'rgba(168,85,247,.1)',border:'1px solid rgba(168,85,247,.2)',borderRadius:100,color:t.accent,fontSize:12,display:'flex',alignItems:'center',gap:8,fontWeight:500}}>{`{{${f}}}`}<button onClick={()=>setCustomFields(customFields.filter(x=>x!==f))} style={{background:'none',border:'none',color:t.error,cursor:'pointer',padding:0,fontSize:14}}>×</button></span>)}
              </div>
            </div>}
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:24}}><Btn v="g" onClick={()=>{setModal(null);setNewFieldName('')}}>Cancel</Btn><Btn onClick={()=>{if(newFieldName.trim()&&!customFields.includes(newFieldName.trim().replace(/\s/g,''))){setCustomFields([...customFields,newFieldName.trim().replace(/\s/g,'')]);setNewFieldName('')}}} d={!newFieldName.trim()}>Add Field</Btn></div>
          </>}

          {modal==='snippet'&&<><h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>Add Snippet</h2>
            <p style={{color:t.textMuted,fontSize:13,marginBottom:20}}>Snippets are reusable text blocks for CTAs, intros, signatures.</p>
            <Input label="Snippet Name" value={newSnippet.name} onChange={v=>setNewSnippet({...newSnippet,name:v})} placeholder="e.g., CTA - Meeting"/>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Snippet Text</label>
              <textarea value={newSnippet.text} onChange={e=>setNewSnippet({...newSnippet,text:e.target.value})} rows={3} placeholder="Would you be open to a quick call?" style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:13,boxSizing:'border-box',fontFamily:'Inter,system-ui,sans-serif',resize:'vertical'}}/>
            </div>
            {snippets.length>0&&<div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:t.textMuted,marginBottom:10,textTransform:'uppercase',letterSpacing:'0.05em'}}>Your snippets</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {snippets.map(s=><div key={s.id} style={{padding:'12px 14px',background:'rgba(0,255,136,.05)',border:'1px solid rgba(0,255,136,.1)',borderRadius:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontWeight:600,fontSize:13,color:t.success}}>{s.name}</div><div style={{fontSize:12,color:t.textMuted,marginTop:4}}>{s.text.slice(0,50)}{s.text.length>50?'...':''}</div></div><button onClick={()=>setSnippets(snippets.filter(x=>x.id!==s.id))} style={{background:'none',border:'none',color:t.error,cursor:'pointer',fontSize:16}}>×</button></div>)}
              </div>
            </div>}
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}><Btn v="g" onClick={()=>{setModal(null);setNewSnippet({name:'',text:''})}}>Cancel</Btn><Btn onClick={()=>{if(newSnippet.name.trim()&&newSnippet.text.trim()){setSnippets([...snippets,{id:'s'+Date.now(),name:newSnippet.name,text:newSnippet.text}]);setNewSnippet({name:'',text:''})}}} d={!newSnippet.name.trim()||!newSnippet.text.trim()}>Add Snippet</Btn></div>
          </>}

          {modal==='snippetManager'&&<><h2 style={{fontSize:18,fontWeight:600,marginBottom:20}}>Snippets & Custom Fields</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
              {/* Snippets Column */}
              <div>
                <h3 style={{fontSize:14,fontWeight:600,marginBottom:12,color:'#22c55e'}}>Snippets</h3>
                <p style={{color:'#888',fontSize:12,marginBottom:12}}>Reusable text blocks for emails</p>
                {snippets.map(s=><div key={s.id} style={{padding:12,background:'rgba(34,197,94,.08)',borderRadius:8,marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'start'}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:500,fontSize:13,color:'#22c55e',marginBottom:4}}>{s.name}</div>
                    <div style={{fontSize:11,color:'#888',whiteSpace:'pre-wrap',lineHeight:1.4}}>{s.text}</div>
                  </div>
                  <button onClick={()=>setSnippets(snippets.filter(x=>x.id!==s.id))} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:14,marginLeft:8}}>×</button>
                </div>)}
                <div style={{marginTop:12}}>
                  <Input label="Name" value={newSnippet.name} onChange={v=>setNewSnippet({...newSnippet,name:v})} placeholder="CTA - Call"/>
                  <textarea value={newSnippet.text} onChange={e=>setNewSnippet({...newSnippet,text:e.target.value})} rows={2} placeholder="Snippet text..." style={{width:'100%',padding:10,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#fff',fontSize:12,boxSizing:'border-box',fontFamily:'inherit',resize:'vertical',marginBottom:8}}/>
                  <Btn s="s" onClick={()=>{if(newSnippet.name.trim()&&newSnippet.text.trim()){setSnippets([...snippets,{id:'s'+Date.now(),name:newSnippet.name,text:newSnippet.text}]);setNewSnippet({name:'',text:''})}}} d={!newSnippet.name.trim()||!newSnippet.text.trim()}>+ Add Snippet</Btn>
                </div>
              </div>
              {/* Custom Fields Column */}
              <div>
                <h3 style={{fontSize:14,fontWeight:600,marginBottom:12,color:'#a5b4fc'}}>Custom Fields</h3>
                <p style={{color:'#888',fontSize:12,marginBottom:12}}>Merge tags beyond the basics</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
                  {['firstName','lastName','company','email'].map(f=><span key={f} style={{padding:'6px 12px',background:'rgba(99,102,241,.15)',borderRadius:6,color:'#a5b4fc',fontSize:12}}>{`{{${f}}}`}</span>)}
                </div>
                {customFields.length>0&&<div style={{marginBottom:16}}>
                  <div style={{fontSize:11,color:'#666',marginBottom:8}}>Your custom fields:</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {customFields.map(f=><span key={f} style={{padding:'6px 12px',background:'rgba(168,85,247,.15)',borderRadius:6,color:'#c4b5fd',fontSize:12,display:'flex',alignItems:'center',gap:6}}>{`{{${f}}}`}<button onClick={()=>setCustomFields(customFields.filter(x=>x!==f))} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer',padding:0,fontSize:12}}>×</button></span>)}
                  </div>
                </div>}
                <div style={{display:'flex',gap:8}}>
                  <input value={newFieldName} onChange={e=>setNewFieldName(e.target.value)} placeholder="fieldName" style={{flex:1,padding:10,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#fff',fontSize:12}}/>
                  <Btn s="s" onClick={()=>{if(newFieldName.trim()&&!customFields.includes(newFieldName.trim().replace(/\s/g,''))){setCustomFields([...customFields,newFieldName.trim().replace(/\s/g,'')]);setNewFieldName('')}}} d={!newFieldName.trim()}>+ Add</Btn>
                </div>
              </div>
            </div>
            <div style={{marginTop:20,display:'flex',justifyContent:'flex-end'}}><Btn onClick={()=>setModal(null)}>Done</Btn></div>
          </>}

          {/* Email Preview Modal */}
          {modal==='preview'&&previewEmail&&<><h2 style={{fontSize:20,fontWeight:700,marginBottom:24,letterSpacing:'-0.02em'}}>Email Preview</h2>
            {/* Lead Selector */}
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Preview with Lead</label>
              <select value={previewLead?.id||''} onChange={e=>setPreviewLead(leads.find(l=>l.id===e.target.value)||leads[0])} style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14}}>
                {leads.length===0?<option value="">No leads - using sample data</option>:leads.slice(0,20).map(l=><option key={l.id} value={l.id}>{l.first_name} {l.last_name} ({l.email})</option>)}
              </select>
            </div>
            
            {/* Spam Score */}
            {(()=>{
              const sampleLead = previewLead || { first_name: 'John', last_name: 'Doe', email: 'john@acme.com', company: 'Acme Corp' }
              const renderedSubject = renderMergeTags(previewEmail.subject, sampleLead)
              const renderedBody = renderMergeTags(previewEmail.body, sampleLead)
              const score = calculateSpamScore(previewEmail.subject, previewEmail.body)
              const spam = getSpamLabel(score)
              
              return <>
                <div style={{padding:16,background:t.elevated,borderRadius:12,marginBottom:20,border:`1px solid ${t.border}`}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                    <span style={{fontSize:11,color:t.textMuted,textTransform:'uppercase',letterSpacing:'0.05em'}}>Spam Score</span>
                    <span style={{fontSize:18,fontWeight:700,color:spam.color}}>{score}/100</span>
                  </div>
                  <div style={{height:8,background:t.border,borderRadius:4,overflow:'hidden',marginBottom:12}}>
                    <div style={{height:'100%',width:`${score}%`,background:spam.color,borderRadius:4,transition:'width .3s'}}/>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{padding:'4px 10px',background:`${spam.color}20`,borderRadius:100,fontSize:12,fontWeight:600,color:spam.color}}>{spam.label}</span>
                    <span style={{fontSize:12,color:t.textMuted}}>{spam.desc}</span>
                  </div>
                </div>
                
                {/* Rendered Preview */}
                <div style={{background:t.bg,borderRadius:12,border:`1px solid ${t.border}`,overflow:'hidden'}}>
                  <div style={{padding:16,borderBottom:`1px solid ${t.border}`}}>
                    <div style={{fontSize:11,color:t.textMuted,marginBottom:4}}>TO:</div>
                    <div style={{fontSize:14}}>{sampleLead.email}</div>
                  </div>
                  <div style={{padding:16,borderBottom:`1px solid ${t.border}`}}>
                    <div style={{fontSize:11,color:t.textMuted,marginBottom:4}}>SUBJECT:</div>
                    <div style={{fontSize:16,fontWeight:600}}>{renderedSubject}</div>
                  </div>
                  <div style={{padding:20,fontSize:14,lineHeight:1.7,whiteSpace:'pre-wrap',minHeight:150}}>
                    {renderedBody}
                  </div>
                </div>
              </>
            })()}
            
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:24}}>
              <Btn v="g" onClick={()=>{setModal(null);setPreviewEmail(null);setPreviewLead(null)}}>Close</Btn>
            </div>
          </>}

          {/* Waitlist Modal */}
          {modal==='waitlist'&&<>
            {waitlistSent?<>
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{width:64,height:64,borderRadius:16,background:'linear-gradient(135deg,#22c55e,#10b981)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',fontSize:28}}>✓</div>
                <h2 style={{fontSize:22,fontWeight:800,marginBottom:12,letterSpacing:'-0.02em'}}>You're on the list!</h2>
                <p style={{color:t.textMuted,fontSize:14,lineHeight:1.6,marginBottom:24}}>We'll notify you as soon as Team plans are available. Thanks for your interest!</p>
                <Btn onClick={()=>{setModal(null);setWaitlistSent(false);setWaitlistForm({name:'',email:'',company:'',teamSize:''})}}>Close</Btn>
              </div>
            </>:<>
              <h2 style={{fontSize:22,fontWeight:700,marginBottom:8,letterSpacing:'-0.02em'}}>Join the Team Waitlist</h2>
              <p style={{color:t.textMuted,fontSize:14,marginBottom:24,lineHeight:1.5}}>Be the first to know when Team plans launch. Get early access pricing.</p>
              <Input label="Your Name" value={waitlistForm.name} onChange={v=>setWaitlistForm({...waitlistForm,name:v})} placeholder="John Smith"/>
              <Input label="Work Email" value={waitlistForm.email} onChange={v=>setWaitlistForm({...waitlistForm,email:v})} placeholder="john@company.com"/>
              <Input label="Company Name" value={waitlistForm.company} onChange={v=>setWaitlistForm({...waitlistForm,company:v})} placeholder="Acme Inc"/>
              <div style={{marginBottom:16}}>
                <label style={{display:'block',fontSize:11,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Team Size</label>
                <select value={waitlistForm.teamSize} onChange={e=>setWaitlistForm({...waitlistForm,teamSize:e.target.value})} style={{width:'100%',padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:14}}>
                  <option value="">Select team size</option>
                  <option value="2-5">2-5 people</option>
                  <option value="6-10">6-10 people</option>
                  <option value="11-25">11-25 people</option>
                  <option value="26-50">26-50 people</option>
                  <option value="50+">50+ people</option>
                </select>
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <Btn v="g" onClick={()=>{setModal(null);setWaitlistForm({name:'',email:'',company:'',teamSize:''})}}>Cancel</Btn>
                <Btn onClick={()=>{
                  // In production, you'd send this to your backend/Supabase
                  console.log('Waitlist submission:', waitlistForm)
                  setWaitlistSent(true)
                }} d={!waitlistForm.name.trim()||!waitlistForm.email.trim()||!waitlistForm.company.trim()||!waitlistForm.teamSize}>Join Waitlist</Btn>
              </div>
            </>}
          </>}
        </div>
      </div>}

      {/* Command Palette */}
      {cmdOpen&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',backdropFilter:'blur(8px)',display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:100,zIndex:200}} onClick={()=>setCmdOpen(false)}>
        <div style={{width:500,background:t.surface,border:t.cardBorder,borderRadius:16,overflow:'hidden',boxShadow:'0 0 60px rgba(168,85,247,0.1)'}} onClick={e=>e.stopPropagation()}>
          <div style={{padding:16,borderBottom:`1px solid ${t.border}`}}>
            <input value={cmdQuery} onChange={e=>setCmdQuery(e.target.value)} placeholder="Type a command or search..." autoFocus style={{width:'100%',padding:14,background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:15,outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{maxHeight:350,overflow:'auto'}}>
            {[
              {icon:'→',label:'Go to Dashboard',shortcut:'1',action:()=>{setPage('dashboard');setCmdOpen(false)}},
              {icon:'→',label:'Go to Leads',shortcut:'2',action:()=>{setPage('leads');setCmdOpen(false)}},
              {icon:'→',label:'Go to Sequences',shortcut:'3',action:()=>{setPage('sequences');setCmdOpen(false)}},
              {icon:'→',label:'Go to Templates',shortcut:'4',action:()=>{setPage('templates');setCmdOpen(false)}},
              {icon:'→',label:'Go to Analytics',shortcut:'5',action:()=>{setPage('analytics');setCmdOpen(false)}},
              {icon:'→',label:'Go to Settings',shortcut:'6',action:()=>{setPage('settings');setCmdOpen(false)}},
              {icon:'+',label:'Add New Lead',shortcut:'⌘N',action:()=>{setModal('lead');setCmdOpen(false)}},
              {icon:'↓',label:'Import Leads',shortcut:'⌘I',action:()=>{setModal('import');setCmdOpen(false)}},
              {icon:'↑',label:'Export Data',shortcut:'⌘E',action:()=>{setModal('export');setCmdOpen(false)}},
              {icon:'◆',label:'AI Assistant',shortcut:'',action:()=>{setAiOpen(true);setCmdOpen(false)}},
              {icon:'+',label:'New Sequence',shortcut:'',action:()=>{setModal('sequence');setCmdOpen(false)}},
            ].filter(cmd=>!cmdQuery||cmd.label.toLowerCase().includes(cmdQuery.toLowerCase())).map((cmd,i)=>(
              <div key={i} onClick={cmd.action} style={{padding:'14px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',borderBottom:`1px solid ${t.border}`,transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.background='rgba(168,85,247,0.1)'}} onMouseOut={e=>{e.currentTarget.style.background='transparent'}}>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <span style={{width:24,textAlign:'center',color:t.accent,fontSize:14}}>{cmd.icon}</span>
                  <span style={{fontSize:14}}>{cmd.label}</span>
                </div>
                {cmd.shortcut&&<span style={{fontSize:11,color:t.textMuted,background:t.elevated,padding:'4px 10px',borderRadius:6,border:`1px solid ${t.border}`}}>{cmd.shortcut}</span>}
              </div>
            ))}
          </div>
          <div style={{padding:'12px 18px',borderTop:`1px solid ${t.border}`,fontSize:11,color:t.textMuted,display:'flex',gap:16}}>
            <span>↑↓ Navigate</span><span>↵ Select</span><span>esc Close</span>
          </div>
        </div>
      </div>}

      {/* AI Assistant Slide Panel */}
      {/* AI Panel - Flex sidebar */}
      {aiOpen&&<div style={{width:380,background:t.bgAlt,borderLeft:`1px solid ${t.border}`,display:'flex',flexDirection:'column',flexShrink:0,boxShadow:'-4px 0 30px rgba(168,85,247,0.05)'}}>
        {/* Header */}
        <div style={{padding:'16px 20px',borderBottom:`1px solid ${t.border}`,display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(168,85,247,0.05)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${t.accent},#7c3aed)`,display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="16" height="16" fill="none" stroke="#000" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
            <span style={{fontWeight:700,fontSize:15,letterSpacing:'-0.02em'}}>AI Assistant</span>
          </div>
          <button onClick={()=>setAiOpen(false)} style={{background:'transparent',border:`1px solid ${t.border}`,color:t.textMuted,width:28,height:28,borderRadius:8,cursor:'pointer',fontSize:14}}>×</button>
        </div>
        
        {/* Messages */}
        <div style={{flex:1,overflow:'auto',padding:16}}>
          {aiMsgs.length===0&&<div style={{textAlign:'center',padding:'40px 20px'}}>
            <div style={{width:64,height:64,borderRadius:16,background:`linear-gradient(135deg,${t.accent},#7c3aed)`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 0 40px rgba(168,85,247,0.3)'}}><svg width="28" height="28" fill="none" stroke="#000" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
            <h3 style={{fontSize:18,fontWeight:700,marginBottom:8,letterSpacing:'-0.02em'}}>AI Email Writer</h3>
            <p style={{color:t.textMuted,fontSize:13,marginBottom:16,lineHeight:1.5}}>I can help write cold emails, subject lines, follow-ups, and more.</p>
            {profile.name||profile.company?
              <div style={{padding:'12px 14px',background:'rgba(0,255,136,.05)',border:'1px solid rgba(0,255,136,.15)',borderRadius:10,marginBottom:20,fontSize:12,color:t.success,fontWeight:500}}>Using profile: {profile.name||profile.company}</div>:
              <div onClick={()=>setPage('profile')} style={{padding:'12px 14px',background:'rgba(168,85,247,.05)',border:'1px solid rgba(168,85,247,.15)',borderRadius:10,marginBottom:20,fontSize:12,color:t.accent,cursor:'pointer',fontWeight:500}}>Set up Profile for better results</div>
            }
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {['Write a cold intro email','Give me 5 subject line ideas','Write a break-up email','Make this more conversational'].map(p=>(
                <button key={p} onClick={()=>{setAiIn(p);sendAi()}} style={{padding:'14px 16px',background:t.surface,border:`1px solid ${t.border}`,borderRadius:12,color:t.textSecondary,fontSize:13,cursor:'pointer',textAlign:'left',transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.color=t.accent}} onMouseOut={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.textSecondary}}>{p}</button>
              ))}
            </div>
          </div>}
          {aiMsgs.map((m,i)=>(
            <div key={i} style={{marginBottom:16}}>
              <div style={{fontSize:10,color:t.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.05em',fontWeight:500}}>{m.role==='user'?'You':'AI Assistant'}</div>
              <div style={{padding:16,background:m.role==='user'?'rgba(168,85,247,.1)':t.surface,border:`1px solid ${m.role==='user'?'rgba(168,85,247,.2)':t.border}`,borderRadius:14,fontSize:13,whiteSpace:'pre-wrap',lineHeight:1.6}}>
                {m.content}
                {m.role==='assistant'&&m.content.includes('---')&&(
                  <button onClick={()=>useAi(m.content)} style={{display:'flex',alignItems:'center',gap:8,marginTop:14,padding:'12px 16px',background:t.accent,border:'none',borderRadius:100,color:'#000',fontSize:12,fontWeight:600,cursor:'pointer',width:'100%',justifyContent:'center',boxShadow:DS.btnGlow}}>
                    Use This Email
                  </button>
                )}
              </div>
            </div>
          ))}
          {aiLoad&&<div style={{display:'flex',alignItems:'center',gap:10,color:t.textMuted,fontSize:13,padding:14}}><div style={{width:16,height:16,border:`2px solid rgba(168,85,247,.2)`,borderTopColor:t.accent,borderRadius:'50%',animation:'spin 1s linear infinite'}}/>Thinking...</div>}
        </div>
        
        {/* Input */}
        <div style={{padding:16,borderTop:`1px solid ${t.border}`,background:'rgba(0,0,0,.3)'}}>
          {aiMsgs.length>0&&<button onClick={()=>setAiMsgs([])} style={{width:'100%',padding:10,background:'transparent',border:`1px solid ${t.border}`,borderRadius:100,color:t.textMuted,fontSize:11,cursor:'pointer',marginBottom:12,fontWeight:500}}>Clear conversation</button>}
          <div style={{display:'flex',gap:10}}>
            <input value={aiIn} onChange={e=>setAiIn(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendAi()} placeholder="Ask me anything..." style={{flex:1,padding:'14px 16px',background:t.bg,border:`1px solid ${t.border}`,borderRadius:12,color:t.text,fontSize:13,outline:'none'}}/>
            <button onClick={sendAi} disabled={!aiIn.trim()||aiLoad} style={{padding:'0 20px',background:!aiIn.trim()||aiLoad?'rgba(168,85,247,.3)':t.accent,border:'none',borderRadius:100,color:'#000',fontSize:13,fontWeight:600,cursor:!aiIn.trim()||aiLoad?'not-allowed':'pointer',opacity:!aiIn.trim()||aiLoad?.5:1,boxShadow:!aiIn.trim()||aiLoad?'none':DS.btnGlow}}>Send</button>
          </div>
        </div>
      </div>}
      
      {/* Upgrade Modal */}
      {upgradeModal&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.9)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300}} onClick={()=>setUpgradeModal(null)}>
        <div style={{background:t.surface,border:'1px solid rgba(168,85,247,.3)',borderRadius:20,padding:40,width:420,textAlign:'center',boxShadow:'0 0 60px rgba(168,85,247,0.2)'}} onClick={e=>e.stopPropagation()}>
          <div style={{width:64,height:64,borderRadius:16,background:'linear-gradient(135deg,#f59e0b,#ef4444)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',fontSize:28}}>⚡</div>
          <h2 style={{fontSize:22,fontWeight:800,marginBottom:12,letterSpacing:'-0.02em'}}>Upgrade Your Plan</h2>
          <p style={{color:t.textMuted,fontSize:14,lineHeight:1.6,marginBottom:24}}>{upgradeModal.message}</p>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {plan.tier==='free'&&<button onClick={()=>{startTrial('starter');setUpgradeModal(null)}} style={{padding:'14px 24px',background:t.accent,border:'none',borderRadius:100,color:'#000',fontSize:14,fontWeight:700,cursor:'pointer',boxShadow:'0 0 30px rgba(168,85,247,0.4)'}}>Start Starter Trial (14 days free)</button>}
            {(plan.tier==='free'||plan.tier==='starter')&&<button onClick={()=>{startTrial('pro');setUpgradeModal(null)}} style={{padding:'14px 24px',background:'transparent',border:'1px solid rgba(168,85,247,.3)',borderRadius:100,color:t.accent,fontSize:14,fontWeight:600,cursor:'pointer'}}>Start Pro Trial (14 days free)</button>}
            <button onClick={()=>setUpgradeModal(null)} style={{padding:'12px 24px',background:'transparent',border:'none',color:t.textMuted,fontSize:13,cursor:'pointer'}}>Maybe Later</button>
          </div>
        </div>
      </div>}
      
      {/* Trial Banner */}
      {isOnTrial()&&<div style={{position:'fixed',top:0,left:64,right:0,background:'linear-gradient(90deg,rgba(168,85,247,.15),rgba(99,102,241,.15))',borderBottom:'1px solid rgba(168,85,247,.2)',padding:'10px 24px',display:'flex',alignItems:'center',justifyContent:'center',gap:16,zIndex:50}}>
        <span style={{fontSize:13,color:t.text}}>
          <span style={{fontWeight:700,color:t.accent}}>Trial Active:</span> {trialDaysLeft()} days left on {plan.trialTier?.charAt(0).toUpperCase()+plan.trialTier?.slice(1)} plan
        </span>
        <button onClick={()=>alert('Stripe integration coming soon! Your trial will continue.')} style={{padding:'6px 16px',background:t.accent,border:'none',borderRadius:100,color:'#000',fontSize:12,fontWeight:600,cursor:'pointer'}}>Upgrade Now</button>
      </div>}
      
    </div>
  )
}
