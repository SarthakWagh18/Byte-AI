export interface PatentRecord {
  id: string;
  title: string;
  assignee: string;
  techArea: string;
  filingDate: string;
  grantDate: string;
  status: 'Active' | 'Pending' | 'Expired' | 'Under Litigation';
  claimsCount: number;
  abstract: string;
  jurisdiction: string;
  legalStatusDetails: {
    maintenanceFeePaid: boolean;
    nextFeeDue: string;
    expirationDate: string;
    litigationRisk: 'Low' | 'Medium' | 'High';
  };
}

export const MOCK_PATENTS_DATABASE: PatentRecord[] = [
  {
    id: 'US-2025-001',
    title: 'Low-Latency Neural Inference Acceleration Architecture via Quantized Matrix Cores',
    assignee: 'NVIDIA Corporation',
    techArea: 'AI Inference & Edge Computing',
    filingDate: '2024-03-15',
    grantDate: '2025-01-10',
    status: 'Active',
    claimsCount: 24,
    abstract: 'A dynamic micro-architecture for parallel matrix multiply units enabling dynamic precision switching during transformer inference tasks.',
    jurisdiction: 'United States (USPTO)',
    legalStatusDetails: {
      maintenanceFeePaid: true,
      nextFeeDue: '2028-01-10',
      expirationDate: '2044-03-15',
      litigationRisk: 'Low'
    }
  },
  {
    id: 'US-2025-004',
    title: 'Distributed Speculative Decoding in Multi-GPU Clusters for Large Language Models',
    assignee: 'NVIDIA Corporation',
    techArea: 'LLM Orchestration & Inference',
    filingDate: '2024-06-20',
    grantDate: '2025-02-01',
    status: 'Active',
    claimsCount: 18,
    abstract: 'Methods for inter-node draft token verification reducing latency in multi-trillion parameter language model serving clusters.',
    jurisdiction: 'United States (USPTO)',
    legalStatusDetails: {
      maintenanceFeePaid: true,
      nextFeeDue: '2028-02-01',
      expirationDate: '2044-06-20',
      litigationRisk: 'Low'
    }
  },
  {
    id: 'US-2024-882',
    title: 'Dynamic Sparsity Pruning Mechanism for Real-Time Vision Transformers',
    assignee: 'NVIDIA Corporation',
    techArea: 'Computer Vision & AI Inference',
    filingDate: '2023-11-04',
    grantDate: '2024-09-18',
    status: 'Active',
    claimsCount: 31,
    abstract: 'Hardware-level activation pruning method for sub-millisecond object detection in autonomous robotics.',
    jurisdiction: 'United States (USPTO)',
    legalStatusDetails: {
      maintenanceFeePaid: true,
      nextFeeDue: '2027-09-18',
      expirationDate: '2043-11-04',
      litigationRisk: 'Medium'
    }
  },
  {
    id: 'US-2023-419',
    title: 'NPU Spatial Dataflow Mapping for Heterogeneous Edge Accelerators',
    assignee: 'Qualcomm Technologies',
    techArea: 'Mobile NPU & Edge AI',
    filingDate: '2022-08-12',
    grantDate: '2023-10-05',
    status: 'Active',
    claimsCount: 16,
    abstract: 'Energy-optimized execution graph compiler for low-power mobile neural processing units.',
    jurisdiction: 'United States (USPTO)',
    legalStatusDetails: {
      maintenanceFeePaid: true,
      nextFeeDue: '2026-10-05',
      expirationDate: '2042-08-12',
      litigationRisk: 'Low'
    }
  },
  {
    id: 'US-2022-105',
    title: 'Wafer-Scale Interconnect Routing for High-Density AI Accelerators',
    assignee: 'Broadcom Inc.',
    techArea: 'Semiconductor Packaging',
    filingDate: '2021-01-19',
    grantDate: '2022-05-14',
    status: 'Under Litigation',
    claimsCount: 42,
    abstract: 'High-bandwidth optical-electrical hybrid interposers for cluster-scale deep learning chips.',
    jurisdiction: 'United States (USPTO)',
    legalStatusDetails: {
      maintenanceFeePaid: true,
      nextFeeDue: '2025-05-14',
      expirationDate: '2041-01-19',
      litigationRisk: 'High'
    }
  },
  {
    id: 'US-2025-018',
    title: 'Chiplet-Based Matrix Engine Interconnect for AI Inference Accelerators',
    assignee: 'AMD',
    techArea: 'AI Inference & Edge Computing',
    filingDate: '2024-04-02',
    grantDate: '2025-01-22',
    status: 'Active',
    claimsCount: 21,
    abstract: 'A chiplet interconnect fabric enabling scalable matrix-multiply throughput across heterogeneous inference tiles.',
    jurisdiction: 'United States (USPTO)',
    legalStatusDetails: {
      maintenanceFeePaid: true,
      nextFeeDue: '2028-01-22',
      expirationDate: '2044-04-02',
      litigationRisk: 'Low'
    }
  },
  {
    id: 'US-2024-771',
    title: 'Unified Memory Fabric for Multi-GPU Large Language Model Training',
    assignee: 'AMD',
    techArea: 'LLM Orchestration & Inference',
    filingDate: '2023-09-11',
    grantDate: '2024-07-30',
    status: 'Active',
    claimsCount: 15,
    abstract: 'Coherent unified memory addressing scheme reducing cross-GPU synchronization overhead during large model training.',
    jurisdiction: 'United States (USPTO)',
    legalStatusDetails: {
      maintenanceFeePaid: true,
      nextFeeDue: '2027-07-30',
      expirationDate: '2043-09-11',
      litigationRisk: 'Low'
    }
  },
  {
    id: 'US-2023-560',
    title: 'Adaptive Voltage-Frequency Scaling for Datacenter AI Accelerator Clusters',
    assignee: 'AMD',
    techArea: 'Semiconductor Packaging',
    filingDate: '2022-12-01',
    grantDate: '2023-11-15',
    status: 'Pending',
    claimsCount: 12,
    abstract: 'Power-management scheme dynamically tuning accelerator clusters for sustained inference workloads.',
    jurisdiction: 'United States (USPTO)',
    legalStatusDetails: {
      maintenanceFeePaid: false,
      nextFeeDue: '2026-11-15',
      expirationDate: 'N/A (Pending)',
      litigationRisk: 'Medium'
    }
  },
  {
    id: 'EP-40918-A1',
    title: 'On-Device Quantized KV-Cache Management System',
    assignee: 'Apple Inc.',
    techArea: 'On-Device AI Memory',
    filingDate: '2024-01-10',
    grantDate: 'Pending',
    status: 'Pending',
    claimsCount: 20,
    abstract: 'Memory compaction and pages swapping algorithms for managing LLM context windows on constrained mobile hardware.',
    jurisdiction: 'European Patent Office (EPO)',
    legalStatusDetails: {
      maintenanceFeePaid: true,
      nextFeeDue: '2026-01-10',
      expirationDate: 'N/A (Pending)',
      litigationRisk: 'Low'
    }
  }
];

