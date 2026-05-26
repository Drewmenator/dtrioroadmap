import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from '@supabase/supabase-js';
import MyTasks from './components/MyTasks';
import NotificationBell from './components/NotificationBell';
const SB_URL = "https://zfrnuaymgcqekzipokve.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmcm51YXltZ2NxZWt6aXBva3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODY5MjgsImV4cCI6MjA5NDM2MjkyOH0.0YRIS38Nnvg-SoWtYuB2voVdH52FKWDJPXnlWev5g_k";
const SB_TABLE = "roadmap_state";
const supabaseClient = createClient(SB_URL, SB_KEY);
const sbGetKey = async (id) => { try { const r = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}?id=eq.${id}&select=state`, {headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}}); const rows = await r.json(); return rows?.[0]?.state||null; } catch(e){return null;} };
const sbSetKey = async (id, state) => { try { await fetch(`${SB_URL}/rest/v1/${SB_TABLE}`, {method:"POST",headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},body:JSON.stringify({id,state,updated_at:new Date().toISOString()})}); } catch(e){} };
const SB_ID = "dtrio-v1";
const sbGet = async () => { try { const r = await fetch(`${SB_URL}/rest/v1/${SB_TABLE}?id=eq.${SB_ID}&select=state`, {headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}}); const rows = await r.json(); return rows?.[0]?.state||null; } catch(e){return null;} };
const sbSet = async (state) => { try { await fetch(`${SB_URL}/rest/v1/${SB_TABLE}`, {method:"POST",headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},body:JSON.stringify({id:SB_ID,state,updated_at:new Date().toISOString()})}); } catch(e){} };


// ─── COLOUR PALETTE ───────────────────────────────────────────────────────────
const COLORS = {
  s1: "#1e3a6e", s1l: "#e8edf5", s1m: "#9aaac8",
  s2: "#00a882", s2l: "#e6f7f3", s2m: "#9de8d4",
  s3: "#cc2b24", s3l: "#fae9e8", s3m: "#e8a09d",
  s4: "#d4961a", s4l: "#fdf5e6", s4m: "#f5d98a",
  s5: "#7c44d4", s5l: "#f3eefb", s5m: "#ceb8f0",
  s6: "#e8763a", s6l: "#fdf0e8", s6m: "#f5c4a0",
  ragG: "#16a34a", ragA: "#d97706", ragR: "#dc2626",
  bg: "#f2f4f9", surface: "#fff", border: "#dde2ef",
  text: "#1a2035", muted: "#8492b4", faint: "#eef1f8",
};
const STAGE_COLORS = ["", COLORS.s1, COLORS.s2, COLORS.s3, COLORS.s4, COLORS.s5];
const STAGE_NAMES  = ["", "Input", "Development", "Internal Testing", "Soft Release", "Hard Release"];
const ENV_COLORS   = [COLORS.s6, COLORS.s1, COLORS.s2, COLORS.s3, COLORS.s4, COLORS.s5];
const MN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TEAM_MAP = {
  "Management,Consultants": "mgmt",
  "Management": "mgmt",
  "Consultants": "cons",
  "Development": "dev",
  "Marketing": "mkt",
  "All": "all",
};

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
const D = (y,m,d) => new Date(y,m-1,d);
//const fmt  = d => d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
const fmtS = d => d.toLocaleDateString("en-GB",{day:"numeric",month:"short"});
const RANGE_START = new Date(2025,11,1);
const RANGE_END   = new Date(2027,7,1);
const TODAY = new Date();
const pct = d => Math.min(100, Math.max(0, (d - RANGE_START) / (RANGE_END - RANGE_START) * 100));

const MONTHS = [];
{ let c = new Date(RANGE_START); while(c < RANGE_END){ MONTHS.push(new Date(c)); c.setMonth(c.getMonth()+1); } }

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
const DEFAULT_ENVS = [
  {
    name:"Uncertainty Assessment Tool", sub:"Identify, explore & quantify key uncertainties", rag:"G",
    description:"Enables teams to identify the key uncertainties that drive decision outcomes, explore their range, and understand which ones matter most.",
    purpose:"To surface and structure uncertainties critical to the decision so strategies can be tested against them.",
    successCriteria:["All key uncertainties identified","Ranges defined for each uncertainty","Uncertainties ranked by impact","Team aligned on deal-breakers"],
    dependencies:["Problem Definition approved","DTrio uncertainty module built and tested"],
    bars:[
      {s:1,start:D(2025,12,1),end:D(2026,2,28),lbl:"Input",team:"Management,Consultants",teams:["Management","Consultants"],owner:"Ellen & Andrew",role:"Define uncertainty framework and requirements.",
       deliverables:["Requirements doc","Stakeholder interview notes","Scope sign-off"],
       acts:["Define feature brief and DQ methodology alignment","Map decision quality criteria to feature requirements","Conduct stakeholder interviews with DQ consultants","Document user stories and use cases","Define success metrics and acceptance criteria","Review scope with Ellen (management)","Sign off on requirements document","Brief Jan and Daniel on requirements","Agree timeline and milestones with dev team"],
       checked:[],actDates:[],prog:100,note:"",comments:[]},
      {s:2,start:D(2026,1,1),end:D(2026,3,31),lbl:"Development",team:"Development",teams:["Development"],owner:"Jan & Daniel",role:"Build the uncertainty assessment feature.",
       deliverables:["Working feature build","Code review sign-off","Dev demo recording"],
       acts:["Set up feature branch and architecture","Build UI/UX wireframes and get DQ consultant sign-off","Implement core uncertainty assessment logic","Build database schema and API endpoints","Integrate with existing DTrio platform","Internal code review","Fix code review feedback","Build unit and integration tests","Demo to Andrew and Selena for early feedback","Implement DQ consultant feedback"],
       checked:[],actDates:[],prog:100,note:"",comments:[]},
      {s:3,start:D(2026,3,1),end:D(2026,4,30),lbl:"Internal Testing",team:"Development",teams:["Management","Consultants","Development"],owner:"Ashley & Selena",role:"Test against DQ methodology standards.",
       deliverables:["Test plan","Bug report","Sign-off document"],
       acts:["Write internal test plan","Ashley and Selena test feature against DQ methodology","Jan and Daniel test for edge cases and bugs","Document all issues","Prioritise and assign fixes","Dev team resolves critical bugs","Re-test after fixes","Performance and load testing","Ray and Andrew sign off on methodology accuracy","Ellen reviews and approves"],
       checked:[],actDates:[],prog:80,note:"",comments:[]},
      {s:4,start:D(2026,4,1),end:D(2026,6,30),lbl:"Soft Release",team:"Marketing",teams:["Marketing","Consultants"],owner:"David & Sam",role:"Coordinate pilot client testing and feedback.",
       deliverables:["Pilot client list","Feedback report","Release comms draft"],
       acts:["Identify 2-3 pilot clients","Prepare pilot client briefing materials","David and Sam onboard pilot clients","Run guided sessions with pilot clients","Collect structured feedback","Ashley and Selena analyse feedback against DQ standards","Document improvement recommendations","Jan and Daniel implement critical feedback","Re-test improvements","Sam prepares release communications"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:5,start:D(2026,6,1),end:D(2026,7,31),lbl:"Hard Release",team:"All",teams:["Management","Consultants","Development","Marketing"],owner:"Ellen & Andrew",role:"Final release to all users.",
       deliverables:["Production deployment","Release announcement","Post-release report"],
       acts:["Andrew final QA sign-off","Jan and Daniel deploy to production","Sam publishes announcement","Send release notes to all users","Monitor for critical issues post-launch","Jan and Daniel on standby for hotfixes","Ray and Ashley available for user support","Collect post-release metrics","Post-release team review led by Ellen","Document lessons learned"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
    ]
  },
  {
    name:"Issue Raising", sub:"Surface & structure inputs into the decision frame", rag:"G",
    description:"Enables teams to systematically raise and structure issues that need to be addressed in the decision-making process.",
    purpose:"To ensure all relevant issues are surfaced, structured and prioritised before the decision frame is set.",
    successCriteria:["All issues captured and categorised","Issues linked to decision outcomes","Team aligned on priority issues"],
    dependencies:["Uncertainty Assessment Tool complete","Problem Definition in progress"],
    bars:[
      {s:1,start:D(2026,4,1),end:D(2026,5,31),lbl:"Input",team:"Management,Consultants",teams:["Management","Consultants"],owner:"Ellen & Selena",role:"Define issue raising requirements and methodology.",
       deliverables:["Requirements doc","Issue taxonomy","Scope sign-off"],
       acts:["Define feature brief aligned to DQ issue raising methodology","Map issue types to decision quality framework","Conduct stakeholder interviews","Document user stories for issue submission and management","Define success metrics","Review scope with Ellen","Sign off on requirements","Brief Jan and Daniel","Agree milestones"],
       checked:[],actDates:[],prog:60,note:"",comments:[]},
      {s:2,start:D(2026,5,15),end:D(2026,8,15),lbl:"Development",team:"Development",teams:["Development"],owner:"Jan & Daniel",role:"Build issue raising and management feature.",
       deliverables:["Working issue raising module","Code review sign-off","Dev demo"],
       acts:["Set up feature branch","Build UI for issue submission and categorisation","Implement issue tagging and prioritisation logic","Build issue dashboard and filtering","Integrate with DTrio decision frame","Internal code review","Fix code review feedback","Build automated tests","Demo to Ashley and Ray","Implement consultant feedback"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:3,start:D(2026,8,15),end:D(2026,10,1),lbl:"Internal Testing",team:"Development",teams:["Management","Consultants","Development"],owner:"Andrew & Ashley",role:"Test issue raising against DQ standards.",
       deliverables:["Test plan","Bug report","Methodology sign-off"],
       acts:["Write test plan","Andrew and Ashley test against DQ issue raising standards","Jan and Daniel test edge cases","Document issues","Prioritise fixes","Dev team resolves bugs","Re-test","Performance testing","Andrew signs off on methodology","Ellen approves"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:4,start:D(2026,10,1),end:D(2026,11,15),lbl:"Soft Release",team:"Marketing",teams:["Marketing","Consultants"],owner:"Sam & David",role:"Pilot with select clients.",
       deliverables:["Pilot feedback report","Release comms"],
       acts:["Identify pilot clients","Prepare briefing materials","Sam and David onboard clients","Run guided pilot sessions","Collect feedback","Selena and Ray analyse feedback","Document recommendations","Jan implements critical fixes","Re-test","Sam prepares launch comms"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:5,start:D(2026,11,15),end:D(2027,1,15),lbl:"Hard Release",team:"All",teams:["Management","Consultants","Development","Marketing"],owner:"Ellen & Jan",role:"Full release of issue raising feature.",
       deliverables:["Production deployment","Announcement","Post-release review"],
       acts:["Andrew final QA sign-off","Jan and Daniel deploy to production","Sam publishes announcement","Send release notes","Monitor post-launch","Dev team on hotfix standby","Consultants support users","Collect metrics","Ellen leads post-release review","Document lessons learned"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
    ]
  },
  {
    name:"Problem Definition", sub:"Frame the right question before seeking answers", rag:"G",
    description:"Helps teams correctly frame the decision problem before jumping to solutions.",
    purpose:"To ensure the team is solving the right problem by clearly defining the decision context and boundaries.",
    successCriteria:["Problem clearly framed","Decision owner identified","Scope boundaries set","Success measures defined"],
    dependencies:["Issue Raising complete"],
    bars:[
      {s:1,start:D(2026,4,1),end:D(2026,5,31),lbl:"Input",team:"Management,Consultants",teams:["Management","Consultants"],owner:"Ellen & Andrew",role:"Define problem definition methodology and requirements.",
       deliverables:["Feature requirements","Problem framing templates","Scope sign-off"],
       acts:["Define feature brief for problem definition tool","Map DQ problem framing methodology to feature","Conduct stakeholder interviews","Document user stories","Define success metrics","Review scope with Ellen","Sign off requirements","Brief dev team","Agree milestones"],
       checked:[],actDates:[],prog:60,note:"",comments:[]},
      {s:2,start:D(2026,5,15),end:D(2026,8,15),lbl:"Development",team:"Development",teams:["Development"],owner:"Jan & Daniel",role:"Build problem definition and framing feature.",
       deliverables:["Working problem definition module","Code review","Dev demo"],
       acts:["Set up feature branch","Build problem framing UI","Implement decision context and boundary tools","Build scope definition and success measures module","Integrate with DTrio workflow","Internal code review","Fix feedback","Build automated tests","Demo to Andrew and Ashley","Implement feedback"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:3,start:D(2026,8,15),end:D(2026,10,1),lbl:"Internal Testing",team:"Development",teams:["Management","Consultants","Development"],owner:"Selena & Ashley",role:"Test problem definition against DQ standards.",
       deliverables:["Test plan","Bug report","Sign-off"],
       acts:["Write test plan","Selena and Ashley test against DQ problem framing standards","Jan and Daniel test edge cases","Document issues","Prioritise fixes","Dev resolves bugs","Re-test","Performance testing","Andrew signs off","Ellen approves"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:4,start:D(2026,10,1),end:D(2026,11,15),lbl:"Soft Release",team:"Marketing",teams:["Marketing","Consultants"],owner:"David & Sam",role:"Pilot with clients.",
       deliverables:["Pilot feedback","Release comms"],
       acts:["Identify pilot clients","Prepare briefing","David and Sam onboard clients","Run pilot sessions","Collect feedback","Ray and Ashley analyse feedback","Document recommendations","Daniel implements fixes","Re-test","Sam prepares comms"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:5,start:D(2026,11,15),end:D(2027,1,15),lbl:"Hard Release",team:"All",teams:["Management","Consultants","Development","Marketing"],owner:"Ellen & Daniel",role:"Full release of problem definition feature.",
       deliverables:["Production deployment","Announcement","Post-release review"],
       acts:["Andrew final QA sign-off","Jan and Daniel deploy","Sam announces","Send release notes","Monitor post-launch","Dev on hotfix standby","Consultants support users","Collect metrics","Ellen leads review","Document lessons learned"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
    ]
  },
  {
    name:"Issue Categorization", sub:"Prioritise & structure issues to sharpen the frame", rag:"G",
    description:"Enables teams to categorise and prioritise issues raised so the most critical ones drive the decision frame.",
    purpose:"To bring structure and priority to the issues raised so teams focus on what matters most.",
    successCriteria:["All issues categorised","Priority issues identified","Categories linked to decision frame"],
    dependencies:["Issue Raising complete","Problem Definition approved"],
    bars:[
      {s:1,start:D(2026,6,1),end:D(2026,7,15),lbl:"Input",team:"Management,Consultants",teams:["Management","Consultants"],owner:"Ellen & Ray",role:"Define categorisation methodology and requirements.",
       deliverables:["Requirements doc","Category taxonomy","Scope sign-off"],
       acts:["Define feature brief for issue categorisation","Map DQ categorisation methodology","Conduct stakeholder interviews","Document user stories","Define success metrics","Review scope with Ellen","Sign off requirements","Brief Jan and Daniel","Agree milestones"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:2,start:D(2026,7,15),end:D(2026,10,15),lbl:"Development",team:"Development",teams:["Development"],owner:"Jan & Daniel",role:"Build issue categorisation feature.",
       deliverables:["Working categorisation module","Code review","Dev demo"],
       acts:["Set up feature branch","Build categorisation UI and tagging system","Implement priority scoring logic","Build category dashboard and filters","Integrate with Issue Raising module","Internal code review","Fix feedback","Build automated tests","Demo to Selena and Ashley","Implement feedback"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:3,start:D(2026,10,15),end:D(2026,12,1),lbl:"Internal Testing",team:"Development",teams:["Management","Consultants","Development"],owner:"Ashley & Andrew",role:"Test categorisation against DQ standards.",
       deliverables:["Test plan","Bug report","Sign-off"],
       acts:["Write test plan","Ashley and Andrew test against DQ standards","Jan and Daniel test edge cases","Document issues","Prioritise fixes","Dev resolves bugs","Re-test","Performance testing","Ray signs off on methodology","Ellen approves"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:4,start:D(2026,12,1),end:D(2027,1,1),lbl:"Soft Release",team:"Marketing",teams:["Marketing","Consultants"],owner:"Sam & David",role:"Pilot with clients.",
       deliverables:["Pilot feedback","Release comms"],
       acts:["Identify pilot clients","Prepare briefing","Sam and David onboard clients","Run pilot sessions","Collect feedback","Selena analyses feedback","Document recommendations","Daniel implements fixes","Re-test","Sam prepares comms"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:5,start:D(2027,1,1),end:D(2027,2,15),lbl:"Hard Release",team:"All",teams:["Management","Consultants","Development","Marketing"],owner:"Ellen & Jan",role:"Full release of issue categorisation.",
       deliverables:["Production deployment","Announcement","Post-release review"],
       acts:["Andrew final QA sign-off","Jan and Daniel deploy","Sam announces","Send release notes","Monitor post-launch","Dev on hotfix standby","Ray and Ashley support users","Collect metrics","Ellen leads review","Document lessons learned"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
    ]
  },
  {
    name:"Decision Hierarchy", sub:"Focus on the right decisions now — defer the rest", rag:"G",
    description:"Helps teams map and prioritise decisions into a hierarchy so they focus on what needs to be decided now.",
    purpose:"To give teams a structured view of which decisions are in-scope, which are off-the-table, and which can be deferred.",
    successCriteria:["All decisions mapped","Hierarchy levels defined","Team aligned on in-scope decisions"],
    dependencies:["Issue Categorization complete","Problem Definition approved"],
    bars:[
      {s:1,start:D(2026,6,1),end:D(2026,7,15),lbl:"Input",team:"Management,Consultants",teams:["Management","Consultants"],owner:"Ellen & Selena",role:"Define decision hierarchy methodology and requirements.",
       deliverables:["Requirements doc","Decision hierarchy framework","Scope sign-off"],
       acts:["Define feature brief for decision hierarchy tool","Map DQ decision hierarchy methodology","Conduct stakeholder interviews","Document user stories","Define success metrics","Review scope with Ellen","Sign off requirements","Brief Jan and Daniel","Agree milestones"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:2,start:D(2026,7,15),end:D(2026,10,15),lbl:"Development",team:"Development",teams:["Development"],owner:"Jan & Daniel",role:"Build decision hierarchy feature.",
       deliverables:["Working hierarchy module","Code review","Dev demo"],
       acts:["Set up feature branch","Build decision hierarchy visualisation UI","Implement decision level classification logic","Build drag-and-drop hierarchy organiser","Integrate with DTrio decision frame","Internal code review","Fix feedback","Build automated tests","Demo to Andrew and Ray","Implement feedback"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:3,start:D(2026,10,15),end:D(2026,12,1),lbl:"Internal Testing",team:"Development",teams:["Management","Consultants","Development"],owner:"Andrew & Ray",role:"Test hierarchy against DQ standards.",
       deliverables:["Test plan","Bug report","Sign-off"],
       acts:["Write test plan","Andrew and Ray test against DQ hierarchy standards","Jan and Daniel test edge cases","Document issues","Prioritise fixes","Dev resolves bugs","Re-test","Performance testing","Selena signs off on methodology","Ellen approves"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:4,start:D(2026,12,1),end:D(2027,1,1),lbl:"Soft Release",team:"Marketing",teams:["Marketing","Consultants"],owner:"David & Sam",role:"Pilot with clients.",
       deliverables:["Pilot feedback","Release comms"],
       acts:["Identify pilot clients","Prepare briefing","David and Sam onboard clients","Run pilot sessions","Collect feedback","Ashley and Selena analyse feedback","Document recommendations","Jan implements fixes","Re-test","Sam prepares comms"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:5,start:D(2027,1,1),end:D(2027,2,28),lbl:"Hard Release",team:"All",teams:["Management","Consultants","Development","Marketing"],owner:"Ellen & Daniel",role:"Full release of decision hierarchy.",
       deliverables:["Production deployment","Announcement","Post-release review"],
       acts:["Andrew final QA sign-off","Jan and Daniel deploy","Sam announces","Send release notes","Monitor post-launch","Dev on hotfix standby","Consultants support users","Collect metrics","Ellen leads review","Document lessons learned"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
    ]
  },
  {
    name:"Strategy Table", sub:"Generate & evaluate alternatives for the decision", rag:"G",
    description:"Enables teams to generate, organise and evaluate strategic alternatives against the decision criteria.",
    purpose:"To ensure all viable strategic options are considered before a decision is made.",
    successCriteria:["All alternatives generated","Alternatives evaluated against criteria","Best strategy identified","Team aligned on recommendation"],
    dependencies:["Decision Hierarchy complete","Issue Categorization approved"],
    bars:[
      {s:1,start:D(2026,8,1),end:D(2026,9,15),lbl:"Input",team:"Management,Consultants",teams:["Management","Consultants"],owner:"Ellen & Andrew",role:"Define strategy table methodology and requirements.",
       deliverables:["Requirements doc","Strategy framework","Scope sign-off"],
       acts:["Define feature brief for strategy table tool","Map DQ strategy table methodology","Conduct stakeholder interviews","Document user stories","Define success metrics","Review scope with Ellen","Sign off requirements","Brief Jan and Daniel","Agree milestones"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:2,start:D(2026,9,15),end:D(2026,11,15),lbl:"Development",team:"Development",teams:["Development"],owner:"Jan & Daniel",role:"Build strategy table feature.",
       deliverables:["Working strategy table module","Code review","Dev demo"],
       acts:["Set up feature branch","Build strategy table canvas UI","Implement alternative generation and scoring logic","Build criteria weighting and evaluation engine","Integrate with Decision Hierarchy and Issue modules","Internal code review","Fix feedback","Build automated tests","Demo to Ashley and Selena","Implement feedback"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:3,start:D(2026,11,15),end:D(2026,12,31),lbl:"Internal Testing",team:"Development",teams:["Management","Consultants","Development"],owner:"Selena & Ashley",role:"Test strategy table against DQ standards.",
       deliverables:["Test plan","Bug report","Sign-off"],
       acts:["Write test plan","Selena and Ashley test against DQ strategy standards","Jan and Daniel test edge cases","Document issues","Prioritise fixes","Dev resolves bugs","Re-test","Performance testing","Andrew signs off on methodology","Ellen approves"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:4,start:D(2026,12,15),end:D(2027,1,15),lbl:"Soft Release",team:"Marketing",teams:["Marketing","Consultants"],owner:"Sam & David",role:"Pilot with clients.",
       deliverables:["Pilot feedback","Release comms"],
       acts:["Identify pilot clients","Prepare briefing","Sam and David onboard clients","Run pilot sessions","Collect structured feedback","Ray and Ashley analyse feedback","Document recommendations","Daniel implements fixes","Re-test","Sam prepares launch comms"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
      {s:5,start:D(2027,1,15),end:D(2027,3,1),lbl:"Hard Release",team:"All",teams:["Management","Consultants","Development","Marketing"],owner:"Ellen & Andrew",role:"Full release of strategy table.",
       deliverables:["Production deployment","Announcement","Post-release review"],
       acts:["Andrew final QA sign-off","Jan and Daniel deploy to production","Sam publishes announcement","Send release notes to all users","Monitor for critical issues","Dev on hotfix standby","All consultants support users","Collect post-release metrics","Ellen leads post-release review","Document lessons learned"],
       checked:[],actDates:[],prog:0,note:"",comments:[]},
    ]
  },
];
// ─── STORAGE KEY ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "dtrio-roadmap-v1";

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [envs, setEnvs] = useState(null);
  const [loading, setLoading] = useState(true);
  const saving = false; // simplified
  const [lastSaved, setLastSaved] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);
  // ganttRef removed
  const [userName, setUserName] = useState(() => localStorage.getItem("dtrio-username") || "");
  const [showNamePrompt, setShowNamePrompt] = useState(() => !localStorage.getItem("dtrio-username"));
  const [nameInput, setNameInput] = useState("");
  const [editLog, setEditLog] = useState(() => { try { return JSON.parse(localStorage.getItem("dtrio-editlog") || "[]"); } catch { return []; } });
  const [showEditLog, setShowEditLog] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // {envIdx, barIdx}
  const [activeTab, setActiveTab] = useState("tasks");
  const [activeTeam] = useState("all");
  const [activeStages, setActiveStages] = useState(new Set([1,2,3,4,5]));
  const [snapDate, setSnapDate] = useState(null);
  const [view, setView] = useState(window.innerWidth < 768 ? "mytasks" : "gantt"); // gantt | board
  const [ganttZoom, setGanttZoom] = useState("month"); // month | week | day
  const [milestones, setMilestones] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dtrio-milestones-v2") || "null") || [
      // Uncertainty Assessment Tool (ei:0)
      {id:1,  ei:0, bi:0, name:"Requirements Sign-off",   date:"2026-02-28", color:"#1e3a6e"},
      {id:2,  ei:0, bi:1, name:"Dev Complete",            date:"2026-03-31", color:"#00a882"},
      {id:3,  ei:0, bi:2, name:"QA Sign-off",             date:"2026-04-30", color:"#cc2b24"},
      {id:4,  ei:0, bi:3, name:"Pilot Feedback Due",      date:"2026-06-30", color:"#d4961a"},
      {id:5,  ei:0, bi:4, name:"Hard Release",            date:"2026-07-31", color:"#7c44d4"},
      // Issue Raising (ei:1)
      {id:6,  ei:1, bi:0, name:"Requirements Sign-off",   date:"2026-05-31", color:"#1e3a6e"},
      {id:7,  ei:1, bi:1, name:"Dev Complete",            date:"2026-08-15", color:"#00a882"},
      {id:8,  ei:1, bi:2, name:"QA Sign-off",             date:"2026-10-01", color:"#cc2b24"},
      {id:9,  ei:1, bi:3, name:"Pilot Feedback Due",      date:"2026-11-15", color:"#d4961a"},
      {id:10, ei:1, bi:4, name:"Hard Release",            date:"2027-01-15", color:"#7c44d4"},
      // Problem Definition (ei:2)
      {id:11, ei:2, bi:0, name:"Requirements Sign-off",   date:"2026-05-31", color:"#1e3a6e"},
      {id:12, ei:2, bi:1, name:"Dev Complete",            date:"2026-08-15", color:"#00a882"},
      {id:13, ei:2, bi:2, name:"QA Sign-off",             date:"2026-10-01", color:"#cc2b24"},
      {id:14, ei:2, bi:3, name:"Pilot Feedback Due",      date:"2026-11-15", color:"#d4961a"},
      {id:15, ei:2, bi:4, name:"Hard Release",            date:"2027-01-15", color:"#7c44d4"},
      // Issue Categorization (ei:3)
      {id:16, ei:3, bi:0, name:"Requirements Sign-off",   date:"2026-07-15", color:"#1e3a6e"},
      {id:17, ei:3, bi:1, name:"Dev Complete",            date:"2026-10-15", color:"#00a882"},
      {id:18, ei:3, bi:2, name:"QA Sign-off",             date:"2026-12-01", color:"#cc2b24"},
      {id:19, ei:3, bi:3, name:"Pilot Feedback Due",      date:"2027-01-01", color:"#d4961a"},
      {id:20, ei:3, bi:4, name:"Hard Release",            date:"2027-02-15", color:"#7c44d4"},
      // Decision Hierarchy (ei:4)
      {id:21, ei:4, bi:0, name:"Requirements Sign-off",   date:"2026-07-15", color:"#1e3a6e"},
      {id:22, ei:4, bi:1, name:"Dev Complete",            date:"2026-10-15", color:"#00a882"},
      {id:23, ei:4, bi:2, name:"QA Sign-off",             date:"2026-12-01", color:"#cc2b24"},
      {id:24, ei:4, bi:3, name:"Pilot Feedback Due",      date:"2027-01-01", color:"#d4961a"},
      {id:25, ei:4, bi:4, name:"Hard Release",            date:"2027-02-28", color:"#7c44d4"},
      // Strategy Table (ei:5)
      {id:26, ei:5, bi:0, name:"Requirements Sign-off",   date:"2026-09-15", color:"#1e3a6e"},
      {id:27, ei:5, bi:1, name:"Dev Complete",            date:"2026-11-15", color:"#00a882"},
      {id:28, ei:5, bi:2, name:"QA Sign-off",             date:"2026-12-31", color:"#cc2b24"},
      {id:29, ei:5, bi:3, name:"Pilot Feedback Due",      date:"2027-01-15", color:"#d4961a"},
      {id:30, ei:5, bi:4, name:"Hard Release",            date:"2027-03-01", color:"#7c44d4"},
    ]; } catch { return []; }
  });
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [showMilestones, setShowMilestones] = useState(true);
  const [teamPanel, setTeamPanel] = useState(null); // null | "Management" | "Dev" | "Marketing" | "All"
  const [dragState, setDragState] = useState(null); // {ei, bi, startX, origStart, origEnd}
  const [pilotCompanies, setPilotCompanies] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dtrio-pilot") || "null") || [
      { id:1, name:"Woodside",   color:"#E8763A", contacts:[{name:"Anna Pechatnikov",role:"Key Contact"}], stages:{outreach:"todo",planning:"todo",testing:"todo",debrief:"todo",closeout:"todo"}, notes:"" },
      { id:2, name:"Shell",      color:"#1E3A6E", contacts:[{name:"Jim Morgan",role:"Key Contact"}], stages:{outreach:"todo",planning:"todo",testing:"todo",debrief:"todo",closeout:"todo"}, notes:"Is Jim the appropriate person? Chuck, Pete W?" },
      { id:3, name:"OMV",        color:"#00A882", contacts:[{name:"Walter Kosi",role:"Key Contact"}], stages:{outreach:"todo",planning:"todo",testing:"todo",debrief:"todo",closeout:"todo"}, notes:"" },
      { id:4, name:"CNOOC",      color:"#7C44D4", contacts:[{name:"Andrea Dickens",role:"Key Contact"}], stages:{outreach:"todo",planning:"todo",testing:"todo",debrief:"todo",closeout:"todo"}, notes:"" },
      { id:5, name:"Collohuasi", color:"#2E7D32", contacts:[{name:"Mauricio Lira",role:"Key Contact"}], stages:{outreach:"todo",planning:"todo",testing:"todo",debrief:"todo",closeout:"todo"}, notes:"" },
      { id:6, name:"Chevron",    color:"#CC2B24", contacts:[{name:"Luis Mendoza",role:"Key Contact"}], stages:{outreach:"todo",planning:"todo",testing:"todo",debrief:"todo",closeout:"todo"}, notes:"" },
    ]; } catch { return []; }
  });
  const [addingCompany, setAddingCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({name:"",color:"#1E3A6E",contacts:[{name:"",role:""}]});
  const [expandedPilot, setExpandedPilot] = useState(null);
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [contacts, setContacts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dtrio-contacts") || "[]"); } catch { return []; }
  });
  const [emailjsConfig, setEmailjsConfig] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dtrio-emailjs") || '{"serviceId":"service_h49udk9","templateId":"template_e7k9lkp","publicKey":"mj8u2GOmVMejXO2Ya"}'); } catch { return {serviceId:"service_h49udk9",templateId:"template_e7k9lkp",publicKey:"mj8u2GOmVMejXO2Ya"}; }
  });
  const [alertLog, setAlertLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dtrio-alertlog") || "[]"); } catch { return []; }
  });
  const [newContact, setNewContact] = useState({name:"",email:"",team:"Management,Consultants"});
  const [, setUnreadAlerts] = useState(0);
  

  // ── LOAD FROM STORAGE ──────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      // Helper: merge saved Supabase state onto DEFAULT_ENVS structure
      const mergeFromRaw = (raw) => {
        const saved = JSON.parse(raw);
        return DEFAULT_ENVS.map((env, ei) => {
          const savedEnv = saved[ei];
          if (!savedEnv) return env;
          return {
            ...env,
            rag: savedEnv.rag ?? env.rag,
            bars: env.bars.map((bar, bi) => {
              const savedBar = savedEnv.bars?.[bi];
              if (!savedBar) return bar;
              return {
                ...bar,
                prog:       typeof savedBar.prog === "number" ? savedBar.prog : bar.prog,
                note:       savedBar.note      ?? bar.note,
                // Use Array.isArray check so empty arrays [] are preserved (not replaced with defaults)
                checked:    Array.isArray(savedBar.checked)  ? savedBar.checked  : bar.acts.map(() => false),
                actDates:   Array.isArray(savedBar.actDates) ? savedBar.actDates : bar.acts.map(() => null),
                acts:       Array.isArray(savedBar.acts)     ? savedBar.acts     : bar.acts,
                teams:      bar.teams, // always use DEFAULT teams
                avatarName: savedBar.avatarName ?? bar.avatarName ?? "",
                comments:   Array.isArray(savedBar.comments) ? savedBar.comments : [],
                start:      savedBar.start ? new Date(savedBar.start) : new Date(bar.start),
                end:        savedBar.end   ? new Date(savedBar.end)   : new Date(bar.end),
              };
            }),
          };
        });
      };

      // Safe fallback: only use defaults locally, NEVER write defaults back to Supabase
      const loadDefaults = () => DEFAULT_ENVS.map(e => ({
        ...e, bars: e.bars.map(b => ({
          ...b,
          checked: b.acts.map(() => false),
          actDates: b.acts.map(() => null),
          comments: [],
          avatarName: "",
        }))
      }));

      try {
        // Always load from Supabase first. Retry once on failure before falling back.
        let raw = await sbGet();
        if (!raw) {
          // Wait 1.5s and retry once — handles Supabase cold starts
          await new Promise(r => setTimeout(r, 1500));
          raw = await sbGet();
        }
        if (raw) {
          // Supabase has real data — merge it in
          setEnvs(mergeFromRaw(raw));
        } else {
          // Truly no data in Supabase (first-ever load) — write defaults once
          const defaults = loadDefaults();
          const defaultPayload = defaults.map(env => ({
            rag: env.rag,
            bars: env.bars.map(b => ({
              prog: b.prog||0, note: b.note||"", checked: b.checked||[],
              acts: b.acts||[], actDates: b.actDates||[], teams: b.teams||[],
              avatarName: b.avatarName||"", comments: b.comments||[],
              start: b.start, end: b.end,
            }))
          }));
          await sbSet(JSON.stringify(defaultPayload));
          setEnvs(defaults);
        }
      } catch (e) {
        // Network error — show defaults locally but DO NOT write to Supabase
        console.warn("Supabase load failed, showing defaults locally:", e);
        setEnvs(loadDefaults());
      }
      setLoading(false);

      // Load all data from Supabase
      const pilotRaw = await sbGetKey("dtrio-pilot");
      if (pilotRaw) { try { setPilotCompanies(JSON.parse(pilotRaw)); } catch(e){} }
      const contactsRaw = await sbGetKey("dtrio-contacts");
      if (contactsRaw) { try { setContacts(JSON.parse(contactsRaw)); } catch(e){} }
      const editRaw = await sbGetKey("dtrio-editlog");
      if (editRaw) { try { setEditLog(JSON.parse(editRaw)); } catch(e){} }
      const milestonesRaw = await sbGetKey("dtrio-milestones-v2");
      if (milestonesRaw) { try { setMilestones(JSON.parse(milestonesRaw)); } catch(e){} }
      const emailjsRaw = await sbGetKey("dtrio-emailjs");
      if (emailjsRaw) { try { setEmailjsConfig(JSON.parse(emailjsRaw)); } catch(e){} }

    })();
  }, []);

  // ── LIVE TRACKING — Realtime + 10s backup poll ─────────────────────────────
  useEffect(() => { setLastSynced(new Date()); }, []);

  useEffect(() => {
    if (!envs) return;

    const mergeData = (raw) => {
      try {
        const saved = JSON.parse(raw);
        setEnvs(prev => prev.map((env, ei) => {
          const savedEnv = saved[ei];
          if (!savedEnv) return env;
          return {
            ...env,
            rag: savedEnv.rag ?? env.rag,
            bars: env.bars.map((bar, bi) => {
              const savedBar = savedEnv.bars?.[bi];
              if (!savedBar) return bar;
              return {
                ...bar,
                prog:       typeof savedBar.prog === "number" ? savedBar.prog : bar.prog,
                note:       savedBar.note      ?? bar.note,
                checked:    Array.isArray(savedBar.checked)  ? savedBar.checked  : bar.checked,
                actDates:   Array.isArray(savedBar.actDates) ? savedBar.actDates : bar.acts.map(()=>null),
                acts:       Array.isArray(savedBar.acts)     ? savedBar.acts     : bar.acts,
                teams:      bar.teams,
                avatarName: savedBar.avatarName ?? bar.avatarName ?? "",
                comments:   Array.isArray(savedBar.comments) ? savedBar.comments : bar.comments ?? [],
                start:      savedBar.start ? new Date(savedBar.start) : bar.start,
                end:        savedBar.end   ? new Date(savedBar.end)   : bar.end,
              };
            }),
          };
        }));
        setLastSynced(new Date());
      } catch(e) {}
    };

    // Realtime subscription for instant updates
    let channel = null;
    if (supabaseClient) {
      channel = supabaseClient
        .channel('roadmap-realtime')
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'roadmap_state', filter: `id=eq.${SB_ID}` },
          (payload) => { if (payload.new?.state) mergeData(payload.new.state); }
        )
        .subscribe();
    }

    // Backup poll every 10 seconds
    const interval = setInterval(async () => {
      try {
        const raw = await sbGet();
        if (raw) mergeData(raw);
        const pilotRaw = await sbGetKey("dtrio-pilot");
        if (pilotRaw) { try { setPilotCompanies(JSON.parse(pilotRaw)); } catch(e){} }
        const contactsRaw = await sbGetKey("dtrio-contacts");
        if (contactsRaw) { try { setContacts(JSON.parse(contactsRaw)); } catch(e){} }
        const milestonesRaw = await sbGetKey("dtrio-milestones-v2");
        if (milestonesRaw) { try { setMilestones(JSON.parse(milestonesRaw)); } catch(e){} }
      } catch(e) {}
    }, 10000);

    return () => {
      if (channel && supabaseClient) supabaseClient.removeChannel(channel);
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!envs]);

  // ── ALERT ENGINE ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!envs || contacts.length === 0) return;
    const now = new Date();
    const newAlerts = [];

    envs.forEach((env, ei) => {
      env.bars.forEach((bar, bi) => {
        const end = new Date(bar.end);
        const daysLeft = Math.ceil((end - now) / (1000*60*60*24));
        const alertKey = `deadline-${ei}-${bi}-${end.toISOString().slice(0,10)}`;
        const ragKey = `rag-${ei}-${bar.rag}`;
        const sentAlerts = JSON.parse(localStorage.getItem("dtrio-sent-alerts") || "{}");

        // Deadline alert: within 7 days and not 100% done
        if (daysLeft >= 0 && daysLeft <= 7 && bar.prog < 100 && !sentAlerts[alertKey]) {
          const teamMatch = (t) => {
            if (bar.team.includes("All")) return true;
            if (bar.teams ? bar.teams.includes(t) : bar.team.includes(t)) return true;
            return false;
          };
          const recipients = contacts.filter(c => teamMatch(c.team));
          if (recipients.length > 0) {
            const alert = { type:"deadline", env:env.name, stage:bar.lbl, daysLeft, end:end.toISOString(), recipients:recipients.map(c=>c.name), time: now.toISOString(), key: alertKey };
            newAlerts.push(alert);
            sentAlerts[alertKey] = true;
            // Fire EmailJS if configured
            if (emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey && window.emailjs) {
              recipients.forEach(c => {
                window.emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, {
                  to_name: c.name, to_email: c.email,
                  subject: `⚠ DTrio Alert: ${env.name} — ${bar.lbl} due in ${daysLeft} day${daysLeft===1?"":"s"}`,
                  message: `Hi ${c.name},

This is a reminder that the ${bar.lbl} stage of ${env.name} is due on ${end.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})} — ${daysLeft} day${daysLeft===1?"":"s"} away.

