import React, { useState } from 'react';

const C = (dark) => ({
  node:     { bg: dark ? '#1D4030' : '#E1F5EE', border: '#1D9E75', text: dark ? '#9FE1CB' : '#0F6E56' },
  decision: { bg: dark ? '#3D3010' : '#FFF8E7', border: '#F59E0B', text: dark ? '#FCD34D' : '#92400E' },
  start:    { bg: dark ? '#F1EFE8' : '#2C2C2A', border: dark ? '#F1EFE8' : '#2C2C2A', text: dark ? '#1A1A18' : '#F1EFE8' },
  end:      { bg: '#1D9E75', border: '#1D9E75', text: '#FFFFFF' },
  arrow:    dark ? '#5DCAA5' : '#1D9E75',
  line:     dark ? '#383836' : '#E8E6DF',
  text:     dark ? '#F1EFE8' : '#1A1A18',
  subtext:  dark ? '#9FE1CB' : '#0F6E56',
  seq:   { actor: { bg: '#2C2C2A', text: '#F1EFE8' }, msg: dark ? '#5DCAA5' : '#1D9E75', box: dark ? '#1D4030' : '#E1F5EE' },
  state: { active: { bg: dark ? '#1D4030' : '#E1F5EE', border: '#1D9E75', text: dark ? '#9FE1CB' : '#0F6E56' },
           normal: { bg: dark ? '#2C2C2A' : '#F1EFE8', border: dark ? '#383836' : '#D3D1C7', text: dark ? '#F1EFE8' : '#1A1A18' } },
  class: { header: { bg: '#2C2C2A', text: '#F1EFE8' }, body: { bg: dark ? '#232320' : '#F8F7F4', text: dark ? '#F1EFE8' : '#1A1A18' }, border: dark ? '#1D9E75' : '#D3D1C7' },
});

function wrapText(text, maxChars = 18) {
  const words = String(text || '').split(' ');
  const lines = []; let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) { if (cur) lines.push(cur.trim()); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur.trim());
  return lines.length ? lines : [String(text || '')];
}

function Tooltip({ step, dark, onClose }) {
  if (!step) return null;
  const col = C(dark);
  return (
    <div style={{ background: col.node.bg, borderColor: col.node.border }}
      className="w-full p-3.5 rounded-xl border animate-fade-in">
      <div className="flex justify-between items-start gap-2">
        <p className="text-xs font-bold" style={{ color: col.node.text }}>{step.title}</p>
        <button onClick={onClose} className="text-xs opacity-50 hover:opacity-100">x</button>
      </div>
      <p className="text-xs leading-relaxed mt-1" style={{ color: col.text }}>{step.desc}</p>
      {step.code_ref && (
        <span className="inline-block mt-2 text-xs font-mono px-2 py-0.5 rounded"
          style={{ background: col.node.border, color: '#fff' }}>{step.code_ref}</span>
      )}
    </div>
  );
}

function Flowchart({ steps, name, dark }) {
  const [active, setActive] = useState(null);
  const col = C(dark);
  const W = 380, nodeW = 160, nodeH = 48, gapY = 65, cx = W / 2, startY = 20;
  const nodes = [
    { type: 'start', label: name || 'Start', y: startY, desc: '' },
    ...steps.map((s, i) => {
      const isDecision = /check|if|compare|decision|whether|condition/i.test(s.title);
      return { type: i === steps.length - 1 ? 'end' : isDecision ? 'decision' : 'node', label: s.title, desc: s.desc, code_ref: s.code_ref, y: startY + (i + 1) * (nodeH + gapY) };
    }),
  ];
  const totalH = nodes[nodes.length - 1].y + nodeH + 30;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ maxWidth: 420 }}>
        <defs><marker id="arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0,10 3.5,0 7" fill={col.arrow} /></marker></defs>
        {nodes.map((node, i) => {
          const isActive = active === i;
          const c = node.type === 'start' ? col.start : node.type === 'end' ? col.end : node.type === 'decision' ? col.decision : col.node;
          const lines = wrapText(node.label, 20);
          const textY = node.y + nodeH / 2 - (lines.length - 1) * 8;
          return (
            <g key={i} onClick={() => node.desc && setActive(isActive ? null : i)} style={{ cursor: node.desc ? 'pointer' : 'default' }}>
              {i > 0 && <line x1={cx} y1={nodes[i-1].y+nodeH} x2={cx} y2={node.y-2} stroke={col.arrow} strokeWidth="2" markerEnd="url(#arr)" />}
              {node.type === 'decision'
                ? <polygon points={`${cx},${node.y} ${cx+80},${node.y+nodeH/2} ${cx},${node.y+nodeH} ${cx-80},${node.y+nodeH/2}`} fill={isActive?c.border:c.bg} stroke={c.border} strokeWidth={isActive?2.5:1.5} />
                : node.type === 'start' || node.type === 'end'
                ? <rect x={cx-nodeW/2} y={node.y} width={nodeW} height={nodeH} rx={nodeH/2} fill={c.bg} stroke={c.border} strokeWidth={isActive?2.5:1.5} />
                : <rect x={cx-nodeW/2} y={node.y} width={nodeW} height={nodeH} rx="10" fill={isActive?c.border:c.bg} stroke={c.border} strokeWidth={isActive?2.5:1.5} />}
              {lines.map((l, li) => <text key={li} x={cx} y={textY+li*16} textAnchor="middle" fontSize="12" fontWeight="600" fill={isActive&&node.type==='node'?'#fff':c.text}>{l}</text>)}
              {node.type === 'node' && <><circle cx={cx-nodeW/2+12} cy={node.y+12} r="10" fill={c.border}/><text x={cx-nodeW/2+12} y={node.y+16} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{i}</text></>}
            </g>
          );
        })}
      </svg>
      {active !== null && <Tooltip step={nodes[active]} dark={dark} onClose={() => setActive(null)} />}
      <p className="text-xs opacity-40">Click any step to see explanation</p>
    </div>
  );
}

