import { DigiicampusAdapter } from './adapter';
import { Semester, Course, Module, ModuleContent, DigiicampusSessionStatus } from '../../types';

export class MockDigiicampusAdapter implements DigiicampusAdapter {
  private mockSemesters: Semester[] = [
    {
      id: 'sem-2026-odd',
      name: '2026 — Odd Semester (Semester V)',
      isCurrent: true,
      year: '2026',
      term: 'Odd'
    },
    {
      id: 'sem-2026-even',
      name: '2026 — Even Semester (Semester IV)',
      isCurrent: false,
      year: '2026',
      term: 'Even'
    }
  ];

  private mockCourses: Record<string, Course[]> = {
    'sem-2026-odd': [
      {
        id: 'cs301',
        code: 'CS-301',
        name: 'Computer Networks',
        credits: 4,
        instructor: 'Dr. A. Sharma',
        semesterId: 'sem-2026-odd',
        modules: [
          {
            id: 'cn-mod-1',
            courseId: 'cs301',
            number: 1,
            title: 'Introduction to Networks & Physical Layer',
            description: 'Network topologies, OSI 7-layer model vs TCP/IP stack, transmission media, digital vs analog signals.',
            topics: ['OSI Model', 'TCP/IP Architecture', 'Transmission Media', 'Bandwidth & Latency'],
            resourceCount: 4,
            resources: [
              { id: 'res-1', title: 'Lecture 1 Slides - Network Fundamentals.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-2', title: 'OSI Model Deep Dive Notes.docx', type: 'document', isAccessible: true },
              { id: 'res-3', title: 'RFC 791 IPv4 Specification Summary', type: 'text', isAccessible: true },
              { id: 'res-4', title: 'Physical Layer Signal Encoding Video Link', type: 'link', isAccessible: true }
            ]
          },
          {
            id: 'cn-mod-2',
            courseId: 'cs301',
            number: 2,
            title: 'Data Link Layer & Error Control',
            description: 'Framing techniques, error detection (CRC, Checksum), flow control (Stop-and-Wait, Sliding Window Protocols), Ethernet IEEE 802.3 standards.',
            topics: ['Framing', 'CRC Error Detection', 'Sliding Window Protocol', 'CSMA/CD'],
            resourceCount: 3,
            resources: [
              { id: 'res-5', title: 'Data Link Control Protocols Guide.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-6', title: 'CRC Polynomial Calculation Examples.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-7', title: 'Ethernet Frame Structure Walkthrough.txt', type: 'text', isAccessible: true }
            ]
          },
          {
            id: 'cn-mod-3',
            courseId: 'cs301',
            number: 3,
            title: 'Network Layer & IP Routing Protocols',
            description: 'IPv4 and IPv6 addressing, Subnetting, Classless Inter-Domain Routing (CIDR), Distance Vector (RIP) and Link State (OSPF) routing algorithms.',
            topics: ['IPv4/IPv6 Addressing', 'Subnet Masking', 'Dijkstra Link State Routing', 'BGP & Autonomous Systems'],
            resourceCount: 5,
            resources: [
              { id: 'res-8', title: 'Subnetting Cheat Sheet & Practice Problems.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-9', title: 'OSPF vs BGP Architecture Comparison.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-10', title: 'Router Configuration Commands Reference.txt', type: 'text', isAccessible: true },
              { id: 'res-11', title: 'IP Packet Structure & Header Fields.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-12', title: 'Lab Assignment 3 - Packet Tracer Setup.pdf', type: 'pdf', isAccessible: true }
            ]
          },
          {
            id: 'cn-mod-4',
            courseId: 'cs301',
            number: 4,
            title: 'Transport Layer Protocols (TCP & UDP)',
            description: 'Connection-oriented TCP vs Connectionless UDP, TCP 3-way handshake, congestion control algorithms (Reno, Tahoe), socket programming principles.',
            topics: ['TCP 3-Way Handshake', 'Congestion Control', 'UDP Datagrams', 'Socket API Basics'],
            resourceCount: 3,
            resources: [
              { id: 'res-13', title: 'TCP Connection Lifecycle & State Machine.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-14', title: 'Socket Programming Code Examples in C/Python.zip', type: 'document', isAccessible: true },
              { id: 'res-15', title: 'Flow Control vs Congestion Control Notes.txt', type: 'text', isAccessible: true }
            ]
          },
          {
            id: 'cn-mod-5',
            courseId: 'cs301',
            number: 5,
            title: 'Application Layer Services & Network Security',
            description: 'DNS domain hierarchy, HTTP/HTTPS web protocol, SMTP/IMAP email standards, TLS/SSL encryption, public key infrastructure (RSA).',
            topics: ['DNS Resolution Lifecycle', 'HTTP/1.1 vs HTTP/2 vs HTTP/3', 'Symmetric & Asymmetric Encryption', 'Firewalls & NAT'],
            resourceCount: 4,
            resources: [
              { id: 'res-16', title: 'Web Protocols & Security Foundations.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-17', title: 'RSA Cryptography Step-by-Step Example.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-18', title: 'DNS Cache Poisoning & Mitigation.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-19', title: 'TLS 1.3 Handshake Protocol Flow.txt', type: 'text', isAccessible: true }
            ]
          }
        ]
      },
      {
        id: 'cs302',
        code: 'CS-302',
        name: 'Database Management Systems',
        credits: 4,
        instructor: 'Prof. R. Verma',
        semesterId: 'sem-2026-odd',
        modules: [
          {
            id: 'db-mod-1',
            courseId: 'cs302',
            number: 1,
            title: 'Relational Model & ER Diagrams',
            description: 'Entity-Relationship data modeling, relational algebra operators, keys (Primary, Foreign, Candidate), integrity constraints.',
            topics: ['ER & EER Diagrams', 'Relational Algebra (Select, Project, Join)', 'Candidate Keys & Functional Dependencies'],
            resourceCount: 3,
            resources: [
              { id: 'res-db1', title: 'ER Diagram Design Guidelines.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-db2', title: 'Relational Algebra Symbols & Queries.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-db3', title: 'University Database Schema Case Study.docx', type: 'document', isAccessible: true }
            ]
          },
          {
            id: 'db-mod-2',
            courseId: 'cs302',
            number: 2,
            title: 'SQL Query Optimization & Normalization',
            description: 'Complex SQL joins, subqueries, view definitions, normalization forms (1NF, 2NF, 3NF, BCNF, 4NF), lossless join decomposition.',
            topics: ['SQL Window Functions', '1NF to BCNF Normalization', 'Functional Dependency Closure Algorithms'],
            resourceCount: 4,
            resources: [
              { id: 'res-db4', title: 'Normalization Step-by-Step Solved Problems.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-db5', title: 'Advanced SQL Query Tuning & Indexing.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-db6', title: 'SQL Practice Problem Set.sql', type: 'text', isAccessible: true },
              { id: 'res-db7', title: 'BCNF vs 3NF Trade-offs Reference.txt', type: 'text', isAccessible: true }
            ]
          },
          {
            id: 'db-mod-3',
            courseId: 'cs302',
            number: 3,
            title: 'Transaction Processing & ACID Properties',
            description: 'ACID guarantees, transaction state diagrams, serializability (Conflict & View Serializability), precedence graphs.',
            topics: ['ACID Guarantees', 'Conflict Serializability', 'Two-Phase Locking (2PL)', 'Strict vs Rigorous 2PL'],
            resourceCount: 3,
            resources: [
              { id: 'res-db8', title: 'Transaction Concurrency Control Notes.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-db9', title: 'Conflict Serializability Proof Technique.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-db10', title: 'Deadlock Detection & Prevention Strategies.txt', type: 'text', isAccessible: true }
            ]
          },
          {
            id: 'db-mod-4',
            courseId: 'cs302',
            number: 4,
            title: 'Indexing, B+ Trees & Query Execution',
            description: 'B-Trees and B+ Trees indexing structure, hash indexes, disk storage management, query processing steps, cost-based optimizer.',
            topics: ['B+ Tree Search & Insertion', 'Clustered vs Non-Clustered Indexes', 'External Merge Sort in Query Execution'],
            resourceCount: 3,
            resources: [
              { id: 'res-db11', title: 'B+ Tree Insertion & Deletion Visual Examples.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-db12', title: 'Index Selection Guidelines for Production DBs.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-db13', title: 'Disk Block I/O Optimization Notes.txt', type: 'text', isAccessible: true }
            ]
          }
        ]
      },
      {
        id: 'cs303',
        code: 'CS-303',
        name: 'Data Structures & Algorithms',
        credits: 4,
        instructor: 'Dr. K. Patel',
        semesterId: 'sem-2026-odd',
        modules: [
          {
            id: 'ds-mod-1',
            courseId: 'cs303',
            number: 1,
            title: 'Asymptotic Complexity & Dynamic Arrays',
            description: 'Big-O, Omega, and Theta notations, amortized analysis of dynamic arrays, master theorem for recurrence relations.',
            topics: ['Big-O Asymptotic Bounds', 'Master Theorem Formula', 'Amortized Doubling Array Complexity'],
            resourceCount: 3,
            resources: [
              { id: 'res-ds1', title: 'Asymptotic Analysis Reference & Recurrences.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-ds2', title: 'Amortized Analysis Accounting Method.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-ds3', title: 'Complexity Cheat Sheet.txt', type: 'text', isAccessible: true }
            ]
          },
          {
            id: 'ds-mod-2',
            courseId: 'cs303',
            number: 2,
            title: 'Balanced Search Trees & Heaps',
            description: 'AVL Trees rotations, Red-Black Tree invariants, Binary Heap property, Priority Queues, HeapSort algorithm.',
            topics: ['AVL Tree Single & Double Rotations', 'Red-Black Tree Properties', 'Binary Heapify Algorithm'],
            resourceCount: 4,
            resources: [
              { id: 'res-ds4', title: 'AVL Rotations & Balance Factor Calculations.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-ds5', title: 'Red-Black Tree Insertion Rebalancing Rules.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-ds6', title: 'HeapSort vs QuickSort Empirical Benchmark.txt', type: 'text', isAccessible: true },
              { id: 'res-ds7', title: 'Priority Queue Implementation Code.cpp', type: 'text', isAccessible: true }
            ]
          },
          {
            id: 'ds-mod-3',
            courseId: 'cs303',
            number: 3,
            title: 'Graph Algorithms & Shortest Paths',
            description: 'Graph representations (Adjacency Matrix/List), Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra algorithm, Bellman-Ford, Kruskal & Prim MST.',
            topics: ['BFS & DFS Topological Sorting', 'Dijkstra Algorithm with Min-Heap', 'Kruskal Disjoint Set Union (DSU)'],
            resourceCount: 4,
            resources: [
              { id: 'res-ds8', title: 'Graph Traversal & Cycle Detection Algorithms.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-ds9', title: 'Shortest Path Algorithms Comparative Table.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-ds10', title: 'Minimum Spanning Trees Solved Examples.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-ds11', title: 'Graph Problem Set & Solutions.pdf', type: 'pdf', isAccessible: true }
            ]
          },
          {
            id: 'ds-mod-4',
            courseId: 'cs303',
            number: 4,
            title: 'Dynamic Programming & Greedy Strategies',
            description: 'Optimal substructure, overlapping subproblems, memoization vs bottom-up tabulation, 0/1 Knapsack, Longest Common Subsequence (LCS), Matrix Chain Multiplication.',
            topics: ['0/1 Knapsack DP Matrix', 'LCS Recurrence Relation', 'Greedy Choice Property vs DP'],
            resourceCount: 3,
            resources: [
              { id: 'res-ds12', title: 'Dynamic Programming 10 Essential Patterns.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-ds13', title: 'Knapsack & LCS State Transition Equations.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-ds14', title: 'Greedy Fractional Knapsack vs DP 0-1 Knapsack.txt', type: 'text', isAccessible: true }
            ]
          }
        ]
      },
      {
        id: 'cs304',
        code: 'CS-304',
        name: 'Software Engineering & System Design',
        credits: 3,
        instructor: 'Prof. M. Gupta',
        semesterId: 'sem-2026-odd',
        modules: [
          {
            id: 'se-mod-1',
            courseId: 'cs304',
            number: 1,
            title: 'Agile Methodologies & SDLC Lifecycles',
            description: 'Waterfall model, Spiral model, Scrum framework, Sprint planning, Kanban flow, User Stories and Acceptance Criteria.',
            topics: ['Waterfall vs Agile Comparison', 'Scrum Roles & Artifacts', 'User Story Estimation (Story Points)'],
            resourceCount: 3,
            resources: [
              { id: 'res-se1', title: 'Agile Manifesto & Scrum Framework Guide.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-se2', title: 'Software Requirement Specification (SRS) Template.docx', type: 'document', isAccessible: true },
              { id: 'res-se3', title: 'Sprint Retrospective & Estimation Notes.txt', type: 'text', isAccessible: true }
            ]
          },
          {
            id: 'se-mod-2',
            courseId: 'cs304',
            number: 2,
            title: 'Object-Oriented Design & SOLID Principles',
            description: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion, UML Class & Sequence Diagrams.',
            topics: ['SOLID Principles Detailed Breakdown', 'UML Class Diagram Notations', 'Sequence Diagram Message Flows'],
            resourceCount: 3,
            resources: [
              { id: 'res-se4', title: 'SOLID Principles Code Refactoring Examples.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-se5', title: 'UML 2.5 Standard Diagramming Reference.pdf', type: 'pdf', isAccessible: true },
              { id: 'res-se6', title: 'Design Patterns Overview (Creational, Structural, Behavioral).txt', type: 'text', isAccessible: true }
            ]
          }
        ]
      }
    ]
  };

