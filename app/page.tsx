"use client";

import { useMemo, useState, type ReactNode } from "react";
import styles from "./page.module.css";

type Persona = "monica" | "javier" | "jordan";
type Screen =
  | "home"
  | "case"
  | "confirm"
  | "ready"
  | "placeholder"
  | "javierHome"
  | "prep"
  | "documentationStart"
  | "worksheet"
  | "deviceScan"
  | "documentScan"
  | "review"
  | "pdf"
  | "reorder"
  | "jordanHome"
  | "accountInsight";
type Tab = "Home" | "Schedule" | "Cases" | "Inventory" | "More";

type Candidate = { name: string; detail: string[]; recommended?: boolean };

const candidates: Candidate[] = [
  {
    name: "Javier Ruiz",
    recommended: true,
    detail: ["ICD qualified", "Available now · 18 min away", "Supported Dr. Smith previously", "Workload within target range"],
  },
  { name: "Priya Shah", detail: ["ICD qualified", "Available after 2:15 PM · 27 min away", "Methodist experience"] },
  { name: "Mark Wilson", detail: ["ICD qualified", "12 min away", "Currently on non-procedure work"] },
];

const placeholderCopy: Record<Exclude<Tab, "Home">, { title: string; text: string }> = {
  Schedule: { title: "Schedule", text: "A future mobile schedule will connect personal work, team coverage, and intelligent assignment recommendations." },
  Cases: { title: "Cases", text: "Select Javier’s connected ICD case from his home experience to move through preparation and documentation." },
  Inventory: { title: "Inventory intelligence", text: "Case-linked utilization, expiration risk, par levels, and replenishment come together in the connected workflow." },
  More: { title: "More capabilities", text: "Complaints, account signals, and additional field tools will be expanded in future prototype moments." },
};

