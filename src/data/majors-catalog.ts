export interface MajorItem {
  id: string;
  code: string;
  name: string;
  name_ar: string;
  facultyId: string;
  facultyName: string;
  facultyName_ar: string;
  level: "masters" | "diploma" | "certificate" | "all";
  levelLabel: string;
  duration: string;
  iconName: string;
  description: string;
  description_ar: string;
  modules: string[];
  careerOutcomes: string[];
  highlightTag?: string;
}

export interface FacultyFilter {
  id: string;
  name: string;
  name_ar: string;
  count: number;
}

export const facultiesList: { id: string; name: string; name_ar: string }[] = [
  { id: "all", name: "All Disciplines", name_ar: "جميع التخصصات" },
  { id: "business", name: "Business & Executive Commerce", name_ar: "الأعمال والتجارة التنفيذية" },
  { id: "technology", name: "Computing & Emerging Tech", name_ar: "الحوسبة والتكنولوجيا المتقدمة" },
  { id: "health", name: "Health Sciences & Clinical Care", name_ar: "العلوم الصحية والإدارة الطبية" },
  { id: "law", name: "Law, Justice & Criminology", name_ar: "القانون والعدالة الجنائية" },
  { id: "design", name: "Architecture & Construction", name_ar: "العمارة والتصميم والتشييد" },
  { id: "humanities", name: "Psychology & Social Sciences", name_ar: "علم النفس والعلوم الإنسانية" },
  { id: "applied", name: "Hospitality, Aviation & Media", name_ar: "الضيافة والطيران والإعلام" },
];