  async detectSession(): Promise<DigiicampusSessionStatus> {
    // Simulate detecting logged in session
    return {
      isConnected: true,
      studentName: "Alex Morgan",
      studentId: "STU-2026-8942",
      activePortalUrl: "https://portal.digiicampus.com/student/dashboard",
      lastChecked: Date.now()
    };
  }

  async getSemesters(): Promise<Semester[]> {
    return this.mockSemesters;
  }

  async getCurrentSemester(): Promise<Semester | null> {
    return this.mockSemesters.find(s => s.isCurrent) || this.mockSemesters[0];
  }

  async getCourses(semesterId: string): Promise<Course[]> {
    return this.mockCourses[semesterId] || this.mockCourses['sem-2026-odd'];
  }

  async getModules(courseId: string): Promise<Module[]> {
    const allCourses = await this.getCourses('sem-2026-odd');
    const course = allCourses.find(c => c.id === courseId);
    return course ? course.modules : [];
  }

  async getModuleContent(courseId: string, moduleId: string): Promise<ModuleContent> {
    const allCourses = await this.getCourses('sem-2026-odd');
    const course = allCourses.find(c => c.id === courseId);
    const module = course?.modules.find(m => m.id === moduleId);

    if (!course || !module) {
      throw new Error(`Module ${moduleId} in course ${courseId} not found.`);
    }

    const lessonText = `
Module Title: ${module.title}
Course Name: ${course.name} (${course.code})
Instructor: ${course.instructor || 'Digiicampus Academic Faculty'}

Detailed Overview:
${module.description || 'This module covers fundamental concepts, theoretical models, practical implementations, and step-by-step mathematical/technical derivations.'}

Topics Covered:
${(module.topics || []).map((t, idx) => `${idx + 1}. ${t}`).join('\n')}

Core Learning Materials & Coursework Text:
- Key Principle 1: Understanding the fundamental architectural foundation and component interactions within ${module.title}.
- Key Principle 2: Mathematical models and algorithmic step-by-step executions used to resolve complex system bottlenecks.
- Key Principle 3: Practical real-world engineering applications, trade-offs, and optimization strategies.
- Critical Exam Points: Derivations, comparison tables between competing protocols/structures, and standard problem-solving methodologies.
`;

    return {
      courseId: course.id,
      courseName: `${course.code} - ${course.name}`,
      moduleId: module.id,
      moduleName: `Module ${module.number} — ${module.title}`,
      moduleDescription: module.description,
      topics: module.topics || [],
      lessonText: lessonText.trim(),
      resources: module.resources
    };
  }
}