export default function Home() {
  const [persona, setPersona] = useState<Persona>("monica");
  const [screen, setScreen] = useState<Screen>("home");
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [assistOpen, setAssistOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const [promptSent, setPromptSent] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [deviceCaptured, setDeviceCaptured] = useState(false);
  const [documentCaptured, setDocumentCaptured] = useState(false);
  const [recordSubmitted, setRecordSubmitted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [appOnly, setAppOnly] = useState(false);
  const [territoryAssistOpen, setTerritoryAssistOpen] = useState(false);
  const [territoryPromptSent, setTerritoryPromptSent] = useState(false);

  const personaDetails = persona === "monica"
    ? { initials: "MT", name: "Monica Torres", role: "Clinical Manager" }
    : persona === "javier"
      ? { initials: "JR", name: "Javier Ruiz", role: "Clinical Representative" }
      : { initials: "JL", name: "Jordan Lee", role: "Territory Manager" };

  const homeTitle = assigned ? "Two items still need your attention today" : "Three items need your attention today";
  const homeDescription = assigned
    ? "Today’s urgent ICD procedure is now coverage-ready. An upcoming EP case needs specialized support, and a Watchman inventory action can help protect future readiness."
    : "One urgent procedure requires coverage, one upcoming case needs specialized support, and one inventory action can help protect readiness later this week.";

  const showBack = !["home", "javierHome", "jordanHome", "placeholder"].includes(screen);
  const currentHeading = useMemo(() => {
    const headings: Partial<Record<Screen, string>> = {
      case: "Case readiness",
      confirm: "Confirm assignment",
      ready: "Case readiness",
      prep: "Case preparation",
      documentationStart: "Procedure record",
      worksheet: "Procedure worksheet",
      deviceScan: "Device capture",
      documentScan: "Document scan",
      review: "Review worksheet",
      pdf: "Generate PDF",
      reorder: "Replenishment",
      accountInsight: "Account insight",
    };
    return headings[screen];
  }, [screen]);

  function setMessage(message: string) { setToast(message); }

  function navigateTab(tab: Tab) {
    setActiveTab(tab);
    setAssistOpen(false);
    setPromptSent(false);
    if (tab === "Home") {
      setScreen(persona === "monica" ? "home" : persona === "javier" ? "javierHome" : "jordanHome");
    } else if (persona === "jordan" && tab === "Cases") {
      setScreen("accountInsight");
    } else if (persona === "javier" && tab === "Cases") {
      setScreen("prep");
    } else if (persona === "javier" && tab === "Inventory" && recordSubmitted) {
      setScreen("reorder");
    } else {
      setScreen("placeholder");
    }
  }

  function choosePersona(nextPersona: Persona) {
    if (nextPersona === "javier" && !assigned) {
      setMessage("Complete Monica’s urgent coverage assignment first to unlock Javier’s connected experience.");
      setPersonaMenuOpen(false);
      return;
    }
    if (nextPersona === "jordan" && !recordSubmitted) {
      setMessage("Complete Javier’s procedure documentation first to unlock Jordan’s connected account insight.");
      setPersonaMenuOpen(false);
      return;
    }
    setPersona(nextPersona);
    setActiveTab("Home");
    setScreen(nextPersona === "monica" ? "home" : nextPersona === "javier" ? "javierHome" : "jordanHome");
    setPersonaMenuOpen(false);
    setAssistOpen(false);
    setTerritoryAssistOpen(false);
    setTerritoryPromptSent(false);
    setToast(null);
  }

  function beginCoverageFlow() { setActiveTab("Cases"); setScreen("case"); setToast(null); }
  function findCoverage() { setAssistOpen(true); setPromptSent(false); }
  function selectCandidate(candidate: Candidate) {
    if (candidate.name !== "Javier Ruiz") {
      setMessage("For this walkthrough, select Javier Ruiz to continue the recommended path.");
      return;
    }
    setSelectedCandidate(candidate);
    setAssistOpen(false);
    setScreen("confirm");
  }
  function confirmAssignment() { setAssigned(true); setScreen("ready"); setActiveTab("Cases"); setToast(null); }
  function returnToBriefing() { setPersona("monica"); setScreen("home"); setActiveTab("Home"); setPromptSent(false); }
  function handoffToJavier() { setPersona("javier"); setScreen("javierHome"); setActiveTab("Home"); setToast(null); }
  function openJavierCase() { setScreen("prep"); setActiveTab("Cases"); }
  function beginDocumentation() { setScreen("documentationStart"); setActiveTab("Cases"); }
  function openWorksheet() { setScreen("worksheet"); }
  function captureDevice() { setDeviceCaptured(true); setScreen("deviceScan"); }
  function captureDocument() { setDocumentCaptured(true); setScreen("documentScan"); }
  function openReview() { setScreen("review"); }
  function submitRecord() { setRecordSubmitted(true); setScreen("pdf"); }
  function reviewReorder() { setScreen("reorder"); setActiveTab("Inventory"); }
  function handoffToJordan() { setPersona("jordan"); setScreen("jordanHome"); setActiveTab("Home"); setToast(null); setTerritoryAssistOpen(false); setTerritoryPromptSent(false); }
  function openAccountInsight() { setScreen("accountInsight"); setActiveTab("Cases"); setToast(null); }
  function askTerritoryAssist() { setTerritoryAssistOpen(true); setTerritoryPromptSent(false); }

  return (
    <main className={`${styles.stage} ${appOnly ? styles.appOnlyStage : ""}`}>
      {!appOnly ? (
        <div className={styles.prototypeBar}>
          <div className={styles.previewIntro}>
            <span className={styles.previewLabel}>Connected experience preview</span>
            <p className={styles.previewSubtext}>Guided demo layer · controls outside the app</p>
          </div>

          <div className={styles.controlPanel}>
            <div className={styles.controlHeading}>
              <span className={styles.viewingLabel}>Viewing as</span>
              <button
                className={styles.appOnlyToggle}
                type="button"
                onClick={() => {
                  setAppOnly(true);
                  setPersonaMenuOpen(false);
                }}
              >
                App only
              </button>
            </div>

            <div className={styles.personaWrap}>
              <button
                className={styles.personaButton}
                type="button"
                onClick={() => setPersonaMenuOpen((open) => !open)}
                aria-expanded={personaMenuOpen}
              >
                <span className={styles.avatarSmall}>{personaDetails.initials}</span>
                <span className={styles.personaText}>
                  <strong>{personaDetails.name}</strong>
                  <span>{personaDetails.role}</span>
                </span>
                <ChevronDown />
              </button>
              {personaMenuOpen && (
                <div className={styles.personaMenu}>
                  <p className={styles.menuTitle}>View a connected field experience</p>
                  <button className={styles.personaSelect} type="button" onClick={() => choosePersona("monica")}>
                    <PersonaRow initials="MT" name="Monica Torres" role="Clinical Manager" active={persona === "monica"} />
                  </button>
                  <button className={styles.personaSelect} type="button" onClick={() => choosePersona("javier")}>
                    <PersonaRow initials="JR" name="Javier Ruiz" role="Clinical Representative" active={persona === "javier"} locked={!assigned} />
                  </button>
                  <button className={styles.personaSelect} type="button" onClick={() => choosePersona("jordan")}>
                    <PersonaRow initials="JL" name="Jordan Lee" role="Territory Manager" active={persona === "jordan"} locked={!recordSubmitted} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.appOnlyBar}>
          <button className={styles.displayToggle} type="button" onClick={() => setAppOnly(false)}>
            Return to guided demo
          </button>
          <span>App only view · clean capture mode</span>
        </div>
      )}

      <div className={`${styles.previewLayout} ${appOnly ? styles.appOnlyLayout : ""}`}>
      <section className={styles.phone} aria-label="CardioConnect mobile prototype">
        <div className={styles.statusBar} aria-hidden="true"><span>9:41</span><div className={styles.statusIcons}><SignalIcon /><WifiIcon /><BatteryIcon /></div></div>
        <header className={styles.appHeader}>
          {showBack ? (
            <button className={styles.iconButton} type="button" aria-label="Go back" onClick={() => {
              const back: Partial<Record<Screen, Screen>> = { case: "home", confirm: "case", ready: "home", prep: "javierHome", documentationStart: "prep", worksheet: "documentationStart", deviceScan: "worksheet", documentScan: "worksheet", review: "worksheet", pdf: "review", reorder: "pdf", accountInsight: "jordanHome" };
              setScreen(back[screen] ?? (persona === "monica" ? "home" : "javierHome"));
            }}><ArrowLeft /></button>
          ) : (
            <div className={styles.brandLockup}><div className={styles.brandMark} aria-hidden="true" /><span>CardioConnect</span></div>
          )}
          {showBack ? <h1 className={styles.headerTitle}>{currentHeading}</h1> : null}
          <div className={styles.headerActions}>
            {!showBack && <button className={styles.iconButton} type="button" aria-label="Notifications"><Bell /><span className={styles.notificationDot} /></button>}
            <button className={styles.avatarButton} type="button" aria-label={`${personaDetails.name} profile`}>{personaDetails.initials}</button>
          </div>
        </header>

        <div className={styles.scrollArea}>
          {screen === "home" && <MonicaHomeScreen assigned={assigned} title={homeTitle} description={homeDescription} onFindCoverage={beginCoverageFlow} onStaticJourney={setMessage} />}
          {screen === "case" && <CaseScreen onFindCoverage={findCoverage} />}
          {screen === "confirm" && selectedCandidate && <ConfirmScreen candidate={selectedCandidate} onConfirm={confirmAssignment} onChooseAnother={findCoverage} />}
          {screen === "ready" && <ReadyScreen onReturnHome={returnToBriefing} onWorkload={() => setMessage("Workload balancing is a planned manager workflow; we are building the connected case lifecycle first.")} />}
          {screen === "javierHome" && <JavierHomeScreen onOpenCase={openJavierCase} />}
          {screen === "prep" && <PrepScreen onAskAssist={() => setMessage("Assist: Required inventory is available and the ICD Implant documentation template is prepared for completion after the case.")} />}
          {screen === "documentationStart" && <DocumentationStartScreen onBegin={openWorksheet} onScanDevice={captureDevice} onScanDocument={captureDocument} />}
          {screen === "worksheet" && <WorksheetScreen deviceCaptured={deviceCaptured} documentCaptured={documentCaptured} onScanDevice={captureDevice} onScanDocument={captureDocument} onReview={openReview} />}
          {screen === "deviceScan" && <DeviceCaptureScreen onConfirm={() => { setDeviceCaptured(true); setScreen("worksheet"); }} />}
          {screen === "documentScan" && <DocumentCaptureScreen onConfirm={() => { setDocumentCaptured(true); setScreen("worksheet"); }} />}
          {screen === "review" && <ReviewScreen onSubmit={submitRecord} />}
          {screen === "pdf" && <PdfScreen onReorder={reviewReorder} onToast={setMessage} />}
          {screen === "reorder" && <ReorderScreen onDone={() => setMessage("Replenishment request prepared for review and routing.")} />}
          {screen === "jordanHome" && <JordanHomeScreen onOpenAccount={openAccountInsight} onStaticJourney={setMessage} />}
          {screen === "accountInsight" && <AccountInsightScreen onAskAssist={askTerritoryAssist} />}
          {screen === "placeholder" && activeTab !== "Home" && <PlaceholderScreen tab={activeTab} onHome={() => navigateTab("Home")} />}
        </div>

        {toast && <div className={styles.toast} role="status"><span>{toast}</span><button type="button" onClick={() => setToast(null)} aria-label="Dismiss"><CloseIcon /></button></div>}

        {!assistOpen && !territoryAssistOpen && screen !== "placeholder" && <button className={styles.assistFab} type="button" onClick={() => {
          if (persona === "monica" && screen === "case") { findCoverage(); }
          else if (persona === "jordan" && screen === "accountInsight") { askTerritoryAssist(); }
          else { setMessage(persona === "javier" ? "Assist is available throughout Javier’s case workflow with contextual guidance and capture support." : persona === "jordan" ? "Select the Methodist signal to see how Assist helps prioritize physician outreach." : "Select the urgent CRM case to see Assist recommend qualified coverage."); }
        }} aria-label="Open Assist"><Sparkle />Assist</button>}

        <BottomNav active={activeTab} onNavigate={navigateTab} />
        {assistOpen && <AssistSheet promptSent={promptSent} onClose={() => setAssistOpen(false)} onSendPrompt={() => setPromptSent(true)} onSelectCandidate={selectCandidate} />}
        {territoryAssistOpen && <TerritoryAssistSheet promptSent={territoryPromptSent} onClose={() => setTerritoryAssistOpen(false)} onSendPrompt={() => setTerritoryPromptSent(true)} onToast={setMessage} />}
      </section>
      {!appOnly && <StoryRail persona={persona} screen={screen} assigned={assigned} onContinueAsJavier={handoffToJavier} onAdvanceToDocumentation={beginDocumentation} onContinueAsJordan={handoffToJordan} />}
      </div>
    </main>
  );
}

function StoryRail({ persona, screen, assigned, onContinueAsJavier, onAdvanceToDocumentation, onContinueAsJordan }: { persona: Persona; screen: Screen; assigned: boolean; onContinueAsJavier: () => void; onAdvanceToDocumentation: () => void; onContinueAsJordan: () => void }) {
  const steps = ["Anticipate", "Orchestrate", "Prepare", "Complete", "Continue", "Act"];
  let step = 0;
  let role = "Clinical Manager";
  let title = "Know what needs attention before it becomes disruption.";
  let description = "Monica opens CardioConnect to a prioritized briefing across representative CRM, EP, and Watchman activity.";
  let outcome = "Coverage risk is surfaced before the team has to search for it.";
  let action: ReactNode = null;

  if (persona === "monica" && ["case", "confirm"].includes(screen)) {
    step = 1;
    title = "Turn an urgent need into a confident assignment.";
    description = "Assist uses case context, qualifications, proximity, physician familiarity, and current workload to recommend coverage from mobile.";
    outcome = "Complex coordination becomes an explainable action, with Monica retaining final control.";
  }
  if (persona === "monica" && screen === "ready") {
    step = 1;
    title = "Coverage is confirmed. The case moves forward.";
    description = "Javier has been assigned and CardioConnect has prepared the information he needs for the procedure.";
    outcome = "One manager action immediately creates a ready-to-execute clinical handoff.";
    action = <button className={styles.railAction} type="button" onClick={onContinueAsJavier}>Continue as Javier <ArrowRight /></button>;
  }
  if (persona === "monica" && assigned && screen === "home") {
    step = 1;
    title = "Resolved needs fall away. New priorities remain visible.";
    description = "Monica’s briefing reflects that the urgent case is covered and surfaces the next decisions for her team.";
    outcome = "The app stays focused on action, not retrospective reporting.";
  }
  if (persona === "javier" && screen === "javierHome") {
    step = 2; role = "Clinical Representative";
    title = "A new assignment arrives with context attached.";
    description = "Javier sees the urgent case update and can open a prepared briefing instead of hunting for procedure details.";
    outcome = "Clinical reps receive clear, actionable handoffs in real time.";
  }
  if (persona === "javier" && screen === "prep") {
    step = 2; role = "Clinical Representative";
    title = "Prepare for the case before arriving onsite.";
    description = "CardioConnect assembles procedure details, physician context, inventory readiness, and an expiration opportunity in one view.";
    outcome = "Case prep and inventory intelligence are connected before the procedure begins.";
    action = <div className={styles.railTransition}><p><strong>Later that day</strong><br />The procedure has been completed. The scheduled case becomes Javier’s procedure record.</p><button className={styles.railAction} type="button" onClick={onAdvanceToDocumentation}>Continue to documentation <ArrowRight /></button></div>;
  }
  if (persona === "javier" && ["documentationStart", "worksheet", "deviceScan", "documentScan", "review", "pdf"].includes(screen)) {
    step = 3; role = "Clinical Representative";
    title = "Carry the procedure through completion in one workflow.";
    description = "Known case information carries forward, while barcode and document scanning accelerate the detailed worksheet with user confirmation.";
    outcome = "Detailed procedure documentation is completed without leaving CardioConnect.";
  }
  if (persona === "javier" && screen === "reorder") {
    step = 4; role = "Clinical Representative";
    title = "Every completed case triggers the next right action.";
    description = "Confirmed device use reduced expiration risk and created a below-par stock condition at Methodist.";
    outcome = "CardioConnect connects procedure completion directly to replenishment readiness.";
    action = <button className={styles.railAction} type="button" onClick={onContinueAsJordan}>Continue as Jordan <ArrowRight /></button>;
  }
  if (persona === "jordan" && screen === "jordanHome") {
    step = 5; role = "Territory Manager";
    title = "See where customer attention matters most.";
    description = "The same operational activity becomes a territory signal, helping Jordan focus outreach where changing demand may require support.";
    outcome = "Field operations become actionable account and physician insight.";
  }
  if (persona === "jordan" && screen === "accountInsight") {
    step = 5; role = "Territory Manager";
    title = "Turn connected activity into proactive engagement.";
    description = "Jordan understands why Methodist surfaced and can ask Assist which physician may benefit from a proactive conversation this week.";
    outcome = "The case lifecycle ends with informed customer action—not another report to interpret.";
  }

  return <aside className={styles.storyRail} aria-label="Guided story context">
    <p className={styles.railKicker}>Guided story</p>
    <div className={styles.storyProgress}>{steps.map((label, index) => <span key={label} className={index === step ? styles.storyActive : index < step ? styles.storyComplete : ""}>{label}</span>)}</div>
    <p className={styles.railStep}>Chapter {step + 1} of {steps.length} · {role}</p>
    <h2>{title}</h2>
    <p className={styles.railDescription}>{description}</p>
    <section className={styles.railOutcome}><p>Outcome</p><strong>{outcome}</strong></section>
    {action}
    <p className={styles.railNote}>Story controls are outside the product UI and disappear in App Only mode.</p>
  </aside>;
}

function MonicaHomeScreen({ assigned, title, description, onFindCoverage, onStaticJourney }: { assigned: boolean; title: string; description: string; onFindCoverage: () => void; onStaticJourney: (message: string) => void }) {
  return <div className={styles.screenContent}>
    <section className={styles.greeting}><p className={styles.eyebrow}>Upper Midwest Region · Monday, June 22</p><h2>Good morning, Monica</h2></section>
    <section className={styles.briefingCard}><div className={styles.assistTag}><Sparkle />Intelligent briefing</div><h3>{title}</h3><p>{description}</p><button className={styles.textLink} type="button" onClick={() => onStaticJourney("Assist will be able to summarize today’s most urgent actions in plain language.")}>Ask Assist about today <ArrowRight /></button></section>
    <div className={styles.metrics}><Metric value="14" label="Today’s procedures" /><Metric value={assigned ? "14/14" : "13/14"} label="Coverage ready" emphasized={assigned} /><Metric value="2" label="Inventory actions" /></div>
    <div className={styles.sectionHeading}><h3>Needs attention</h3><button className={styles.smallLink} type="button">View all</button></div>
    {!assigned ? <PriorityCard division="CRM" status="Coverage needed" title="ICD Implant" detail="Methodist Hospital · Dr. Aaron Smith" time="Today · 3:00 PM" supporting="No qualified clinical assigned." action="Find coverage" onAction={onFindCoverage} hero /> : <section className={styles.resolvedWrap}><p className={styles.subsectionLabel}>Recently resolved</p><PriorityCard division="CRM" status="Coverage confirmed" title="ICD Implant" detail="Methodist Hospital · Dr. Aaron Smith" time="Today · 3:00 PM" supporting="Assigned to Javier Ruiz." action="View case" onAction={onFindCoverage} resolved /></section>}
    <PriorityCard division="EP" title="AF Ablation" detail="Abbott Northwestern · Dr. Michael Chen" time="Tomorrow · 8:00 AM" supporting="Certified secondary support recommended." action="Review recommendation" onAction={() => onStaticJourney("EP coverage recommendation will be represented in a future interaction.")} />
    <PriorityCard division="Watchman" title="LAA Closure" detail="North Memorial · Dr. Elena Patel" time="Wednesday · 9:00 AM" supporting="Planned device use may require replenishment." action="Review inventory plan" onAction={() => onStaticJourney("Watchman inventory readiness will be expanded in a future interaction.")} />
    {assigned && <section className={styles.capacityCard}><div className={styles.assistTag}><Sparkle /> Team capacity insight</div><h3>Sally Morgan has elevated workload this week</h3><p>Following weekend urgent support, Sally has six scheduled procedures across the next four days.</p><button className={styles.textLink} type="button" onClick={() => onStaticJourney("Workload rebalancing will be expanded after the connected documentation lifecycle.")}>Review workload options <ArrowRight /></button></section>}
  </div>;
}

function CaseScreen({ onFindCoverage }: { onFindCoverage: () => void }) { return <div className={styles.screenContent}>
  <div className={styles.caseTitleBlock}><div className={styles.chipRow}><Chip text="CRM" tone="division" /><Chip text="Coverage needed" tone="action" /></div><h2>ICD Implant</h2><p>Methodist Hospital · Dr. Aaron Smith</p><strong>Today · 3:00 PM</strong></div>
  <section className={styles.surfaceCard}><h3>Readiness summary</h3><ReadinessRow label="Clinical coverage" value="Not assigned" attention /><ReadinessRow label="Procedure details" value="Confirmed" /><ReadinessRow label="Required inventory" value="Available on site" /><ReadinessRow label="Documentation template" value="Prepared after procedure" /><ReadinessRow label="Physician context" value="Available" /></section>
  <section className={styles.aiInsightCard}><div className={styles.assistTag}><Sparkle /> Assist insight</div><p>This procedure requires an ICD-qualified clinical representative. I can recommend available team members based on qualifications, travel time, physician familiarity, and current workload.</p></section>
  <button className={styles.primaryButton} type="button" onClick={onFindCoverage}>Find qualified coverage</button><button className={styles.secondaryButton} type="button">View team schedule</button>
</div>; }

function ConfirmScreen({ candidate, onConfirm, onChooseAnother }: { candidate: Candidate; onConfirm: () => void; onChooseAnother: () => void }) { return <div className={styles.screenContent}>
  <section className={styles.selectedCandidateCard}><p className={styles.subsectionLabel}>Selected clinical</p><div className={styles.personHeader}><span className={styles.personAvatar}>JR</span><div><h2>{candidate.name}</h2><p>Clinical Representative</p></div></div><ul className={styles.rationaleList}><li>ICD qualified</li><li>Available for scheduled start time</li><li>18 minutes from Methodist Hospital</li><li>Prior experience supporting Dr. Smith</li><li>No conflicting priority procedure coverage</li></ul></section>
  <section className={styles.surfaceCard}><p className={styles.subsectionLabel}>Procedure</p><h3>ICD Implant</h3><p className={styles.cardDescription}>Methodist Hospital · Dr. Aaron Smith</p><p className={styles.caseTime}>Today · 3:00 PM</p></section>
  <p className={styles.confirmationQuestion}>Assign Javier to this procedure and notify the case team?</p><button className={styles.primaryButton} type="button" onClick={onConfirm}>Confirm assignment</button><button className={styles.secondaryButton} type="button" onClick={onChooseAnother}>Choose another clinical</button>
</div>; }

function ReadyScreen({ onReturnHome, onWorkload }: { onReturnHome: () => void; onWorkload: () => void }) { return <div className={styles.screenContent}>
  <section className={styles.successBanner}><CheckCircle /><div><h2>Coverage confirmed</h2><p>Javier Ruiz has been assigned to the ICD Implant at Methodist Hospital.</p></div></section>
  <section className={styles.surfaceCard}><h3>Updated readiness</h3><ReadinessRow label="Clinical coverage" value="Javier Ruiz confirmed" positive /><ReadinessRow label="Procedure details" value="Confirmed" /><ReadinessRow label="Required inventory" value="Available on site" /><ReadinessRow label="Case preparation" value="Briefing ready for Javier" positive /><ReadinessRow label="Documentation" value="ICD Implant template prepared" /></section>
  <section className={styles.handoffCard}><p className={styles.subsectionLabel}>Notification sent</p><h3>Javier’s case briefing is ready</h3><p>He will receive procedure details, physician context, inventory readiness, and a prepared documentation workflow in CardioConnect.</p></section>
  <section className={styles.capacityCard}><div className={styles.assistTag}><Sparkle /> Team capacity insight</div><h3>Sally Morgan has elevated workload this week</h3><p>Assist can identify reassignment options while maintaining coverage and physician continuity.</p><button className={styles.textLink} type="button" onClick={onWorkload}>Review workload options <ArrowRight /></button></section>
  <button className={styles.secondaryButton} type="button" onClick={onReturnHome}>Return to Monica’s briefing</button>
</div>; }

function JavierHomeScreen({ onOpenCase }: { onOpenCase: () => void }) { return <div className={styles.screenContent}>
  <section className={styles.greeting}><p className={styles.eyebrow}>Monday, June 22 · Clinical Representative</p><h2>Hi, Javier</h2></section>
  <section className={styles.updateHero}><div className={styles.assistTag}><Sparkle /> Assignment update</div><h3>Your day has changed</h3><p>You have been assigned to a new procedure. Case preparation is ready for review.</p></section>
  <div className={styles.sectionHeading}><h3>Next procedure</h3><button className={styles.smallLink} type="button">View day</button></div>
  <article className={styles.assignmentCard}><div className={styles.chipRow}><Chip text="CRM" tone="division" /><Chip text="New assignment" tone="positive" /></div><h3>ICD Implant</h3><p>Methodist Hospital · Dr. Aaron Smith</p><strong>Today · 3:00 PM</strong><div className={styles.assignmentMeta}><span><PinIcon />18 min away</span><span><CheckSmall />Coverage confirmed</span></div><button className={styles.primaryButton} type="button" onClick={onOpenCase}>Open case preparation</button></article>
  <section className={styles.todayList}><h3>Today</h3><div className={styles.timelineRow}><span>9:00 AM</span><div><strong>Device Check</strong><p>Hennepin Healthcare · Complete</p></div></div><div className={`${styles.timelineRow} ${styles.timelineActive}`}><span>3:00 PM</span><div><strong>ICD Implant</strong><p>Methodist Hospital · Newly assigned</p></div></div></section>
</div>; }

function PrepScreen({ onAskAssist }: { onAskAssist: () => void }) { return <div className={styles.screenContent}>
  <div className={styles.caseTitleBlock}><div className={styles.chipRow}><Chip text="CRM" tone="division" /><Chip text="Ready" tone="positive" /></div><h2>ICD Implant</h2><p>Methodist Hospital · Dr. Aaron Smith</p><strong>Today · 3:00 PM</strong></div>
  <section className={styles.surfaceCard}><h3>Case readiness</h3><ReadinessRow label="Procedure details" value="Confirmed" positive /><ReadinessRow label="Clinical assignment" value="You are assigned" positive /><ReadinessRow label="Required inventory" value="Available on site" positive /><ReadinessRow label="Physician preferences" value="Available" /><ReadinessRow label="Procedure worksheet" value="Template prepared" positive /></section>
  <section className={styles.inventoryInsight}><div className={styles.assistTag}><Sparkle /> Inventory insight</div><h3>Expiration opportunity identified</h3><p>One compatible ICD lead at Methodist expires in 8 days and may be eligible for this case. If used, stock will fall below par and a reorder request can be prepared after confirmation.</p><button className={styles.textLink} type="button" onClick={onAskAssist}>Ask Assist about inventory <ArrowRight /></button></section>
  <section className={styles.documentationPrepared}><div><p className={styles.subsectionLabel}>Procedure documentation</p><h3>ICD Implant worksheet prepared</h3><p>Available after procedure completion.</p></div><Chip text="Prepared" tone="positive" /></section>
</div>; }

function DocumentationStartScreen({ onBegin, onScanDevice, onScanDocument }: { onBegin: () => void; onScanDevice: () => void; onScanDocument: () => void }) { return <div className={styles.screenContent}>
  <section className={styles.successBanner}><CheckCircle /><div><h2>Procedure completed</h2><p>Documentation is ready to begin within this connected case.</p></div></section>
  <section className={styles.aiInsightCard}><div className={styles.assistTag}><Sparkle /> Smart setup</div><p>I carried forward information captured during scheduling and prepared the ICD Implant worksheet for this case.</p></section>
  <section className={styles.surfaceCard}><h3>Prefilled from the case</h3><ReadinessRow label="Procedure" value="ICD Implant" /><ReadinessRow label="Account" value="Methodist Hospital" /><ReadinessRow label="Implanting physician" value="Dr. Aaron Smith" /><ReadinessRow label="Procedure date/time" value="Today · 3:00 PM" /><ReadinessRow label="Assigned clinical" value="Javier Ruiz" /></section>
  <button className={styles.primaryButton} type="button" onClick={onBegin}>Begin procedure worksheet</button>
  <div className={styles.quickCaptureRow}><button type="button" onClick={onScanDevice}><BarcodeIcon />Scan device barcode</button><button type="button" onClick={onScanDocument}><DocumentIcon />Scan supporting document</button></div>
</div>; }

function WorksheetScreen({ deviceCaptured, documentCaptured, onScanDevice, onScanDocument, onReview }: { deviceCaptured: boolean; documentCaptured: boolean; onScanDevice: () => void; onScanDocument: () => void; onReview: () => void }) { return <div className={styles.screenContent}>
  <section className={styles.progressHeader}><p className={styles.eyebrow}>ICD Implant · Methodist Hospital</p><h2>Procedure Worksheet</h2><div className={styles.progressTrack}><span style={{ width: deviceCaptured && documentCaptured ? "78%" : deviceCaptured || documentCaptured ? "52%" : "34%" }} /></div><p>{deviceCaptured && documentCaptured ? "Most required fields are ready for review." : "12 fields completed from scheduling and the procedure template."}</p></section>
  <section className={styles.capturePrompt}><div className={styles.assistTag}><Sparkle /> Accelerate entry</div><p>Scan the implanted device barcode and supporting documentation to prefill additional fields for your review.</p><div className={styles.captureButtons}><button type="button" onClick={onScanDevice} className={deviceCaptured ? styles.capturedAction : ""}><BarcodeIcon />{deviceCaptured ? "Device captured" : "Scan device"}</button><button type="button" onClick={onScanDocument} className={documentCaptured ? styles.capturedAction : ""}><DocumentIcon />{documentCaptured ? "Document captured" : "Scan document"}</button></div></section>
  <section className={styles.worksheetSections}>
    <WorksheetRow title="Patient data" status="Needs review" />
    <WorksheetRow title="Account & hospital data" status="Prefilled" positive />
    <WorksheetRow title="Physician data" status="Partially prefilled" />
    <WorksheetRow title="Implanted devices" status={deviceCaptured ? "Captured" : "Scan required"} positive={deviceCaptured} />
    <WorksheetRow title="Measured data" status={documentCaptured ? "Captured · review" : "Required"} positive={documentCaptured} />
    <WorksheetRow title="Programmed parameters" status={documentCaptured ? "Captured · review" : "Required"} positive={documentCaptured} />
    <WorksheetRow title="Removed / attempted" status="Required" />
    <WorksheetRow title="Product complaint assessment" status="Required" />
    <WorksheetRow title="Proof of delivery" status="Required" />
    <WorksheetRow title="Output & submission" status="Not started" />
  </section>
  <button className={styles.primaryButton} type="button" onClick={onReview} disabled={!deviceCaptured || !documentCaptured}>Review completed worksheet</button>
  {!deviceCaptured || !documentCaptured ? <p className={styles.helperText}>Capture device and document data to continue this walkthrough.</p> : null}
</div>; }

function DeviceCaptureScreen({ onConfirm }: { onConfirm: () => void }) { return <div className={styles.screenContent}>
  <section className={styles.scanVisual}><BarcodeIcon /><p>Barcode captured</p></section>
  <section className={styles.surfaceCard}><div className={styles.assistTag}><Sparkle /> Device identified</div><h3 className={styles.captureTitle}>Review captured device</h3><ReadinessRow label="Device category" value="ICD" /><ReadinessRow label="Product / model" value="Vigilant™ EL ICD" /><ReadinessRow label="Serial / lot number" value="9148027" /><ReadinessRow label="Inventory source" value="Methodist consignment" /><ReadinessRow label="Expiration status" value="Expires in 8 days" attention /><ReadinessRow label="Par-level impact" value="Below par after use" attention /></section>
  <p className={styles.reviewNote}>Confirm device use before it is added to the procedure record and reflected in inventory.</p><button className={styles.primaryButton} type="button" onClick={onConfirm}>Confirm implanted device</button>
</div>; }

function DocumentCaptureScreen({ onConfirm }: { onConfirm: () => void }) { return <div className={styles.screenContent}>
  <section className={styles.scanVisual}><DocumentIcon /><p>Supporting document scanned</p></section>
  <section className={styles.aiInsightCard}><div className={styles.assistTag}><Sparkle /> Review required</div><p>I identified information that may apply to this worksheet. Confirm each value before it is added to the procedure record.</p></section>
  <section className={styles.extractionList}>
    <ExtractionRow data="Measured value: R-wave 12.8 mV" section="Measured data" />
    <ExtractionRow data="Impedance: 542 Ω" section="Measured data" />
    <ExtractionRow data="Programmed mode: DDDR" section="Programmed parameters" />
    <ExtractionRow data="Dr. Aaron Smith" section="Implanting physician · matches record" />
  </section>
  <button className={styles.primaryButton} type="button" onClick={onConfirm}>Confirm selected values</button>
</div>; }

function ReviewScreen({ onSubmit }: { onSubmit: () => void }) { const sections = ["Patient data reviewed", "Account and physician details confirmed", "Implanted device recorded", "Measured data completed", "Programmed parameters completed", "Removed / attempted documented", "Product complaint assessment completed", "Proof of delivery complete"]; return <div className={styles.screenContent}>
  <section className={styles.reviewHero}><div className={styles.assistTag}><Sparkle /> Ready for submission</div><h2>Procedure record complete</h2><p>Review completion status and submit the full case record within CardioConnect.</p></section>
  <section className={styles.completionList}>{sections.map((item) => <div className={styles.completionRow} key={item}><CheckSmall />{item}</div>)}</section>
  <section className={styles.surfaceCard}><p className={styles.subsectionLabel}>Product complaint assessment</p><h3>No concern identified</h3><p className={styles.cardDescription}>User confirmed no product performance concern or follow-up is required for this procedure.</p></section>
  <button className={styles.primaryButton} type="button" onClick={onSubmit}>Submit procedure record</button><button className={styles.secondaryButton} type="button">Save draft</button>
</div>; }

function PdfScreen({ onReorder, onToast }: { onReorder: () => void; onToast: (message: string) => void }) { return <div className={styles.screenContent}>
  <section className={styles.successBanner}><CheckCircle /><div><h2>Procedure record submitted</h2><p>The ICD Implant record is complete and inventory utilization has been recorded.</p></div></section>
  <section className={styles.surfaceCard}><p className={styles.subsectionLabel}>Generate output</p><h3>Select information to include</h3><div className={styles.checklist}><CheckOption label="Procedure summary" /><CheckOption label="Account and physician details" /><CheckOption label="Implanted devices" /><CheckOption label="Measured data" /><CheckOption label="Programmed parameters" /><CheckOption label="Proof of delivery" /></div><button className={styles.secondaryButton} type="button" onClick={() => onToast("PDF prepared. Print and secure email delivery would be available in the production experience.")}>Generate PDF</button></section>
  <section className={styles.replenishCard}><div className={styles.assistTag}><Sparkle /> Replenishment recommended</div><h3>Methodist is now below recommended par</h3><p>The ICD lead used reduced expiration risk, but the account now needs reorder to protect future case readiness.</p><button className={styles.primaryInlineButton} type="button" onClick={onReorder}>Review reorder <ArrowRight /></button></section>
</div>; }

function ReorderScreen({ onDone }: { onDone: () => void }) { return <div className={styles.screenContent}>
  <div className={styles.caseTitleBlock}><div className={styles.chipRow}><Chip text="CRM" tone="division" /><Chip text="Recommended" tone="action" /></div><h2>Replenishment request</h2><p>Methodist Hospital · ICD Inventory</p></div>
  <section className={styles.surfaceCard}><h3>Inventory impact</h3><ReadinessRow label="Device used" value="Vigilant™ EL ICD" /><ReadinessRow label="Inventory source" value="Account consignment" /><ReadinessRow label="Expiration avoided" value="8 days remaining" positive /><ReadinessRow label="Current stock" value="Below par" attention /><ReadinessRow label="Recommended quantity" value="1 replacement unit" /></section>
  <section className={styles.aiInsightCard}><div className={styles.assistTag}><Sparkle /> Assist recommendation</div><p>Prepare a reorder request for one replacement unit to restore the account’s recommended par level before its next scheduled ICD procedure.</p></section>
  <button className={styles.primaryButton} type="button" onClick={onDone}>Prepare reorder request</button><button className={styles.secondaryButton} type="button">Review account inventory</button>
</div>; }


function JordanHomeScreen({ onOpenAccount, onStaticJourney }: { onOpenAccount: () => void; onStaticJourney: (message: string) => void }) { return <div className={styles.screenContent}>
  <section className={styles.greeting}><p className={styles.eyebrow}>Territory priorities · Week of June 22</p><h2>Good morning, Jordan</h2></section>
  <section className={styles.territoryHero}><div className={styles.assistTag}><Sparkle /> Account intelligence</div><h3>Three accounts may need attention this week</h3><p>Based on procedure activity, changing coverage needs, and upcoming case readiness.</p><button className={styles.textLink} type="button" onClick={() => onStaticJourney("Open the Methodist signal to ask Assist which physician may benefit from proactive outreach.")}>Ask Assist where to focus <ArrowRight /></button></section>
  <div className={styles.metrics}><Metric value="3" label="Priority accounts" /><Metric value="12" label="Upcoming cases" /><Metric value="2" label="Activity signals" /></div>
  <div className={styles.sectionHeading}><h3>Account signals</h3><button className={styles.smallLink} type="button">View territory</button></div>
  <article className={`${styles.signalCard} ${styles.signalPriority}`}>
    <div className={styles.chipRow}><Chip text="CRM" tone="division" /><Chip text="Priority signal" tone="action" /></div>
    <h3>Methodist Hospital</h3>
    <p className={styles.cardDescription}>Dr. Aaron Smith</p>
    <p className={styles.supportingText}>Two urgent add-on procedures this week; today’s ICD case was covered successfully.</p>
    <button className={styles.cardPrimaryAction} type="button" onClick={onOpenAccount}>Review signal <ArrowRight /></button>
  </article>
  <article className={styles.signalCard}>
    <div className={styles.chipRow}><Chip text="EP" tone="division" /></div>
    <h3>Abbott Northwestern</h3>
    <p className={styles.cardDescription}>Dr. Michael Chen</p>
    <p className={styles.supportingText}>AF Ablation volume is trending above recent average; next week’s coverage is under review.</p>
    <button className={styles.cardAction} type="button" onClick={() => onStaticJourney("Additional EP account insights are not included in this walkthrough.")}>View activity <ArrowRight /></button>
  </article>
  <article className={styles.signalCard}>
    <div className={styles.chipRow}><Chip text="Watchman" tone="division" /></div>
    <h3>North Memorial</h3>
    <p className={styles.cardDescription}>Dr. Elena Patel</p>
    <p className={styles.supportingText}>Upcoming LAA Closure is ready; reorder is expected after planned device use.</p>
    <button className={styles.cardAction} type="button" onClick={() => onStaticJourney("Additional Watchman account insights are not included in this walkthrough.")}>View readiness <ArrowRight /></button>
  </article>
</div>; }

function AccountInsightScreen({ onAskAssist }: { onAskAssist: () => void }) { return <div className={styles.screenContent}>
  <div className={styles.caseTitleBlock}><div className={styles.chipRow}><Chip text="CRM" tone="division" /><Chip text="Priority signal" tone="action" /></div><h2>Methodist Hospital</h2><p>Dr. Aaron Smith</p><strong>Territory insight · This week</strong></div>
  <section className={styles.surfaceCard}><h3>Why this account surfaced</h3>
    <div className={styles.signalReason}><span className={styles.reasonIcon}>1</span><div><strong>Urgent case activity</strong><p>Two urgent CRM add-on procedures were added this week.</p></div></div>
    <div className={styles.signalReason}><span className={styles.reasonIcon}>2</span><div><strong>Coverage response</strong><p>Today’s same-day ICD coverage request was resolved with Javier Ruiz.</p></div></div>
    <div className={styles.signalReason}><span className={styles.reasonIcon}>3</span><div><strong>Inventory follow-through</strong><p>A reorder request is prepared after documented device use.</p></div></div>
  </section>
  <section className={styles.aiInsightCard}><div className={styles.assistTag}><Sparkle /> Assist insight</div><p>Recent procedure activity may indicate near-term demand at Methodist. I can help prioritize physician outreach based on account signals and upcoming scheduled cases.</p></section>
  <button className={styles.primaryButton} type="button" onClick={onAskAssist}>Ask which physician to prioritize</button>
  <button className={styles.secondaryButton} type="button">View upcoming cases</button>
</div>; }

function TerritoryAssistSheet({ promptSent, onClose, onSendPrompt, onToast }: { promptSent: boolean; onClose: () => void; onSendPrompt: () => void; onToast: (message: string) => void }) { return <><div className={styles.scrim} onClick={onClose} aria-hidden="true" /><section className={styles.assistSheet} aria-label="Assist"><div className={styles.sheetHandle} /><header className={styles.sheetHeader}><div><div className={styles.assistHeading}><Sparkle /><h2>Assist</h2></div><p>Using territory activity and account signals as context.</p></div><button className={styles.iconButton} type="button" aria-label="Close Assist" onClick={onClose}><CloseIcon /></button></header>{!promptSent ? <div className={styles.promptStart}><p className={styles.subsectionLabel}>Suggested prompt</p><button className={styles.promptCard} type="button" onClick={onSendPrompt}>Which physicians should I prioritize visiting this week?<ArrowRight /></button></div> : <div className={styles.conversation}><div className={styles.userMessage}>Which physicians should I prioritize visiting this week?</div><div className={styles.assistantMessage}><div className={styles.assistTag}><Sparkle /> Recommendation</div><p><strong>Dr. Aaron Smith at Methodist</strong> is the strongest priority. His account has had two urgent add-on cases this week, including one requiring same-day coverage. Your clinical team has coverage in place, and a proactive conversation may help anticipate additional near-term demand.</p></div><section className={styles.territoryRecommendation}><p className={styles.subsectionLabel}>Recommended next action</p><h3>Plan a proactive check-in with Dr. Smith</h3><p>Confirm upcoming procedure demand and ensure clinical and inventory support are aligned.</p><button className={styles.primaryInlineButton} type="button" onClick={() => onToast("Follow-up reminder added for Methodist Hospital · Dr. Aaron Smith.")}>Add follow-up reminder <ArrowRight /></button></section></div>}</section></>; }

function PlaceholderScreen({ tab, onHome }: { tab: Exclude<Tab, "Home">; onHome: () => void }) { return <div className={styles.placeholderScreen}><div className={styles.placeholderIcon}><Sparkle /></div><h2>{placeholderCopy[tab].title}</h2><p>{placeholderCopy[tab].text}</p><button className={styles.primaryButton} type="button" onClick={onHome}>Return home</button></div>; }

function AssistSheet({ promptSent, onClose, onSendPrompt, onSelectCandidate }: { promptSent: boolean; onClose: () => void; onSendPrompt: () => void; onSelectCandidate: (candidate: Candidate) => void }) { return <><div className={styles.scrim} onClick={onClose} aria-hidden="true" /><section className={styles.assistSheet} aria-label="Assist"><div className={styles.sheetHandle} /><header className={styles.sheetHeader}><div><div className={styles.assistHeading}><Sparkle /><h2>Assist</h2></div><p>Using this ICD Implant at Methodist Hospital as context.</p></div><button className={styles.iconButton} type="button" aria-label="Close Assist" onClick={onClose}><CloseIcon /></button></header>{!promptSent ? <div className={styles.promptStart}><p className={styles.subsectionLabel}>Suggested prompt</p><button className={styles.promptCard} type="button" onClick={onSendPrompt}>Who is available right now? We have an ICD starting at 3 PM at Methodist Hospital that needs coverage.<ArrowRight /></button></div> : <div className={styles.conversation}><div className={styles.userMessage}>Who is available right now? We have an ICD starting at 3 PM at Methodist Hospital that needs coverage.</div><div className={styles.assistantMessage}><div className={styles.assistTag}><Sparkle /> Recommendation</div><p>I found three ICD-qualified clinical representatives who can support this case. Javier Ruiz is the strongest match based on availability, proximity, and prior experience supporting Dr. Smith.</p></div><div className={styles.candidateList}>{candidates.map((candidate) => <CandidateCard key={candidate.name} candidate={candidate} onSelect={() => onSelectCandidate(candidate)} />)}</div></div>}</section></>; }

function CandidateCard({ candidate, onSelect }: { candidate: Candidate; onSelect: () => void }) { return <article className={`${styles.candidateCard} ${candidate.recommended ? styles.candidateRecommended : ""}`}>{candidate.recommended && <span className={styles.recommendedTag}>Recommended</span>}<div className={styles.candidateTop}><div><h3>{candidate.name}</h3><p>Clinical Representative</p></div><button className={candidate.recommended ? styles.miniPrimary : styles.miniSecondary} type="button" onClick={onSelect}>{candidate.recommended ? "Select Javier" : "Select"}</button></div><ul>{candidate.detail.map((item) => <li key={item}>{item}</li>)}</ul></article>; }

function BottomNav({ active, onNavigate }: { active: Tab; onNavigate: (tab: Tab) => void }) { const items: Array<{ label: Tab; icon: ReactNode }> = [{ label: "Home", icon: <HomeIcon /> }, { label: "Schedule", icon: <CalendarIcon /> }, { label: "Cases", icon: <CaseIcon /> }, { label: "Inventory", icon: <BoxIcon /> }, { label: "More", icon: <DotsIcon /> }]; return <nav className={styles.bottomNav} aria-label="Primary navigation">{items.map((item) => <button className={`${styles.navItem} ${active === item.label ? styles.navActive : ""}`} type="button" key={item.label} onClick={() => onNavigate(item.label)}>{item.icon}<span>{item.label}</span></button>)}</nav>; }
function PriorityCard({ division, status, title, detail, time, supporting, action, onAction, hero, resolved }: { division: string; status?: string; title: string; detail: string; time: string; supporting: string; action: string; onAction: () => void; hero?: boolean; resolved?: boolean }) { return <article className={`${styles.priorityCard} ${hero ? styles.priorityHero : ""} ${resolved ? styles.priorityResolved : ""}`}><div className={styles.chipRow}><Chip text={division} tone="division" />{status && <Chip text={status} tone={resolved ? "positive" : "action"} />}</div><h4>{title}</h4><p className={styles.cardDescription}>{detail}</p><p className={styles.caseTime}>{time}</p><p className={styles.supportingText}>{supporting}</p><button className={hero ? styles.cardPrimaryAction : styles.cardAction} type="button" onClick={onAction}>{action} <ArrowRight /></button></article>; }
function Metric({ value, label, emphasized }: { value: string; label: string; emphasized?: boolean }) { return <div className={`${styles.metric} ${emphasized ? styles.metricEmphasized : ""}`}><strong>{value}</strong><span>{label}</span></div>; }
function ReadinessRow({ label, value, attention, positive }: { label: string; value: string; attention?: boolean; positive?: boolean }) { return <div className={styles.readinessRow}><span>{label}</span><strong className={attention ? styles.attentionText : positive ? styles.positiveText : ""}>{value}</strong></div>; }
function Chip({ text, tone }: { text: string; tone: "division" | "action" | "positive" }) { return <span className={`${styles.chip} ${styles[`chip${tone.charAt(0).toUpperCase()}${tone.slice(1)}`]}`}>{text}</span>; }
function WorksheetRow({ title, status, positive }: { title: string; status: string; positive?: boolean }) { return <div className={styles.worksheetRow}><span>{title}</span><strong className={positive ? styles.positiveText : ""}>{status}</strong><ChevronRight /></div>; }
function ExtractionRow({ data, section }: { data: string; section: string }) { return <article className={styles.extractionRow}><div><strong>{data}</strong><p>{section}</p></div><label><input type="checkbox" defaultChecked /> Confirm</label></article>; }
function CheckOption({ label }: { label: string }) { return <label className={styles.checkOption}><input type="checkbox" defaultChecked /><span>{label}</span></label>; }
function PersonaRow({ initials, name, role, active, comingSoon, locked }: { initials: string; name: string; role: string; active?: boolean; comingSoon?: boolean; locked?: boolean }) { return <div className={`${styles.personaRow} ${active ? styles.personaActive : ""}`}><span className={styles.avatarSmall}>{initials}</span><div><strong>{name}</strong><span>{role}</span></div>{active ? <Chip text="Active" tone="positive" /> : comingSoon ? <span className={styles.comingSoon}>Coming next</span> : locked ? <span className={styles.comingSoon}>Locked</span> : <span className={styles.comingSoon}>View</span>}</div>; }

function Sparkle() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.2 6 6 2.2-6 2.2-2.2 6-2.2-6-6-2.2 6-2.2 2.2-6z" /><path d="M19 15.7l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9.9-2.4z" /></svg>; }
function ArrowRight() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>; }
function ArrowLeft() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>; }
function ChevronDown() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>; }
function ChevronRight() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>; }
function Bell() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 10a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0" /></svg>; }
function CheckCircle() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" /><path d="m22 4-10 10.01-3-3" /></svg>; }
function CheckSmall() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>; }
function CloseIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>; }
function PinIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>; }
function BarcodeIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5v14M7 5v14M11 5v14M13 5v14M17 5v14M20 5v14" /></svg>; }
function DocumentIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v6h6M9 12h6M9 16h6" /></svg>; }
function HomeIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M10 20v-6h4v6" /></svg>; }
function CalendarIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2" /></svg>; }
function CaseIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M9 6V4h6v2M4 12h16M10 12v2h4v-2" /></svg>; }
function BoxIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 8-9 5-9-5 9-5 9 5z" /><path d="M3 8v9l9 5 9-5V8M12 13v9" /></svg>; }
function DotsIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12h.01M19 12h.01M5 12h.01" /></svg>; }
function SignalIcon() { return <svg viewBox="0 0 18 14"><path d="M1 13h2V9H1v4zm4 0h2V6H5v7zm4 0h2V3H9v10zm4 0h2V0h-2v13z" /></svg>; }
function WifiIcon() { return <svg viewBox="0 0 18 14"><path d="M1 4.5a12 12 0 0 1 16 0M4 8a7.8 7.8 0 0 1 10 0M7.4 11a3 3 0 0 1 3.2 0M9 13h.01" /></svg>; }
function BatteryIcon() { return <svg viewBox="0 0 26 14"><rect x="1" y="2" width="21" height="10" rx="2" /><path d="M24 5v4" /><path d="M4 5h14v4H4z" /></svg>; }
