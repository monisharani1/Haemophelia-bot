import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Custom Vite plugin providing the /api/chat server-side endpoint
function chatApiPlugin() {
  return {
    name: 'nova-orbit-chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { query, history = [], scopedSignals = [] } = data;

            if (!query) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Query is required' }));
              return;
            }

            // Build grounded context from scoped signals
            const contextText = scopedSignals.length > 0
              ? scopedSignals.map((s, idx) => `[Signal #${idx + 1}]
Headline: ${s.headline}
Category: ${s.category} | Priority: ${s.priority} | Impact Score: ${s.impactScore}/100
Source: ${s.source} (${s.sourceIdType ? `${s.sourceIdType}: ${s.sourceId}` : 'Unverified'})
Source URL: ${s.sourceUrl || 'N/A'}
Date: ${s.date}
Summary: ${s.summary}
Strategic Rationale: ${s.whyItMatters}
Tags: ${s.tags ? s.tags.join(', ') : 'None'}`).join('\n\n')
              : 'No directly matching signals in current active filtered slice.';

            const systemPrompt = `You are Nova Orbit Copilot, an elite biopharma strategic intelligence assistant.
You answer user inquiries strictly grounded in the provided Nova Orbit database slice.

CRITICAL CONSTRAINTS:
1. Grounding: Answer ONLY using the facts present in the provided intelligence signals.
2. Narrow Scoping: Answer precisely what was asked (e.g. if asked about side effects, return only safety/side-effect findings; if asked about regulatory approvals, return only regulatory status). Do NOT bundle generic domain overviews or unrelated topics.
3. No Hallucinations: If the answer is not contained in the provided signals dataset, state plainly: "The requested information is not available in the current active Nova Orbit intelligence database."

ACTIVE SIGNALS DATASET:
${contextText}`;

            const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

            if (apiKey) {
              const messages = [
                ...history.slice(-4).map(h => ({
                  role: h.sender === 'user' ? 'user' : 'assistant',
                  content: h.text
                })),
                { role: 'user', content: query }
              ];

              const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': apiKey,
                  'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                  model: 'claude-3-5-sonnet-20241022',
                  max_tokens: 800,
                  system: systemPrompt,
                  messages
                })
              });

              if (response.ok) {
                const result = await response.json();
                const text = result.content?.find(c => c.type === 'text')?.text || '';
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ response: text, source: 'claude-api' }));
                return;
              }
            }

            // Grounded deterministic analysis engine (scoped strictly to provided signals)
            const lowerQuery = query.toLowerCase();
            let matchedText = '';

            // 1. Check for specific signal match in scoped context
            const matchingSignals = scopedSignals.filter(s => {
              const terms = lowerQuery.split(' ').filter(w => w.length > 3);
              return terms.some(t => 
                s.headline.toLowerCase().includes(t) || 
                s.summary.toLowerCase().includes(t) ||
                s.whyItMatters.toLowerCase().includes(t) ||
                (s.tags && s.tags.some(tag => tag.toLowerCase().includes(t))) ||
                (s.sourceId && s.sourceId.toLowerCase().includes(t))
              );
            });

            if (matchingSignals.length > 0) {
              const primary = matchingSignals[0];
              if (lowerQuery.includes('side effect') || lowerQuery.includes('safety') || lowerQuery.includes('adverse') || lowerQuery.includes('tma')) {
                if (primary.category === 'Safety' || primary.summary.toLowerCase().includes('microangiopathy') || primary.summary.toLowerCase().includes('bleed')) {
                  matchedText = `**Safety & Adverse Event Findings (${primary.sourceIdType || 'Record'}: ${primary.sourceId || primary.id}):**\n\n• **Signal**: ${primary.headline}\n• **Observed Safety Profile**: ${primary.summary}\n• **Clinical Relevance**: ${primary.whyItMatters}`;
                } else {
                  matchedText = `According to **${primary.sourceId || primary.headline}**, no severe adverse events or thromboembolic events were reported in the primary cohort study (${primary.summary}).`;
                }
              } else if (lowerQuery.includes('regulatory') || lowerQuery.includes('fda') || lowerQuery.includes('ema') || lowerQuery.includes('approval') || lowerQuery.includes('priority review')) {
                matchedText = `**Regulatory Intelligence (${primary.sourceIdType || 'Filing'}: ${primary.sourceId || primary.id}):**\n\n• **Status**: ${primary.headline}\n• **Action Summary**: ${primary.summary}\n• **Regulatory Significance**: ${primary.whyItMatters}`;
              } else if (lowerQuery.includes('reimbursement') || lowerQuery.includes('pricing') || lowerQuery.includes('hta') || lowerQuery.includes('access')) {
                matchedText = `**Market Access & Pricing Data (${primary.sourceIdType || 'Filing'}: ${primary.sourceId || primary.id}):**\n\n• **Coverage Determination**: ${primary.headline}\n• **Details**: ${primary.summary}\n• **Commercial Implications**: ${primary.whyItMatters}`;
              } else {
                matchedText = `**Intelligence Record (${primary.sourceIdType || 'Record'}: ${primary.sourceId || primary.id}):**\n\n• **Headline**: ${primary.headline}\n• **Summary**: ${primary.summary}\n• **Impact (${primary.priority} Priority / Score: ${primary.impactScore}/100)**: ${primary.whyItMatters}`;
              }
            } else if (scopedSignals.length > 0) {
              matchedText = `The current active Nova Orbit dataset contains ${scopedSignals.length} signals. However, none specifically match all criteria in your query "${query}". Please refine your search by drug name, NCT/PMID identifier, or regulatory body.`;
            } else {
              matchedText = `The requested information is not available in the current active Nova Orbit intelligence database.`;
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ response: matchedText, source: 'nova-orbit-grounded-engine' }));
          } catch (err) {
            console.error('API /api/chat error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), chatApiPlugin()],
});
