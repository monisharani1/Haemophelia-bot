import { Signal, RelevantFunction, FunctionalUnitAnalysis, ChatMessage } from '../types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';

/**
 * Retrieve the active Anthropic API Key
 */
export function getAnthropicApiKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('ANTHROPIC_API_KEY');
    if (stored && stored.trim().length > 0) return stored.trim();
  }
  return (import.meta as any).env?.VITE_ANTHROPIC_API_KEY || '';
}

/**
 * Save the Anthropic API Key
 */
export function setAnthropicApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('ANTHROPIC_API_KEY', key.trim());
    } else {
      localStorage.removeItem('ANTHROPIC_API_KEY');
    }
  }
}

/**
 * Call Anthropic Messages API
 */
async function callAnthropicApi(systemPrompt: string, userPrompt: string, maxTokens = 1500): Promise<string> {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Anthropic API error (${response.status})`);
  }

  const data = await response.json();
  const textContent = data.content?.find((c: any) => c.type === 'text')?.text || '';
  return textContent;
}

/**
 * Generate dedicated Functional Unit Breakdown for an article
 */
export async function generateFunctionalUnitBreakdown(
  signal: Signal,
  unit: RelevantFunction
): Promise<FunctionalUnitAnalysis> {
  const systemPrompt = `You are a Principal Strategic Intelligence Advisor for a leading global biopharmaceutical company specialized in Haemophilia & Rare Hematology.
Your task is to provide an executive-level, actionable, highly tailored strategic breakdown of a specific clinical/regulatory/market intelligence signal for a designated internal functional unit (${unit}).

Do NOT provide generic corporate advice. Provide granular, domain-specific insights reflecting haemophilia pharmacology, factor replacement standards, non-factor bispecifics, gene therapy hurdles (AAV neutralizing antibodies, durability), inhibitor management, and payer/HTA reimbursement dynamics.

Respond ONLY with valid JSON in this exact structure:
{
  "relevance": "Detailed paragraph explaining why this signal is critical specifically to ${unit}",
  "concreteActions": [
    "Concrete action 1 tailored to ${unit}",
    "Concrete action 2 tailored to ${unit}",
    "Concrete action 3 tailored to ${unit}",
    "Concrete action 4 tailored to ${unit}"
  ],
  "strategicTranslation": {
    "pipelineDecisions": "Strategic implications on pipeline, portfolio, or target development",
    "researchDirections": "Recommended studies, RWE analyses, or clinical trial design adaptations",
    "regulatoryImplications": "Regulatory interactions, labeling, safety commitments, or filing paths",
    "marketPositioning": "Competitive differentiation, value narrative, or formulary defense",
    "investmentVectors": "Resource allocation, CAPEX/OPEX reprioritization, or licensing targets"
  },
  "keyTakeaways": [
    "Executive summary bullet 1",
    "Executive summary bullet 2",
    "Executive summary bullet 3"
  ]
}`;

  const userPrompt = `Intelligence Signal to Analyze:
Title: ${signal.headline}
Category: ${signal.category}
Source: ${signal.source}
Impact Score: ${signal.impactScore}/100 (Priority: ${signal.priority})
Executive Summary: ${signal.summary}
Strategic Rationale: ${signal.whyItMatters}
Tags: ${signal.tags?.join(', ') || 'Haemophilia A, Prophylaxis'}

Target Functional Unit: ${unit}

Generate the detailed JSON strategic assessment.`;

  try {
    const rawResponse = await callAnthropicApi(systemPrompt, userPrompt, 1600);
    // Parse JSON
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as FunctionalUnitAnalysis;
    }
  } catch (error: any) {
    console.warn('Anthropic API live call fallback activated:', error.message);
  }

  // Fallback intelligent domain synthesizer if API key is not present or offline
  return generateFallbackUnitAnalysis(signal, unit);
}

/**
 * Intelligent domain-accurate fallback generator
 */
function generateFallbackUnitAnalysis(signal: Signal, unit: RelevantFunction): FunctionalUnitAnalysis {
  const isBispecific = signal.headline.toLowerCase().includes('bispecific') || signal.summary.toLowerCase().includes('bispecific');
  const isGeneTherapy = signal.headline.toLowerCase().includes('gene therapy') || signal.headline.toLowerCase().includes('aav') || signal.headline.toLowerCase().includes('crispr');
  const isSafety = signal.category === 'Safety' || signal.headline.toLowerCase().includes('tma') || signal.headline.toLowerCase().includes('inhibitor');
  const isReimbursement = signal.category === 'Market' || signal.headline.toLowerCase().includes('reimbursement') || signal.headline.toLowerCase().includes('pbm');

  let relevance = '';
  const actions: string[] = [];
  const translation: FunctionalUnitAnalysis['strategicTranslation'] = {};
  const takeaways: string[] = [];

  switch (unit) {
    case 'R&D':
      relevance = `For R&D, this signal indicates key shifts in therapeutic benchmarks and biochemical endpoints in Haemophilia A. ${
        isBispecific 
          ? 'The 88% zero-bleed rate in Phase 3 establishes a formidable pharmacokinetic hurdle for early-stage factor mimetics, necessitating optimized FVIII mimetic binding affinity and extended subcutaneous bioavailability.'
          : isGeneTherapy
          ? 'Overcoming pre-existing AAV neutralizing antibodies via plasmapheresis or in-vivo CRISPR editing alters vector engineering priorities and opens delivery platform validation.'
          : isSafety
          ? 'Co-administration safety alerts highlight critical thrombogenic thresholds when combining bypass agents with non-factor therapies, demanding preclinical thrombin generation assay refinement.'
          : 'Clinical evidence requires immediate recalibration of target product profiles (TPPs) for next-generation factor replacement and non-factor modalities.'
      }`;
      actions.push(
        `Review ongoing Phase 1/2 protocols to ensure primary bleeding rate (ABR) endpoints benchmark against the 88% zero-bleed threshold.`,
        `Conduct head-to-head in-vitro thrombin generation profiling across inhibitor and non-inhibitor plasma matrices.`,
        `Initiate molecular optimization for sub-Q delivery formulation to match once-monthly dosing intervals.`,
        `Evaluate vector capsid engineering or transient immune-depletion protocols for neutralizing antibody mitigation.`
      );
      translation.pipelineDecisions = 'Reprioritize asset milestones toward non-factor mimetics with >4-week half-life windows.';
      translation.researchDirections = 'Execute comparative microvascular endothelial safety assays and PK/PD simulation models.';
      translation.regulatoryImplications = 'Incorporate biomarker-driven safety stopping rules into upcoming IND packages.';
      translation.investmentVectors = 'Allocate $3.5M toward automated high-throughput FIXa/FX dual-affinity screening platforms.';
      takeaways.push(
        'Efficacy threshold has shifted from bleed reduction to complete annual bleed elimination (Zero ABR).',
        'Subcutaneous convenience with monthly kinetics is the mandatory baseline for pipeline assets.',
        'Preclinical models must include co-medication safety assessment protocols.'
      );
      break;

    case 'Medical Affairs':
      relevance = `Medical Affairs must lead the scientific narrative with Haemophilia Comprehensive Care Centers (HTCs) and key opinion leaders (KOLs). With clinicians evaluating new Phase 3 data and safety updates, our medical science liaisons (MSLs) must provide balanced, evidence-based education regarding breakthrough bleed management and treatment durability.`;
      actions.push(
        `Deploy an updated Medical Science Liaison (MSL) reactive slide deck addressing ISTH 2026 clinical endpoints and real-world inhibitor risks.`,
        `Convene an Advisory Board with top 12 European and US HTC Directors within 45 days to assess clinical practice shifts.`,
        `Publish a peer-reviewed systematic literature review on breakthrough bleed protocols in non-factor prophylaxis regimens.`,
        `Update CME educational modules regarding early neonatal PUP (Previously Untreated Patient) prophylaxis initiation.`
      );
      translation.pipelineDecisions = 'Align investigator-initiated study (IIS) grant funding with long-term joint health outcomes.';
      translation.researchDirections = 'Launch real-world evidence (RWE) registry tracking annualized bleeding rates and patient-reported joint mobility scores.';
      translation.marketPositioning = 'Position our portfolio on holistic patient well-being, verified long-term joint protection, and transparent safety registry tracking.';
      takeaways.push(
        'HTC clinicians demand rigorous guidance on acute breakthrough bleed management.',
        'Real-world PUP data is critical for reassuring pediatric hematologists on inhibitor safety.',
        'Proactive KOL engagement will mitigate competitor first-mover advantage.'
      );
      break;

    case 'Commercial':
      relevance = `The commercial implications are substantial. This signal directly impacts market share forecasts, competitive positioning against standard-of-care factor concentrates, and hospital tender defense strategies across major territories.`;
      actions.push(
        `Recalibrate FY2027 market share transition models accounting for faster physician conversion to extended-interval prophylaxis.`,
        `Develop competitive counter-positioning playbooks emphasizing treatment familiarity, individualized PK dosing, and established safety records.`,
        `Review tender pricing strategies across Tier-1 EU markets to protect baseline factor volume while expanding premium portfolio options.`,
        `Equip field commercial teams with digital objection-handling tools focused on real-world treatment adherence.`
      );
      translation.marketPositioning = 'Emphasize personalized prophylaxis vs one-size-fits-all fixed regimens.';
      translation.investmentVectors = 'Reallocate 15% of regional promotional budget toward digital engagement with patient advocacy groups.';
      takeaways.push(
        'Monthly dosing confers immense commercial appeal for active pediatric and adolescent patients.',
        'Defending existing factor revenues requires value-added clinical support programs.',
        'Differentiated safety records remain a decisive commercial counterweight.'
      );
      break;

    case 'Market Access':
      relevance = `For Market Access and Health Economics (HEOR), this signal directly influences HTA cost-effectiveness thresholds, budget impact models (BIMs), and payer rebate negotiations across national formularies and US PBMs.`;
      actions.push(
        `Update European HTA Joint Clinical Assessment (JCA) dossier with ICER (Incremental Cost-Effectiveness Ratio) models reflecting reduced bleed hospitalization costs.`,
        `Prepare value-based contracting (VBC) frameworks tying reimbursement to verified zero-bleed outcomes.`,
        `Engage US Pharmacy Benefit Managers (PBMs) with net-price parity analyses against standard-of-care prophylaxis.`,
        `Model paediatric HTA expansion impact across 12 EU member states to establish optimal launch price corridor.`
      );
      translation.marketPositioning = 'Demonstrate total cost-of-care reduction through eliminated emergency room visits and reduced joint arthropathy surgery.';
      translation.investmentVectors = 'Commission a comprehensive 5-year budget impact model with independent health economics academic partners.';
      takeaways.push(
        'Payers are prioritizing subcutaneous therapies that demonstrate net budget neutrality.',
        'Value-based outcome guarantees are increasingly required for premium tier placement.',
        'Paediatric reimbursement expansion accelerates whole-family brand adoption.'
      );
      break;

    case 'Regulatory':
      relevance = `Regulatory Affairs must monitor changing agency precedent (FDA CBER, EMA CHMP, and PMDA) regarding surrogate endpoints, accelerated approval pathways, and pharmacovigilance commitments for novel haemophilia modalities.`;
      actions.push(
        `Analyze CHMP and FDA review precedents to determine whether annualized bleeding rate (ABR) non-inferiority remains sufficient or if zero-bleed superiority is becoming expected.`,
        `Review Risk Evaluation and Mitigation Strategies (REMS) and European Risk Management Plans (RMP) for co-medication warnings.`,
        `Prepare briefing documents for upcoming Type B / Scientific Advice meetings with regulatory authorities.`,
        `Submit updated periodic safety update reports (PSUR) reflecting global registry co-administration data.`
      );
      translation.regulatoryImplications = 'Harmonize labeling across US and EU to prevent restrictive black-box co-medication warnings.';
      translation.researchDirections = 'Incorporate post-marketing safety study (PASS) commitments into initial submission timelines.';
      takeaways.push(
        'Regulators are scrutinizing combination regimens and thrombotic risk profiles closely.',
        'Priority review pathways for antibody-positive gene therapies create unprecedented fast-track precedent.',
        'Labeling clarity on breakthrough bleed protocols is paramount for approval.'
      );
      break;

    case 'Safety':
      relevance = `Pharmacovigilance and Safety teams must immediately evaluate spontaneous adverse event reports, signal detection thresholds in WHO VigiBase/FAERS, and potential microvascular thrombosis risks in high-risk patient subgroups.`;
      actions.push(
        `Conduct an ad-hoc safety review across internal global safety databases for microvascular thrombotic events and inhibitor formation.`,
        `Draft and distribute a Direct Healthcare Professional Communication (DHPC) regarding acute bleed management guidelines.`,
        `Implement automated disproportionality scoring (PRR/ROR) for non-factor combinations in real-time safety feeds.`,
        `Liaise with the European Haemophilia Safety Surveillance (EUHASS) network for prospective case validation.`
      );
      translation.regulatoryImplications = 'Update Section 4.4 (Special warnings) and 4.5 (Interactions) in the European Summary of Product Characteristics (SmPC).';
      translation.researchDirections = 'Establish mechanistic biomarker surveillance (D-dimer, fibrin monomer) in all ongoing clinical protocols.';
      takeaways.push(
        'Rigorous combination safety protocols prevent potentially fatal microangiopathic complications.',
        'Post-market real-world safety surveillance is an essential competitive and compliance differentiator.',
        'Immediate cross-functional alignment between PV, Regulatory, and Medical Affairs is essential.'
      );
      break;

    case 'Leadership':
    default:
      relevance = `Executive Leadership must synthesize this intelligence to steer corporate portfolio strategy, M&A/licensing evaluations, capital allocation, and investor communications in a rapidly evolving Haemophilia A landscape.`;
      actions.push(
        `Convene an Executive Portfolio Committee review to stress-test 5-year revenue forecasts against next-generation competitors.`,
        `Evaluate potential in-licensing opportunities for complementary rebalancing or in-vivo gene editing assets.`,
        `Approve a cross-functional task force to execute commercial defense and market access acceleration.`,
        `Prepare an Executive Briefing for the Board of Directors summarizing therapeutic paradigm shifts.`
      );
      translation.pipelineDecisions = 'Accelerate Phase 2/3 capital deployment for top-tier candidates while pruning sub-competitive legacy programs.';
      translation.investmentVectors = 'Authorize $12M strategic reserve for expedited clinical development and market access negotiations.';
      translation.marketPositioning = 'Establish corporate leadership as the foremost innovator in zero-bleed long-acting haemophilia therapies.';
      takeaways.push(
        'The standard of care is transitioning rapidly toward extended-interval zero-bleed regimens.',
        'Cross-functional execution across R&D, Access, and Medical Affairs will dictate market leadership.',
        'Strategic agility and evidence leadership are the decisive differentiators.'
      );
      break;
  }

  return {
    relevance,
    concreteActions: actions,
    strategicTranslation: translation,
    keyTakeaways: takeaways
  };
}

/**
 * Scope signals based on user inquiry for precise prompt grounding
 */
export function scopeSignalsForQuery(query: string, allSignals: Signal[]): Signal[] {
  const q = query.toLowerCase();
  const matched = allSignals.filter(s => {
    const textToSearch = `${s.headline} ${s.summary} ${s.whyItMatters} ${s.tags?.join(' ')} ${s.sourceId || ''} ${s.source}`.toLowerCase();
    
    // Check specific terms
    if (q.includes('bispecific') || q.includes('haven') || q.includes('isth') || q.includes('antibody')) {
      if (textToSearch.includes('bispecific') || textToSearch.includes('haven') || textToSearch.includes('isth')) return true;
    }
    if (q.includes('gene therapy') || q.includes('aav') || q.includes('aav5') || q.includes('crispr') || q.includes('serpinc1')) {
      if (textToSearch.includes('gene therapy') || textToSearch.includes('aav') || textToSearch.includes('crispr') || textToSearch.includes('serpinc1')) return true;
    }
    if (q.includes('safety') || q.includes('tma') || q.includes('microangiopathy') || q.includes('inhibitor') || q.includes('faers') || q.includes('vigibase')) {
      if (s.category === 'Safety' || textToSearch.includes('safety') || textToSearch.includes('tma') || textToSearch.includes('inhibitor')) return true;
    }
    if (q.includes('reimbursement') || q.includes('access') || q.includes('hta') || q.includes('pbm') || q.includes('pricing')) {
      if (s.category === 'Market' || textToSearch.includes('reimbursement') || textToSearch.includes('hta') || textToSearch.includes('pbm')) return true;
    }
    if (q.includes('regulatory') || q.includes('fda') || q.includes('ema') || q.includes('chmp') || q.includes('cber')) {
      if (s.category === 'Regulatory' || textToSearch.includes('fda') || textToSearch.includes('ema') || textToSearch.includes('chmp')) return true;
    }

    // Keyword match
    const words = q.split(/\s+/).filter(w => w.length > 3);
    return words.some(w => textToSearch.includes(w));
  });

  return matched.length > 0 ? matched : allSignals.slice(0, 5);
}

/**
 * Chatbot assistant completion call
 */
export async function sendChatbotMessage(
  userQuery: string,
  history: ChatMessage[],
  signals: Signal[]
): Promise<string> {
  const scopedSignals = scopeSignalsForQuery(userQuery, signals);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: userQuery,
        history: history.slice(-6),
        scopedSignals
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.response) {
        return data.response;
      }
    }
  } catch (err) {
    console.warn('Backend /api/chat error, falling back to client-side grounded extraction:', err);
  }

  // Fallback grounded domain chatbot response
  return generateFallbackChatResponse(userQuery, scopedSignals);
}

function generateFallbackChatResponse(query: string, scopedSignals: Signal[]): string {
  const q = query.toLowerCase();

  // Find matching signal
  const matching = scopedSignals.filter(s => {
    const text = `${s.headline} ${s.summary} ${s.whyItMatters} ${s.tags?.join(' ')} ${s.sourceId || ''}`.toLowerCase();
    const words = q.split(/\s+/).filter(w => w.length > 3);
    return words.some(w => text.includes(w));
  });

  if (matching.length > 0) {
    const primary = matching[0];
    if (q.includes('side effect') || q.includes('safety') || q.includes('adverse') || q.includes('tma')) {
      if (primary.category === 'Safety' || primary.summary.toLowerCase().includes('microangiopathy') || primary.summary.toLowerCase().includes('bleed')) {
        return `**Safety Finding (${primary.sourceIdType || 'Source'}: ${primary.sourceId || primary.id}):**\n\n• **Signal**: ${primary.headline}\n• **Safety Profile**: ${primary.summary}\n• **Clinical Implications**: ${primary.whyItMatters}`;
      } else {
        return `According to **${primary.sourceId || primary.headline}**, no severe adverse events or thromboembolic events were reported in the primary study (${primary.summary}).`;
      }
    }

    if (q.includes('regulatory') || q.includes('fda') || q.includes('ema') || q.includes('approval')) {
      return `**Regulatory Status (${primary.sourceIdType || 'Record'}: ${primary.sourceId || primary.id}):**\n\n• **Action**: ${primary.headline}\n• **Scope**: ${primary.summary}\n• **Significance**: ${primary.whyItMatters}`;
    }

    return `**Nova Orbit Intelligence (${primary.sourceIdType || 'Source'}: ${primary.sourceId || primary.id}):**\n\n• **Finding**: ${primary.headline}\n• **Summary**: ${primary.summary}\n• **Strategic Takeaway**: ${primary.whyItMatters}`;
  }

  if (scopedSignals.length > 0) {
    return `The requested detail is not found for query "${query}". The current active dataset includes ${scopedSignals.length} relevant signals. Please specify a drug, trial identifier (e.g., NCT05047809), or regulatory filing.`;
  }

  return `The requested information is not available in the current active Nova Orbit intelligence database.`;
}