Current progress: ${bar.prog}%

View the roadmap: https://dtrioroadmap.netlify.app

DTrio Roadmap`
                }, emailjsConfig.publicKey).catch(()=>{});
              });
            }
          }
          localStorage.setItem("dtrio-sent-alerts", JSON.stringify(sentAlerts));
        }

        // RAG alert: At Risk or Off Track
        if ((bar.rag === "A" || bar.rag === "R") && !sentAlerts[ragKey]) {
          const teamMatch = (t) => {
            if (bar.team.includes("All")) return true;
            if (bar.teams ? bar.teams.includes(t) : bar.team.includes(t)) return true;
            return false;
          };
          const recipients = contacts.filter(c => teamMatch(c.team) || c.team === "Management");
          if (recipients.length > 0) {
            const ragLabel = bar.rag === "A" ? "At Risk 🟡" : "Off Track 🔴";
            const alert = { type:"rag", env:env.name, stage:bar.lbl, rag:bar.rag, ragLabel, recipients:recipients.map(c=>c.name), time:now.toISOString(), key:ragKey };
            newAlerts.push(alert);
            sentAlerts[ragKey] = true;
            if (emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey && window.emailjs) {
              recipients.forEach(c => {
                window.emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, {
                  to_name: c.name, to_email: c.email,
                  subject: `${bar.rag==="R"?"🔴":"🟡"} DTrio Alert: ${env.name} — ${bar.lbl} is ${ragLabel}`,
                  message: `Hi ${c.name},

