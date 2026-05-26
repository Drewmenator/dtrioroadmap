import { useState } from 'react'

const COLORS = {
  s1: "#1e3a6e", s2: "#00a882", s3: "#cc2b24", s4: "#d4961a", s5: "#7c44d4",
  ragG: "#16a34a", ragA: "#d97706", ragR: "#dc2626",
  bg: "#f2f4f9", surface: "#fff", border: "#dde2ef",
  text: "#1a2035", muted: "#8492b4", faint: "#eef1f8",
};

const STAGES = ["Input","Development","Internal Testing","Soft Release","Hard Release"];
const STAGE_COLORS = {
  "Input": "#1e3a6e", "Development": "#00a882", "Internal Testing": "#cc2b24",
  "Soft Release": "#d4961a", "Hard Release": "#7c44d4",
};
const TEAMS = ["All","Management","Consultants","Development","Marketing"];
const TEAM_COLORS = {
  "All": "#1e3a6e", "Management": "#00a882", "Consultants": "#7c44d4",
  "Development": "#cc2b24", "Marketing": "#d4961a",
};
const TIMELINES = ["Today","This Week","This Month","Overdue"];
const TIMELINE_COLORS = {
  "Today": "#d4961a", "This Week": "#1e3a6e", "This Month": "#00a882", "Overdue": "#cc2b24",
};