function SequenceDiagram({ steps, name, dark }) {
  const [active, setActive] = useState(null);
  const col = C(dark);
  const actors = ['Client', name || 'System', 'Output'];
  const W = 420, gap = W / (actors.length + 1), actorY = 20, actorH = 36, actorW = 90;
  const msgStartY = actorY + actorH + 20, msgGap = 55;
  const totalH = msgStartY + steps.length * msgGap + 40;
  const getX = (i) => gap * (i + 1);
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ maxWidth: 440 }}>
        {actors.map((a, i) => (
          <g key={i}>
            <rect x={getX(i)-actorW/2} y={actorY} width={actorW} height={actorH} rx="8" fill={col.seq.actor.bg} stroke={col.node.border} strokeWidth="1.5" />
            <text x={getX(i)} y={actorY+actorH/2+5} textAnchor="middle" fontSize="12" fontWeight="700" fill={col.seq.actor.text}>{a}</text>
            <line x1={getX(i)} y1={actorY+actorH} x2={getX(i)} y2={totalH-10} stroke={col.line} strokeWidth="1.5" strokeDasharray="5,4" />
          </g>
        ))}
        {steps.map((s, i) => {
          const y = msgStartY + i * msgGap;
          const from = i % 2 === 0 ? 0 : 1, to = i % 2 === 0 ? 1 : 2;
          const x1 = getX(from), x2 = getX(to);
          const isActive = active === i;
          const label = wrapText(s.title, 16);
          return (
            <g key={i} onClick={() => setActive(isActive ? null : i)} style={{ cursor: 'pointer' }}>
              <defs><marker id={`a${i}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={col.seq.msg} /></marker></defs>
              <line x1={x1} y1={y} x2={x2-8} y2={y} stroke={isActive?col.node.border:col.seq.msg} strokeWidth={isActive?2.5:1.5} markerEnd={`url(#a${i})`} />
              <rect x={x2-6} y={y-10} width={12} height={20} rx="2" fill={isActive?col.node.border:col.seq.box} stroke={col.node.border} strokeWidth="1" />
              {label.map((l, li) => <text key={li} x={(x1+x2)/2} y={y-6+li*13} textAnchor="middle" fontSize="11" fontWeight="600" fill={isActive?col.node.border:col.text}>{l}</text>)}
              <circle cx={x1+12} cy={y} r="9" fill={col.node.border}/><text x={x1+12} y={y+4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{i+1}</text>
            </g>
          );
        })}
      </svg>
      {active !== null && <Tooltip step={steps[active]} dark={dark} onClose={() => setActive(null)} />}
      <p className="text-xs opacity-40">Click any message to see explanation</p>
    </div>
  );
}

function StateDiagram({ steps, name, dark }) {
  const [active, setActive] = useState(null);
  const col = C(dark);
  const W = 380, boxW = 150, boxH = 44, cx = W / 2, startY = 20, gapY = 70;
  const totalH = startY + (steps.length + 1) * (boxH + gapY) + 20;
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ maxWidth: 420 }}>
        <defs><marker id="sarr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill={col.arrow}/></marker></defs>
        <circle cx={cx} cy={startY+10} r="12" fill={col.start.bg} stroke={col.start.border} strokeWidth="1.5" />
        <circle cx={cx} cy={startY+10} r="6" fill={col.start.text} />
        {steps.map((s, i) => {
          const y = startY + 30 + i * (boxH + gapY);
          const isActive = active === i;
          const c = isActive ? col.state.active : col.state.normal;
          const lines = wrapText(s.title, 20);
          const textY = y + boxH/2 - (lines.length-1)*8;
          return (
            <g key={i} onClick={() => setActive(isActive ? null : i)} style={{ cursor: 'pointer' }}>
              <line x1={cx} y1={i===0?startY+22:startY+30+(i-1)*(boxH+gapY)+boxH} x2={cx} y2={y-2} stroke={col.arrow} strokeWidth="2" markerEnd="url(#sarr)" />
              <rect x={cx-boxW/2} y={y} width={boxW} height={boxH} rx="22" fill={c.bg} stroke={c.border} strokeWidth={isActive?2.5:1.5} />
              {lines.map((l, li) => <text key={li} x={cx} y={textY+li*16} textAnchor="middle" fontSize="12" fontWeight="600" fill={c.text}>{l}</text>)}
            </g>
          );
        })}
        {steps.length > 0 && (<>
          <line x1={cx} y1={startY+30+(steps.length-1)*(boxH+gapY)+boxH} x2={cx} y2={totalH-32} stroke={col.arrow} strokeWidth="2" markerEnd="url(#sarr)" />
          <circle cx={cx} cy={totalH-20} r="12" fill="none" stroke={col.end.bg} strokeWidth="3" />
          <circle cx={cx} cy={totalH-20} r="7" fill={col.end.bg} />
        </>)}
      </svg>
      {active !== null && <Tooltip step={steps[active]} dark={dark} onClose={() => setActive(null)} />}
      <p className="text-xs opacity-40">Click any state to see explanation</p>
    </div>
  );
}