The ${bar.lbl} stage of ${env.name} has been marked as ${ragLabel}.

Immediate attention may be required.

View the roadmap: https://dtrioroadmap.netlify.app

DTrio Roadmap`
                }, emailjsConfig.publicKey).catch(()=>{});
              });
            }
          }
          localStorage.setItem("dtrio-sent-alerts", JSON.stringify(sentAlerts));
        }
      });
    });

    if (newAlerts.length > 0) {
      setAlertLog(prev => {
        const updated = [...newAlerts, ...prev].slice(0, 50);
        localStorage.setItem("dtrio-alertlog", JSON.stringify(updated));
        return updated;
      });
      setUnreadAlerts(n => n + newAlerts.length);
    }
  }, [envs, contacts, emailjsConfig]);

  // Load EmailJS SDK
  useEffect(() => {
    if (document.getElementById("emailjs-sdk")) return;
    const s = document.createElement("script");
    s.id = "emailjs-sdk";
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    s.onload = () => { if (emailjsConfig.publicKey) window.emailjs.init(emailjsConfig.publicKey); };
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (window.emailjs && emailjsConfig.publicKey) window.emailjs.init(emailjsConfig.publicKey);
  }, [emailjsConfig.publicKey]);

  // Load EmailJS SDK dynamically
  useEffect(() => {
    if (document.getElementById("emailjs-sdk")) return;
    const s = document.createElement("script");
    s.id = "emailjs-sdk";
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    s.onload = () => { if (window.emailjs && emailjsConfig.publicKey) window.emailjs.init(emailjsConfig.publicKey); };
    document.head.appendChild(s);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (window.emailjs && emailjsConfig.publicKey) window.emailjs.init(emailjsConfig.publicKey);
}, [emailjsConfig.publicKey]);

  // Save pilot companies when they change
  useEffect(() => { localStorage.setItem("dtrio-pilot", JSON.stringify(pilotCompanies)); sbSetKey("dtrio-pilot", JSON.stringify(pilotCompanies)); }, [pilotCompanies]);
  // Save milestones
  useEffect(() => { localStorage.setItem("dtrio-milestones-v2", JSON.stringify(milestones)); sbSetKey("dtrio-milestones-v2", JSON.stringify(milestones)); }, [milestones]);

  // Save contacts when they change
  useEffect(() => { localStorage.setItem("dtrio-contacts", JSON.stringify(contacts)); sbSetKey("dtrio-contacts", JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem("dtrio-emailjs", JSON.stringify(emailjsConfig)); sbSetKey("dtrio-emailjs", JSON.stringify(emailjsConfig)); }, [emailjsConfig]);

  // ── SAVE TO STORAGE (debounced) ────────────────────────────────────────────
  const persistSave = useCallback(async (newEnvs) => {
    try {
      const payload = newEnvs.map(env => ({
        rag: env.rag,
        bars: env.bars.map(b => ({
          prog: b.prog, note: b.note,
          checked: b.checked, acts: b.acts,
          actDates: b.actDates || [],
          teams: b.teams || [],
          avatarName: b.avatarName || "",
          comments: b.comments || [],
          start: b.start, end: b.end,
        })),
      }));
      const json = JSON.stringify(payload); await sbSet(json);
      // Stamp the edit in local log only (no separate Supabase call needed)
      const stamp = { by: localStorage.getItem("dtrio-username") || "Unknown", at: new Date().toISOString() };
      setEditLog(prev => { const next=[{by:stamp.by,at:stamp.at},...prev].slice(0,20); localStorage.setItem("dtrio-editlog",JSON.stringify(next)); sbSetKey("dtrio-editlog",JSON.stringify(next)); return next; });
      setLastSaved(new Date());
    } catch(e) { console.error("Save failed", e); }
  }, []);

  const updateEnvs = useCallback((updater) => {
    setEnvs(prev => {
      const next = updater(prev);
      persistSave(next);
      return next;
    });
  }, [persistSave]);

  // ── UPDATE HELPERS ─────────────────────────────────────────────────────────
  const updateBar = (ei, bi, patch) => updateEnvs(prev =>
    prev.map((env, i) => i !== ei ? env : {
      ...env,
      bars: env.bars.map((bar, j) => j !== bi ? bar : { ...bar, ...patch }),
    })
  );
  const updateEnv = (ei, patch) => updateEnvs(prev =>
    prev.map((env, i) => i !== ei ? env : { ...env, ...patch })
  );

  const toggleCheck = (ei, bi, ti) => {
    if (!envs) return;
    const bar = envs[ei].bars[bi];
    const newChecked = [...(bar.checked || bar.acts.map(() => false))];
    newChecked[ti] = !newChecked[ti];
    const done = newChecked.filter(Boolean).length;
    const prog = Math.round((done / bar.acts.length) * 100);
    updateBar(ei, bi, { checked: newChecked, prog });
  };

  const currentBar = activeModal ? envs?.[activeModal.ei]?.bars?.[activeModal.bi] : null;
  const currentEnv = activeModal ? envs?.[activeModal.ei] : null;

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:COLORS.bg,flexDirection:"column",gap:16}}>
      <div style={{width:36,height:36,border:`3px solid ${COLORS.border}`,borderTopColor:COLORS.s1,borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
      <div style={{fontSize:13,color:COLORS.muted}}>Loading DTrio Roadmap...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const overallPct = envs ? Math.round(envs.reduce((a,e) => a + e.bars.reduce((b,bar) => b + bar.prog/100, 0), 0) / envs.reduce((a,e) => a + e.bars.length, 0) * 100) : 0;

  return (
    <div style={{background:COLORS.bg,minHeight:"100vh",fontFamily:'"DM Sans",sans-serif',color:COLORS.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #dde2ef; border-radius: 3px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes overdue { 0%,100%{box-shadow:0 0 0 2px #dc2626} 50%{box-shadow:0 0 0 2px transparent} }
        .bar-el { cursor: grab; transition: filter .15s, transform .12s; }
        .bar-el:hover { filter: brightness(.88); transform: translateY(calc(-50% - 2px)); z-index: 5; overflow: visible !important; }
        .task-row { transition: border-color .2s, background .2s; }
        .task-row:focus-within { border-color: ${COLORS.s1} !important; background: white !important; }
        .btn-hover:hover { opacity: .88; transform: translateY(-1px); }
        .leg-item:hover { transform: translateY(-1px); }
        .snap-item:hover { border-color: ${COLORS.s1} !important; box-shadow: 0 2px 12px rgba(0,0,0,.08); transform: translateY(-1px); }
        .month-col { cursor: pointer; transition: background .15s; }
        .month-col:hover { background: rgba(30,58,110,.07) !important; }
        .month-col:hover .click-hint { opacity: 1 !important; }
        .kanban-card:hover { border-color: ${COLORS.s1} !important; box-shadow: 0 2px 12px rgba(0,0,0,.08); transform: translateY(-1px); cursor: pointer; }
        @media (max-width: 768px) {
          .dtrio-header { padding: 8px 12px !important; flex-wrap: nowrap !important; }
          .dtrio-header-left { display: none !important; }
          .dtrio-header-right { flex-wrap: nowrap !important; gap: 6px !important; }
          .dtrio-progress { margin: 6px 12px 0 !important; padding: 8px 12px !important; }
          .dtrio-toolbar { padding: 5px 12px !important; gap: 4px !important; overflow-x: auto !important; flex-wrap: nowrap !important; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
          .dtrio-toolbar::-webkit-scrollbar { display: none; }
          .dtrio-toolbar button { padding: 3px 7px !important; font-size: 9px !important; white-space: nowrap !important; }
          .dtrio-toolbar-team { padding: 5px 12px !important; gap: 4px !important; overflow-x: auto !important; flex-wrap: nowrap !important; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
          .dtrio-toolbar-team::-webkit-scrollbar { display: none; }
          .dtrio-toolbar-team button { white-space: nowrap !important; font-size: 11px !important; }
          .dtrio-view-toggle { display: none !important; }
          /* Gantt shown on mobile with horizontal scroll */
          .dtrio-tasks { padding: 10px 12px 80px !important; overflow-x: hidden !important; }
          .dtrio-board { margin: 8px 12px 80px !important; }
          .dtrio-pilot { margin: 8px 12px 80px !important; }
          .dtrio-mobile-tabs { display: flex !important; }
        }
        @media (min-width: 769px) { .dtrio-mobile-tabs { display: none !important; } }
        @media print {
          @page { size: A3 landscape; margin: 8mm; }
          .dtrio-toolbar, .dtrio-toolbar-team, .dtrio-header .dtrio-header-actions { display: none !important; }
          .dtrio-view-gantt { overflow: visible !important; margin: 0 !important; box-shadow: none !important; }
          [data-gantt-inner="true"] { min-width: unset !important; }
          body { overflow: visible !important; }
        }
      `}</style>

      {/* PAGE HEADER */}
      <div style={{padding:"18px 32px 14px",borderBottom:`1px solid ${COLORS.border}`,background:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}} className="dtrio-header">
        <div className="dtrio-header-left">
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.02em",color:COLORS.s1}}>Decision Frameworks</div>
            <div style={{fontSize:10,color:COLORS.muted,letterSpacing:".08em",textTransform:"uppercase",paddingLeft:10,borderLeft:`1px solid ${COLORS.border}`}}>Web Software Roadmap</div>
          </div>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:20,fontWeight:800,color:COLORS.text,letterSpacing:"-.01em"}}>Web Software <span style={{background:"linear-gradient(135deg,#1e3a6e,#cc2b24)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Release Gantt</span></div>
          <div style={{fontSize:11,color:COLORS.muted,marginTop:4}}>Click any bar for details · <span style={{color:COLORS.s2,fontWeight:500}}>changes save automatically</span></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          {saving && <span style={{fontSize:10,color:COLORS.muted,animation:"pulse 1s infinite"}}>Saving…</span>}
          {lastSaved && !saving && <span style={{fontSize:10,color:COLORS.ragG}}>✓ Saved {lastSaved.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"})}</span>}
          {editLog.length>0 && <span style={{fontSize:10,color:COLORS.muted,marginLeft:4}}>· by <span style={{fontWeight:600,color:COLORS.s1}}>{editLog[0]?.by}</span></span>}
          <button onClick={()=>setShowEditLog(p=>!p)} title="Edit history" style={{background:"none",border:`1px solid ${COLORS.border}`,borderRadius:7,padding:"3px 8px",cursor:"pointer",fontSize:12,color:COLORS.muted,marginLeft:4}}>📝</button>
          {lastSynced && <span style={{fontSize:10,color:COLORS.muted,marginLeft:6,display:"flex",alignItems:"center",gap:3}}><span style={{width:6,height:6,borderRadius:"50%",background:"#00a882",display:"inline-block",animation:"pulse 2s infinite"}} />Live · synced {lastSynced.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</span>}
         <NotificationBell envs={envs} />
          <button onClick={()=>setShowAlertPanel(true)} title="Team & Alert Settings" style={{background:"#fff",border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"5px 9px",cursor:"pointer",color:COLORS.muted,display:"inline-flex",alignItems:"center",gap:4,transition:"all .15s"}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>
          <span style={{fontSize:11,color:COLORS.muted,padding:"4px 10px",background:COLORS.faint,border:`1px solid ${COLORS.border}`,borderRadius:100}}>Dec 2025 – Jul 2027</span>
        </div>
      </div>

      {/* NAME PROMPT */}
      {showNamePrompt && (
        <div style={{position:"fixed",inset:0,background:"rgba(26,32,53,.6)",backdropFilter:"blur(4px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"#fff",borderRadius:16,padding:"32px 28px",maxWidth:400,width:"100%",boxShadow:"0 24px 80px rgba(0,0,0,.2)",animation:"fadeIn .2s ease"}}>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:20,fontWeight:800,color:COLORS.text,marginBottom:6}}>👋 Welcome to DTrio</div>
            <div style={{fontSize:13,color:COLORS.muted,marginBottom:20}}>So we can track who made changes, please enter your name. You'll only see this once.</div>
            <input
              autoFocus
              placeholder="e.g. Andrew Esiri"
              value={nameInput}
              onChange={e=>setNameInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&nameInput.trim()){ localStorage.setItem("dtrio-username",nameInput.trim()); setUserName(nameInput.trim()); setShowNamePrompt(false); } }}
              style={{width:"100%",padding:"10px 14px",border:`1.5px solid ${COLORS.border}`,borderRadius:9,fontSize:14,boxSizing:"border-box",marginBottom:12,outline:"none"}}
            />
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{ if(!nameInput.trim()) return; localStorage.setItem("dtrio-username",nameInput.trim()); setUserName(nameInput.trim()); setShowNamePrompt(false); }} style={{flex:1,padding:"10px",borderRadius:9,background:COLORS.s1,color:"#fff",border:"none",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                Let's go →
              </button>
              <button onClick={()=>{ localStorage.setItem("dtrio-username","Guest"); setUserName("Guest"); setShowNamePrompt(false); }} style={{padding:"10px 16px",borderRadius:9,background:COLORS.faint,color:COLORS.muted,border:`1px solid ${COLORS.border}`,fontSize:13,cursor:"pointer"}}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT LOG PANEL */}
      {showEditLog && (
        <div style={{position:"fixed",inset:0,zIndex:400,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingTop:70,paddingRight:32}} onClick={e=>e.target===e.currentTarget&&setShowEditLog(false)}>
          <div style={{width:340,maxHeight:"70vh",background:"#fff",borderRadius:14,boxShadow:"0 24px 80px rgba(0,0,0,.2)",display:"flex",flexDirection:"column",overflow:"hidden",animation:"fadeIn .2s ease"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${COLORS.border}`,background:COLORS.faint,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:14,fontWeight:800,color:COLORS.text}}>📝 Edit History</div>
              <button onClick={()=>setShowEditLog(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:COLORS.muted}}>×</button>
            </div>
            <div style={{overflowY:"auto",flex:1,padding:"10px 0"}}>
              {editLog.length===0 && <div style={{padding:"20px",textAlign:"center",color:COLORS.muted,fontSize:12}}>No edits recorded yet. Changes you make will appear here.</div>}
              {editLog.map((e,i)=>{
                const d=new Date(e.at);
                const mins=Math.round((Date.now()-d)/60000);
                const ago=mins<1?"just now":mins<60?`${mins}m ago`:mins<1440?`${Math.floor(mins/60)}h ago`:`${Math.floor(mins/1440)}d ago`;
                return (
                  <div key={i} style={{padding:"10px 18px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:COLORS.s1,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>{e.by.split(" ").map(w=>w[0]).slice(0,2).join("")}</span>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:COLORS.text}}>{e.by}</div>
                      <div style={{fontSize:10,color:COLORS.muted}}>made a change · {ago}</div>
                    </div>
                    <div style={{fontSize:10,color:COLORS.muted,textAlign:"right",flexShrink:0}}>
                      {d.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}<br/>{d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}
                    </div>
                  </div>
                );
              })}
            </div>
            {editLog.length>0 && (
              <div style={{padding:"10px 18px",borderTop:`1px solid ${COLORS.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:COLORS.muted}}>Last edit by <strong>{editLog[0]?.by}</strong></span>
                <button onClick={()=>{setEditLog([]);localStorage.removeItem("dtrio-editlog");}} style={{fontSize:10,color:"#cc2b24",background:"none",border:"none",cursor:"pointer"}}>Clear</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ALERT PANEL */}
      {showAlertPanel && (
        <div style={{position:"fixed",inset:0,zIndex:400,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingTop:70,paddingRight:32}} onClick={e=>e.target===e.currentTarget&&setShowAlertPanel(false)}>
          <div style={{width:420,maxHeight:"80vh",background:"#fff",borderRadius:14,boxShadow:"0 24px 80px rgba(0,0,0,.2)",display:"flex",flexDirection:"column",overflow:"hidden",animation:"fadeIn .2s ease"}}>
            {/* Panel Header */}
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${COLORS.border}`,background:COLORS.faint,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:800,color:COLORS.text}}>🔔 Alert Settings</div>
              <button onClick={()=>setShowAlertPanel(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:COLORS.muted}}>×</button>
            </div>
            <div style={{overflowY:"auto",flex:1}}>
              {/* Team Contacts */}
              <div style={{padding:"14px 18px 10px"}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:COLORS.muted,marginBottom:10}}>Team Contacts</div>
                {contacts.length === 0 && <div style={{fontSize:12,color:COLORS.muted,marginBottom:10}}>No contacts added yet.</div>}
                {contacts.map((c,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:8,background:COLORS.faint,marginBottom:6}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:COLORS.s1,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>{c.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</span>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:COLORS.text}}>{c.name}</div>
                      <div style={{fontSize:10,color:COLORS.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.email} · {c.team}</div>
                    </div>
                    <button onClick={()=>setContacts(prev=>prev.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",color:COLORS.muted,fontSize:16,lineHeight:1,padding:"0 2px"}}>×</button>
                  </div>
                ))}
                {/* Add contact form */}
                <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                  <input placeholder="Full name" value={newContact.name} onChange={e=>setNewContact(p=>({...p,name:e.target.value}))} style={{flex:"1 1 120px",padding:"6px 9px",border:`1px solid ${COLORS.border}`,borderRadius:7,fontSize:12,minWidth:0}} />
                  <input placeholder="Email address" value={newContact.email} onChange={e=>setNewContact(p=>({...p,email:e.target.value}))} style={{flex:"1 1 160px",padding:"6px 9px",border:`1px solid ${COLORS.border}`,borderRadius:7,fontSize:12,minWidth:0}} />
                  <select value={newContact.team} onChange={e=>setNewContact(p=>({...p,team:e.target.value}))} style={{padding:"6px 9px",border:`1px solid ${COLORS.border}`,borderRadius:7,fontSize:12,background:"#fff"}}>
                    <option>Management</option><option>Consultants</option><option>Development</option><option>Marketing</option><option>All</option>
                  </select>
                  <button onClick={()=>{
                    if(!newContact.name||!newContact.email) return;
                    setContacts(p=>[...p,{...newContact}]);
                    setNewContact({name:"",email:"",team:"Management,Consultants"});
                  }} style={{padding:"6px 14px",borderRadius:7,background:COLORS.s1,color:"#fff",border:"none",fontSize:12,fontWeight:600,cursor:"pointer"}}>Add</button>
                </div>
              </div>
              <div style={{borderTop:`1px solid ${COLORS.border}`,margin:"0 18px"}} />
              {/* EmailJS Config */}
              <div style={{padding:"14px 18px 10px"}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:COLORS.muted,marginBottom:4}}>EmailJS Config <span style={{fontSize:10,fontWeight:400,color:COLORS.muted}}>(optional — for email alerts)</span></div>
                <div style={{fontSize:11,color:COLORS.muted,marginBottom:8}}>Sign up free at <span style={{color:COLORS.s2}}>emailjs.com</span> → get Service ID, Template ID, Public Key</div>
                {[["serviceId","Service ID"],["templateId","Template ID"],["publicKey","Public Key"]].map(([k,lbl])=>(
                  <div key={k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontSize:11,color:COLORS.muted,width:90,flexShrink:0}}>{lbl}</span>
                    <input placeholder={`Your ${lbl}`} value={emailjsConfig[k]} onChange={e=>setEmailjsConfig(p=>({...p,[k]:e.target.value}))} style={{flex:1,padding:"5px 8px",border:`1px solid ${COLORS.border}`,borderRadius:7,fontSize:11}} />
                  </div>
                ))}
                {emailjsConfig.serviceId && <div style={{fontSize:11,color:"#00a882",marginTop:4}}>✓ EmailJS configured — emails will fire automatically</div>}
                {!emailjsConfig.serviceId && <div style={{fontSize:11,color:COLORS.muted,marginTop:4}}>Without EmailJS, alerts are in-app only (still logged below)</div>}
              </div>
              <div style={{borderTop:`1px solid ${COLORS.border}`,margin:"0 18px"}} />
              {/* Alert Log */}
              <div style={{padding:"14px 18px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:COLORS.muted}}>Alert Log ({alertLog.length})</div>
                  {alertLog.length>0&&<button onClick={()=>{setAlertLog([]);localStorage.removeItem("dtrio-alertlog");localStorage.removeItem("dtrio-sent-alerts");}} style={{fontSize:10,color:COLORS.muted,background:"none",border:"none",cursor:"pointer"}}>Clear all</button>}
                </div>
                {alertLog.length===0&&<div style={{fontSize:12,color:COLORS.muted}}>No alerts fired yet. Alerts appear here when deadlines are within 7 days or RAG status changes.</div>}
                {alertLog.map((a,i)=>(
                  <div key={i} style={{padding:"8px 10px",borderRadius:8,background:a.type==="rag"&&a.rag==="R"?"#fff5f5":a.type==="rag"?"#fffbeb":"#eff6ff",marginBottom:6,borderLeft:`3px solid ${a.type==="rag"&&a.rag==="R"?"#cc2b24":a.type==="rag"?"#d4961a":"#3b82f6"}`}}>
                    <div style={{fontSize:12,fontWeight:600,color:COLORS.text}}>{a.type==="deadline"?`⏰ Deadline: ${a.env} — ${a.stage} (${a.daysLeft}d left)`:a.type==="rag"?`${a.rag==="R"?"🔴":"🟡"} RAG Alert: ${a.env} — ${a.stage} is ${a.ragLabel}`:a.env}</div>
                    <div style={{fontSize:10,color:COLORS.muted,marginTop:2}}>Sent to: {a.recipients?.join(", ")||"—"} · {new Date(a.time).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROGRESS OVERVIEW */}
      <div style={{margin:window.innerWidth<700?"8px 8px 0":"12px 32px 0",background:"#fff",border:`1px solid ${COLORS.border}`,borderRadius:12,padding:window.innerWidth<700?"10px 12px":"12px 18px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",animation:"fadeIn .4s ease"}}>
        <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:COLORS.text,whiteSpace:"nowrap"}}>Overall Progress</div>
        <div style={{flex:1,minWidth:120,height:8,background:COLORS.faint,borderRadius:4,overflow:"hidden",border:`1px solid ${COLORS.border}`}}>
          <div style={{height:"100%",borderRadius:4,background:`linear-gradient(90deg,${COLORS.s1},${COLORS.s2})`,width:`${overallPct}%`,transition:"width .5s"}} />
        </div>
        <div style={{fontFamily:"Syne,sans-serif",fontSize:16,fontWeight:800,color:COLORS.s1,minWidth:36}}>{overallPct}%</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",width:"100%"}}>
          {envs?.map((env,i) => {
            const ep = Math.round(env.bars.reduce((a,b) => a+b.prog,0)/env.bars.length);
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:COLORS.muted}}>
                <span style={{fontWeight:600,color:COLORS.text}}>{env.name.split(" ")[0]}</span>
                <div style={{width:50,height:4,background:COLORS.border,borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:2,background:ENV_COLORS[i],width:`${ep}%`}} />
                </div>
                <span>{ep}%</span>
                <RagPill rag={env.rag} onClick={() => { setActiveModal({ei:i,bi:0}); setActiveTab("tasks"); }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="dtrio-toolbar" style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:6,padding:window.innerWidth<700?"8px 12px":"10px 32px",background:"#fff",borderBottom:`1px solid ${COLORS.border}`,animation:"fadeIn .4s .04s ease both"}}>
        <span style={{fontSize:10,fontWeight:600,letterSpacing:".09em",textTransform:"uppercase",color:COLORS.muted,marginRight:2}}>Stage:</span>
        {[1,2,3,4,5].map(s => (
          <button key={s} onClick={() => setActiveStages(prev => {
            if(prev.has(s) && prev.size===1) return prev;
            const n = new Set(prev);
            n.has(s) ? n.delete(s) : n.add(s);
            return n;
          })} className="leg-item" style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:100,fontSize:11,fontWeight:500,border:`1.5px solid`,cursor:"pointer",userSelect:"none",transition:"opacity .2s",opacity:activeStages.has(s)?1:.25,color:STAGE_COLORS[s],borderColor:s===1?COLORS.s1m:s===2?COLORS.s2m:s===3?COLORS.s3m:s===4?COLORS.s4m:COLORS.s5m,background:s===1?COLORS.s1l:s===2?COLORS.s2l:s===3?COLORS.s3l:s===4?COLORS.s4l:COLORS.s5l}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:STAGE_COLORS[s]}} />
            {["","①","②","③","④","⑤"][s]} {STAGE_NAMES[s]}
          </button>
        ))}

        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          {view==="gantt" && <button onClick={()=>{
            const el=document.getElementById("gantt-scroll");
            if(!el) return;
            const rangeStart=new Date(2025,11,1).getTime();
            const rangeEnd=new Date(2027,7,1).getTime();
            const now=Date.now();
            const pct=Math.max(0,Math.min(1,(now-rangeStart)/(rangeEnd-rangeStart)));
            const innerWidth=el.scrollWidth-180;
            el.scrollTo({left:Math.max(0,innerWidth*pct-el.clientWidth/2+90),behavior:"smooth"});
          }} style={{padding:"5px 14px",borderRadius:8,border:`1px solid ${COLORS.s1}`,background:"#fff",fontSize:11,fontWeight:700,color:COLORS.s1,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>
            📍 Today
          </button>}
          {view==="gantt" && <button onClick={()=>setShowMilestones(p=>!p)} style={{padding:"5px 12px",borderRadius:8,border:`1px solid ${COLORS.border}`,background:showMilestones?COLORS.s1:"#fff",color:showMilestones?"#fff":COLORS.muted,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .2s"}}>◆ {showMilestones?"Hide":"Show"}</button>}
          {view==="gantt" && <div style={{display:"flex",border:`1px solid ${COLORS.border}`,borderRadius:8,overflow:"hidden"}}>
            {[["month","Month"],["week","Week"],["day","Day"]].map(([z,l]) => (
              <button key={z} onClick={()=>setGanttZoom(z)} style={{padding:"4px 10px",border:"none",background:ganttZoom===z?COLORS.s1:"#fff",color:ganttZoom===z?"#fff":COLORS.muted,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .2s"}}>{l}</button>
            ))}
          </div>}
          <div className="dtrio-view-toggle" style={{display:"flex",border:`1px solid ${COLORS.border}`,borderRadius:8,overflow:"hidden"}}>
          {[["gantt","▤ Gantt"],["board","⊞ Board"],["pilot","🏢 Pilot"],["mytasks","Tasks"]].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)} style={{padding:"5px 12px",border:"none",background:view===v?COLORS.s1:"#fff",color:view===v?"#fff":COLORS.muted,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .2s"}}>
              {l}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* TEAM FILTER ROW */}
      <div className="dtrio-toolbar-team" style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:6,padding:window.innerWidth<700?"6px 12px":"8px 32px",background:"#fff",borderBottom:`1px solid ${COLORS.border}`}}>
        <span style={{fontSize:10,fontWeight:600,letterSpacing:".09em",textTransform:"uppercase",color:COLORS.muted,marginRight:2}}>Team:</span>
        {[["All","All"],["Management","Management"],["Consultants","Consultants"],["Development","Development"],["Marketing","Marketing"]].map(([k,l]) => (
          <button key={k} onClick={() => { const next=teamPanel===l?null:l; setTeamPanel(next); if(next && view!=="mytasks") setTimeout(()=>{ const el=document.getElementById("team-timeline-panel"); if(el) el.scrollIntoView({behavior:"smooth",block:"start"}); },100); }} style={{padding:"4px 10px",borderRadius:100,fontSize:11,fontWeight:500,border:`1.5px solid ${teamPanel===l?COLORS.s1:COLORS.border}`,background:teamPanel===l?COLORS.s1:"#fff",color:teamPanel===l?"#fff":COLORS.muted,cursor:"pointer",transition:"all .2s",fontFamily:"DM Sans,sans-serif"}}>
            {l}
          </button>
        ))}
      </div>

      {view === "mytasks" && <MyTasks envs={envs} activeTeam={teamPanel} userName={userName} />}

      {/* GANTT VIEW */}
      {view === "pilot" && (
        <div style={{margin:"14px 32px 30px",animation:"fadeIn .4s ease"}}>
          {/* Pilot Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:20,fontWeight:800,color:COLORS.text}}>🏢 Pilot Client Testing Tracker</div>
              <div style={{fontSize:12,color:COLORS.muted,marginTop:2}}>{pilotCompanies.length} companies · Track stakeholder outreach through client close-out</div>
            </div>
            <button onClick={()=>setAddingCompany(p=>!p)} style={{padding:"7px 16px",borderRadius:9,background:COLORS.s1,color:"#fff",border:"none",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>+ Add Company</button>
          </div>

          {/* Add company form */}
          {addingCompany && (
            <div style={{background:"#fff",borderRadius:12,padding:"16px 18px",marginBottom:16,border:`1px solid ${COLORS.border}`,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
              <div style={{fontSize:12,fontWeight:700,color:COLORS.text,marginBottom:10}}>New Pilot Company</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                <input placeholder="Company name" value={newCompany.name} onChange={e=>setNewCompany(p=>({...p,name:e.target.value}))} style={{flex:"1 1 160px",padding:"7px 10px",border:`1px solid ${COLORS.border}`,borderRadius:7,fontSize:12}} />
                <input placeholder="Key contact name" value={newCompany.contacts[0].name} onChange={e=>setNewCompany(p=>({...p,contacts:[{...p.contacts[0],name:e.target.value}]}))} style={{flex:"1 1 160px",padding:"7px 10px",border:`1px solid ${COLORS.border}`,borderRadius:7,fontSize:12}} />
                <input placeholder="Role / title" value={newCompany.contacts[0].role} onChange={e=>setNewCompany(p=>({...p,contacts:[{...p.contacts[0],role:e.target.value}]}))} style={{flex:"1 1 120px",padding:"7px 10px",border:`1px solid ${COLORS.border}`,borderRadius:7,fontSize:12}} />
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11,color:COLORS.muted}}>Colour</span>
                  <input type="color" value={newCompany.color} onChange={e=>setNewCompany(p=>({...p,color:e.target.value}))} style={{width:36,height:34,border:`1px solid ${COLORS.border}`,borderRadius:7,cursor:"pointer",padding:2}} />
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{
                  if(!newCompany.name) return;
                  setPilotCompanies(p=>[...p,{id:Date.now(),...newCompany,stages:{outreach:"todo",planning:"todo",testing:"todo",debrief:"todo",closeout:"todo"},notes:""}]);
                  setNewCompany({name:"",color:"#1E3A6E",contacts:[{name:"",role:""}]});
                  setAddingCompany(false);
                }} style={{padding:"6px 16px",borderRadius:7,background:COLORS.s1,color:"#fff",border:"none",fontSize:12,fontWeight:600,cursor:"pointer"}}>Add Company</button>
                <button onClick={()=>setAddingCompany(false)} style={{padding:"6px 16px",borderRadius:7,background:"transparent",color:COLORS.muted,border:`1px solid ${COLORS.border}`,fontSize:12,cursor:"pointer"}}>Cancel</button>
              </div>
            </div>
          )}

          {/* Main tracker table */}
          {(() => {
            const PILOT_STAGES = [
              {key:"outreach",label:"Stakeholder Outreach",color:"#1E3A6E",tasks:["Identify key contact","Confirm they are the right person","Schedule outreach call","Send introduction email","Confirm participation"]},
              {key:"planning",label:"Testing Planning",color:"#00A882",tasks:["Who should be involved?","When should testing be completed?","How should they provide feedback?","How do we help them get started?"]},
              {key:"testing",label:"Testing",color:"#D4961A",tasks:["Monitor engagement","Redirect if needed","Offer support","Remind them of due date for feedback"]},
              {key:"debrief",label:"Planning Debrief",color:"#7C44D4",tasks:["What was the level of engagement?","How many tested?","General feedback","Brutal truths or critical insights","Actions","Communication back to testers and their org"]},
              {key:"closeout",label:"Client Close-Out",color:"#CC2B24",tasks:["Thank them for participating and provide next steps"]},
            ];
            const STATUS = {todo:{bg:"#F3F4F6",color:"#6B7280",label:"To Do"},inprogress:{bg:"#FFF7ED",color:"#D4961A",label:"In Progress"},done:{bg:"#ECFDF5",color:"#00A882",label:"Done"},blocked:{bg:"#FFF5F5",color:"#CC2B24",label:"Blocked"}};
            return (
              <div style={{background:"#fff",borderRadius:14,border:`1px solid ${COLORS.border}`,boxShadow:"0 4px 24px rgba(0,0,0,.06)",overflow:"hidden"}}>
                {/* Column headers */}
                <div style={{display:"grid",gridTemplateColumns:"200px repeat(5,1fr)",borderBottom:`2px solid ${COLORS.border}`,background:COLORS.faint}}>
                  <div style={{padding:"12px 16px",fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:COLORS.muted}}>Company</div>
                  {PILOT_STAGES.map(s=>(
                    <div key={s.key} style={{padding:"12px 10px",borderLeft:`1px solid ${COLORS.border}`,textAlign:"center"}}>
                      <div style={{fontSize:10,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",color:s.color}}>{s.label}</div>
                      <div style={{fontSize:9,color:COLORS.muted,marginTop:2}}>{s.tasks.length} tasks</div>
                    </div>
                  ))}
                </div>

                {/* Company rows */}
                {pilotCompanies.map((co,ci)=>(
                  <div key={co.id} style={{borderBottom:`1px solid ${COLORS.border}`}}>
                    {/* Main row */}
                    <div style={{display:"grid",gridTemplateColumns:"200px repeat(5,1fr)",cursor:"pointer",background:expandedPilot===co.id?COLORS.faint:"#fff",transition:"background .15s"}} onClick={()=>setExpandedPilot(expandedPilot===co.id?null:co.id)} onMouseEnter={e=>{if(expandedPilot!==co.id)e.currentTarget.style.background=COLORS.faint}} onMouseLeave={e=>{if(expandedPilot!==co.id)e.currentTarget.style.background="#fff"}}>
                      {/* Company name cell */}
                      <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:32,height:32,borderRadius:8,background:co.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <span style={{fontSize:12,fontWeight:800,color:"#fff"}}>{co.name.slice(0,2).toUpperCase()}</span>
                        </div>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:COLORS.text}}>{co.name}</div>
                          <div style={{fontSize:10,color:COLORS.muted}}>{co.contacts[0]?.name||"No contact"}</div>
                        </div>
                        <span style={{marginLeft:"auto",fontSize:12,color:COLORS.muted}}>{expandedPilot===co.id?"▲":"▼"}</span>
                      </div>
                      {/* Stage status cells */}
                      {PILOT_STAGES.map(s=>{
                        const st = co.stages[s.key]||"todo";
                        const sc = STATUS[st];
                        const tasks = co.stageTasks?.[s.key] || s.tasks.map(()=>false);
                        const done = tasks.filter(Boolean).length;
                        return (
                          <div key={s.key} style={{padding:"14px 10px",borderLeft:`1px solid ${COLORS.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
                            <span onClick={e=>{
                              e.stopPropagation();
                              const order=["todo","inprogress","done","blocked"];
                              const next=order[(order.indexOf(st)+1)%order.length];
                              setPilotCompanies(prev=>prev.map((c,i)=>i!==ci?c:{...c,stages:{...c.stages,[s.key]:next}}));
                            }} style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,background:sc.bg,color:sc.color,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>{sc.label}</span>
                            <div style={{fontSize:9,color:COLORS.muted}}>{done}/{s.tasks.length} tasks</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Expanded detail */}
                    {expandedPilot===co.id && (
                      <div style={{padding:"16px 20px",background:"#FAFBFF",borderTop:`1px solid ${COLORS.border}`}}>
                        {/* Task checklists per stage */}
                        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16}}>
                          {PILOT_STAGES.map(s=>{
                            const checked = co.stageTasks?.[s.key] || s.tasks.map(()=>false);
                            const done = checked.filter(Boolean).length;
                            return (
                              <div key={s.key} style={{background:"#fff",borderRadius:10,padding:"12px 14px",border:`1px solid ${COLORS.border}`,boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
                                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                                  <div style={{fontSize:10,fontWeight:700,color:s.color,letterSpacing:".06em",textTransform:"uppercase"}}>{s.label}</div>
                                  <span style={{fontSize:9,color:done===s.tasks.length&&done>0?"#00A882":COLORS.muted,fontWeight:600}}>{done}/{s.tasks.length}</span>
                                </div>
                                {s.tasks.map((task,ti)=>(
                                  <div key={ti} style={{display:"flex",alignItems:"flex-start",gap:7,marginBottom:6,cursor:"pointer"}} onClick={()=>setPilotCompanies(prev=>prev.map((c,i)=>{
                                    if(i!==ci) return c;
                                    const cur = c.stageTasks?.[s.key]||s.tasks.map(()=>false);
                                    const next=[...cur]; next[ti]=!next[ti];
                                    return {...c,stageTasks:{...c.stageTasks,[s.key]:next}};
                                  }))}>
                                    <div style={{width:14,height:14,borderRadius:4,border:`2px solid ${checked[ti]?s.color:COLORS.border}`,background:checked[ti]?s.color:"#fff",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
                                      {checked[ti]&&<span style={{color:"#fff",fontSize:9,lineHeight:1,fontWeight:700}}>✓</span>}
                                    </div>
                                    <span style={{fontSize:11,color:checked[ti]?COLORS.muted:COLORS.text,textDecoration:checked[ti]?"line-through":"none",lineHeight:1.4}}>{task}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>

                        {/* Bottom row: contacts + notes + actions */}
                        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                          <div style={{flex:"0 0 200px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:COLORS.muted,marginBottom:6,letterSpacing:".07em",textTransform:"uppercase"}}>Contacts</div>
                            {co.contacts.map((ct,j)=>(
                              <div key={j} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                                <div style={{width:28,height:28,borderRadius:"50%",background:co.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                  <span style={{fontSize:10,fontWeight:700,color:"#fff"}}>{ct.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</span>
                                </div>
                                <div style={{flex:1}}>
                                  <div style={{fontSize:12,fontWeight:600,color:COLORS.text}}>{ct.name}</div>
                                  <div style={{fontSize:10,color:COLORS.muted}}>{ct.role}</div>
                                </div>
                                <button onClick={()=>setPilotCompanies(prev=>prev.map((c,i)=>i!==ci?c:{...c,contacts:c.contacts.filter((_,k)=>k!==j)}))} style={{background:"none",border:"none",cursor:"pointer",color:COLORS.muted,fontSize:16,padding:"0 4px"}}>×</button>
                              </div>
                            ))}
                            <button onClick={()=>{const name=prompt("Contact name:");const role=prompt("Role:");if(name)setPilotCompanies(prev=>prev.map((c,i)=>i!==ci?c:{...c,contacts:[...c.contacts,{name,role:role||""}]}));}} style={{fontSize:11,color:COLORS.s2,background:"none",border:"none",cursor:"pointer",padding:0,marginTop:2}}>+ Add contact</button>
                          </div>
                          <div style={{flex:"1 1 260px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:COLORS.muted,marginBottom:6,letterSpacing:".07em",textTransform:"uppercase"}}>Notes & Feedback</div>
                            <textarea value={co.notes} onChange={e=>setPilotCompanies(prev=>prev.map((c,i)=>i!==ci?c:{...c,notes:e.target.value}))} placeholder="Add notes, blockers, feedback from this client..." style={{width:"100%",minHeight:80,padding:"8px 10px",border:`1px solid ${COLORS.border}`,borderRadius:8,fontSize:12,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}} />
                          </div>
                          <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
                            <button onClick={()=>setPilotCompanies(prev=>prev.filter((_,i)=>i!==ci))} style={{padding:"6px 14px",borderRadius:7,background:"transparent",color:"#CC2B24",border:"1px solid #CC2B24",fontSize:11,cursor:"pointer",fontWeight:600}}>Remove Company</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {pilotCompanies.length===0&&<div style={{padding:"48px 20px",textAlign:"center",color:COLORS.muted}}>No pilot companies yet. Click "+ Add Company" to get started.</div>}
              </div>
            );
          })()}
        </div>
      )}

      {view === "gantt" && (
        <div
          onMouseMove={e => {
            if (!dragState) return;
            const { ei, bi, startX, origStart, origEnd } = dragState;
            const totalMs = MONTHS[MONTHS.length-1] - MONTHS[0];
            const pxPerMs = (e.currentTarget.getBoundingClientRect().width - 180) / totalMs;
            const deltaMs = Math.round((e.clientX - startX) / pxPerMs / (1000*60*60*24*30)) * (1000*60*60*24*30);
            const newStart = new Date(origStart.getTime() + deltaMs);
            const newEnd = new Date(origEnd.getTime() + deltaMs);
            updateBar(ei, bi, {start: newStart, end: newEnd});
          }}
          onMouseUp={() => { if(dragState) { setDragState(null); } }}
          onMouseLeave={() => { if(dragState) setDragState(null); }}
          id="gantt-scroll" className="dtrio-view-gantt" ref={el => {
            if (el && !el.dataset.scrolled) {
              el.dataset.scrolled = "1";
              setTimeout(() => {
                const totalMs = RANGE_END - RANGE_START;
                const todayMs = TODAY - RANGE_START;
                const pct = Math.max(0, Math.min(1, todayMs / totalMs));
                el.scrollLeft = (el.scrollWidth - 180) * pct - el.clientWidth / 2;
              }, 100);
            }
          }} style={{margin:window.innerWidth<700?"8px 8px 20px":"14px 32px 30px",background:"#fff",border:`1px solid ${COLORS.border}`,borderRadius:14,overflowX:"auto",boxShadow:"0 4px 24px rgba(0,0,0,.06)",animation:"fadeIn .4s .08s ease both",cursor:dragState?"grabbing":"default"}}>
          <div data-gantt-inner="true" style={{minWidth:900}}>
            {/* Dynamic Gantt with Month/Week/Day zoom */}
            {(() => {
              const zoomStart = ganttZoom === "day"
                ? new Date(TODAY.getFullYear(), TODAY.getMonth()-1, 1)
                : ganttZoom === "week"
                ? new Date(TODAY.getFullYear(), TODAY.getMonth()-2, 1)
                : RANGE_START;
              const zoomEnd = ganttZoom === "day"
                ? new Date(TODAY.getFullYear(), TODAY.getMonth()+3, 31)
                : ganttZoom === "week"
                ? new Date(TODAY.getFullYear(), TODAY.getMonth()+12, 0)
                : RANGE_END;
              const zPct = d => Math.min(100, Math.max(0, (new Date(d) - zoomStart) / (zoomEnd - zoomStart) * 100));

              const cols = [];
              if (ganttZoom === "month") {
                let c = new Date(zoomStart);
                while (c < zoomEnd) { cols.push(new Date(c)); c.setMonth(c.getMonth()+1); }
              } else if (ganttZoom === "week") {
                let c = new Date(zoomStart);
                c.setDate(c.getDate() - c.getDay() + 1);
                while (c < zoomEnd) { cols.push(new Date(c)); c.setDate(c.getDate()+7); }
              } else {
                let c = new Date(zoomStart);
                while (c <= zoomEnd) { cols.push(new Date(c)); c.setDate(c.getDate()+1); }
              }

              const colWidth = ganttZoom === "day" ? 36 : ganttZoom === "week" ? 56 : undefined;

              return (
                <>
                  {/* Header row */}
                  <div style={{display:"flex",borderBottom:`2px solid ${COLORS.border}`,background:COLORS.faint,position:"sticky",top:0,zIndex:10}}>
                    <div style={{flexShrink:0,width:220,borderRight:`1px solid ${COLORS.border}`,padding:"10px 14px",display:"flex",alignItems:"flex-end"}}>
                      <span style={{fontSize:9,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:COLORS.muted}}>Feature</span>
                    </div>
                    <div style={{flex:1,display:"flex",minWidth:cols.length*(colWidth||40)}}>
                      {cols.map((col,i) => {
                        let isNow=false, label1="", label2="";
                        if (ganttZoom==="month") {
                          isNow = col.getFullYear()===TODAY.getFullYear() && col.getMonth()===TODAY.getMonth();
                          label1 = MN[col.getMonth()]; label2 = "'"+String(col.getFullYear()).slice(2);
                        } else if (ganttZoom==="week") {
                          const wEnd = new Date(col); wEnd.setDate(col.getDate()+6);
                          isNow = TODAY >= col && TODAY <= wEnd;
                          label1 = MN[col.getMonth()]+" "+col.getDate();
                          label2 = "W"+Math.ceil(col.getDate()/7);
                        } else {
                          isNow = col.toDateString()===TODAY.toDateString();
                          label1 = col.getDate(); label2 = MN[col.getMonth()].slice(0,1);
                        }
                        return (
                          <div key={i} style={{flexShrink:0,width:colWidth,flex:colWidth?undefined:1,borderLeft:`1px solid ${COLORS.border}`,padding:"6px 2px",textAlign:"center",background:isNow?"rgba(47,91,232,.07)":"transparent",minWidth:colWidth||32}}>
                            <div style={{fontSize:10,fontWeight:700,color:isNow?COLORS.s1:COLORS.text,whiteSpace:"nowrap"}}>{label1}</div>
                            <div style={{fontSize:8,color:COLORS.muted}}>{label2}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Env rows */}
                  {envs?.map((env, ei) => {
                    const envColor = ENV_COLORS[ei];
                    return (
                      <div key={ei} style={{display:"flex",borderBottom:`1px solid ${COLORS.border}`,minHeight:44}}>
                        <div style={{flexShrink:0,width:220,borderRight:`1px solid ${COLORS.border}`,padding:"10px 14px",background:"#fff",position:"sticky",left:0,zIndex:5}}>
                          <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:800,color:COLORS.text,marginBottom:2}}>{env.name}</div>
                          <div style={{fontSize:10,color:COLORS.muted}}>{env.bars.length} stages</div>
                        </div>
                        <div style={{flex:1,position:"relative",minWidth:cols.length*(colWidth||40),minHeight:44}}>
                          {/* Grid lines */}
                          {cols.map((_,ci) => (
                            <div key={ci} style={{position:"absolute",left:`${ci/cols.length*100}%`,top:0,bottom:0,width:`${1/cols.length*100}%`,borderLeft:`1px solid ${COLORS.border}`,pointerEvents:"none",opacity:.3}} />
                          ))}
                          {/* Today line */}
                          {(() => {
                            const tp = zPct(TODAY);
                            if (tp<0||tp>100) return null;
                            return <div style={{position:"absolute",left:`${tp}%`,top:0,bottom:0,width:2,background:"#cc2b24",zIndex:8,pointerEvents:"none",opacity:.85}} />;
                          })()}
                          {/* Bars */}
                          {env.bars.map((bar, bi) => {
                            const l = zPct(bar.start), w = zPct(bar.end) - l;
                            if (w<=0||l>=100) return null;
                            const sc = STAGE_COLORS[bar.s];
                            const teamKey = TEAM_MAP[bar.team]||"all";
                            const stageVisible = activeStages.has(bar.s);
                            const teamVisible = activeTeam==="all"||teamKey===activeTeam||teamKey==="all";
                            if (!stageVisible||!teamVisible) return null;
                            const prog = bar.prog||0;
                            const isActive = activeModal?.ei===ei && activeModal?.bi===bi;
                            const barMilestones = (milestones||[]).filter(m=>m.ei===ei&&m.bi===bi);
                            return (
                              <>
                              {showMilestones && barMilestones.map(m => {
                                const mp = zPct(new Date(m.date));
                                if (mp<0||mp>100) return null;
                                return (
                                  <div key={`m-${m.id}`} onClick={()=>{setActiveModal({ei,bi});setActiveTab("milestones");setEditingMilestone(m);}} style={{position:"absolute",left:`${mp}%`,top:6,height:26,transform:"translateX(-50%)",zIndex:9,cursor:"pointer",display:"flex",alignItems:"center",flexDirection:"column"}}>
                                    <div style={{width:8,height:8,background:m.color,transform:"rotate(45deg)",boxShadow:`0 0 0 2px #fff,0 0 0 2px ${m.color}`,marginTop:9}} />
                                    <div style={{position:"absolute",top:26,left:"50%",transform:"translateX(-50%)",fontSize:7,fontWeight:700,color:m.color,whiteSpace:"nowrap",background:"rgba(255,255,255,.9)",padding:"1px 3px",borderRadius:3,pointerEvents:"none"}}>{m.name}</div>
                                  </div>
                                );
                              })}
                              <div key={bi}
                                onClick={()=>{if(!dragState)setActiveModal(isActive?null:{ei,bi});}}
                                onMouseDown={e=>{
                                  if(!stageVisible||!teamVisible) return;
                                  e.preventDefault(); e.stopPropagation();
                                  setDragState({ei,bi,startX:e.clientX,origStart:new Date(bar.start),origEnd:new Date(bar.end)});
                                }}
                                style={{
                                  position:"absolute",left:`${l}%`,width:`${Math.max(w,.5)}%`,
                                  top:6,height:26,borderRadius:6,
                                  background:sc,cursor:"grab",overflow:"hidden",
                                  boxShadow:isActive?`0 0 0 2px #fff,0 0 0 4px ${sc}`:"0 2px 6px rgba(0,0,0,.15)",
                                  zIndex:isActive?6:2,display:"flex",alignItems:"center",paddingLeft:7,gap:4
                                }}
                              >
                                <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${prog}%`,background:"rgba(255,255,255,.25)",borderRadius:6}} />
                                <span style={{fontSize:9,fontWeight:700,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",position:"relative",zIndex:1}}>
                                  {bar.lbl} {prog>0?prog+"%":""}
                                </span>
                              </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* BOARD / KANBAN VIEW */}
      {view === "board" && (
        <div style={{margin:"14px 32px 30px",overflowX:"auto",animation:"fadeIn .3s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,minWidth:900}}>
            {[1,2,3,4,5].map(s => (
              <div key={s} style={{background:"#fff",border:`1px solid ${COLORS.border}`,borderRadius:12,overflow:"hidden"}}>
                <div style={{padding:"10px 12px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:STAGE_COLORS[s]}} />
                  <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:COLORS.text}}>{STAGE_NAMES[s]}</div>
                </div>
                <div style={{padding:8,display:"flex",flexDirection:"column",gap:7,minHeight:80}}>
                  {envs?.map((env,ei) => env.bars.map((bar,bi) => {
                    if (bar.s !== s) return null;
                    const sc = STAGE_COLORS[bar.s];
                    const isOverdue = bar.end < TODAY && bar.prog < 100;
                    return (
                      <div key={`${ei}-${bi}`} onClick={() => { if(!dragState) { setActiveModal({ei,bi}); setActiveTab("tasks"); } }}
                      onMouseDown={e => { e.preventDefault(); const rect = e.currentTarget.parentElement.getBoundingClientRect(); setDragState({ei,bi,startX:e.clientX,origStart:new Date(bar.start),origEnd:new Date(bar.end),containerRect:rect}); }} className="kanban-card"
                        style={{background:COLORS.faint,border:`1px solid ${isOverdue?COLORS.ragR:COLORS.border}`,borderRadius:9,padding:"10px 12px",cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden",animation:"fadeIn .3s ease"}}>
                        <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:sc,borderRadius:"9px 0 0 9px"}} />
                        <div style={{fontFamily:"Syne,sans-serif",fontSize:11,fontWeight:700,color:COLORS.text,marginBottom:2}}>{env.name}</div>
                        <div style={{fontSize:10,color:COLORS.muted,marginBottom:6}}>{fmtS(bar.start)} – {fmtS(bar.end)}{isOverdue && <span style={{color:COLORS.ragR,fontWeight:700}}> OVERDUE</span>}</div>
                        <div style={{height:4,background:COLORS.border,borderRadius:2,overflow:"hidden",marginBottom:4}}>
                          <div style={{height:"100%",borderRadius:2,background:sc,width:`${bar.prog}%`,transition:"width .3s"}} />
                        </div>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <span style={{fontSize:9,color:COLORS.muted}}>{bar.team.split(" ")[0]}{bar.avatarName && " · "+bar.avatarName}</span>
                          <RagPill rag={envs[ei].rag} small />
                        </div>
                      </div>
                    );
                  }))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MONTH SNAPSHOT PANEL */}
      {snapDate && envs && (
        <div style={{position:"fixed",right:0,top:0,bottom:0,width:360,background:"#fff",borderLeft:`1px solid ${COLORS.border}`,boxShadow:"-8px 0 40px rgba(0,0,0,.1)",zIndex:150,display:"flex",flexDirection:"column",animation:"slideIn .25s ease"}}>
          <div style={{padding:"18px 20px 14px",borderBottom:`1px solid ${COLORS.border}`,background:COLORS.faint,display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:800,color:COLORS.text}}>Team Tasks</div>
              <div style={{fontSize:11,color:COLORS.muted,marginTop:2}}>{snapDate.toLocaleDateString("en-GB",{month:"long",year:"numeric"})}</div>
            </div>
            <button onClick={() => setSnapDate(null)} style={{width:26,height:26,borderRadius:6,border:`1px solid ${COLORS.border}`,background:"#fff",color:COLORS.muted,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          <div style={{overflowY:"auto",flex:1,padding:14}}>
            {(()=>{
              const mS = new Date(snapDate.getFullYear(),snapDate.getMonth(),1);
              const mE = new Date(snapDate.getFullYear(),snapDate.getMonth()+1,0);
              const groups = {};
              envs.forEach((env,ei) => env.bars.forEach((bar,bi) => {
                if (bar.start <= mE && bar.end >= mS) {
                  const tk = TEAM_MAP[bar.team]||"all";
                  if(!groups[tk]) groups[tk]=[];
                  groups[tk].push({env,bar,ei,bi});
                }
              }));
              const TEAM_LABELS = {mgmt:"Management & Consultants",dev:"Dev Team",mkt:"Marketing Team",all:"All Teams"};
              const TEAM_COLORS_MAP = {mgmt:COLORS.s1,dev:COLORS.s2,mkt:COLORS.s4,all:COLORS.s5};
              const found = Object.keys(groups).length > 0;
              if (!found) return <div style={{textAlign:"center",padding:"40px 0",color:COLORS.muted,fontSize:13}}>No active stages this month</div>;
              return ["mgmt","dev","mkt","all"].map(tk => {
                if (!groups[tk]?.length) return null;
                const tc = TEAM_COLORS_MAP[tk];
                return (
                  <div key={tk} style={{marginBottom:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <div style={{padding:"2px 10px",borderRadius:100,fontSize:9,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",background:tc+"22",color:tc,border:`1px solid ${tc}44`}}>{TEAM_LABELS[tk]}</div>
                    </div>
                    {groups[tk].map(({env,bar,ei,bi}) => {
                      const sc = STAGE_COLORS[bar.s];
                      const done = (bar.checked||[]).filter(Boolean).length;
                      const isOverdue = bar.end < TODAY && bar.prog < 100;
                      return (
                        <div key={`${ei}-${bi}`} onClick={() => { setActiveModal({ei,bi}); setActiveTab("tasks"); setSnapDate(null); }} className="snap-item"
                          style={{background:COLORS.faint,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:"10px 12px",marginBottom:8,cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden"}}>
                          <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:sc,borderRadius:"10px 0 0 10px"}} />
                          <div style={{fontFamily:"Syne,sans-serif",fontSize:11,fontWeight:700,color:COLORS.text,marginBottom:2}}>{env.name}{isOverdue && <span style={{color:COLORS.ragR,fontSize:9,fontWeight:700,marginLeft:5}}>OVERDUE</span>}</div>
                          <div style={{fontSize:10,color:COLORS.muted,marginBottom:6}}>{STAGE_NAMES[bar.s]} · {fmtS(bar.start)}–{fmtS(bar.end)}</div>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                            <div style={{flex:1,height:5,background:COLORS.border,borderRadius:3,overflow:"hidden"}}>
                              <div style={{height:"100%",borderRadius:3,background:sc,width:`${bar.prog}%`}} />
                            </div>
                            <span style={{fontSize:10,fontWeight:700,color:sc}}>{bar.prog}%</span>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:3}}>
                            {bar.acts.slice(0,4).map((act,ti) => {
                              const ck = (bar.checked||[])[ti];
                              return (
                                <div key={ti} style={{display:"flex",alignItems:"flex-start",gap:5,fontSize:10.5,color:ck?COLORS.muted:COLORS.text,textDecoration:ck?"line-through":"none",lineHeight:1.4}}>
                                  <div style={{width:5,height:5,borderRadius:"50%",background:ck?COLORS.ragG:sc,flexShrink:0,marginTop:4}} />
                                  {act}
                                </div>
                              );
                            })}
                            {bar.acts.length > 4 && <div style={{fontSize:10,color:COLORS.muted}}>+{bar.acts.length-4} more · {done}/{bar.acts.length} complete</div>}
                          </div>
                          {(bar.owner||bar.avatarName) && (
                            <div style={{marginTop:6,display:"flex",alignItems:"center",gap:5,fontSize:10,color:COLORS.muted}}>
                              <div style={{width:16,height:16,borderRadius:"50%",background:sc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,fontWeight:800,color:"#fff"}}>{(bar.avatarName||bar.owner).split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()}</div>
                              {bar.avatarName||bar.owner}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* TEAM TIMELINE PANEL */}
      {teamPanel && (() => {
        const matchTeam = (barTeam, barTeams) => {
          if (teamPanel === "All") return true;
          if (barTeams && barTeams.length > 0) return barTeams.includes(teamPanel);
          if (teamPanel === "Management") return barTeam.includes("Management");
          if (teamPanel === "Consultants") return barTeam.includes("Consultant");
          if (teamPanel === "Development") return barTeam.includes("Dev") || barTeam.includes("Development");
          if (teamPanel === "Marketing") return barTeam.includes("Marketing");
          return false;
        };
        const items = [];
        envs?.forEach((env, ei) => {
          env.bars.forEach((bar, bi) => {
            if (matchTeam(bar.team, bar.teams)) {
              bar.acts.forEach((act, ai) => {
                items.push({ act, env: env.name, stage: bar.lbl, end: new Date(bar.end), start: new Date(bar.start), done: bar.checked?.[ai] ?? false, ei, bi, envColor: ENV_COLORS[ei] });
              });
            }
          });
        });
        items.sort((a,b) => a.end - b.end);
        const overdue = items.filter(x => x.end < TODAY && !x.done);
        const upcoming = items.filter(x => x.end >= TODAY && !x.done);
        const done = items.filter(x => x.done);
        const fmtD = d => new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
        const fmtS = d => new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short"});
        return (
          <div id="team-timeline-panel" style={{margin:"0 32px 16px",background:"#fff",border:`1px solid ${COLORS.border}`,borderRadius:14,boxShadow:"0 4px 24px rgba(0,0,0,.06)",animation:"fadeIn .3s ease",overflow:"hidden"}}>
            <div style={{padding:"12px 20px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:COLORS.faint}}>
              <div>
                <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:800,color:COLORS.text}}>{teamPanel === "All" ? "All Teams" : teamPanel + " Team"} — Task Timeline</div>
                <div style={{fontSize:11,color:COLORS.muted,marginTop:2}}>{items.length} tasks · {overdue.length > 0 ? <span style={{color:"#cc2b24",fontWeight:700}}>{overdue.length} overdue · </span> : null}{done.length} complete</div>
              </div>
              <button onClick={() => setTeamPanel(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:COLORS.muted,lineHeight:1,padding:"0 4px"}}>×</button>
            </div>
            <div style={{maxHeight:360,overflowY:"auto"}}>
              {overdue.length > 0 && <>
                <div style={{padding:"5px 20px",fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#cc2b24",background:"#fff5f5",borderBottom:`1px solid ${COLORS.border}`}}>⚠ Overdue ({overdue.length})</div>
                {overdue.map((x,i) => (
                  <div key={i} onClick={() => { setActiveModal({ei:x.ei,bi:x.bi}); setActiveTab("tasks"); }} style={{padding:"8px 20px",borderBottom:`1px solid ${COLORS.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#fafafa"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{width:3,height:36,borderRadius:2,background:x.envColor,flexShrink:0}} />
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:COLORS.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.act}</div>
                      <div style={{fontSize:10,color:COLORS.muted,marginTop:1}}>{x.env} · {x.stage}</div>
                    </div>
                    <div style={{fontSize:11,color:"#cc2b24",fontWeight:700,flexShrink:0,textAlign:"right"}}>Due {fmtD(x.end)}</div>
                  </div>
                ))}
              </>}
              {upcoming.length > 0 && <>
                <div style={{padding:"5px 20px",fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:COLORS.s2,background:`${COLORS.s2}11`,borderBottom:`1px solid ${COLORS.border}`}}>Upcoming ({upcoming.length})</div>
                {upcoming.map((x,i) => {
                  const daysLeft = Math.ceil((x.end - TODAY) / (1000*60*60*24));
                  return (
                    <div key={i} onClick={() => { setActiveModal({ei:x.ei,bi:x.bi}); setActiveTab("tasks"); }} style={{padding:"8px 20px",borderBottom:`1px solid ${COLORS.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#fafafa"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{width:3,height:36,borderRadius:2,background:x.envColor,flexShrink:0}} />
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:600,color:COLORS.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.act}</div>
                        <div style={{fontSize:10,color:COLORS.muted,marginTop:1}}>{x.env} · {x.stage}</div>
                      </div>
                      <div style={{flexShrink:0,textAlign:"right"}}>
                        <div style={{fontSize:11,color:daysLeft<=14?"#d4961a":COLORS.muted,fontWeight:daysLeft<=14?700:400}}>Due {fmtS(x.end)}</div>
                        <div style={{fontSize:10,color:COLORS.muted,marginTop:1}}>{daysLeft}d left</div>
                      </div>
                    </div>
                  );
                })}
              </>}
              {done.length > 0 && <>
                <div style={{padding:"5px 20px",fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#00a882",background:"#00a88211",borderBottom:`1px solid ${COLORS.border}`}}>✓ Complete ({done.length})</div>
                {done.map((x,i) => (
                  <div key={i} onClick={() => { setActiveModal({ei:x.ei,bi:x.bi}); setActiveTab("tasks"); }} style={{padding:"8px 20px",borderBottom:`1px solid ${COLORS.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:10,opacity:.55,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#fafafa"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{width:3,height:36,borderRadius:2,background:x.envColor,flexShrink:0}} />
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:COLORS.text,textDecoration:"line-through",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.act}</div>
                      <div style={{fontSize:10,color:COLORS.muted,marginTop:1}}>{x.env} · {x.stage}</div>
                    </div>
                    <div style={{fontSize:11,color:COLORS.muted,flexShrink:0}}>Completed by {fmtS(x.end)}</div>
                  </div>
                ))}
              </>}
              {items.length === 0 && <div style={{padding:"32px 20px",textAlign:"center",color:COLORS.muted,fontSize:12}}>No tasks assigned to this team yet.</div>}
            </div>
          </div>
        );
      })()}

      {/* DETAIL MODAL */}
      {activeModal && currentBar && currentEnv && (
        <div onClick={e => e.target === e.currentTarget && setActiveModal(null)} style={{position:"fixed",inset:0,background:"rgba(26,32,53,.5)",backdropFilter:"blur(4px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:680,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,.2)",animation:"fadeIn .2s ease",overflow:"hidden"}}>
            {/* Header */}
            <div style={{padding:"18px 22px 14px",borderBottom:`1px solid ${COLORS.border}`,background:COLORS.faint,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:14,flexWrap:"wrap",flexShrink:0}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"inline-block",fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:"2px 9px",borderRadius:100,marginBottom:5,background:`${ENV_COLORS[activeModal.ei]}22`,color:ENV_COLORS[activeModal.ei],border:`1px solid ${ENV_COLORS[activeModal.ei]}44`}}>{currentEnv.name}</div>
                <div style={{fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:800,color:COLORS.text,lineHeight:1.2}}>{STAGE_NAMES[currentBar.s]} Stage</div>
                <div style={{fontSize:11,color:COLORS.muted,marginTop:3,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                  <input type="date" value={currentBar.start instanceof Date ? currentBar.start.toISOString().slice(0,10) : ""} onChange={e => { const d=new Date(e.target.value); if(!isNaN(d)) updateBar(activeModal.ei,activeModal.bi,{start:d}); }} style={{border:`1px solid ${COLORS.border}`,borderRadius:6,padding:"2px 6px",fontSize:11,color:COLORS.text,background:"#fff",cursor:"pointer"}} />
                  <span style={{color:COLORS.muted}}>→</span>
                  <input type="date" value={currentBar.end instanceof Date ? currentBar.end.toISOString().slice(0,10) : ""} onChange={e => { const d=new Date(e.target.value); if(!isNaN(d)) updateBar(activeModal.ei,activeModal.bi,{end:d}); }} style={{border:`1px solid ${COLORS.border}`,borderRadius:6,padding:"2px 6px",fontSize:11,color:COLORS.text,background:"#fff",cursor:"pointer"}} />
                  <span style={{color:COLORS.muted}}>· {currentBar.team}</span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"flex-start",gap:10,flexShrink:0}}>
                <div>
                  <div style={{fontSize:10,fontWeight:600,color:COLORS.muted,letterSpacing:".07em",textTransform:"uppercase",marginBottom:4}}>RAG Status</div>
                  <div style={{display:"flex",gap:5}}>
                    {["G","A","R"].map(v => (
                      <button key={v} onClick={() => updateEnv(activeModal.ei, {rag:v})} style={{padding:"4px 10px",borderRadius:7,border:`2px solid ${currentEnv.rag===v?(v==="G"?COLORS.ragG:v==="A"?COLORS.ragA:COLORS.ragR):COLORS.border}`,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"DM Sans,sans-serif",background:currentEnv.rag===v?(v==="G"?"#dcfce7":v==="A"?"#fef3c7":"#fee2e2"):"#fff",color:currentEnv.rag===v?(v==="G"?COLORS.ragG:v==="A"?COLORS.ragA:COLORS.ragR):COLORS.muted}}>
                        {v==="G"?"✓ On Track":v==="A"?"⚠ At Risk":"✗ Off Track"}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} style={{width:28,height:28,borderRadius:7,border:`1px solid ${COLORS.border}`,background:"#fff",color:COLORS.muted,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{display:"flex",padding:"0 22px",borderBottom:`1px solid ${COLORS.border}`,background:COLORS.faint,flexShrink:0,overflowX:"auto"}}>
              {["tasks","overview","people","criteria","comments","milestones"].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{padding:"9px 13px",border:"none",background:"transparent",fontFamily:"DM Sans,sans-serif",fontSize:11.5,fontWeight:activeTab===t?600:500,color:activeTab===t?COLORS.s1:COLORS.muted,cursor:"pointer",borderBottom:`2px solid ${activeTab===t?COLORS.s1:"transparent"}`,marginBottom:-1,whiteSpace:"nowrap",transition:"all .2s",textTransform:"capitalize"}}>
                  {t === "tasks" ? "Tasks" : t === "overview" ? "Overview" : t === "people" ? "People & Roles" : t === "criteria" ? "Success Criteria" : t === "milestones" ? "Milestones" : "Comments"}
                </button>
              ))}
            </div>

            {/* Tab body */}
            <div style={{overflowY:"auto",padding:"18px 22px",flex:1}}>

              {/* MILESTONES TAB */}
              {activeTab === "milestones" && (
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <label style={{fontSize:10,fontWeight:600,color:COLORS.muted,letterSpacing:".07em",textTransform:"uppercase"}}>Milestones</label>
                    <button onClick={() => {
                      setEditingMilestone({id:Date.now(),name:"",date:"",color:"#1e3a6e",ei:activeModal.ei,bi:activeModal.bi});
                    }} style={{fontSize:11,padding:"3px 10px",borderRadius:6,border:`1px solid ${COLORS.s1}`,background:COLORS.s1,color:"#fff",cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>+ Add</button>
                  </div>
                  {milestones.filter(m=>m.ei===activeModal.ei&&m.bi===activeModal.bi).length===0 && (
                    <div style={{textAlign:"center",padding:"24px 0",color:COLORS.muted,fontSize:13}}>No milestones for this stage yet.</div>
                  )}
                  {milestones.filter(m=>m.ei===activeModal.ei&&m.bi===activeModal.bi).map(m => (
                    <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,border:`1px solid ${COLORS.border}`,background:COLORS.faint,marginBottom:8}}>
                      <div style={{width:12,height:12,background:m.color,transform:"rotate(45deg)",flexShrink:0}} />
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:COLORS.text}}>{m.name}</div>
                        <div style={{fontSize:11,color:COLORS.muted}}>{m.date?new Date(m.date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):"No date"}</div>
                      </div>
                      <button onClick={()=>setEditingMilestone(m)} style={{fontSize:11,padding:"3px 8px",borderRadius:6,border:`1px solid ${COLORS.border}`,background:"#fff",cursor:"pointer",color:COLORS.muted}}>Edit</button>
                      <button onClick={()=>setMilestones(prev=>prev.filter(x=>x.id!==m.id))} style={{fontSize:11,padding:"3px 8px",borderRadius:6,border:"1px solid #fecaca",background:"#fff0f0",cursor:"pointer",color:"#cc2b24"}}>✕</button>
                    </div>
                  ))}
                  {editingMilestone&&editingMilestone.ei===activeModal.ei&&editingMilestone.bi===activeModal.bi&&(
                    <div style={{borderTop:`1px solid ${COLORS.border}`,paddingTop:12,marginTop:8}}>
                      <div style={{fontSize:11,fontWeight:700,color:COLORS.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:".06em"}}>{milestones.find(m=>m.id===editingMilestone.id)?"Edit":"New"} Milestone</div>
                      <input placeholder="Name e.g. Beta Release" value={editingMilestone.name||""} onChange={e=>setEditingMilestone(p=>({...p,name:e.target.value}))}
                        style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${COLORS.border}`,fontSize:13,marginBottom:8,fontFamily:"DM Sans,sans-serif",outline:"none",boxSizing:"border-box"}} />
                      <div style={{display:"flex",gap:8,marginBottom:8}}>
                        <input type="date" value={editingMilestone.date||""} onChange={e=>setEditingMilestone(p=>({...p,date:e.target.value}))}
                          style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1px solid ${COLORS.border}`,fontSize:13,fontFamily:"DM Sans,sans-serif",outline:"none"}} />
                        <input type="color" value={editingMilestone.color||"#1e3a6e"} onChange={e=>setEditingMilestone(p=>({...p,color:e.target.value}))}
                          style={{width:40,height:36,borderRadius:8,border:`1px solid ${COLORS.border}`,cursor:"pointer",padding:2}} />
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>{
                          if(!editingMilestone.name||!editingMilestone.date) return;
                          setMilestones(prev=>{
                            const exists=prev.find(m=>m.id===editingMilestone.id);
                            if(exists) return prev.map(m=>m.id===editingMilestone.id?editingMilestone:m);
                            return [...prev,editingMilestone];
                          });
                          setEditingMilestone(null);
                        }} style={{flex:1,padding:"8px 0",borderRadius:8,background:COLORS.s1,color:"#fff",border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>
                          Save ◆
                        </button>
                        <button onClick={()=>setEditingMilestone(null)} style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${COLORS.border}`,background:"#fff",fontSize:13,cursor:"pointer",color:COLORS.muted,fontFamily:"DM Sans,sans-serif"}}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TASKS */}
              {activeTab === "tasks" && (
                <div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <label style={{fontSize:10,fontWeight:600,color:COLORS.muted,letterSpacing:".07em",textTransform:"uppercase"}}>Tasks</label>
                    <span style={{fontSize:10,color:COLORS.muted}}>{(currentBar.checked||[]).filter(Boolean).length}/{currentBar.acts.length} complete</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
                    {currentBar.acts.map((act,ti) => {
                      const checked = (currentBar.checked||[])[ti] || false;
                      return (
                        <div key={ti} className="task-row" style={{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",borderRadius:7,border:`1px solid ${COLORS.border}`,background:COLORS.faint}}>
                          <input type="checkbox" checked={checked} onChange={() => toggleCheck(activeModal.ei, activeModal.bi, ti)}
                            style={{width:15,height:15,accentColor:COLORS.s2,cursor:"pointer",flexShrink:0}} />
                          <input type="text" value={act} onChange={e => {
                            const newActs = [...currentBar.acts];
                            newActs[ti] = e.target.value;
                            updateBar(activeModal.ei, activeModal.bi, {acts: newActs});
                          }} style={{flex:1,border:"none",background:"transparent",fontFamily:"DM Sans,sans-serif",fontSize:12.5,color:checked?COLORS.muted:COLORS.text,outline:"none",textDecoration:checked?"line-through":"none"}} />
                          <input type="date" value={(currentBar.actDates||[])[ti]||""} onChange={e => {
                            const newActDates = [...(currentBar.actDates||currentBar.acts.map(()=>null))];
                            newActDates[ti] = e.target.value||null;
                            updateBar(activeModal.ei, activeModal.bi, {actDates:newActDates});
                          }} style={{border:`1px solid ${COLORS.border}`,borderRadius:6,padding:"2px 6px",fontSize:11,color:COLORS.muted,fontFamily:"DM Sans,sans-serif",background:"#fff",cursor:"pointer",flexShrink:0}} />
                          <button onClick={() => {
                            const newActs = currentBar.acts.filter((_,i)=>i!==ti);
                            const newChecked = (currentBar.checked||[]).filter((_,i)=>i!==ti);
                            const prog = newActs.length ? Math.round(newChecked.filter(Boolean).length/newActs.length*100) : 0;
                            updateBar(activeModal.ei, activeModal.bi, {acts:newActs, checked:newChecked, prog});
                          }} style={{width:18,height:18,border:"none",background:"transparent",color:COLORS.muted,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"color .2s"}} onMouseOver={e=>e.currentTarget.style.color=COLORS.s3} onMouseOut={e=>e.currentTarget.style.color=COLORS.muted}>×</button>
                        </div>
                      );
                    })}
                    <button onClick={() => updateBar(activeModal.ei, activeModal.bi, {acts:[...currentBar.acts,"New task"],checked:[...(currentBar.checked||[]),false]})}
                      style={{padding:"5px 11px",borderRadius:7,border:`1px dashed ${COLORS.border}`,background:"transparent",color:COLORS.muted,fontSize:11,fontFamily:"DM Sans,sans-serif",cursor:"pointer",width:"100%",transition:"all .2s"}} onMouseOver={e=>{e.currentTarget.style.borderColor=COLORS.s1;e.currentTarget.style.color=COLORS.s1}} onMouseOut={e=>{e.currentTarget.style.borderColor=COLORS.border;e.currentTarget.style.color=COLORS.muted}}>
                      + Add task
                    </button>
                  </div>

                  <div style={{marginBottom:14}}>
                    <label style={{display:"block",fontSize:10,fontWeight:600,color:COLORS.muted,letterSpacing:".07em",textTransform:"uppercase",marginBottom:5}}>Owner Name</label>
                    <input type="text" value={currentBar.avatarName||""} onChange={e => updateBar(activeModal.ei, activeModal.bi, {avatarName: e.target.value})}
                      placeholder="e.g. Sarah Johnson" style={{width:"100%",border:`1px solid ${COLORS.border}`,borderRadius:7,padding:"7px 10px",fontFamily:"DM Sans,sans-serif",fontSize:13,color:COLORS.text,outline:"none",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=COLORS.s1} onBlur={e=>e.target.style.borderColor=COLORS.border} />
                  </div>

                  <div style={{marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                      <label style={{fontSize:10,fontWeight:600,color:COLORS.muted,letterSpacing:".07em",textTransform:"uppercase"}}>Progress</label>
                      <span style={{fontFamily:"Syne,sans-serif",fontSize:18,fontWeight:800,color:COLORS.s1}}>{currentBar.prog}%</span>
                    </div>
                    <div style={{height:5,background:COLORS.faint,borderRadius:3,overflow:"hidden",marginBottom:7,border:`1px solid ${COLORS.border}`}}>
                      <div style={{height:"100%",background:COLORS.s2,borderRadius:3,width:`${currentBar.prog}%`,transition:"width .2s"}} />
                    </div>
                    <input type="range" min={0} max={100} step={5} value={currentBar.prog} onChange={e => updateBar(activeModal.ei, activeModal.bi, {prog:+e.target.value})}
                      style={{width:"100%",accentColor:COLORS.s1,cursor:"pointer"}} />
                  </div>

                  <div>
                    <label style={{display:"block",fontSize:10,fontWeight:600,color:COLORS.muted,letterSpacing:".07em",textTransform:"uppercase",marginBottom:5}}>Notes</label>
                    <textarea value={currentBar.note||""} onChange={e => updateBar(activeModal.ei, activeModal.bi, {note: e.target.value})}
                      placeholder="Add notes, blockers, or comments..." rows={3}
                      style={{width:"100%",border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"9px 11px",fontFamily:"DM Sans,sans-serif",fontSize:12.5,color:COLORS.text,resize:"vertical",outline:"none",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=COLORS.s1} onBlur={e=>e.target.style.borderColor=COLORS.border} />
                  </div>
                </div>
              )}

              {/* OVERVIEW */}
              {activeTab === "overview" && (
                <div>
                  <Section title="About this Environment">{currentEnv.description}</Section>
                  <Section title="Purpose of this Stage">{currentEnv.purpose}</Section>
                  <Section title="Key Deliverables"><ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:5}}>{(currentBar.deliverables||[]).map((d,i)=><ListItem key={i}>{d}</ListItem>)}</ul></Section>
                  <Section title="Dependencies" last><ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:5}}>{(currentEnv.dependencies||[]).map((d,i)=><ListItem key={i} secondary>{d}</ListItem>)}</ul></Section>
                </div>
              )}

              {/* PEOPLE */}
              {activeTab === "people" && (
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:12,padding:14,background:COLORS.faint,border:`1px solid ${COLORS.border}`,borderRadius:11,marginBottom:16}}>
                    <div style={{width:46,height:46,borderRadius:11,background:STAGE_COLORS[currentBar.s],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:800,color:"#fff",flexShrink:0}}>{(currentBar.owner||currentBar.team).split(" ").slice(0,2).map(w=>w[0]).join("")}</div>
                    <div>
                      <div style={{fontSize:10,fontWeight:600,color:COLORS.muted,letterSpacing:".09em",textTransform:"uppercase",marginBottom:2}}>Stage Owner</div>
                      <div style={{fontFamily:"Syne,sans-serif",fontSize:14,fontWeight:700,color:COLORS.text,marginBottom:2}}>{currentBar.owner||currentBar.team}</div>
                      <div style={{fontSize:11,color:COLORS.muted}}>Team: {currentBar.team}</div>
                    </div>
                  </div>
                  <Section title="Role & Responsibilities">{currentBar.role}</Section>
                  <Section title="All Stage Owners" last>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      {currentEnv.bars.map((b,bi) => (
                        <div key={bi} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 11px",background:bi===activeModal.bi?`${STAGE_COLORS[b.s]}11`:COLORS.faint,border:`1px solid ${bi===activeModal.bi?STAGE_COLORS[b.s]:COLORS.border}`,borderRadius:7}}>
                          <div style={{width:28,height:28,borderRadius:7,background:STAGE_COLORS[b.s],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff",flexShrink:0}}>{(b.owner||b.team).split(" ").slice(0,2).map(w=>w[0]).join("")}</div>
                          <div>
                            <div style={{fontSize:11,fontWeight:600,color:COLORS.text}}>{STAGE_NAMES[b.s]}{bi===activeModal.bi?" (current)":""}</div>
                            <div style={{fontSize:10,color:COLORS.muted}}>{b.owner||b.team}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              )}

              {/* SUCCESS CRITERIA */}
              {activeTab === "criteria" && (
                <div>
                  <Section title="How do we know this environment is done?">
                    <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:5}}>
                      {(currentEnv.successCriteria||[]).map((s,i)=>(
                        <li key={i} style={{fontSize:12.5,color:"#3a4260",lineHeight:1.5,padding:"8px 11px 8px 30px",position:"relative",background:"#f0fdf4",borderRadius:7,border:"1px solid #bbf7d0"}}>
                          <span style={{position:"absolute",left:10,top:9,fontSize:11,color:COLORS.ragG}}>✓</span>{s}
                        </li>
                      ))}
                    </ul>
                  </Section>
                  <Section title="Stage Timeline" last>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      {currentEnv.bars.map((b,bi) => {
                        const isCurrent = bi === activeModal.bi;
                        const isNow = TODAY >= b.start && TODAY < b.end;
                        return (
                          <div key={bi} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 11px",borderRadius:7,border:`1px solid ${isCurrent?COLORS.s1m:COLORS.border}`,background:isCurrent?COLORS.s1l:COLORS.faint}}>
                            <div style={{width:9,height:9,borderRadius:"50%",background:STAGE_COLORS[b.s],flexShrink:0}} />
                            <div style={{fontSize:11,fontWeight:isCurrent?700:500,color:isCurrent?COLORS.s1:COLORS.text,minWidth:110}}>{STAGE_NAMES[b.s]}{isNow?" (now)":""}</div>
                            <div style={{fontSize:10,color:COLORS.muted,flex:1}}>{fmtS(b.start)} – {fmtS(b.end)}</div>
                            <div style={{fontSize:10,color:COLORS.muted}}>{b.team.split(" ")[0]}</div>
                          </div>
                        );
                      })}
                    </div>
                  </Section>
                </div>
              )}

              {/* COMMENTS */}
              {activeTab === "comments" && (
                <div>
                  {(currentBar.comments||[]).length === 0 && <div style={{textAlign:"center",padding:"30px 0",color:COLORS.muted,fontSize:13}}>No comments yet</div>}
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
                    {(currentBar.comments||[]).map((c,i) => (
                      <div key={i} style={{padding:"10px 12px",background:COLORS.faint,border:`1px solid ${COLORS.border}`,borderRadius:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                          <div style={{width:22,height:22,borderRadius:"50%",background:COLORS.s1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"#fff",flexShrink:0}}>{c.author.split(" ").slice(0,2).map(w=>w[0]).join("")}</div>
                          <div style={{fontSize:11,fontWeight:600,color:COLORS.text}}>{c.author}</div>
                          <div style={{fontSize:10,color:COLORS.muted,marginLeft:"auto"}}>{c.time}</div>
                        </div>
                        <div style={{fontSize:12.5,color:"#3a4260",lineHeight:1.6}}>{c.text}</div>
                      </div>
                    ))}
                  </div>
                  <CommentInput onPost={(text) => {
                    const author = currentBar.avatarName || "You";
                    const time = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"})+" "+new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
                    const newComments = [...(currentBar.comments||[]), {author,text,time}];
                    updateBar(activeModal.ei, activeModal.bi, {comments: newComments});
                  }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* MOBILE BOTTOM TAB BAR */}
      <div className="dtrio-mobile-tabs" style={{
        display:"none", position:"fixed", bottom:0, left:0, right:0,
        background:"#fff", borderTop:`1px solid ${COLORS.border}`,
        padding:"8px 0 20px", zIndex:200,
        justifyContent:"space-around", alignItems:"center"
      }}>
        {[["mytasks","Tasks","📋"],["gantt","Gantt","▤"],["board","Board","⊞"],["pilot","Pilot","🏢"]].map(([v,l,icon]) => (
          <button key={v} onClick={() => setView(v)} style={{
            display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            background:"none", border:"none", cursor:"pointer", padding:"4px 16px",
            color: view===v ? COLORS.s1 : COLORS.muted, fontFamily:"DM Sans,sans-serif"
          }}>
            <span style={{fontSize:20}}>{icon}</span>
            <span style={{fontSize:10, fontWeight:view===v?700:400}}>{l}</span>
            {view===v && <div style={{width:4,height:4,borderRadius:"50%",background:COLORS.s1}} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function RagPill({ rag, onClick, small }) {
  const colors = { G: { bg:"#dcfce7", color:"#16a34a", border:"#bbf7d0" }, A: { bg:"#fef3c7", color:"#d97706", border:"#fde68a" }, R: { bg:"#fee2e2", color:"#dc2626", border:"#fecaca" } };
  const c = colors[rag] || colors.G;
  return (
    <div onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:3,padding:small?"1px 5px":"2px 6px",borderRadius:100,fontSize:small?8:9,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",background:c.bg,color:c.color,border:`1px solid ${c.border}`,cursor:onClick?"pointer":"default",flexShrink:0}}>
      <div style={{width:small?4:5,height:small?4:5,borderRadius:"50%",background:c.color}} />
      {rag}
    </div>
  );
}

function Section({ title, children, last }) {
  return (
    <div style={{marginBottom:last?0:18,paddingBottom:last?0:18,borderBottom:last?"none":`1px solid ${COLORS.faint}`}}>
      <div style={{fontFamily:"Syne,sans-serif",fontSize:11,fontWeight:700,color:COLORS.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:".08em"}}>{title}</div>
      {typeof children === "string" ? <div style={{fontSize:13,color:"#3a4260",lineHeight:1.75}}>{children}</div> : children}
    </div>
  );
}

function ListItem({ children, secondary }) {
  return (
    <li style={{fontSize:12.5,color:"#3a4260",lineHeight:1.5,padding:"7px 11px 7px 28px",position:"relative",background:secondary?"#f8f9fc":COLORS.faint,borderRadius:7,border:`1px solid ${COLORS.border}`}}>
      <span style={{position:"absolute",left:9,top:8,fontSize:11,color:secondary?COLORS.muted:COLORS.s1}}>{secondary?"↳":"▸"}</span>
      {children}
    </li>
  );
}

function CommentInput({ onPost }) {
  const [text, setText] = useState("");
  return (
    <div style={{display:"flex",gap:7,alignItems:"flex-start"}}>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Add a comment..." rows={2}
        style={{flex:1,border:`1px solid ${COLORS.border}`,borderRadius:7,padding:"7px 10px",fontFamily:"DM Sans,sans-serif",fontSize:12,color:COLORS.text,outline:"none",resize:"none",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=COLORS.s1} onBlur={e=>e.target.style.borderColor=COLORS.border} />
      <button onClick={() => { if(text.trim()){ onPost(text.trim()); setText(""); }}} style={{padding:"7px 12px",borderRadius:8,border:"none",background:`linear-gradient(135deg,${COLORS.s1},${COLORS.s5})`,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"DM Sans,sans-serif",alignSelf:"flex-end"}}>Post</button>
    </div>
  );
}