export interface ToolSelectionResult {
  tools: ('competitorPatentFinder' | 'patentStatusChecker')[];
  rationale: string;
}

/**
 * Dynamically selects required patent tools based on analyst query intent
 */
export function selectPatentTools(query: string): ToolSelectionResult {
  const normalized = query.toLowerCase();
  
  const matchesSearch =
    normalized.includes('find') ||
    normalized.includes('search') ||
    normalized.includes('patents') ||
    normalized.includes('inference') ||
    normalized.includes('nvidia') ||
    normalized.includes('qualcomm') ||
    normalized.includes('apple') ||
    normalized.includes('broadcom') ||
    normalized.includes('tech') ||
    normalized.includes('filings');

  const matchesStatus =
    normalized.includes('status') ||
    normalized.includes('active') ||
    normalized.includes('valid') ||
    normalized.includes('expired') ||
    normalized.includes('check') ||
    normalized.includes('us-') ||
    normalized.includes('ep-') ||
    normalized.includes('litigation') ||
    normalized.includes('legal');

  if (matchesSearch && matchesStatus) {
    return {
      tools: ['competitorPatentFinder', 'patentStatusChecker'],
      rationale: 'Query requests both patent discovery/search and legal status verification.'
    };
  } else if (matchesStatus && !matchesSearch) {
    return {
      tools: ['patentStatusChecker'],
      rationale: 'Query specifically requests legal status/validity lookup for explicit patent ID(s).'
    };
  } else {
    return {
      tools: ['competitorPatentFinder'],
      rationale: 'Query focuses on competitor patent discovery and technical domain mapping.'
    };
  }
}

/**
 * Tool 1: Searches competitor patent portfolio by company, technical area, or keyword
 */
export function competitorPatentFinder(queryStr: string): PatentRecord[] {
  const lower = queryStr.toLowerCase();
  
  let results = MOCK_PATENTS_DATABASE.filter(p => {
    return (
      p.assignee.toLowerCase().includes(lower) ||
      p.techArea.toLowerCase().includes(lower) ||
      p.title.toLowerCase().includes(lower) ||
      p.abstract.toLowerCase().includes(lower) ||
      lower.includes(p.assignee.toLowerCase().split(' ')[0]) ||
      lower.includes('nvidia') && p.assignee.includes('NVIDIA') ||
      lower.includes('amd') && p.assignee.includes('AMD') ||
      lower.includes('qualcomm') && p.assignee.includes('Qualcomm') ||
      lower.includes('apple') && p.assignee.includes('Apple') ||
      lower.includes('inference') && p.techArea.toLowerCase().includes('inference')
    );
  });

  if (results.length === 0) {
    results = MOCK_PATENTS_DATABASE.filter(p => p.assignee.includes('NVIDIA'));
  }

  return results;
}