function ClassDiagram({ steps, name, result, dark }) {
  const col = C(dark);
  const W = 380, cx = W / 2, boxW = 260, boxX = cx - boxW / 2;
  const className = name || 'MyClass';
  const attributes = steps.filter((_, i) => i % 2 === 0).map(s => s.code_ref || s.title);
  const methods = steps.filter((_, i) => i % 2 !== 0).map(s => s.code_ref || s.title);
  const headerH = 44, rowH = 26;
  const attrH = Math.max(attributes.length, 1) * rowH + 28;
  const methodH = Math.max(methods.length, 1) * rowH + 28;
  const totalH = headerH + attrH + methodH + 60;
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ maxWidth: 420 }}>
        <rect x={boxX} y={10} width={boxW} height={headerH+attrH+methodH} rx="10" fill="none" stroke={col.class.border} strokeWidth="1.5" />
        <rect x={boxX} y={10} width={boxW} height={headerH} rx="10" fill={col.class.header.bg} />
        <rect x={boxX} y={30} width={boxW} height={headerH-20} fill={col.class.header.bg} />
        <text x={cx} y={10+headerH/2+6} textAnchor="middle" fontSize="14" fontWeight="800" fill={col.class.header.text}>{className}</text>
        <line x1={boxX} y1={10+headerH} x2={boxX+boxW} y2={10+headerH} stroke={col.class.border} strokeWidth="1" />
        <rect x={boxX} y={10+headerH} width={boxW} height={attrH} fill={col.class.body.bg} />
        <text x={boxX+12} y={10+headerH+16} fontSize="10" fontWeight="700" fill={col.subtext} opacity="0.6">ATTRIBUTES</text>
        {attributes.map((a, i) => <text key={i} x={boxX+16} y={10+headerH+30+i*rowH} fontSize="12" fontFamily="monospace" fill={col.class.body.text}>+ {String(a).slice(0,28)}</text>)}
        {attributes.length === 0 && <text x={boxX+16} y={10+headerH+30} fontSize="11" fill={col.class.body.text} opacity="0.4">none</text>}
        <line x1={boxX} y1={10+headerH+attrH} x2={boxX+boxW} y2={10+headerH+attrH} stroke={col.class.border} strokeWidth="1" />
        <rect x={boxX} y={10+headerH+attrH} width={boxW} height={methodH} fill={col.class.body.bg} />
        <rect x={boxX} y={10+headerH+attrH+methodH-10} width={boxW} height={10} rx="10" fill={col.class.body.bg} />
        <text x={boxX+12} y={10+headerH+attrH+16} fontSize="10" fontWeight="700" fill={col.subtext} opacity="0.6">METHODS</text>
        {methods.map((m, i) => <text key={i} x={boxX+16} y={10+headerH+attrH+30+i*rowH} fontSize="12" fontFamily="monospace" fill={col.class.body.text}>+ {String(m).slice(0,26)}()</text>)}
        {methods.length === 0 && <text x={boxX+16} y={10+headerH+attrH+30} fontSize="11" fill={col.class.body.text} opacity="0.4">none</text>}
        {result?.key_concepts?.slice(0,3).map((kc, i) => (
          <g key={i}><rect x={boxX+i*88} y={totalH-30} width={82} height={22} rx="11" fill={col.node.bg} stroke={col.node.border} strokeWidth="1" />
          <text x={boxX+i*88+41} y={totalH-15} textAnchor="middle" fontSize="10" fontWeight="600" fill={col.node.text}>{String(kc).slice(0,10)}</text></g>
        ))}
      </svg>
      <p className="text-xs opacity-40">Class structure of {className}</p>
    </div>
  );
}

export default function FlowDiagram({ steps, name, dark, vizMode, result }) {
  if (!steps || steps.length === 0)
    return <div className="flex items-center justify-center py-12 text-sm opacity-40">No steps to visualize</div>;

  switch (vizMode) {
    case 'sequence':     return <SequenceDiagram steps={steps} name={name} dark={dark} />;
    case 'stateDiagram': return <StateDiagram steps={steps} name={name} dark={dark} />;
    case 'classDiagram': return <ClassDiagram steps={steps} name={name} dark={dark} result={result} />;
    default:             return <Flowchart steps={steps} name={name} dark={dark} />;
  }
}