export const allMajorsData: MajorItem[] = [
  // ---------------------------------------------------------------------------
  // 1. BUSINESS & EXECUTIVE COMMERCE (11 Majors)
  // ---------------------------------------------------------------------------
  {
    id: "accounting",
    code: "ACC-401",
    name: "Accounting & Auditing Governance",
    name_ar: "المحاسبة والتدقيق المالي والحوكمة",
    facultyId: "business",
    facultyName: "Faculty of Executive Commerce",
    facultyName_ar: "كلية التجارة التنفيذية",
    level: "diploma",
    levelLabel: "Professional Diploma / Master's",
    duration: "12 - 18 Months",
    iconName: "Calculator",
    description:
      "Advanced corporate accounting principles, transnational IFRS reporting standards, forensics, and internal financial audit frameworks for executive oversight.",
    description_ar:
      "تغطية متقدمة للمعايير المحاسبية الدولية IFRS والتدقيق الداخلي وإدارة التقارير المالية والرقابة التنفيذية في الشركات متعددة الجنسيات.",
    modules: ["IFRS Reporting & Transnational Tax", "Forensic Auditing & Fraud Examination", "Managerial Cost Strategy & Controls"],
    careerOutcomes: ["Chief Financial Officer (CFO)", "Senior Audit Partner", "Financial Controller"],
    highlightTag: "High Demand",
  },
  {
    id: "banking",
    code: "BNK-402",
    name: "Banking & Financial Services",
    name_ar: "الخدمات المصرفية والمالية وإدارة الاستثمار",
    facultyId: "business",
    facultyName: "Faculty of Executive Commerce",
    facultyName_ar: "كلية التجارة التنفيذية",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "Landmark",
    description:
      "Strategic operations in central banking, commercial credit risk management, liquidity structures, and fintech capital market modernization.",
    description_ar:
      "دراسة استراتيجيات البنوك المركزية وإدارة الائتمان ومخاطر السيولة وأسواق المال والتطورات الحديثة في التكنولوجيا المالية المصرفية.",
    modules: ["Commercial Lending & Credit Risk", "Capital Markets & Treasury Governance", "Digital Asset Banking & Regulation"],
    careerOutcomes: ["Investment Director", "Credit Risk Head", "Private Wealth Advisor"],
  },
  {
    id: "business-administration",
    code: "BAD-501",
    name: "Business Administration (Executive MBA Track)",
    name_ar: "إدارة الأعمال التنفيذية والاستراتيجية المؤسسية",
    facultyId: "business",
    facultyName: "Faculty of Executive Commerce",
    facultyName_ar: "كلية التجارة التنفيذية",
    level: "masters",
    levelLabel: "Executive Master's",
    duration: "18 - 24 Months",
    iconName: "Briefcase",
    description:
      "Comprehensive leadership discipline equipping directors with cross-functional mastery across multinational finance, corporate strategy, and organizational growth.",
    description_ar:
      "برنامج قيادي رفيع يمنح المدراء التنفيذيين التمكن الشامل في إدارة الشركات العابرة للحدود والاستراتيجيات المؤسسية وبناء الميزة التنافسية.",
    modules: ["Global Corporate Governance", "Strategic Value Creation & Mergers", "Organizational Leadership Dynamics"],
    careerOutcomes: ["Managing Director", "Chief Executive Officer (CEO)", "VP of Corporate Strategy"],
    highlightTag: "Flagship Program",
  },
  {
    id: "business-management",
    code: "BMG-502",
    name: "Business Management & Operations",
    name_ar: "إدارة العمليات وتطوير المنشآت",
    facultyId: "business",
    facultyName: "Faculty of Executive Commerce",
    facultyName_ar: "كلية التجارة التنفيذية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Building2",
    description:
      "Applied enterprise management concentrating on supply-chain resilience, operational lean frameworks, productivity optimization, and executive decision science.",
    description_ar:
      "إدارة العمليات المؤسسية مع التركيز على مرونة سلاسل الإمداد وتحسين الإنتاجية وتطبيق منهجيات اللين لاتخاذ القرارات الاستراتيجية.",
    modules: ["Operations & Logistics Optimization", "Executive Decision Modeling", "Enterprise Change Facilitation"],
    careerOutcomes: ["Chief Operating Officer (COO)", "Operations General Manager", "Supply Chain Director"],
  },
  {
    id: "hr-management",
    code: "HRM-403",
    name: "Human Resource Management (HRM)",
    name_ar: "إدارة الموارد البشرية والقيادة الاستراتيجية",
    facultyId: "business",
    facultyName: "Faculty of Executive Commerce",
    facultyName_ar: "كلية التجارة التنفيذية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Users",
    description:
      "Modern talent acquisition, cross-border workforce analytics, compensation structures, international labor ethics, and executive performance appraisal.",
    description_ar:
      "استقطاب وتطوير المواهب وإدارة التعويضات وتحليلات القوى العاملة وتطبيق معايير العمل الدولية لتطوير بيئات العمل المؤسسية الحديثة.",
    modules: ["Global Talent Strategy & Retention", "Labor Law & Disciplinary Standards", "Workforce Analytics & KPI Systems"],
    careerOutcomes: ["Chief Human Resources Officer (CHRO)", "Head of Talent Development", "People Operations Lead"],
  },
  {
    id: "international-business",
    code: "INB-503",
    name: "International Business & Transnational Trade",
    name_ar: "الأعمال الدولية والتجارة العابرة للحدود",
    facultyId: "business",
    facultyName: "Faculty of Executive Commerce",
    facultyName_ar: "كلية التجارة التنفيذية",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "Globe",
    description:
      "Navigating multilateral trade agreements, geopolitical risk assessments, global supply-chain treaties, and foreign direct investment (FDI) strategy.",
    description_ar:
      "دراسة الاتفاقيات التجارية العالمية وإدارة المخاطر الجيوسياسية واستراتيجيات الاستثمار الأجنبي المباشر وسلاسل الإمداد العابرة للقارات.",
    modules: ["Transnational Trade Law & Treaties", "Emerging Market Entry Models", "Geopolitical Risk & Currency Strategy"],
    careerOutcomes: ["International Trade Director", "Foreign Market Expansion Lead", "Global Commercial Attaché"],
  },
  {
    id: "management",
    code: "MGT-404",
    name: "General Management & Institutional Leadership",
    name_ar: "الإدارة العامة والقيادة المؤسسية",
    facultyId: "business",
    facultyName: "Faculty of Executive Commerce",
    facultyName_ar: "كلية التجارة التنفيذية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "LineChart",
    description:
      "Core principles of executive responsibility, stakeholder governance, crisis resolution, and institutional ethics across public and private enterprises.",
    description_ar:
      "تنمية مهارات القيادة الإدارية وإدارة الأزمات وحوكمة أصحاب المصلحة وتوجيه الفرق المؤسسية نحو تحقيق الأهداف المستدامة.",
    modules: ["Executive Crisis Command", "Stakeholder Governance & Ethics", "Strategic Resource Allocation"],
    careerOutcomes: ["General Manager", "Institutional Director", "Division Head"],
  },
  {
    id: "management-of-technology",
    code: "MOT-504",
    name: "Management of Technology (MoT)",
    name_ar: "إدارة التكنولوجيا والابتكار الرقمي",
    facultyId: "business",
    facultyName: "Faculty of Executive Commerce",
    facultyName_ar: "كلية التجارة التنفيذية",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "Layers",
    description:
      "Bridging the executive boardroom and technological innovation: R&D leadership, digital transformation roadmap execution, and technology venture governance.",
    description_ar:
      "الربط بين قيادة الأعمال والابتكار التكنولوجي وإدارة مشاريع التحول الرقمي ومحافظ البحث والتطوير وحوكمة التقنيات الناشئة.",
    modules: ["Digital Transformation Frameworks", "R&D Portfolio Management", "Tech Venture Valuation & IP Strategy"],
    careerOutcomes: ["Chief Technology Officer (CTO)", "VP of Digital Transformation", "Head of Innovation"],
    highlightTag: "Executive Tech",
  },
  {
    id: "marketing",
    code: "MKT-405",
    name: "Marketing & Growth Strategy",
    name_ar: "التسويق واستراتيجيات النمو المؤسسي",
    facultyId: "business",
    facultyName: "Faculty of Executive Commerce",
    facultyName_ar: "كلية التجارة التنفيذية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "TrendingUp",
    description:
      "Data-driven consumer analytics, omnichannel distribution architecture, brand equity maximization, and strategic commercial market positioning.",
    description_ar:
      "تحليلات سلوك المستهلك الرقمية وإدارة القنوات المتعددة وبناء القيمة السوقية للعلامة التجارية واستراتيجيات التوسع التجاري.",
    modules: ["Customer Lifetime Value Modeling", "Omnichannel Growth Engines", "Strategic Brand Positioning"],
    careerOutcomes: ["Chief Marketing Officer (CMO)", "Growth Marketing Lead", "Global Brand Director"],
  },
  {
    id: "marketing-communications",
    code: "MKC-406",
    name: "Marketing Communications (MarComms)",
    name_ar: "الاتصالات التسويقية والإعلام المؤسسي",
    facultyId: "business",
    facultyName: "Faculty of Executive Commerce",
    facultyName_ar: "كلية التجارة التنفيذية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "MessageSquare",
    description:
      "Integrated corporate PR, executive narrative engineering, investor communications, multi-platform media strategy, and brand reputation stewardship.",
    description_ar:
      "صياغة الخطاب الإعلامي للمؤسسات وإدارة العلاقات العامة والتواصل مع المستثمرين وحماية السمعة الرقمية للعلامات التجارية.",
    modules: ["Corporate Narrative & Media Relations", "Reputation & Crisis Communications", "Integrated Digital PR Campaigns"],
    careerOutcomes: ["Director of Communications", "Head of Public Relations", "Brand Advocacy Officer"],
  },
  {
    id: "project-management",
    code: "PRM-505",
    name: "Project Management (PMP / Agile Track)",
    name_ar: "إدارة المشاريع الاحترافية والتحول الرشيق",
    facultyId: "business",
    facultyName: "Faculty of Executive Commerce",
    facultyName_ar: "كلية التجارة التنفيذية",
    level: "diploma",
    levelLabel: "Professional Diploma / Certificate",
    duration: "12 Months",
    iconName: "CheckSquare",
    description:
      "Methodical scope definition, earned value management (EVM), agile enterprise scaling, capital expenditure control, and international PM standards.",
    description_ar:
      "تطبيق أحدث منهجيات إدارة المشاريع الاحترافية وإدارة القيمة المكتسبة والتحول الرشيق وضبط الميزانيات التقديرية والجداول الزمنية.",
    modules: ["Scope, EVM & Schedule Engineering", "Enterprise Agile & Scrum Scaling", "Multi-Project Risk Governance"],
    careerOutcomes: ["Head of PMO", "Senior Project Director", "Agile Transformation Lead"],
    highlightTag: "PMI Aligned",
  },

  // ---------------------------------------------------------------------------
  // 2. COMPUTING & EMERGING TECHNOLOGY (5 Majors)
  // ---------------------------------------------------------------------------
  {
    id: "computer-science",
    code: "CSC-601",
    name: "Computer Science & Software Architecture",
    name_ar: "علوم الحاسب وهندسة البرمجيات المتقدمة",
    facultyId: "technology",
    facultyName: "Institute of Applied Computing",
    facultyName_ar: "معهد الحوسبة التطبيقية",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 - 24 Months",
    iconName: "Code",
    description:
      "Algorithmic design, distributed backend systems, cloud-native software engineering, concurrent architectures, and production-grade security.",
    description_ar:
      "تصميم الخوارزميات المتقدمة وهندسة النظم الموزعة والسحابية وبناء منصات البرمجيات القابلة للتوسع وفق أعلى معايير الأمان البرمجي.",
    modules: ["Distributed Cloud Architecture", "High-Performance Algorithms", "System Reliability & Security Testing"],
    careerOutcomes: ["Principal Software Architect", "Engineering Director", "Lead Distributed Systems Engineer"],
    highlightTag: "Top Rated",
  },
  {
    id: "computer-engineering",
    code: "CEN-502",
    name: "Computer Engineering & Embedded Hardware",
    name_ar: "هندسة الحاسوب والأنظمة المدمجة الذكية",
    facultyId: "technology",
    facultyName: "Institute of Applied Computing",
    facultyName_ar: "معهد الحوسبة التطبيقية",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "Cpu",
    description:
      "Microprocessor system integration, edge computing nodes, IoT sensor hardware ecosystems, and real-time operating systems (RTOS) design.",
    description_ar:
      "تصميم وتكامل المعالجات الدقيقة والأنظمة المدمجة وإنترنت الأشياء (IoT) وبرمجة نظم التشغيل في الوقت الحقيقي للأجهزة الذكية.",
    modules: ["RTOS & Microcontroller Engineering", "IoT Edge Hardware Networks", "Digital Logic & FPGA Design"],
    careerOutcomes: ["Embedded Systems Architect", "IoT Infrastructure Lead", "Hardware Systems Engineer"],
  },
  {
    id: "computer-technology",
    code: "CCT-401",
    name: "Computer Technology & Web Systems",
    name_ar: "تكنولوجيا الحوسبة وتطبيقات الويب",
    facultyId: "technology",
    facultyName: "Institute of Applied Computing",
    facultyName_ar: "معهد الحوسبة التطبيقية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Laptop",
    description:
      "Modern full-stack technical architectures, relational and non-relational database management, enterprise web API protocols, and UI performance.",
    description_ar:
      "تطوير حلول الويب المؤسسية المتكاملة وإدارة قواعد البيانات وربط واجهات برمجة التطبيقات APIs وضمان الأداء التقني العالي.",
    modules: ["Enterprise Web Protocols & APIs", "Database Systems (SQL & NoSQL)", "Frontend Optimization & Frameworks"],
    careerOutcomes: ["Full-Stack Solutions Lead", "Technical Web Consultant", "Database Systems Specialist"],
  },
  {
    id: "information-technology",
    code: "ITE-402",
    name: "Information Technology & Enterprise Infrastructure",
    name_ar: "نظم وتكنولوجيا المعلومات والبنية التحتية",
    facultyId: "technology",
    facultyName: "Institute of Applied Computing",
    facultyName_ar: "معهد الحوسبة التطبيقية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Network",
    description:
      "Enterprise LAN/WAN architecture, virtualized server administration, zero-trust endpoint access, active directory systems, and ITIL service management.",
    description_ar:
      "إدارة شبكات ومخدمات المؤسسات والبنى التحتية السحابية وتطبيق سياسات الثقة الصفرية وأطر إدارة خدمات تكنولوجيا المعلومات ITIL.",
    modules: ["Cloud Infrastructure & Virtualization", "Zero-Trust Network Operations", "ITIL Service & Disaster Recovery"],
    careerOutcomes: ["IT Operations Manager", "Infrastructure Architect", "Senior Network Administrator"],
  },
  {
    id: "industrial-technology",
    code: "IND-403",
    name: "Industrial Technology & Smart Automation",
    name_ar: "التكنولوجيا الصناعية وأنظمة الأتمتة الذكية",
    facultyId: "technology",
    facultyName: "Institute of Applied Computing",
    facultyName_ar: "معهد الحوسبة التطبيقية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Wrench",
    description:
      "SCADA control systems, Industry 4.0 robotics protocols, predictive industrial maintenance, sensor telemetry, and manufacturing automation.",
    description_ar:
      "أنظمة التحكم والمراقبة الصناعية SCADA وتطبيقات الثورة الصناعية الرابعة والأتمتة الروبوتية وبروتوكولات الصيانة التنبؤية الذكية.",
    modules: ["SCADA & PLC Automation", "Industrial IoT & Telemetry", "Six Sigma Quality Engineering"],
    careerOutcomes: ["Automation Engineer", "Industrial Operations Director", "Manufacturing Technology Lead"],
  },

  // ---------------------------------------------------------------------------
  // 3. HEALTH SCIENCES & CLINICAL CARE (6 Majors)
  // ---------------------------------------------------------------------------
  {
    id: "biology",
    code: "BIO-301",
    name: "Biological Sciences & Biotechnology Foundations",
    name_ar: "العلوم البيولوجية وأسس التكنولوجيا الحيوية",
    facultyId: "health",
    facultyName: "Faculty of Health Sciences",
    facultyName_ar: "كلية العلوم الصحية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Dna",
    description:
      "Cellular biology, genetic sequencing technologies, bioinformatics overview, and laboratory quality control protocols for healthcare practitioners.",
    description_ar:
      "دراسة البيولوجيا الخلوية وتسلسل الجينوم والمعلوماتية الحيوية وتطبيق معايير ضبط الجودة المخبرية المعتمدة دولياً.",
    modules: ["Molecular Genetics & Sequencing", "Bioinformatics Foundations", "Clinical Lab Safety & Quality"],
    careerOutcomes: ["Biotech Laboratory Specialist", "Research Analyst", "Clinical Trials Coordinator"],
  },
  {
    id: "microbiology",
    code: "MIC-401",
    name: "Microbiology & Infectious Disease Control",
    name_ar: "علم الأحياء الدقيقة ومكافحة العدوى",
    facultyId: "health",
    facultyName: "Faculty of Health Sciences",
    facultyName_ar: "كلية العلوم الصحية",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "Microscope",
    description:
      "Bacteriology, virology diagnostics, institutional infection containment programs, antimicrobial resistance monitoring, and public health immunology.",
    description_ar:
      "تشخيص الأمراض المعدية وتصميم بروتوكولات مكافحة العدوى في المنشآت الطبية ومراقبة مقاومة المضادات الحيوية وسلامة المجتمع.",
    modules: ["Virology & Diagnostic Pathogens", "Infection Prevention Protocols", "Antimicrobial Stewardship Policy"],
    careerOutcomes: ["Infection Control Director", "Microbiological Consultant", "Public Health Inspector"],
  },
  {
    id: "medical-management",
    code: "MDM-501",
    name: "Medical Management & Hospital Administration",
    name_ar: "إدارة المنشآت الطبية والمستشفيات",
    facultyId: "health",
    facultyName: "Faculty of Health Sciences",
    facultyName_ar: "كلية العلوم الصحية",
    level: "masters",
    levelLabel: "Executive Master's",
    duration: "18 Months",
    iconName: "Stethoscope",
    description:
      "Executive oversight of clinical facilities, patient pathway optimization, healthcare economics, JCI accreditation compliance, and hospital finance.",
    description_ar:
      "إدارة المستشفيات والمراكز التخصصية، وتحسين مسارات رعاية المرضى، وتطبيق معايير الاعتماد الدولي JCI، والرقابة المالية الصحية.",
    modules: ["Clinical Accreditation & Patient Safety", "Healthcare Economics & Budgeting", "Hospital Information Systems (HIS)"],
    careerOutcomes: ["Hospital Director", "Clinical Administrator", "Healthcare Operations VP"],
    highlightTag: "Healthcare Executive",
  },
  {
    id: "medicine-management",
    code: "MNM-502",
    name: "Medicine Management & Pharmaceutical Policy",
    name_ar: "إدارة الدواء والسياسات الصيدلانية",
    facultyId: "health",
    facultyName: "Faculty of Health Sciences",
    facultyName_ar: "كلية العلوم الصحية",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "Pill",
    description:
      "Pharmaceutical supply-chain integrity, regulatory drug approvals, clinical pharmacy governance, formularies, and pharmacovigilance tracking.",
    description_ar:
      "حوكمة سلاسل إمداد الأدوية واللوائح التنظيمية للترخيص وتطوير قوائم الأدوية الأساسية ومراقبة الآثار الجانبية الدوائية (اليقظة الصيدلانية).",
    modules: ["Formulary Governance & Rational Drug Use", "Pharmaceutical Cold-Chain Logistics", "Pharmacovigilance Compliance"],
    careerOutcomes: ["Director of Pharmacy Services", "Pharma Regulatory Affairs Manager", "Drug Supply Chain Lead"],
  },
  {
    id: "nursing-management",
    code: "NRM-402",
    name: "Nursing Management & Clinical Leadership",
    name_ar: "إدارة التمريض والقيادة السريرية",
    facultyId: "health",
    facultyName: "Faculty of Health Sciences",
    facultyName_ar: "كلية العلوم الصحية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Activity",
    description:
      "Staffing ratios, clinical shift allocation, nurse-led triage protocols, patient advocacy standards, and continuous clinical professional development.",
    description_ar:
      "قيادة فرق التمريض وجدولة الورديات السريرية، وتطبيق معايير الفرز الطبي المتقدم، وتطوير كفاءات الرعاية التمريضية المستمرة.",
    modules: ["Clinical Triage & Capacity Ratios", "Nursing Ethics & Malpractice Defense", "Evidence-Based Bedside Governance"],
    careerOutcomes: ["Chief Nursing Officer (CNO)", "Nurse Executive", "Clinical Ward Supervisor"],
  },
  {
    id: "health-and-safety",
    code: "OHS-302",
    name: "Health, Safety & Environmental Management (HSE)",
    name_ar: "الصحة والسلامة المهنية والبيئية (HSE)",
    facultyId: "health",
    facultyName: "Faculty of Health Sciences",
    facultyName_ar: "كلية العلوم الصحية",
    level: "diploma",
    levelLabel: "Professional Diploma / Certificate",
    duration: "12 Months",
    iconName: "ShieldAlert",
    description:
      "Workplace hazard identification, ISO 45001 compliance, emergency catastrophe drills, ergonomic assessments, and environmental risk mitigation.",
    description_ar:
      "تحديد وتقييم المخاطر المهنية، وتطبيق معايير الأيزو ISO 45001، وخطط الطوارئ والإخلاء، وحماية البيئة في مواقع العمل والمنشآت.",
    modules: ["ISO 45001 / OSHA Frameworks", "Hazard Identification & Risk Matrix", "Crisis Evacuation & Incident Analysis"],
    careerOutcomes: ["Corporate HSE Director", "Safety Compliance Officer", "Environmental Risk Assessor"],
    highlightTag: "ISO 45001 Aligned",
  },

  // ---------------------------------------------------------------------------
  // 4. LAW, JUSTICE & CRIMINOLOGY (5 Majors)
  // ---------------------------------------------------------------------------
  {
    id: "law",
    code: "LAW-601",
    name: "Law & Comparative Jurisprudence",
    name_ar: "القانون والدراسات القانونية المقارنة",
    facultyId: "law",
    facultyName: "Faculty of Law & Criminology",
    facultyName_ar: "كلية القانون وعلم الجريمة",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 - 24 Months",
    iconName: "Gavel",
    description:
      "Common law and civil code principles, international arbitration, human rights treaties, statutory interpretation, and legal drafting for counsel.",
    description_ar:
      "دراسة أصول القانون المقارن والتحكيم الدولي وصياغة العقود والتفسير التشريعي والاتفاقيات الدولية للاستشاريين والمحامين الدوليين.",
    modules: ["International Commercial Arbitration", "Comparative Constitutional Frameworks", "Statutory Drafting & Legal Logic"],
    careerOutcomes: ["Senior Legal Counsel", "International Arbitrator", "Corporate Compliance Director"],
    highlightTag: "Legal Excellence",
  },
  {
    id: "business-law",
    code: "BLW-501",
    name: "Business Law & Corporate Contracts",
    name_ar: "قانون الأعمال والعقود والشركات التجارية",
    facultyId: "law",
    facultyName: "Faculty of Law & Criminology",
    facultyName_ar: "كلية القانون وعلم الجريمة",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "Scale",
    description:
      "Corporate liability, shareholder litigation, intellectual property protection, antitrust regulations, and cross-border commercial joint ventures.",
    description_ar:
      "المسؤولية القانونية للشركات، ونزاعات المساهمين، وحماية الملكية الفكرية، وقوانين مكافحة الاحتكار، وعقود المشاريع المشتركة الدولية.",
    modules: ["Mergers & Acquisitions Contracts", "Antitrust & Cross-Border Competition", "Intellectual Property & Licensing"],
    careerOutcomes: ["General Counsel", "Corporate Transaction Partner", "IP Strategy Officer"],
  },
  {
    id: "criminal-law",
    code: "CRL-502",
    name: "Criminal Law & Penal Procedure",
    name_ar: "القانون الجنائي والإجراءات الجزائية",
    facultyId: "law",
    facultyName: "Faculty of Law & Criminology",
    facultyName_ar: "كلية القانون وعلم الجريمة",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "Fingerprint",
    description:
      "Penal code structures, evidentiary rules, constitutional safeguards for defendants, prosecutorial strategy, and white-collar crime statutes.",
    description_ar:
      "دراسة المنظومة العقابية وقواعد الإثبات الجنائي والضمانات الدستورية للمتهمين ومكافحة جرائم ذوي الياقات البيضاء والجرائم المالية.",
    modules: ["Evidentiary Principles & Chain of Custody", "White-Collar Financial Offenses", "Appellate Penal Advocacy"],
    careerOutcomes: ["Criminal Defense Advocate", "Public Prosecutor Counsel", "Financial Crimes Investigator"],
  },
  {
    id: "criminal-justice",
    code: "CRJ-401",
    name: "Criminal Justice Administration",
    name_ar: "إدارة العدالة الجنائية والإنفاذ الأمني",
    facultyId: "law",
    facultyName: "Faculty of Law & Criminology",
    facultyName_ar: "كلية القانون وعلم الجريمة",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "ShieldCheck",
    description:
      "Law enforcement command structures, penal institution management, correctional ethics, community safety policing, and modern judicial logistics.",
    description_ar:
      "إدارة أجهزة إنفاذ القانون والمؤسسات العقابية، وأخلاقيات العمل الأمني، والشرطة المجتمعية، واللوجستيات الإدارية للمحاكم.",
    modules: ["Law Enforcement Leadership", "Correctional Facility Oversight", "Community Safety & Police Ethics"],
    careerOutcomes: ["Police Commissioner / Commander", "Correctional Warden", "Judicial Logistics Director"],
  },
  {
    id: "criminology",
    code: "CRM-402",
    name: "Criminology & Behavioral Profiling",
    name_ar: "علم الجريمة والتحليل السلوكي الجنائي",
    facultyId: "law",
    facultyName: "Faculty of Law & Criminology",
    facultyName_ar: "كلية القانون وعلم الجريمة",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Search",
    description:
      "Theories of criminal etiology, recidivism statistical modeling, offender psychological profiling, forensic sociology, and victimology support.",
    description_ar:
      "نظريات نشأة السلوك الإجرامي، والنمذجة الإحصائية لتكرار الجريمة، والتنميط النفسي للجناة، والدراسات السوسيولوجية لضحايا الجريمة.",
    modules: ["Etiology of Violent Behavior", "Criminal Profiling & Typologies", "Victimology & Restorative Justice"],
    careerOutcomes: ["Forensic Profiler", "Criminological Policy Advisor", "Rehabilitation Program Director"],
  },

  // ---------------------------------------------------------------------------
  // 5. ARCHITECTURE, DESIGN & CONSTRUCTION (3 Majors)
  // ---------------------------------------------------------------------------
  {
    id: "architecture",
    code: "ARC-601",
    name: "Architecture & Urban Spatial Planning",
    name_ar: "الهندسة المعمارية والتخطيط العمراني",
    facultyId: "design",
    facultyName: "School of Architecture & Design",
    facultyName_ar: "مدرسة العمارة والتصميم",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "24 Months",
    iconName: "Landmark",
    description:
      "Sustainable bioclimatic design, Building Information Modeling (BIM), urban zoning statutes, heritage conservation, and large-scale structural aesthetics.",
    description_ar:
      "التصميم المعماري البيئي المستدام، وتطبيقات نمذجة معلومات البناء BIM، وقوانين التنظيم العمراني، والحفاظ على التراث المعماري.",
    modules: ["Advanced BIM & Parametric Form", "Sustainable Urban Microclimates", "Building Codes & Structural Schematics"],
    careerOutcomes: ["Principal Architect", "Urban Planning Director", "Design Practice Partner"],
    highlightTag: "RIBA Context",
  },
  {
    id: "interior-design",
    code: "INT-401",
    name: "Interior Design & Spatial Ergonomics",
    name_ar: "التصميم الداخلي وهندسة الفراغات الوظيفية",
    facultyId: "design",
    facultyName: "School of Architecture & Design",
    facultyName_ar: "مدرسة العمارة والتصميم",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Palette",
    description:
      "Commercial hospitality interiors, acoustic calculations, sustainable textiles and materials, ergonomic fixture planning, and photometric illumination.",
    description_ar:
      "تصميم المساحات الداخلية التجارية والفندقية، والحسابات الصوتية، واختيار المواد المستدامة، والإضاءة المعمارية المتطورة.",
    modules: ["Commercial Space Planning & Acoustics", "Architectural Lighting & Photometry", "Sustainable Materials & Ergonomics"],
    careerOutcomes: ["Design Studio Director", "Hospitality Interior Lead", "Commercial Fitout Consultant"],
  },
  {
    id: "construction-management",
    code: "CON-501",
    name: "Construction Management & Civil Engineering Oversight",
    name_ar: "إدارة التشييد والمشاريع الإنشائية الكبرى",
    facultyId: "design",
    facultyName: "School of Architecture & Design",
    facultyName_ar: "مدرسة العمارة والتصميم",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "HardHat",
    description:
      "FIDIC contract administration, heavy civil project scheduling, contractor bidding logistics, construction site safety, and quality assurance auditing.",
    description_ar:
      "إدارة عقود الفيديك FIDIC، وجدولة المشاريع الإنشائية العملاقة، واللوجستيات وطرح العطاءات، وضبط الجودة والسلامة في المواقع.",
    modules: ["FIDIC Contract Administration", "Cost Estimation & Quantity Surveying", "Site Safety Engineering (HSE-C)"],
    careerOutcomes: ["Construction Project Director", "Commercial Project Manager", "Chief Quantity Surveyor"],
  },

  // ---------------------------------------------------------------------------
  // 6. HUMANITIES, PSYCHOLOGY & SOCIAL SCIENCES (8 Majors)
  // ---------------------------------------------------------------------------
  {
    id: "behavioral-science",
    code: "BHS-401",
    name: "Behavioral Science & Organizational Dynamics",
    name_ar: "العلوم السلوكية وديناميكيات المنظمات",
    facultyId: "humanities",
    facultyName: "Faculty of Humanities & Social Sciences",
    facultyName_ar: "كلية العلوم الإنسانية والاجتماعية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Brain",
    description:
      "Cognitive biases in strategic negotiation, organizational sociology, behavioral nudge architecture, and cross-cultural decision phenomena.",
    description_ar:
      "دراسة الانحيازات المعرفية في المفاوضات وعلم الاجتماع التنظيمي وتطبيق استراتيجيات الوخز السلوكي Nudge لتعزيز إنتاجية المؤسسات.",
    modules: ["Cognitive Biases in Decision Making", "Behavioral Nudge Architecture", "Cross-Cultural Behavioral Mapping"],
    careerOutcomes: ["Behavioral Insights Lead", "Organizational Strategist", "Change Facilitation Specialist"],
  },
  {
    id: "counseling-psychology",
    code: "CPY-501",
    name: "Counseling Psychology & Psychotherapy Practice",
    name_ar: "الإرشاد النفسي والعلاج السلوكي المعرفي",
    facultyId: "humanities",
    facultyName: "Faculty of Humanities & Social Sciences",
    facultyName_ar: "كلية العلوم الإنسانية والاجتماعية",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "HeartHandshake",
    description:
      "CBT modalities, clinical empathy techniques, trauma-informed interventions, therapeutic alliance frameworks, and clinical supervision ethics.",
    description_ar:
      "أساليب العلاج المعرفي السلوكي (CBT)، والتدخلات التخصصية للتعامل مع الصدمات، وأخلاقيات الممارسة الإرشادية النفسية المعتمدة.",
    modules: ["Cognitive Behavioral Therapy (CBT)", "Trauma & Crisis Counseling", "Psychotherapeutic Ethics & Supervision"],
    careerOutcomes: ["Licensed Clinical Counselor", "Mental Health Director", "Wellbeing Program Head"],
  },
  {
    id: "social-work",
    code: "SCW-402",
    name: "Social Work & Community Welfare Systems",
    name_ar: "الخدمة الاجتماعية والرعاية المجتمعية",
    facultyId: "humanities",
    facultyName: "Faculty of Humanities & Social Sciences",
    facultyName_ar: "كلية العلوم الإنسانية والاجتماعية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "HandHeart",
    description:
      "Vulnerable population advocacy, community development initiatives, public social policy implementation, and familial support case-management.",
    description_ar:
      "تطوير برامج الحماية والرعاية الاجتماعية، وإدارة حالات الأسر والفئات الأكثر احتياجاً، وتصميم مبادرات التنمية المجتمعية المستدامة.",
    modules: ["Social Policy & Welfare Law", "Family Case Management Systems", "Community Resilience Interventions"],
    careerOutcomes: ["Community Welfare Director", "Social Policy Lead", "NGO Program Administrator"],
  },
  {
    id: "human-development",
    code: "HMD-403",
    name: "Human Development & Executive Potential",
    name_ar: "التنمية البشرية والتمكين القيادي",
    facultyId: "humanities",
    facultyName: "Faculty of Humanities & Social Sciences",
    facultyName_ar: "كلية العلوم الإنسانية والاجتماعية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Sparkles",
    description:
      "Life-span developmental psychology, executive mentoring competencies, self-actualization pedagogy, and leadership potential realization.",
    description_ar:
      "مراحل النمو الإنساني عبر مراحل الحياة، وأسس الكوتشينج التنفيذي، وتطوير المهارات القيادية وتمكين الكوادر البشرية للوصول لأعلى كفاءة.",
    modules: ["Adult Life-Span Psychology", "Executive Coaching Competencies", "Talent Potential & Empowerment Models"],
    careerOutcomes: ["Executive Leadership Coach", "Human Development Consultant", "Organizational Trainer"],
  },
  {
    id: "education",
    code: "EDU-501",
    name: "Education Leadership & Instructional Governance",
    name_ar: "القيادة التربوية وتطوير المناهج والتعليم",
    facultyId: "humanities",
    facultyName: "Faculty of Humanities & Social Sciences",
    facultyName_ar: "كلية العلوم الإنسانية والاجتماعية",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "GraduationCap",
    description:
      "Curriculum design, accreditation standards, pedagogical innovation, digital learning management systems (LMS), and educational board governance.",
    description_ar:
      "تصميم المناهج التعليمية الحديثة، ومعايير الاعتماد الأكاديمي، وإدارة المنصات التعليمية الرقمية، وقيادة المؤسسات والمدارس التعليمية.",
    modules: ["Pedagogical Design & Assessment", "Institutional Accreditation Frameworks", "Educational Technology Governance"],
    careerOutcomes: ["School Principal / Superintendent", "Academic Dean", "Curriculum Director"],
    highlightTag: "Academic Leadership",
  },
  {
    id: "child-development",
    code: "CHD-301",
    name: "Child Development & Early Learning Systems",
    name_ar: "تنمية الطفولة المبكرة والنظم التعليمية",
    facultyId: "humanities",
    facultyName: "Faculty of Humanities & Social Sciences",
    facultyName_ar: "كلية العلوم الإنسانية والاجتماعية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Baby",
    description:
      "Early childhood neurodevelopment, play-based pedagogical models, developmental milestone diagnostics, and child protection legal frameworks.",
    description_ar:
      "التطور المعرفي والعصبي في مراحل الطفولة المبكرة، ونماذج التعلم القائم على اللعب، ومعايير الكشف المبكر وحماية الطفل القانونية.",
    modules: ["Early Neurocognitive Milestones", "Early Years Learning Frameworks", "Child Safeguarding & Legal Protections"],
    careerOutcomes: ["Early Learning Director", "Child Development Specialist", "Pedagogical Advisor"],
  },
  {
    id: "political-science",
    code: "POL-401",
    name: "Political Science & International Relations",
    name_ar: "العلوم السياسية والدبلوماسية والعلاقات الدولية",
    facultyId: "humanities",
    facultyName: "Faculty of Humanities & Social Sciences",
    facultyName_ar: "كلية العلوم الإنسانية والاجتماعية",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "Flag",
    description:
      "Geopolitical treaties, diplomatic protocol, international institutional voting patterns, global conflict resolution, and public policy formulation.",
    description_ar:
      "تحليل السياسات الدولية، والبروتوكول الدبلوماسي، وحل النزاعات الدولية، وتأثير التكتلات الجيوسياسية على الاقتصاد والسياسات العامة.",
    modules: ["Diplomatic Protocol & Statecraft", "Global Conflict & Treaty Negotiations", "Comparative Political Systems"],
    careerOutcomes: ["Diplomatic Officer", "Political Policy Analyst", "International Affairs Advisor"],
  },
  {
    id: "liberal-arts",
    code: "LBA-302",
    name: "Liberal Arts, Ethics & Critical Thought",
    name_ar: "الآداب والعلوم الإنسانية والفكر النقدي",
    facultyId: "humanities",
    facultyName: "Faculty of Humanities & Social Sciences",
    facultyName_ar: "كلية العلوم الإنسانية والاجتماعية",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "BookOpen",
    description:
      "Philosophical foundations, western and eastern ethical traditions, rhetorical dialectics, intellectual history, and multidisciplinary logic.",
    description_ar:
      "دراسة الفلسفة وتاريخ الأفكار والتقاليد الأخلاقية العالمية وأصول الجدل المنطقي وتنمية مهارات التفكير النقدي المتعدد التخصصات.",
    modules: ["Classical & Contemporary Ethics", "Rhetoric, Dialectic & Argumentation", "World Intellectual Traditions"],
    careerOutcomes: ["Policy Fellow", "Senior Research Scholar", "Editorial Content Director"],
  },

  // ---------------------------------------------------------------------------
  // 7. APPLIED INDUSTRIES, MEDIA & HOSPITALITY (7 Majors)
  // ---------------------------------------------------------------------------
  {
    id: "aviation",
    code: "AVN-401",
    name: "Aviation Management & Airport Operations",
    name_ar: "إدارة الطيران والعمليات الجوية والمطارات",
    facultyId: "applied",
    facultyName: "Faculty of Applied Industries & Services",
    facultyName_ar: "كلية الصناعات التطبيقية والخدمات",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "Plane",
    description:
      "ICAO/FAA safety compliance, airline fleet economic modeling, airport ground logistics, slot management, and international air traffic treaties.",
    description_ar:
      "معايير سلامة الطيران الدولية ICAO، وإدارة أساطيل الطيران، واللوجستيات الأرضية للمطارات، وجدولة الرحلات الجوية واتفاقيات النقل الدولي.",
    modules: ["ICAO Safety Management Systems (SMS)", "Airline Economics & Fleet Deployment", "Airport Capacity & Terminal Logistics"],
    careerOutcomes: ["Airport Operations Director", "Aviation Safety Head", "Airline Commercial Manager"],
    highlightTag: "Aviation Industry",
  },
  {
    id: "hotel-management",
    code: "HTM-402",
    name: "Hotel Management & Luxury Hospitality",
    name_ar: "إدارة الضيافة الفندقية والسياحة الفاخرة",
    facultyId: "applied",
    facultyName: "Faculty of Applied Industries & Services",
    facultyName_ar: "كلية الصناعات التطبيقية والخدمات",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Hotel",
    description:
      "Luxury guest experience design, RevPAR financial metrics, hospitality resort facilities, international concierge standards, and service excellence.",
    description_ar:
      "إدارة المنشآت الفندقية الفاخرة، ومؤشرات الأداء المالي RevPAR، وتصميم تجارب الضيوف الاستثنائية، ومعايير الكونسيرج العالمية.",
    modules: ["Hotel Financial Engineering (RevPAR / ADR)", "Luxury Service Quality Protocols", "Resort Operations & Facilities"],
    careerOutcomes: ["General Manager (Hotel/Resort)", "Director of Hospitality Operations", "Luxury Guest Experience VP"],
  },
  {
    id: "food-management",
    code: "FDM-403",
    name: "Food Management & Culinary Operations",
    name_ar: "إدارة الأغذية وسلامة الإمداد والمطاعم",
    facultyId: "applied",
    facultyName: "Faculty of Applied Industries & Services",
    facultyName_ar: "كلية الصناعات التطبيقية والخدمات",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "UtensilsCrossed",
    description:
      "HACCP food safety certifications, multi-unit restaurant franchise operations, menu engineering margins, and farm-to-table cold-chain logistics.",
    description_ar:
      "تطبيق شهادات سلامة الأغذية HACCP، وإدارة سلاسل المطاعم العالمية، وهندسة تكاليف وقوائم الطعام، وسلاسل الإمداد المبردة.",
    modules: ["HACCP & ISO 22000 Standards", "Menu Engineering & Food Cost Ratios", "Culinary Supply-Chain Operations"],
    careerOutcomes: ["Food & Beverage (F&B) Director", "Restaurant Chain Operations Lead", "Food Safety Quality Auditor"],
  },
  {
    id: "advertising",
    code: "ADV-404",
    name: "Advertising, Media Buying & Creative Direction",
    name_ar: "الإعلان والشراء الإعلامي والتوجيه الإبداعي",
    facultyId: "applied",
    facultyName: "Faculty of Applied Industries & Services",
    facultyName_ar: "كلية الصناعات التطبيقية والخدمات",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Megaphone",
    description:
      "Programmatic ad exchange algorithms, creative brief crafting, international consumer psychographics, broadcast media planning, and ROAS optimization.",
    description_ar:
      "إدارة الحملات الإعلانية الرقمية والشراء الإعلامي الآلي، وتصميم الاستراتيجيات الإبداعية، وتحسين العائد على الإنفاق الإعلاني ROAS.",
    modules: ["Programmatic Ad Buying & Attribution", "Creative Direction & Campaign Briefs", "Consumer Neuromarketing"],
    careerOutcomes: ["Agency Creative Director", "Head of Media Planning", "Global Advertising Lead"],
  },
  {
    id: "communications",
    code: "COM-405",
    name: "Communications & Digital Media Production",
    name_ar: "علوم الاتصال والإنتاج الإعلامي الرقمي",
    facultyId: "applied",
    facultyName: "Faculty of Applied Industries & Services",
    facultyName_ar: "كلية الصناعات التطبيقية والخدمات",
    level: "diploma",
    levelLabel: "Professional Diploma",
    duration: "12 Months",
    iconName: "Share2",
    description:
      "Broadcasting workflows, digital journalistic ethics, mass media law, audience engagement metrics, and multimedia storytelling production.",
    description_ar:
      "تقنيات الإنتاج الإعلامي المتعدد، وأخلاقيات الصحافة الرقمية، وقوانين الإعلام المرئي والمسموع، وتطوير المحتوى التفاعلي للجماهير.",
    modules: ["Digital Broadcast & Podcast Systems", "Media Law & Defamation Defense", "Interactive Multimedia Storytelling"],
    careerOutcomes: ["Media Production Director", "Chief Content Officer", "Broadcast Communications Lead"],
  },
  {
    id: "mathematics",
    code: "MTH-406",
    name: "Applied Mathematics & Computational Modeling",
    name_ar: "الرياضيات التطبيقية والنمذجة الحسابية",
    facultyId: "applied",
    facultyName: "Faculty of Applied Industries & Services",
    facultyName_ar: "كلية الصناعات التطبيقية والخدمات",
    level: "masters",
    levelLabel: "Professional Master's",
    duration: "18 Months",
    iconName: "Binary",
    description:
      "Stochastic processes, differential equation systems, Monte Carlo numerical simulations, linear programming, and statistical risk calculus.",
    description_ar:
      "دراسة العمليات العشوائية والنماذج الحسابية المعقدة ومحاكاة مونت كارلو والبرمجة الخطية وحساب التفاضل الإحصائي للمخاطر.",
    modules: ["Stochastic Modeling & Probability", "Numerical Simulation & Monte Carlo", "Optimization & Applied Linear Systems"],
    careerOutcomes: ["Quantitative Analyst (Quant)", "Data Modeling Specialist", "Risk Analytics Lead"],
  },
  {
    id: "music",
    code: "MUS-301",
    name: "Music Industry & Performing Arts Management",
    name_ar: "إدارة الفنون والموسيقى وحقوق الأداء",
    facultyId: "applied",
    facultyName: "Faculty of Applied Industries & Services",
    facultyName_ar: "كلية الصناعات التطبيقية والخدمات",
    level: "certificate",
    levelLabel: "Professional Certificate / Diploma",
    duration: "12 Months",
    iconName: "Music",
    description:
      "Music publishing royalties, digital streaming platform distribution, concert touring logistics, recording studio administration, and artist representation.",
    description_ar:
      "إدارة حقوق الملكية والتوزيع الرقمي الموسيقي، واللوجستيات الإنتاجية للحفلات الكبرى، وإدارة الاستوديوهات والتعاقدات الفنية.",
    modules: ["Music Publishing & Global Royalties", "Live Concert Touring Production", "Digital Streaming & Catalog Valuation"],
    careerOutcomes: ["Artist & Label Manager", "Concert Tour Producer", "Music Publishing Executive"],
  },
];
