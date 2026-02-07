// Vercel Serverless Function for Contract Analysis
// Uses Anthropic Claude Sonnet for cost-effective analysis

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contract } = req.body;

    if (!contract || contract.length < 100) {
      return res.status(400).json({ error: 'Contract text is required (min 100 characters)' });
    }

    // Call Anthropic API
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const prompt = `You are an expert contract reviewer specializing in freelance and remote work agreements. Analyze the following contract and provide a structured assessment.

Contract Text:
"""
${contract}
"""

Analyze this contract focusing on:
1. Payment terms (clarity, rates, schedules, late fees)
2. Scope definition (clear deliverables, boundaries, revision limits)
3. Intellectual property rights
4. Termination clauses
5. Liability and indemnification
6. Timeline and deadlines
7. Confidentiality
8. Any one-sided or unfair terms

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no additional text):
{
  "risk_score": <number 1-10, where 1=very safe, 10=very risky>,
  "risk_level": "<Low Risk|Medium Risk|High Risk>",
  "critical_issues": [
    "<list of deal-breaker issues that should stop you from signing>"
  ],
  "warnings": [
    "<list of concerning terms that are negotiable but risky>"
  ],
  "good_terms": [
    "<list of protective or fair clauses found>"
  ],
  "missing_clauses": [
    "<list of important terms that are missing or unclear>"
  ]
}

Be specific and actionable. Focus on freelancer/remote worker protection.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const analysisText = data.content[0].text;

    // Parse JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Ensure all required fields exist
    const result = {
      risk_score: analysis.risk_score || 5,
      risk_level: analysis.risk_level || 'Medium Risk',
      critical_issues: analysis.critical_issues || [],
      warnings: analysis.warnings || [],
      good_terms: analysis.good_terms || [],
      missing_clauses: analysis.missing_clauses || []
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Analysis failed', 
      message: error.message 
    });
  }
}