export default function MyTasks({ envs = [], activeTeam = null, userName = "" }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [myTasksOnly, setMyTasksOnly] = useState(false);

  const today = new Date(); today.setHours(0,0,0,0);
  const weekAhead = new Date(today); weekAhead.setDate(today.getDate()+7);
  const monthAhead = new Date(today); monthAhead.setDate(today.getDate()+30);

  const allBars = [];
  (envs||[]).forEach((env) => {
    (env.bars||[]).forEach((bar) => {
      allBars.push({ ...bar, envName: env.name, endDate: new Date(bar.end), startDate: new Date(bar.start) });
    });
  });

  const effectiveTeam = activeTeam || selectedTeam;

  const filtered = allBars.filter(bar => {
    // My Tasks filter - match userName against owner field
    if (myTasksOnly && userName) {
      const owner = (bar.owner || "").toLowerCase();
      const name = userName.toLowerCase();
      // Match first name or full name
      const firstName = name.split(' ')[0];
      if (!owner.includes(name) && !owner.includes(firstName)) return false;
    }
    // Never show 100% completed bars as overdue
    if ((bar.prog||bar.pct||0) >= 100 && selectedTimeline === "Overdue") return false;
    // Hide completed bars unless explicitly viewing All
    if ((bar.prog||bar.pct||0) >= 100 && selectedTimeline && selectedTimeline !== "All") return false;
    // Stage filter
    if (selectedStage && bar.lbl !== selectedStage) return false;
    // Team filter
    const et = effectiveTeam;
    if (et && et !== "All" && et !== "all" && et !== null) {
      const barTeams = Array.isArray(bar.teams) ? bar.teams : [];
      if (barTeams.length > 0) {
        if (!barTeams.includes(et)) return false;
      } else {
        if (!(bar.team||"").includes(et)) return false;
      }
    }
    // Timeline filter
    if (selectedTimeline) {
      const due = bar.endDate;
      if (selectedTimeline === "Today" && !(due >= today && due < new Date(today.getTime()+86400000))) return false;
      if (selectedTimeline === "This Week" && !(due >= today && due <= weekAhead)) return false;
      if (selectedTimeline === "This Month" && !(due >= today && due <= monthAhead)) return false;
      if (selectedTimeline === "Overdue" && !(due < today && (bar.prog||bar.pct||0) < 100)) return false;
    }
    return true;
  });

  function getDueLabel(date, pct) {
    const diff = Math.ceil((date - today) / 86400000);
    if ((pct||0) >= 100 && pct !== undefined && pct !== null) return { label: '✓ Done', color: '#16a34a', bg: '#dcfce7' };
    if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: "#cc2b24", bg: "#fff0f0" };
    if (diff === 0) return { label: "Due today", color: "#d4961a", bg: "#fff8ee" };
    if (diff <= 7) return { label: `${diff}d left`, color: "#00a882", bg: "#edfaf6" };
    return { label: new Date(date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}), color: "#8492b4", bg: "#f2f4f9" };
  }

  function toggleFilter(name) {
    setActiveFilter(prev => prev === name ? null : name);
  }

  function clearAll() {
    setSelectedStage(null); setSelectedTeam(null);
    setSelectedTimeline(null); setActiveFilter(null); setMyTasksOnly(false);
  }

  const hasFilters = selectedStage || selectedTeam || selectedTimeline || myTasksOnly;

  return (
    <div id="dtrio-tasks-view" className="dtrio-tasks" style={{padding:"20px 32px 40px", fontFamily:'"DM Sans",sans-serif', background:COLORS.bg, minHeight:"60vh", overflowX:"hidden", maxWidth:"100%", boxSizing:"border-box"}}>

      {/* Filter row */}
      <div style={{display:"flex", gap:8, marginBottom:0, alignItems:"center", flexWrap:"wrap"}}>

        {/* My Tasks toggle */}
        {userName && (
          <button onClick={() => setMyTasksOnly(p => !p)} style={{
            padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:700,
            border:`2px solid ${myTasksOnly ? COLORS.s1 : COLORS.border}`,
            background: myTasksOnly ? COLORS.s1 : "#fff",
            color: myTasksOnly ? "#fff" : COLORS.muted,
            cursor:"pointer", transition:"all .2s", fontFamily:"DM Sans,sans-serif",
            display:"flex", alignItems:"center", gap:6
          }}>
            👤 {userName.split(' ')[0]}'s Tasks
          </button>
        )}

        <div style={{width:1,height:24,background:COLORS.border,margin:"0 4px"}} />

        {/* Stage button */}
        <button onClick={() => toggleFilter('stage')} style={{
          padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:700,
          border:`2px solid ${activeFilter==='stage'||selectedStage ? STAGE_COLORS[selectedStage||"Input"] : COLORS.border}`,
          background: activeFilter==='stage' ? COLORS.s1 : selectedStage ? STAGE_COLORS[selectedStage]+"18" : "#fff",
          color: activeFilter==='stage' ? "#fff" : selectedStage ? STAGE_COLORS[selectedStage] : COLORS.muted,
          cursor:"pointer", transition:"all .2s", fontFamily:"DM Sans,sans-serif",
          display:"flex", alignItems:"center", gap:6
        }}>
          ⑆ Stage {selectedStage && <span style={{background:STAGE_COLORS[selectedStage],color:"#fff",borderRadius:100,padding:"1px 7px",fontSize:10}}>{selectedStage}</span>}
          <span style={{fontSize:10,opacity:.6}}>{activeFilter==='stage'?'▲':'▼'}</span>
        </button>

        {/* Team button */}
        <button onClick={() => toggleFilter('team')} style={{
          padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:700,
          border:`2px solid ${activeFilter==='team'||selectedTeam ? TEAM_COLORS[selectedTeam||"All"] : COLORS.border}`,
          background: activeFilter==='team' ? COLORS.s1 : selectedTeam ? TEAM_COLORS[selectedTeam]+"18" : "#fff",
          color: activeFilter==='team' ? "#fff" : selectedTeam ? TEAM_COLORS[selectedTeam] : COLORS.muted,
          cursor:"pointer", transition:"all .2s", fontFamily:"DM Sans,sans-serif",
          display:"flex", alignItems:"center", gap:6
        }}>
          👥 Team {selectedTeam && <span style={{background:TEAM_COLORS[selectedTeam],color:"#fff",borderRadius:100,padding:"1px 7px",fontSize:10}}>{selectedTeam}</span>}
          <span style={{fontSize:10,opacity:.6}}>{activeFilter==='team'?'▲':'▼'}</span>
        </button>

        {/* Timeline button */}
        <button onClick={() => toggleFilter('timeline')} style={{
          padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:700,
          border:`2px solid ${activeFilter==='timeline'||selectedTimeline ? TIMELINE_COLORS[selectedTimeline||"Today"] : COLORS.border}`,
          background: activeFilter==='timeline' ? COLORS.s1 : selectedTimeline ? TIMELINE_COLORS[selectedTimeline]+"18" : "#fff",
          color: activeFilter==='timeline' ? "#fff" : selectedTimeline ? TIMELINE_COLORS[selectedTimeline] : COLORS.muted,
          cursor:"pointer", transition:"all .2s", fontFamily:"DM Sans,sans-serif",
          display:"flex", alignItems:"center", gap:6
        }}>
          📅 Timeline {selectedTimeline && <span style={{background:TIMELINE_COLORS[selectedTimeline],color:"#fff",borderRadius:100,padding:"1px 7px",fontSize:10}}>{selectedTimeline}</span>}
          <span style={{fontSize:10,opacity:.6}}>{activeFilter==='timeline'?'▲':'▼'}</span>
        </button>

        {hasFilters && (
          <button onClick={clearAll} style={{
            padding:"7px 12px", borderRadius:8, fontSize:12, fontWeight:600,
            border:`1.5px solid ${COLORS.border}`, background:"#fff",
            color:COLORS.muted, cursor:"pointer", fontFamily:"DM Sans,sans-serif"
          }}>✕ Clear</button>
        )}

        <span style={{marginLeft:"auto", fontSize:12, color:COLORS.muted, fontWeight:600}}>
          {filtered.length} task{filtered.length!==1?"s":""}
        </span>
      </div>

      {/* Dropdown panel */}
      {activeFilter && (
        <div style={{
          background:"#fff", border:`1px solid ${COLORS.border}`, borderRadius:12,
          padding:"14px 18px", marginTop:8, marginBottom:16,
          boxShadow:"0 4px 20px rgba(0,0,0,.08)", animation:"fadeIn .15s ease",
          display:"flex", gap:8, flexWrap:"wrap", alignItems:"center"
        }}>
          {activeFilter === 'stage' && STAGES.map(s => (
            <button key={s} onClick={() => { setSelectedStage(selectedStage===s?null:s); setActiveFilter(null); }} style={{
              padding:"8px 14px", borderRadius:8, fontSize:12, fontWeight:700,
              border:`2px solid ${selectedStage===s ? STAGE_COLORS[s] : COLORS.border}`,
              background: selectedStage===s ? STAGE_COLORS[s] : "#fff",
              color: selectedStage===s ? "#fff" : STAGE_COLORS[s],
              cursor:"pointer", transition:"all .2s", fontFamily:"DM Sans,sans-serif",
              display:"flex", alignItems:"center", gap:6
            }}>
              <div style={{width:8,height:8,borderRadius:"50%",background:selectedStage===s?"#fff":STAGE_COLORS[s]}} />
              {s}
            </button>
          ))}
          {activeFilter === 'team' && TEAMS.map(t => (
            <button key={t} onClick={() => { setSelectedTeam(selectedTeam===t?null:t); setActiveFilter(null); }} style={{
              padding:"8px 14px", borderRadius:8, fontSize:12, fontWeight:700,
              border:`2px solid ${selectedTeam===t ? TEAM_COLORS[t] : COLORS.border}`,
              background: selectedTeam===t ? TEAM_COLORS[t] : "#fff",
              color: selectedTeam===t ? "#fff" : TEAM_COLORS[t],
              cursor:"pointer", transition:"all .2s", fontFamily:"DM Sans,sans-serif",
            }}>{t}</button>
          ))}
          {activeFilter === 'timeline' && TIMELINES.map(tl => (
            <button key={tl} onClick={() => { setSelectedTimeline(selectedTimeline===tl?null:tl); setActiveFilter(null); }} style={{
              padding:"8px 14px", borderRadius:8, fontSize:12, fontWeight:700,
              border:`2px solid ${selectedTimeline===tl ? TIMELINE_COLORS[tl] : COLORS.border}`,
              background: selectedTimeline===tl ? TIMELINE_COLORS[tl] : "#fff",
              color: selectedTimeline===tl ? "#fff" : TIMELINE_COLORS[tl],
              cursor:"pointer", transition:"all .2s", fontFamily:"DM Sans,sans-serif",
            }}>{tl}</button>
          ))}
        </div>
      )}

      {/* Task cards */}
      <div style={{marginTop:activeFilter ? 0 : 16}}>
        {filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 0",background:"#fff",borderRadius:12,border:`1px solid ${COLORS.border}`}}>
            <div style={{fontSize:40,marginBottom:12}}>🎉</div>
            <div style={{fontSize:15,fontWeight:700,color:COLORS.text,marginBottom:4}}>All caught up!</div>
            <div style={{fontSize:13,color:COLORS.muted}}>No tasks match your filters.</div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {filtered.map((bar, i) => {
              const due = getDueLabel(bar.endDate, bar.prog||bar.pct||0);
              const progress = bar.acts?.length > 0
                ? Math.round((bar.checked?.filter(Boolean).length||0) / bar.acts.length * 100)
                : (bar.prog||bar.pct||0);
              const stageColor = STAGE_COLORS[bar.lbl] || COLORS.s1;
              const isMyTask = userName && (bar.owner||"").toLowerCase().includes(userName.toLowerCase().split(' ')[0]);
              return (
                <div key={i} style={{
                  background:"#fff", borderRadius:10,
                  borderLeft:`4px solid ${stageColor}`,
                  padding:"14px 18px", boxShadow:"0 1px 4px rgba(0,0,0,.06)",
                  display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", overflow:"hidden",
                  outline: isMyTask && myTasksOnly ? `2px solid ${COLORS.s1}22` : "none"
                }}>
                  <div style={{flex:2, minWidth:160}}>
                    <div style={{fontSize:14,fontWeight:700,color:COLORS.text,marginBottom:3}}>{bar.envName}</div>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{fontSize:10,fontWeight:700,background:stageColor+"18",color:stageColor,padding:"2px 8px",borderRadius:100}}>{bar.lbl}</span>
                      <span style={{fontSize:11,color:COLORS.muted}}>{bar.team||"—"}</span>
                    </div>
                  </div>
                  <div style={{flex:1,minWidth:100}}>
                    <div style={{fontSize:10,color:COLORS.muted,marginBottom:2,textTransform:"uppercase",letterSpacing:".06em"}}>Owner</div>
                    <div style={{fontSize:12,fontWeight:600,color:isMyTask?COLORS.s1:COLORS.text}}>{bar.owner||bar.avatarName||"Unassigned"}</div>
                  </div>
                  <div style={{flex:2,minWidth:120}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:10,color:COLORS.muted,textTransform:"uppercase",letterSpacing:".06em"}}>Progress</span>
                      <span style={{fontSize:11,fontWeight:700,color:progress===100?COLORS.ragG:COLORS.s1}}>{progress}%</span>
                    </div>
                    <div style={{height:5,background:COLORS.faint,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${progress}%`,background:progress===100?COLORS.ragG:stageColor,borderRadius:3,transition:"width .3s"}} />
                    </div>
                  </div>
                  <div style={{
                    padding:"5px 12px",borderRadius:100,fontSize:11,fontWeight:700,
                    background:due.bg,color:due.color,whiteSpace:"nowrap",
                    border:`1px solid ${due.color}33`
                  }}>{due.label}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
