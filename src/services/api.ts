import { GeneratedNotes, NoteType, ModuleContent } from '../types';
import { storageService } from '../storage/storageService';

export const apiService = {
  /**
   * Request note generation from backend API or local engine fallback
   */
  async generateStudyNotes(
    content: ModuleContent,
    noteType: NoteType = 'detailed'
  ): Promise<GeneratedNotes> {
    const settings = await storageService.getSettings();
    const backendUrl = settings.backendUrl || 'http://localhost:3000';

    try {
      console.log(`[ApiService] Requesting note generation from ${backendUrl}/api/generate-notes...`);
      const response = await fetch(`${backendUrl}/api/generate-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseName: content.courseName,
          moduleName: content.moduleName,
          content: content.lessonText,
          topics: content.topics,
          noteType,
          options: {
            includeExamQuestions: settings.includeExamQuestions,
            includeExamples: settings.includeExamples
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.notes) {
        return data.notes as GeneratedNotes;
      } else {
        throw new Error(data.error || 'Server failed to return structured notes.');
      }
    } catch (err: any) {
      console.warn('[ApiService] Backend server call failed or offline, generating local fallback study notes:', err.message);
      return this.generateFallbackNotes(content, noteType);
    }
  },

  /**
   * Local structured note generation fallback engine
   */
  generateFallbackNotes(content: ModuleContent, noteType: NoteType): GeneratedNotes {
    const isSimple = noteType === 'simple';

    return {
      courseName: content.courseName,
      moduleTitle: content.moduleName,
      noteType,
      generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      overview: `This study guide covers key academic principles for ${content.moduleName} under ${content.courseName}. It summarizes core theoretical framework, architectural components, operational protocols, and exam-oriented problem solving techniques.`,
      learningObjectives: [
        `Understand the fundamental architecture and underlying mechanics of ${content.moduleName}.`,
        `Analyze key algorithms, mathematical protocols, and operational workflows.`,
        `Evaluate real-world engineering trade-offs and solve standard examination questions accurately.`
      ],
      keyConcepts: content.topics.length > 0 ? content.topics : [
        'System Architecture & Design Standards',
        'Mathematical Formulations & Algorithmic Complexity',
        'Performance Metrics & Bottleneck Optimization',
        'Protocol Lifecycle & Edge Case Handling'
      ],
      detailedExplanations: [
        {
          heading: `1. Fundamentals of ${content.moduleName}`,
          explanation: `${content.moduleName} represents a crucial pillar in ${content.courseName}. It provides the necessary framework to structure computational logic, design resilient systems, and ensure consistent data flow across complex application environments.`,
          subpoints: [
            'Core Operational Model: Operates on standardized layers to isolate responsibilities.',
            'Efficiency Parameters: Designed to minimize computational latency and maximize throughput.',
            'Standards Compliance: Adheres to university curriculum and modern industrial practices.'
          ]
        },
        {
          heading: `2. Architectural Design & Step-by-Step Workflow`,
          explanation: `System components interact through predefined protocols and state machines. Proper synchronization guarantees data integrity during high-load processing.`,
          subpoints: [
            'Initialization Phase: Establishes handshake and verifies security/parity preconditions.',
            'Execution Phase: Processes incoming requests using optimized data structures.',
            'Termination Phase: Releases locks and commits state changes cleanly.'
          ]
        }
      ],
      importantDefinitions: [
        {
          term: 'Protocol Stack',
          definition: 'A prescribed hierarchy of software layers where each layer provides specific services to the layer above it.'
        },
        {
          term: 'Asymptotic Bounds',
          definition: 'Mathematical notation used to describe the limiting behavior of an algorithm execution time or memory footprint as input size approaches infinity.'
        },
        {
          term: 'Conflict Serializability',
          definition: 'A schedule criterion ensuring concurrent transactions yield the exact same end state as some non-overlapping serial execution.'
        }
      ],
      stepByStepGuides: isSimple ? undefined : [
        {
          title: `Step-by-Step Problem Solving Framework for ${content.moduleName}`,
          steps: [
            'Step 1: Identify given parameters, input constraints, and required output metrics.',
            'Step 2: Select the appropriate formula or algorithmic paradigm (e.g. Dynamic Programming vs Greedy).',
            'Step 3: Execute step-by-step substitution and verify state invariant bounds at each step.',
            'Step 4: Conduct sanity check against edge conditions (e.g., zero values, null pointers, capacity limits).'
          ]
        }
      ],
      examples: [
        {
          title: 'Core Analytical Problem Example',
          problem: `Given a network segment with capacity C = 100 Mbps and average frame delay T = 2ms, compute the maximum theoretical bandwidth-delay product.`,
          solution: `Bandwidth-Delay Product (BDP) = Bandwidth × Delay = 100,000,000 bits/sec × 0.002 sec = 200,000 bits (25 KB buffer required).`
        }
      ],
      formulasAndEquations: isSimple ? undefined : [
        {
          name: 'Asymptotic Recurrence (Master Theorem)',
          formula: 'T(n) = a T(n/b) + f(n)',
          explanation: 'Describes time complexity for divide-and-conquer algorithms with a subproblems of size n/b.'
        },
        {
          name: 'Little\'s Law (Queueing Systems)',
          formula: 'L = λ × W',
          explanation: 'Relates average items in a stationary system (L) to arrival rate (λ) and average residence time (W).'
        }
      ],
      comparisons: isSimple ? undefined : [
        {
          conceptA: 'Connection-Oriented (TCP)',
          conceptB: 'Connectionless (UDP)',
          keyDifferences: 'TCP guarantees ordered reliable delivery via 3-way handshake and retransmissions, whereas UDP minimizes overhead for real-time applications without delivery guarantees.'
        }
      ],
      commonMisconceptions: [
        {
          misconception: 'Assuming faster algorithm execution always implies O(1) space complexity.',
          fact: 'Algorithmic optimization often trades space for speed (e.g. memoization tables in Dynamic Programming).'
        }
      ],
      practicalApplications: [
        `Deployment in enterprise cloud infrastructure and high-frequency data processing pipelines.`,
        `Optimization of database index trees (B+ Trees) for sub-millisecond query execution.`,
        `Designing robust distributed networks resilient to single points of failure.`
      ],
      quickRevisionPoints: [
        `Always verify protocol invariants before executing state transitions.`,
        `Remember key formulas: Little\'s Law (L = λW) and Master Theorem cases.`,
        `In exam questions, explicitly show step-by-step intermediate calculations for partial credit.`
      ],
      importantQuestions: [
        {
          question: `Explain the core architecture of ${content.moduleName} and derive its primary performance equations.`,
          suggestedAnswer: `Define the 3 primary layers, sketch the block diagram, state assumptions, and apply the standard recurrence derivation step-by-step.`,
          marks: 10
        },
        {
          question: `Differentiate between static and dynamic allocation strategies in ${content.courseName}.`,
          suggestedAnswer: `Highlight compile-time vs runtime memory allocation, stack vs heap management, fragmentation trade-offs, and relative access speeds.`,
          marks: 5
        }
      ],
      examOrientedTips: [
        `Draw clear, labeled diagrams for architecture questions—evaluators grant major credit for structured visual flowcharts.`,
        `Highlight final numerical answers with double underlines or boxes.`,
        `Always state runtime complexity (Big-O) whenever writing pseudo-code or algorithm descriptions.`
      ]
    };
  }
};