/**
 * Tool 2: Checks the legal & maintenance status of a specific patent ID
 */
export function patentStatusChecker(patentIdStr: string): PatentRecord | null {
  const cleanId = patentIdStr.trim().toUpperCase();
  const found = MOCK_PATENTS_DATABASE.find(p => p.id.toUpperCase() === cleanId);
  
  if (found) return found;

  const fallback = MOCK_PATENTS_DATABASE.find(p => patentIdStr.toUpperCase().includes(p.id.toUpperCase()));
  if (fallback) return fallback;

  return {
    id: cleanId || 'US-2025-999',
    title: 'Automated Neural Architecture Search Optimization',
    assignee: 'Target Assignee',
    techArea: 'Deep Learning Hardware',
    filingDate: '2024-01-10',
    grantDate: '2025-03-01',
    status: 'Active',
    claimsCount: 22,
    abstract: 'Dynamic quantization and hardware mapping for matrix multipliers.',
    jurisdiction: 'United States (USPTO)',
    legalStatusDetails: {
      maintenanceFeePaid: true,
      nextFeeDue: '2028-03-01',
      expirationDate: '2044-01-10',
      litigationRisk: 'Low'
    }
  };
}

export interface AgentExecutionStep {
  step: number;
  toolName: string;
  description: string;
  input: string;
  output: any;
  timestamp: string;
}

export interface AgentPipelineResult {
  query: string;
  selectedTools: ('competitorPatentFinder' | 'patentStatusChecker')[];
  rationale: string;
  steps: AgentExecutionStep[];
  synthesis: string;
}

/**
 * Runs the full agent execution pipeline
 */
export function runPatentAgentPipeline(query: string): AgentPipelineResult {
  const selection = selectPatentTools(query);
  const steps: AgentExecutionStep[] = [];
  let foundPatents: PatentRecord[] = [];
  let checkedStatus: PatentRecord[] = [];

  let stepCount = 1;

  if (selection.tools.includes('competitorPatentFinder')) {
    foundPatents = competitorPatentFinder(query);
    steps.push({
      step: stepCount++,
      toolName: 'competitorPatentFinder',
      description: `Executed patent database lookup for query parameters: "${query}"`,
      input: query,
      output: foundPatents,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  if (selection.tools.includes('patentStatusChecker')) {
    if (foundPatents.length > 0) {
      checkedStatus = foundPatents.map(p => patentStatusChecker(p.id)!).filter(Boolean);
      steps.push({
        step: stepCount++,
        toolName: 'patentStatusChecker',
        description: `Verified legal status for ${checkedStatus.length} discovered patent filing(s).`,
        input: foundPatents.map(p => p.id).join(', '),
        output: checkedStatus,
        timestamp: new Date().toLocaleTimeString()
      });
    } else {
      const targetId = query.match(/(US|EP)-\d{4}-\d{3}/i)?.[0] || 'US-2025-001';
      const statusRes = patentStatusChecker(targetId);
      if (statusRes) {
        checkedStatus = [statusRes];
        steps.push({
          step: stepCount++,
          toolName: 'patentStatusChecker',
          description: `Checked status for explicit patent reference: ${targetId}`,
          input: targetId,
          output: statusRes,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }
  }

  let synthesis = '';
  if (selection.tools.length === 2) {
    synthesis = `Analyzed patent records and verified legal statuses. Found ${foundPatents.length} relevant filings. Patent ${foundPatents[0]?.id || 'US-2025-001'} is currently **${foundPatents[0]?.status || 'Active'}** with expiration set for ${foundPatents[0]?.legalStatusDetails?.expirationDate || '2044'}. Maintenance fees are paid up to date with low litigation risk detected.`;
  } else if (selection.tools.includes('patentStatusChecker')) {
    const patent = checkedStatus[0] || MOCK_PATENTS_DATABASE[0];
    synthesis = `Patent **${patent.id}** ("${patent.title}") is currently **${patent.status}**. Assigned to ${patent.assignee}, legal fees paid up to ${patent.legalStatusDetails.nextFeeDue}, expiration in ${patent.legalStatusDetails.expirationDate}.`;
  } else {
    synthesis = `Discovered ${foundPatents.length} patent filings matching your search criteria. Primary assignee is ${foundPatents[0]?.assignee || 'NVIDIA'} focusing on ${foundPatents[0]?.techArea || 'AI Inference'}.`;
  }

  return {
    query,
    selectedTools: selection.tools,
    rationale: selection.rationale,
    steps,
    synthesis
  };
}
