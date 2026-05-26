import { useState, useEffect } from 'react'

const COLORS = {
  s1: "#1e3a6e", s3: "#cc2b24", ragG: "#16a34a", ragA: "#d97706",
  muted: "#8492b4", faint: "#eef1f8", border: "#dde2ef", text: "#1a2035"
};

export default function NotificationBell({ envs = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const weekAhead = new Date(today); weekAhead.setDate(today.getDate()+7);
    const found = [];

    envs.forEach(env => {
      env.bars?.forEach(bar => {
        bar.acts?.forEach((act, ai) => {
          const dateStr = (bar.actDates||[])[ai];
          if (!dateStr) return;
          const due = new Date(dateStr); due.setHours(0,0,0,0);
          const done = (bar.checked||[])[ai];
          if (done) return;
          const diff = Math.ceil((due - today) / 86400000);
          let type = null;
          if (diff < 0 && !done) type = 'overdue';
          else if (diff === 0) type = 'today';
          else if (diff <= 7) type = 'week';
          if (type) {
            found.push({
              act, type, diff,
              feature: env.name,
              stage: bar.lbl,
              due: due.toLocaleDateString("en-GB",{day:"numeric",month:"short"}),
            });
          }
        });
      });
    });

    // Sort: overdue first, then today, then by days
    found.sort((a,b) => {
      const order = {overdue:0, today:1, week:2};
      return order[a.type] - order[b.type] || a.diff - b.diff;
    });

    setAlerts(found);
  }, [envs]);

  const unread = alerts.length;

  function getAlertStyle(type) {
    if (type === 'overdue') return { icon:"🔴", color:"#cc2b24", bg:"#fff0f0", label:`${Math.abs(alerts.find(a=>a===a)?.diff||0)}d overdue` };
    if (type === 'today') return { icon:"🟠", color:"#d4961a", bg:"#fff8ee", label:"Due today" };
    return { icon:"🟡", color:"#d4961a", bg:"#fffbee", label:"Due this week" };
  }

  return (
    <div style={{position:"relative"}}>
      <button
        onClick={() => setIsOpen(p => !p)}
        style={{
          position:"relative", background: unread>0 ? "#fff5f5" : COLORS.faint,
          border:`1px solid ${unread>0?"#cc2b24":COLORS.border}`,
          borderRadius:8, padding:"4px 9px", cursor:"pointer", fontSize:15,
          display:"inline-flex", alignItems:"center", gap:4, transition:"all .15s"
        }}
      >
        🔔
        {unread > 0 && (
          <span style={{
            position:"absolute", top:-6, right:-6, background:"#cc2b24", color:"#fff",
            borderRadius:"50%", width:17, height:17, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:9, fontWeight:700, lineHeight:1
          }}>{unread}</span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position:"absolute", right:0, top:44, width:340,
          background:"#fff", borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,.15)",
          border:`1px solid ${COLORS.border}`, zIndex:500, maxHeight:420, overflowY:"auto"
        }}>
          <div style={{
            padding:"12px 16px", borderBottom:`1px solid ${COLORS.border}`,
            display:"flex", alignItems:"center", justifyContent:"space-between"
          }}>
            <span style={{fontWeight:700, fontSize:14, color:COLORS.s1}}>
              🔔 Alerts {unread > 0 && <span style={{background:"#cc2b24",color:"#fff",borderRadius:100,padding:"1px 7px",fontSize:11,marginLeft:4}}>{unread}</span>}
            </span>
            <button onClick={() => setIsOpen(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:COLORS.muted}}>✕</button>
          </div>

          {alerts.length === 0 ? (
            <div style={{padding:"32px 16px", textAlign:"center", color:COLORS.muted}}>
              <div style={{fontSize:28,marginBottom:8}}>✅</div>
              <div style={{fontSize:13,fontWeight:600}}>No alerts</div>
              <div style={{fontSize:12,marginTop:4}}>All tasks are on track!</div>
            </div>
          ) : (
            <div>
              {['overdue','today','week'].map(type => {
                const group = alerts.filter(a => a.type === type);
                if (!group.length) return null;
                const label = type==='overdue'?'🔴 Overdue':type==='today'?'🟠 Due Today':'🟡 Due This Week';
                return (
                  <div key={type}>
                    <div style={{padding:"8px 16px 4px", fontSize:10, fontWeight:700, color:COLORS.muted, textTransform:"uppercase", letterSpacing:".08em", background:COLORS.faint}}>
                      {label}
                    </div>
                    {group.map((alert, i) => (
                      <div key={i} style={{
                        padding:"10px 16px", borderBottom:`1px solid ${COLORS.faint}`,
                        display:"flex", alignItems:"flex-start", gap:10
                      }}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13, fontWeight:600, color:COLORS.text, marginBottom:2}}>{alert.act}</div>
                          <div style={{fontSize:11, color:COLORS.muted}}>
                            {alert.feature} · <span style={{color:COLORS.s1,fontWeight:600}}>{alert.stage}</span>
                          </div>
                        </div>
                        <div style={{
                          fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:100,
                          background: type==='overdue'?"#fff0f0":type==='today'?"#fff8ee":"#fffbee",
                          color: type==='overdue'?"#cc2b24":"#d4961a", whiteSpace:"nowrap"
                        }}>
                          {type==='overdue' ? `${Math.abs(alert.diff)}d overdue` : type==='today' ? 'Today' : `${alert.diff}d`}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
