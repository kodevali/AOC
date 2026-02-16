
import { GoogleGenAI, Type } from "@google/genai";

export class AuditAIService {
  private getAI() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Missing Gemini API Key. Please ensure API_KEY is configured.");
    }
    return new GoogleGenAI({ apiKey });
  }

  /**
   * Module: Control & Compliance Matrix
   * EXHAUSTIVE STRUCTURAL AUDIT PROTOCOL (V4)
   */
  async analyzeCompliancePDF(fileBase64: string, fileName: string) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'application/pdf', data: fileBase64 } },
            { 
              text: `MISSION: EXHAUSTIVE STRUCTURAL INTERPRETER PROTOCOL WITH INTEGRITY CHECK. 
              Extract EVERY SINGLE prescriptive requirement from the attached document.
              
              ZERO OMISSION POLICY - MANDATORY STRUCTURAL RULES:
              1. OCR & IMAGE SCAN: Perform a full visual OCR scan of every page.
              2. MULTI-COLUMN RESOLUTION: Identify gutters and resolve logical reading order. 
              3. TABLE INTEGRITY: Every row/cell containing a directive MUST be extracted.
              4. CONTENT QUALITY: Provide FULL descriptive text for requirements.
              
              MANDATORY VERIFICATION: Perform a "Coverage Audit" to ensure 100% section mapping.`
            }
          ]
        },
        config: {
          systemInstruction: "You are an Elite Audit AI Operations System. Your primary directive is the ZERO OMISSION POLICY. You provide comprehensive, detailed descriptions for every requirement.",
          temperature: 0,
          thinkingConfig: { thinkingBudget: 32768 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                refId: { type: Type.STRING },
                requirement: { type: Type.STRING },
                procedure: { type: Type.STRING },
                evidence: { type: Type.STRING },
                criteria: { type: Type.STRING },
                riskRating: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                domainTag: { type: Type.STRING },
                sourceExcerpt: { type: Type.STRING }
              },
              required: ["refId", "requirement", "procedure", "evidence", "criteria", "riskRating", "domainTag", "sourceExcerpt"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  /**
   * Module: Gap Analysis Engine
   * EXHAUSTIVE ATOMIC MAPPING (V2)
   */
  async compareRegulatoryGap(regBase64: string, policyBase64: string) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'application/pdf', data: regBase64 } },
            { inlineData: { mimeType: 'application/pdf', data: policyBase64 } },
            { 
              text: `MISSION: SIDE-BY-SIDE TOTAL COVERAGE MAPPING.
              
              AUDITOR PROTOCOL (STRICT ZERO-OMISSION):
              1. ATOMIC EXTRACTION: Identify every single numbered section, bullet point, and clause in Document A (Benchmark).
              2. MANDATORY OUTPUT: For EVERY clause found in Document A, you MUST produce an entry in the JSON.
              3. NO SKIPPING: Even if a clause is perfectly matched in Document B (Target), you MUST include it and mark it as 'Full Compliance'.
              4. INTERNAL MAPPING: For 'Full Compliance' items, find and quote the exact text in Document B that proves compliance.
              5. GAP ANALYSIS: If Document B lacks specific wording or scope found in Document A, mark as 'Gap' or 'Partial'.
              
              THE OUTPUT IS AN AUDIT TRAIL OF 100% ANALYSIS. IF THERE ARE 50 CLAUSES IN DOC A, THERE MUST BE 50 ENTRIES IN THE JSON.`
            }
          ]
        },
        config: {
          systemInstruction: "You are a specialized Compliance Gap Analyst. You ensure that every single regulatory clause is accounted for. You never summarize or skip compliant clauses; you document them as proof of thorough analysis.",
          temperature: 0,
          thinkingConfig: { thinkingBudget: 32768 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                refId: { type: Type.STRING },
                regulatoryRequirement: { type: Type.STRING },
                internalReference: { type: Type.STRING },
                internalText: { type: Type.STRING },
                gapStatus: { type: Type.STRING, enum: ['Full Compliance', 'Partial', 'Gap', 'N/A'] },
                gapDescription: { type: Type.STRING },
                riskRating: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                remediationAction: { type: Type.STRING }
              },
              required: ["refId", "regulatoryRequirement", "gapStatus", "gapDescription", "riskRating", "remediationAction"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async synthesizeDetailedGap(requirement: string, internalText: string, status: string) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Requirement: ${requirement}\nInternal Text: ${internalText}\nStatus: ${status}\n\nPerform a deep-dive technical critique.`,
        config: {
          systemInstruction: "You are a Senior Regulatory Auditor. Provide a high-density, technical critique of compliance gaps.",
          temperature: 0.2
        }
      });
      return response.text;
    } catch (error) {
      console.error("Detailed Synthesis Error:", error);
      throw error;
    }
  }

  async analyzeAuditTrends(files: { data: string, name: string }[]) {
    const ai = this.getAI();
    try {
      const parts = files.map(f => ({ inlineData: { mimeType: 'application/pdf', data: f.data } }));
      parts.push({ text: `Analyze longitudinal trends across these reports.` } as any);
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts },
        config: {
          systemInstruction: "You are a Risk Analytics Specialist.",
          temperature: 0,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                frequency: { type: Type.NUMBER },
                severityTrend: { type: Type.STRING, enum: ['Improving', 'Degrading', 'Stable'] },
                historicalContext: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { year: { type: Type.STRING }, count: { type: Type.NUMBER }, status: { type: Type.STRING } } } },
                aiSynthesis: { type: Type.STRING },
                recommendedAction: { type: Type.STRING }
              },
              required: ["theme", "frequency", "severityTrend", "historicalContext", "aiSynthesis", "recommendedAction"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async generateRCMFromNarrative(fileBase64: string) {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'application/pdf', data: fileBase64 } },
            { 
              text: `MISSION: ATOMIC RCM SYNTHESIS WITH ZERO OMISSION PROTOCOL.
              
              AUDITOR PROTOCOL (STRICT COVERAGE):
              1. ATOMIC EXTRACTION: Analyze the source document and identify every distinct process step, action, or requirement mentioned.
              2. MANDATORY COVERAGE: You MUST generate a corresponding RCM entry for every identifiable clause, sub-step, or narrative segment in the source.
              3. NO SUMMARIZATION: Do not group distinct steps into a single entry. If the document describes 10 sequential actions, produce 10 matrix rows.
              4. AUDIT FIDELITY: Maintain 100% structural integrity of the source narrative. Every clause must have an associated risk and control.
              5. GAP DETECTION: If a step is described but no control is mentioned in the text, you MUST mark it as "GAP: No Control Identified" and suggest a "Recommended Control".`
            }
          ]
        },
        config: {
          systemInstruction: `SYSTEM INSTRUCTIONS: RISK CONTROL MATRIX (RCM) GENERATOR
ROLE: You are an expert Risk and Compliance Analyst and Internal Auditor. Your objective is to analyze uploaded process documentation or descriptive text and transform it into a professional, audit-ready Risk Control Matrix (RCM). Adhere to international risk management standards (COSO, ISO 31000, and SOX).

PROCESSING INSTRUCTIONS:
1. Comprehensive Review: Read the entire document without omission. Evaluate every sub-process/clause for potential risks.
2. Logic Application: Derive risks and controls even if not explicitly labeled, using industry best practices.
3. RCM Generation Framework: Define Process, Define Objectives, Identify Risks (What Could Go Wrong), Root Cause Analysis, Map Controls, Classify (Preventative/Detective), Categorize Nature (Manual, Automated, Semi Automated), and Apply Risk Rating Logic (High/Med/Low).
4. ZERO OMISSION: Do not skip any process steps mentioned. 
5. Professional Language: Use standard terminology like "Segregation of Duties", "Three-way Match", etc.

MANDATORY RESPONSE SCHEMA (12 COLUMNS):
- refId: Process ID / Ref (e.g., AP-01)
- processName: Process Name (Specific sub-step/clause)
- controlObjective: Control Objective
- riskDescription: Risk Description (What could go wrong/Root cause)
- inherentRiskRating: Inherent Risk Rating (High/Medium/Low)
- controlActivity: Control Activity (Detailed description)
- controlType: Control Type (Preventive/Detective)
- controlNature: Control Nature (Manual/Automated/Semi Automated)
- frequency: Frequency
- controlOwner: Control Owner (Job title/Department)
- evidenceOfPerformance: Evidence of Performance
- residualRiskRating: Residual Risk Rating (High/Medium/Low)`,
          temperature: 0,
          thinkingConfig: { thinkingBudget: 32768 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                refId: { type: Type.STRING },
                processName: { type: Type.STRING },
                controlObjective: { type: Type.STRING },
                riskDescription: { type: Type.STRING },
                inherentRiskRating: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                controlActivity: { type: Type.STRING },
                controlType: { type: Type.STRING, enum: ['Preventive', 'Detective'] },
                controlNature: { type: Type.STRING, enum: ['Manual', 'Automated', 'Semi Automated'] },
                frequency: { type: Type.STRING },
                controlOwner: { type: Type.STRING },
                evidenceOfPerformance: { type: Type.STRING },
                residualRiskRating: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
              },
              required: ["refId", "processName", "controlObjective", "riskDescription", "inherentRiskRating", "controlActivity", "controlType", "controlNature", "frequency", "controlOwner", "evidenceOfPerformance", "residualRiskRating"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const auditAI = new AuditAIService();
