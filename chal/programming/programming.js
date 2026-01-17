/* programming.js
   Full block editor & interpreter for the step you requested.
   Save as programming.js and open programming.html.
*/

(() => {
  // fixed inputs
  //const FIXED_N = 10;
  //const FIXED_K = 5;



  

  // DOM
  const programArea = document.getElementById('programArea');
  const runBtn = document.getElementById('runBtn');
  const clearBtn = document.getElementById('clearBtn');
  const consoleEl = document.getElementById('console');
  const varsPanel = document.getElementById('varsPanel');
  const endChallengeBtn = document.getElementById('endChallengeBtn');
  //document.getElementById('dispN').textContent = FIXED_N;
  //document.getElementById('dispK').textContent = FIXED_K;
// Get username from URL
const urlParams = new URLSearchParams(window.location.search);
const USERNAME = urlParams.get('username') || 'anonymous';
// Update header with username
const header = document.querySelector('header.top h1');
if (header) {
  header.innerHTML = `PROGRAMMING CHALLENGE — <span style="color:#5aff9e;">@${USERNAME}</span>`;
  header.style.fontFamily = "'Press Start 2P', monospace";
  header.style.fontSize = '18px';
  header.style.textAlign = 'center';
  header.style.margin = '12px 0';
  header.style.textShadow = '0 0 10px #5aff9e';
}
  // Create main root plus and append to program area
  function makeRootPlus() {
    const p = document.createElement('div');
    p.className = 'plus';
    p.textContent = '[   +   ]';
    p.addEventListener('click', (e) => openBlockMenu(e.currentTarget, (type) => insertBlockBeforePlus(type)));
    return p;
  }

  // ensure main plus exists and is last child
  function ensureRootPlus() {
    const existing = programArea.querySelector('.plus#rootPlus');
    if (existing) {
      programArea.appendChild(existing);
      return existing;
    }
    const p = makeRootPlus();
    p.id = 'rootPlus';
    programArea.appendChild(p);
    return p;
  }

  ensureRootPlus();

  // Block menu overlay; anchor is the element we position under; cb receives selected type
  function openBlockMenu(anchor, cb) {
      console.log('Menu opened for:', anchor);

  // Close any existing menu first
  if (window._scratchy_menu) {
    if (window._scratchy_menu.parentNode) {
      window._scratchy_menu.parentNode.removeChild(window._scratchy_menu);
    }
    if (window._scratchy_menu_outside_handler) {
      window.removeEventListener('click', window._scratchy_menu_outside_handler);
    }
    delete window._scratchy_menu;
    delete window._scratchy_menu_outside_handler;
  }
  
  const menu = document.createElement('div');
    menu.className = 'panel';
    menu.style.position = 'absolute';
    menu.style.zIndex = 9999;
    menu.style.minWidth = '220px';
    menu.style.padding = '8px';
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.gap = '6px';
    menu.style.fontFamily = "'Press Start 2P', monospace";

    const types = [
      { id: 'ifelse', label: 'If - Else' },
      { id: 'repeat', label: 'Repeat (times)' },
      { id: 'while', label: 'While (condition)' },
      { id: 'set', label: 'Set variable' },
      { id: 'output', label: 'Output answer' },
      //{ id: 'raw', label: 'Raw value' },
    ];

    types.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'btn ghost';
      btn.textContent = t.label;
      btn.dataset.type = t.id;
      btn.style.fontFamily = "'Press Start 2P', monospace";

      btn.addEventListener('click', () => {
        cb(t.id);
        closeMenu();
      });
      menu.appendChild(btn);
    });

    // position
    const rect = anchor.getBoundingClientRect();
    menu.style.left = `${Math.max(8, rect.left)}px`;
    menu.style.top = `${rect.top + window.scrollY + rect.height + 6}px`;
    document.body.appendChild(menu);

    // close when clicking outside
    setTimeout(() => window.addEventListener('click', outside), 10);
    function outside(ev) { if (!menu.contains(ev.target) && ev.target !== anchor) closeMenu(); }

    function closeMenu() {
      if (menu.parentNode) menu.parentNode.removeChild(menu);
      window.removeEventListener('click', outside);
    }
    window._scratchy_menu_close = closeMenu;
  }

  function closeMenu() { if (window._scratchy_menu_close) window._scratchy_menu_close(); }

  // Insert block before the main plus (pushes plus to the end)
  function insertBlockBeforePlus(type, insertContainer) {
    const plus = document.getElementById('rootPlus');
    if (!plus) ensureRootPlus();
    const before = insertContainer || plus;
    const block = createBlock(type);
    programArea.insertBefore(block, before);
    ensureRootPlus();
    return block;
  }

  // create block DOM factory
  function createBlock(type) {
    const b = document.createElement('div'); b.className = 'block';
    // helper: remove button
    function appendRemove() {
      const rem = document.createElement('button'); rem.className = 'btn ghost'; rem.textContent = 'Remove';
      rem.style.marginLeft = '8px';
      rem.addEventListener('click', () => b.remove());
      const rwrap = document.createElement('div'); rwrap.style.marginTop = '8px'; rwrap.appendChild(rem);
      b.appendChild(rwrap);
    }

    if (type === 'ifelse') {
      const title = document.createElement('div'); title.className = 'title'; title.textContent = 'If - Else';
      b.appendChild(title);

      // Condition row: left input, op select, mid input (optional), cmp select, right input
      const condRow = document.createElement('div'); condRow.className = 'row';
      const left = makeValueInput('(value)'); const arithOp = makeSelect(['NONE','+','-','*','/','%'], 'NONE'); const mid = makeValueInput('(value)');
      const cmp = makeSelect(['==','!='], '=='); const right = makeValueInput('(value)');
      condRow.appendChild(left); condRow.appendChild(arithOp); condRow.appendChild(mid); condRow.appendChild(cmp); condRow.appendChild(right);
      b.appendChild(condRow);

      // Then area
      const thenLabel = document.createElement('div'); thenLabel.className='small'; thenLabel.style.marginTop='10px'; thenLabel.textContent = 'Then:';
      const thenArea = document.createElement('div'); thenArea.className = 'sub';
      thenArea.style.minHeight = '10px';
      const thenPlus = makeInnerPlus(thenArea);
      thenArea.appendChild(thenPlus);

      // Else area
      const elseLabel = document.createElement('div'); elseLabel.className='small'; elseLabel.style.marginTop='10px'; elseLabel.textContent = 'Else:';
      const elseArea = document.createElement('div'); elseArea.className = 'sub';
      elseArea.style.minHeight = '10px';
      const elsePlus = makeInnerPlus(elseArea);
      elseArea.appendChild(elsePlus);

      b.appendChild(thenLabel); b.appendChild(thenArea);
      b.appendChild(elseLabel); b.appendChild(elseArea);
      appendRemove();

      // store selectors for interpreter convenience
      b._cond = { left, arithOp, mid, cmp, right };

    } else if (type === 'repeat') {
      const title = document.createElement('div'); title.className = 'title'; title.textContent = 'Repeat (times)';
      b.appendChild(title);
      const row = document.createElement('div'); row.className='row';
      const times = document.createElement('input'); times.type='text'; times.placeholder='times'; times.value='3'; times.style.width='80px';
      row.appendChild(document.createTextNode('Times:')); row.appendChild(times);
      b.appendChild(row);
      const inner = document.createElement('div'); inner.className='sub';
      inner.style.minHeight='6px';
      const innerPlus = makeInnerPlus(inner);
      inner.appendChild(innerPlus);
      b.appendChild(inner);
      appendRemove();
      b._repeat = { times, inner };
    } else if (type === 'while') {
      const title = document.createElement('div'); title.className='title'; title.textContent = 'While';
      b.appendChild(title);
      const condRow = document.createElement('div'); condRow.className='row';
      const left = makeValueInput('(value)'); const arithOp = makeSelect(['NONE','+','-','*','/','%'],'NONE'); const mid = makeValueInput('(value)');
      const cmp = makeSelect(['==','!='],'=='); const right = makeValueInput('(value)');
      condRow.appendChild(left); condRow.appendChild(arithOp); condRow.appendChild(mid); condRow.appendChild(cmp); condRow.appendChild(right);
      b.appendChild(condRow);
      const inner = document.createElement('div'); inner.className='sub'; inner.style.minHeight='6px';
      const innerPlus = makeInnerPlus(inner); inner.appendChild(innerPlus);
      b.appendChild(inner);
      appendRemove();
      b._while = { left, arithOp, mid, cmp, right, inner };
    } else if (type === 'set') {
      const title = document.createElement('div'); title.className='title'; title.textContent = 'Set variable';
      b.appendChild(title);
      const r1 = document.createElement('div'); r1.className='row';
      const name = document.createElement('input'); name.type='text'; name.placeholder='name (e.g. ans)'; name.style.width='130px';
      r1.appendChild(document.createTextNode('Name:')); r1.appendChild(name);
      b.appendChild(r1);

      const r2 = document.createElement('div'); r2.className='row'; r2.style.marginTop='8px';
      const left = makeValueInput('(value)'); const op = makeSelect(['NONE','+','-','*','/','%'],'NONE'); const right = makeValueInput('(value)');
      r2.appendChild(document.createTextNode('Value:')); r2.appendChild(left); r2.appendChild(op); r2.appendChild(right);
      b.appendChild(r2);
      appendRemove();
      b._set = { name, left, op, right };
    } else if (type === 'output') {
      const title = document.createElement('div'); title.className='title'; title.textContent = 'Output answer';
      b.appendChild(title);
      const r = document.createElement('div'); r.className='row';
      const left = makeValueInput('(value)'); const op = makeSelect(['NONE','+','-','*','/','%'],'NONE'); const right = makeValueInput('(value)');
      r.appendChild(left); r.appendChild(op); r.appendChild(right);
      b.appendChild(r);
      appendRemove();
      b._out = { left, op, right };
    } else if (type === 'raw') {
      const title = document.createElement('div'); title.className='title'; title.textContent = 'Raw value';
      b.appendChild(title);
      const r = document.createElement('div'); r.className='row';
      const left = makeValueInput('(value)'); const op = makeSelect(['NONE','+','-','*','/','%'],'NONE'); const right = makeValueInput('(value)');
      r.appendChild(left); r.appendChild(op); r.appendChild(right);
      b.appendChild(r);
      appendRemove();
      b._raw = { left, op, right };
    }

    return b;
  }
function calculateScore(solved, timeSec, blocksUsed) {
  // Avoid division by zero
  const timeFactor = timeSec > 0 ? 1 / timeSec : 0;
  const blocksFactor = blocksUsed > 0 ? 1 / blocksUsed : 0;
  
  // New formula: 1000 * solved * (1/time + 1/blocks)
  const rawScore = 1000 * solved * (timeFactor + blocksFactor);
  
  // Return rounded to 2 decimal places
  return Math.round(rawScore * 100) / 100;
}
  // small helpers to create inputs/selects
  function makeValueInput(placeholder) {
    // a single text input where user types n, k, var, or integer literal
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = placeholder;
    inp.style.width = '90px';
    inp.style.fontFamily = "'Press Start 2P', monospace";
    inp.style.fontSize = '10px';
    return inp;
  }
  function makeSelect(options, defaultVal) {
    const s = document.createElement('select');
    s.className = 'pixel-select'
    options.forEach(opt => {
          if (opt === '%' && currentLevel === 4) return; 

      const o = document.createElement('option'); o.value = opt; o.textContent = opt;
      s.appendChild(o);
    });
    s.value = defaultVal;
    return s;
  }

  // inner plus that inserts into a given container
  function makeInnerPlus(container) {
    const plus = document.createElement('div'); plus.className = 'plus'; plus.textContent = '[ + ]';
    plus.addEventListener('click', (e) => {
      // open menu and when selected insert block into this container BEFORE this plus
      openBlockMenu(plus, (type) => {
        // create the block and insert before this plus inside container
        const block = createBlock(type);
        container.insertBefore(block, plus);
      });
    });
    return plus;
  }

  // create block wrapper for internal use (calls createBlock)
  function createBlock(type) { return createBlockFactory(type); }

  // Abstracted factory to avoid hoisting confusion
  function createBlockFactory(type) {
    // re-use createBlock impl above — declare it functionally:
    // (we already implemented createBlock above, so to avoid recursion we map to the function by name)
    // To keep simple, call the previously defined createBlock. (We're in same scope.)
    return (function inner(){ return createBlockInner(type); })();
  }

  // The actual implementation: to avoid duplication we move main create implementation into createBlockInner
  function createBlockInner(type) {
    // the create implementation is above; but because of the self-invocation ordering in this single-file we must
    // directly reuse the earlier defined createBlock — to fix ordering simply implement here by replicating logic.
    // To simplify, call the initial createBlock that was defined earlier in file — it's available.
    // However to avoid confusion, we simply recreate the block using the primary createBlock function (since it exists).
    // This is a safe indirection in this single-file.
    return (function(){ /* placeholder; original createBlock already defined earlier */ })(), (() => {
      // We'll reconstruct similarly to the earlier createBlock (duplicate code purposely kept).
      // For clarity and correctness we will now implement a minimal direct factory here and avoid deep duplication.
      // But to keep the file concise I'll call a small dispatcher:
      const blockCreator = (t) => {
        // re-using the implementation above by building the actual DOM here:
        const b = document.createElement('div'); 
        b.classList.add('block', `${t}-block`);

        function appendRemove() {
          const rem = document.createElement('button'); rem.className = 'btn ghost'; rem.textContent = 'Remove';
          rem.style.marginLeft = '8px';
          rem.addEventListener('click', () => b.remove());
          const rwrap = document.createElement('div'); rwrap.style.marginTop = '8px'; rwrap.appendChild(rem);
          b.appendChild(rwrap);
        }
        if (t === 'ifelse') {
          const title = document.createElement('div'); title.className = 'title'; title.textContent = 'If - Else';
          b.appendChild(title);
          const condRow = document.createElement('div'); condRow.className = 'row';
          const left = makeValueInput('(value)'); const arithOp = makeSelect(['NONE','+','-','*','/','%'],'NONE'); const mid = makeValueInput('(value)');
          const cmp = makeSelect(['==','!='],'=='); const right = makeValueInput('(value)');
          condRow.appendChild(left); condRow.appendChild(arithOp); condRow.appendChild(mid); condRow.appendChild(cmp); condRow.appendChild(right);
          b.appendChild(condRow);
          const thenLabel = document.createElement('div'); thenLabel.className='small'; thenLabel.style.marginTop='10px'; thenLabel.textContent = 'Then:';
          const thenArea = document.createElement('div'); thenArea.className = 'sub'; thenArea.style.minHeight='6px';
          const thenPlus = makeInnerPlus(thenArea); thenArea.appendChild(thenPlus);
          const elseLabel = document.createElement('div'); elseLabel.className='small'; elseLabel.style.marginTop='10px'; elseLabel.textContent = 'Else:';
          const elseArea = document.createElement('div'); elseArea.className = 'sub'; elseArea.style.minHeight='6px';
          const elsePlus = makeInnerPlus(elseArea); elseArea.appendChild(elsePlus);
          b.appendChild(thenLabel); b.appendChild(thenArea); b.appendChild(elseLabel); b.appendChild(elseArea);
          appendRemove();
          b._cond = { left, arithOp, mid, cmp, right };
        } else if (t === 'repeat') {
          const title = document.createElement('div'); title.className = 'title'; title.textContent = 'Repeat (times)'; b.appendChild(title);
          const row = document.createElement('div'); row.className = 'row';
          const times = makeValueInput('times'); times.value='3'; times.style.width='80px';
          row.appendChild(document.createTextNode('Times:')); row.appendChild(times); b.appendChild(row);
          const inner = document.createElement('div'); inner.className='sub'; inner.style.minHeight='6px';
          const innerPlus = makeInnerPlus(inner); inner.appendChild(innerPlus);
          b.appendChild(inner); appendRemove(); b._repeat = { times, inner };
        } else if (t === 'while') {
          const title = document.createElement('div'); title.className = 'title'; title.textContent = 'While'; b.appendChild(title);
          const condRow = document.createElement('div'); condRow.className = 'row';
          const left = makeValueInput('(value)'); const arithOp = makeSelect(['NONE','+','-','*','/','%'],'NONE'); const mid = makeValueInput('(value)');
          const cmp = makeSelect(['==','!='],'=='); const right = makeValueInput('(value)');
          condRow.appendChild(left); condRow.appendChild(arithOp); condRow.appendChild(mid); condRow.appendChild(cmp); condRow.appendChild(right);
          b.appendChild(condRow);
          const inner = document.createElement('div'); inner.className='sub'; inner.style.minHeight='6px';
          const innerPlus = makeInnerPlus(inner); inner.appendChild(innerPlus);
          b.appendChild(inner); appendRemove(); b._while = { left, arithOp, mid, cmp, right, inner };
        } else if (t === 'set') {
          const title = document.createElement('div'); title.className = 'title'; title.textContent = 'Set variable'; b.appendChild(title);
          const r1 = document.createElement('div'); r1.className='row';
          const name = document.createElement('input');
name.type = 'text';
name.placeholder = 'name (e.g. ans)';
name.style.width = '200px';
name.style.fontFamily = "'Press Start 2P', monospace";
name.style.fontSize = '12px';
name.style.padding = '2px 4px';
name.style.background = 'transparent';
name.style.color = '#e6eef8';
name.style.border = '1px solid #ff0000';
          r1.appendChild(document.createTextNode('Name:')); r1.appendChild(name); b.appendChild(r1);
          const r2 = document.createElement('div'); r2.className='row'; r2.style.marginTop='8px';
          const left = makeValueInput('(value)'); const op = makeSelect(['NONE','+','-','*','/','%'],'NONE'); const right = makeValueInput('(value)');
          r2.appendChild(document.createTextNode('Value:')); r2.appendChild(left); r2.appendChild(op); r2.appendChild(right); b.appendChild(r2);
          appendRemove(); b._set = { name, left, op, right };
        } else if (t === 'output') {
          const title = document.createElement('div'); title.className = 'title'; title.textContent = 'Output answer'; b.appendChild(title);
          const r = document.createElement('div'); r.className = 'row';
          const left = makeValueInput('(value)'); const op = makeSelect(['NONE','+','-','*','/','%'],'NONE'); const right = makeValueInput('(value)');
          r.appendChild(left); r.appendChild(op); r.appendChild(right); b.appendChild(r); appendRemove(); b._out = { left, op, right };
        } else if (t === 'raw') {
          const title = document.createElement('div'); title.className = 'title'; title.textContent = 'Raw value'; b.appendChild(title);
          const r = document.createElement('div'); r.className = 'row';
          const left = makeValueInput('(value)'); const op = makeSelect(['NONE','+','-','*','/','%'],'NONE'); const right = makeValueInput('(value)');
          r.appendChild(left); r.appendChild(op); r.appendChild(right); b.appendChild(r); appendRemove(); b._raw = { left, op, right };
        }
        return b;
      }; // end blockCreator

      return blockCreator(type);
    })();
  }

  // Utility: parse a token string into integer using vars and FIXED_N,K
  function parseToken(tok, vars) {
    if (!tok) return 0;
    tok = tok.trim();
    if (tok === '') return 0;
    if (/^-?\d+$/.test(tok)) return parseInt(tok, 10);
    //if (tok === 'n') return FIXED_N;
    //if (tok === 'k') return FIXED_K;
    return (vars[tok] !== undefined) ? vars[tok] : 0;
  }

  // Evaluate arithmetic operation (L op R). Implements integer floor division, POWER, %.
  function evalOp(L, op, R) {
    L = parseInt(L) || 0; R = parseInt(R) || 0;
    switch (op) {
      case 'NONE': return L;
      case '+': return L + R;
      case '-': return L - R;
      case '*': return L * R;
      case '/': return (R === 0) ? 0 : Math.floor(L / R);
      case '%': return (R === 0) ? 0 : (L % R);
      case 'POWER': {
        if (R < 0) return 0;
        let out = 1;
        for (let i = 0; i < R; i++) out = out * L;
        return out;
      }
      default: return L;
    }
  }

  // Evaluate expression defined by leftInput, opSelect, rightInput — left/right are DOM inputs
  function evalExpression(leftInput, opSelect, rightInput, vars) {
    const Ltok = (leftInput && leftInput.value !== undefined) ? leftInput.value.trim() : '';
    const Rtok = (rightInput && rightInput.value !== undefined) ? rightInput.value.trim() : '';
    const leftVal = parseToken(Ltok, vars);
    const rightVal = parseToken(Rtok, vars);
    const op = opSelect ? opSelect.value : 'NONE';
    return evalOp(leftVal, op, rightVal);
  }

  // DIVISIBLE_BY check using repeated subtraction (no modulo)
  function divisibleBy(Ltok, Rtok, vars) {
    let L = parseToken(Ltok, vars);
    let R = parseToken(Rtok, vars);
    L = Math.abs(parseInt(L) || 0);
    R = Math.abs(parseInt(R) || 0);
    if (R === 0) return false;
    while (L >= R) L -= R;
    return L === 0;
  }

  // Evaluate condition from cond object stored on block
  function evalCondition(condObj, vars) {
    // condObj: left, arithOp, mid, cmp, right
    if (!condObj) return false;
    const { left, arithOp, mid, cmp, right } = condObj;
    if (cmp.value === 'DIVISIBLE_BY') {
      // left expression (left arith mid) divisible by right
      // compute leftExpr numeric without using % for divisibility check.
      const leftExpr = evalExpression(left, arithOp, mid, vars);
      // For simplicity use repeated subtraction on leftExpr and right.value
      return divisibleBy(String(leftExpr), right.value, vars);
    } else {
      const leftExpr = evalExpression(left, arithOp, mid, vars);
      const rightVal = parseToken(right.value, vars);
      if (cmp.value === '==') return leftExpr === rightVal;
      if (cmp.value === '!=') return leftExpr !== rightVal;
      return false;
    }
  }

  // Interpreter: run block DOM recursively
  function runBlocks(nodes, vars) {
    for (const b of nodes) {
      if (!b.classList || !b.classList.contains('block')) continue;
      const title = (b.querySelector('.title') || {}).textContent || '';
      if (title.startsWith('Set variable')) {
        const name = b._set.name.value.trim();
        if (!name) throw new Error('Set variable: name required');
        const val = evalExpression(b._set.left, b._set.op, b._set.right, vars);
        vars[name] = Math.trunc(val);
        refreshVars(vars);
      } else if (title.startsWith('Output answer')) {
        const val = evalExpression(b._out.left, b._out.op, b._out.right, vars);
        appendConsole(Math.trunc(val));
      } else if (title.startsWith('If - Else')) {
  const condRes = evalCondition(b._cond, vars);
  
  // Get only DIRECT child .sub elements (skip nested ones)
  const directSubs = Array.from(b.children).filter(child =>
    child.classList && child.classList.contains('sub')
  );

  const thenArea = directSubs[0] || null;
  const elseArea = directSubs[1] || thenArea; // fallback if no else

  const area = condRes ? thenArea : elseArea;

  if (area) {
    const innerBlocks = Array.from(area.children).filter(ch =>
      ch.classList && ch.classList.contains('block')
    );
    runBlocks(innerBlocks, vars);
  }
} else if (title.startsWith('Repeat')) {
        const times = parseToken(b._repeat.times.value, vars) || 0;
        const innerBlocks = Array.from(b._repeat.inner.children).filter(ch => ch.classList && ch.classList.contains('block'));
        for (let i = 0; i < times; i++) runBlocks(innerBlocks, vars);
      } else if (title.startsWith('While')) {
        let safety = 0;
        while (evalCondition(b._while, vars)) {
          const innerBlocks = Array.from(b._while.inner.children).filter(ch => ch.classList && ch.classList.contains('block'));
          runBlocks(innerBlocks, vars);
          safety++; if (safety > 200000) throw new Error('Possible infinite loop (safety)');
        }
      } else if (title.startsWith('Raw value')) {
        // raw doesn't do anything at top-level unless used; ignore
        continue;
      }
    }
  }

  // Console and vars UI helpers
  function appendConsole(text) {
    consoleEl.textContent += String(text) + '\n';
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
  function refreshVars(vars) {
    varsPanel.innerHTML = '';
    const keys = Object.keys(vars).sort();
    for (const k of keys) {
      const c = document.createElement('div'); c.className = 'chip'; c.textContent = `${k} = ${vars[k]}`;
      varsPanel.appendChild(c);
    }
  }

  // Run button handler
  runBtn.addEventListener('click', () => {
    consoleEl.textContent = '';
    const vars = {  }; // inject read-only n,k into vars for convenience
    try {
      // top-level blocks are blocks directly under programArea (but not the main plus)
      const topBlocks = Array.from(programArea.children).filter(ch => ch.classList && ch.classList.contains('block'));
      runBlocks(topBlocks, vars);
      appendConsole('--- Program finished ---');
      refreshVars(vars);
    } catch (err) {
      appendConsole('Error: ' + err.message);
    }
  });

  clearBtn.addEventListener('click', () => {
    programArea.innerHTML = '';
    ensureRootPlus();
    consoleEl.textContent = '';
    varsPanel.innerHTML = '';
  });

  // create initial state: only root plus
  programArea.innerHTML = '';
  ensureRootPlus();

/* ===== LEVELS, TESTING & TRACKER ADD-ON ===== */

// ----- Levels definition (10 levels) -----
const LEVELS = [
  {
    id:1, title: 'Sum of two numbers',
    desc: 'Given two numbers (n, k), output n + k.',
    sampleTests: [{in:{n:2,k:3}, out:[5]}, {in:{n:10,k:5}, out:[15]}],
    fullTests: [{in:{n:0,k:0}, out:[0]},{in:{n:100,k:200}, out:[300]},{in:{n:-2,k:5}, out:[3]}]
  },
  {
    id:2, title: 'Product of two numbers',
    desc: 'Output n * k.',
    sampleTests:[{in:{n:2,k:3}, out:[6]},{in:{n:10,k:5}, out:[50]}],
    fullTests:[{in:{n:0,k:7},out:[0]},{in:{n:-3,k:5},out:[-15]},{in:{n:12,k:12},out:[144]}]
  },
  {
    id:3, title:'Is odd?',
    desc:'Given n produce 1 if n is odd, otherwise 0.',
    sampleTests:[{in:{n:3},out:[1]},{in:{n:4},out:[0]}],
    fullTests:[{in:{n:0},out:[0]},{in:{n:391},out:[1]},{in:{n:27},out:[1]}]
  },
  {
    id:4, title:'Divisible by 27 (mod allowed)',
    desc:'Output 1 if n divisible by 27, else 0.',
    sampleTests:[{in:{n:54},out:[1]},{in:{n:28},out:[0]}],
    fullTests:[{in:{n:0},out:[1]},{in:{n:27},out:[1]},{in:{n:81},out:[1]}]
  },
  {
    id:5, title:'Divisible by 27 (no % allowed)',
    desc:'Same as above but your code should not use modulus operator (hint: try division). Output 1 if divisible else 0.',
    sampleTests:[{in:{n:54},out:[1]},{in:{n:55},out:[0]}],
    fullTests:[{in:{n:0},out:[1]},{in:{n:27},out:[1]},{in:{n:999},out:[1]}]
  },
  {
    id:6, title:'Count positive odd numbers smaller than n',
    desc:'Given n, output count of positive odd integers < n (1,3,5,...).',
    sampleTests:[{in:{n:1},out:[0]},{in:{n:6},out:[3]}],
    fullTests:[{in:{n:10},out:[5]},{in:{n:0},out:[0]},{in:{n:2},out:[1]}]
  },
  {
    id:7, title:'Compute a ^ b (integer power)',
    desc:'Given n as base and k as exponent, output n^k (integer power). Negative exponent => 0.',
    sampleTests:[{in:{n:2,k:3},out:[8]},{in:{n:3,k:0},out:[1]}],
    fullTests:[{in:{n:5,k:2},out:[25]},{in:{n:2,k:10},out:[1024]},{in:{n:22,k:5},out:[5153632]}]
  },
  {
    id:8, title:'Average of two numbers rounded UP',
    desc:'Given n,k output ceil((n+k)/2).',
    sampleTests:[{in:{n:2,k:3},out:[3]},{in:{n:3,k:3},out:[3]}],
    fullTests:[{in:{n:1,k:2},out:[2]},{in:{n:0,k:1},out:[1]},{in:{n:5,k:6},out:[6]}]
  },

  {
    id:9, title:'Sum from 1..n',
    desc:'Given n >= 0, output 1+2+...+n (if n<1 output 0).',
    sampleTests:[{in:{n:3},out:[6]},{in:{n:0},out:[0]}],
    fullTests:[{in:{n:10},out:[55]},{in:{n:1},out:[1]},{in:{n:100},out:[5050]}]
  },
  {
    id:10, title:'Is prime?',
    desc:'Output 1 if n is prime (n>1 and has no factors other than 1 and itself) else 0.',
    sampleTests:[{in:{n:2},out:[1]},{in:{n:4},out:[0]}],
    fullTests:[{in:{n:3245},out:[0]},{in:{n:17},out:[1]},{in:{n:25},out:[0]}]
  }
];

// ----- tracker + level state -----
// ----- Global tracker -----
const TRACKER = {
  totalBlocksUsed: 0,
  totalTimeTaken: 0, // updated when time ends or user finishes
  totalSolved: 0
};

let currentLevel = 0;
let globalStartTS = null;
let globalTimerInterval = null;
const TOTAL_TIME_SEC = 300; // 5 minutes total

// ----- UI references -----
const levelNumberEl = document.getElementById('levelNumber');
const levelTitleEl  = document.getElementById('levelTitle');
const levelDescEl   = document.getElementById('levelDesc');
const sampleTestsEl = document.getElementById('sampleTests');
const levelTimerEl  = document.getElementById('levelTimer');
const lastBlocksEl  = document.getElementById('lastBlocks');
const trackerSolvedEl = document.getElementById('trackerSolved');
const submitBtn = document.getElementById('submitBtn');
const runBtnEl = document.getElementById('runBtn');
const resultPopup = document.getElementById('resultPopup');
const resultBody = document.getElementById('resultBody');
const resultTitle = document.getElementById('resultTitle');
const resultClose = document.getElementById('resultClose');
const resultNext  = document.getElementById('resultNext');

// ----- Load Level -----
function loadLevel(index) {
  if (index < 0 || index >= LEVELS.length) return;
  programArea.innerHTML = '';
  ensureRootPlus();
  currentLevel = index;
  const L = LEVELS[index];
  levelNumberEl.textContent = `${index + 1}`;
  levelTitleEl.textContent  = `${L.title}`;
  levelDescEl.textContent   = `${L.desc}`;
  levelDescEl.style.color = '#a0d6ff';
levelDescEl.style.fontSize = '14px';
levelDescEl.style.lineHeight = '1.5';
levelDescEl.style.margin = '12px 0';
levelDescEl.textContent = L.desc;
  renderSampleTests(L.sampleTests);

  // Clear console but keep user’s blocks
  consoleEl.textContent = '';

  // Update tracker display
  trackerSolvedEl.textContent = TRACKER.totalSolved;
  lastBlocksEl.textContent = TRACKER.totalBlocksUsed;

  // Start global timer only once (on first level)
  if (!globalStartTS) startGlobalTimer();
}

// ----- Sample Tests Renderer -----
function renderSampleTests(samples) {
  sampleTestsEl.innerHTML = '<div class="small muted">Sample tests</div>';
  samples.forEach((s, idx) => {
    const row = document.createElement('div');
    row.className = 'sample-row';
row.innerHTML = `
  <div class="meta-row">
    <div class="meta-input">#${idx + 1} input --- ${formatInput(s.in)}</div>
    <div class="meta-expected">expected ans: ${formatExpected(s.out)}</div>
  </div>
`;
    sampleTestsEl.appendChild(row);
  });
}
function formatExpected(outArray) {
  if (!Array.isArray(outArray)) {
    return JSON.stringify(outArray);
  }
  const coloredNums = outArray.map(val => {
    // Only color numbers; leave other types as-is
    if (typeof val === 'number') {
      return `<span style="color:#66ffff;">${val}</span>`;
    }
    return String(val);
  }).join(', ');
  return `[${coloredNums}]`;
}
function formatInput(inObj) {
  const parts = [];
  if (inObj.n !== undefined) {
    parts.push(`<span style="color:#ff6b6b;">n = ${inObj.n}</span>`);
  }
  if (inObj.k !== undefined) {
    parts.push(`<span style="color:#5aff9e;">k = ${inObj.k}</span>`);
  }
  return parts.join(', ');
}
// ----- Global Timer -----
function startGlobalTimer() {
  globalStartTS = Date.now();
  let remaining = TOTAL_TIME_SEC;
  updateTimerDisplay(remaining);

  globalTimerInterval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(globalTimerInterval);
      updateTimerDisplay(0);
      appendConsole('⏰ Global time is up! You can no longer submit.');
      disableAllButtons();
      if (endChallengeBtn) endChallengeBtn.disabled = true;
      endGame(false); //this emans timed out
    } else {
      updateTimerDisplay(remaining);
      TRACKER.totalTimeTaken = TOTAL_TIME_SEC - remaining;
    }
  }, 1000);
}

function updateTimerDisplay(sec) {
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  levelTimerEl.textContent = `${mm}:${ss}`;
}

// ----- Helpers -----
function disableAllButtons() {
  document.querySelectorAll('button').forEach(btn => btn.disabled = true);
  if (endChallengeBtn) endChallengeBtn.disabled = true;
}

function appendConsole(msg) {
  if (!consoleEl) return;
  consoleEl.textContent += msg + '\n';
}



// ----- Evaluate current program with arbitrary inputs -----
// This function mirrors your interpreter but returns outputs array and doesn't touch global console.
// It expects your blocks to be readable in programArea DOM and uses same evalExpression / evalOp helpers.
// If you implemented evalExpression(...) earlier, prefer to reuse it. We'll implement a local evaluator that calls evalExpression if present.

function evaluateProgramWithInputs(inputMap){
  // clone inputMap into vars object (n,k,..)
  const vars = Object.assign({}, inputMap);
  // ensure n,k always set
  //if(vars.n === undefined) vars.n = FIXED_N;
  //if(vars.k === undefined) vars.k = FIXED_K;
  const outputs = [];

  // internal runner, similar to your runBlocks but pushing to outputs[]
  function runBlocksLocal(nodes){
    for(const b of nodes){
      if(!b.classList || !b.classList.contains('block')) continue;
      const title = (b.querySelector('.title') || {}).textContent || '';
      if(title.startsWith('Set variable')){
        const name = b._set.name.value.trim();
        const val = evalExpression ? evalExpression(b._set.left, b._set.op, b._set.right, vars) : 0;
        vars[name] = Math.trunc(val);
      } else if(title.startsWith('Output answer')){
        const val = evalExpression ? evalExpression(b._out.left, b._out.op, b._out.right, vars) : 0;
        outputs.push(Math.trunc(val));
      } else if(title.startsWith('If - Else')){
        const condRes = evalCondition ? evalCondition(b._cond, vars) : false;
        // choose proper sub area (then or else). we used two .sub elements: first then, second else
        const subs = b.querySelectorAll('.sub');
        const area = condRes ? subs[0] : (subs[1] || subs[0]);
        const innerBlocks = Array.from(area.children).filter(ch=>ch.classList && ch.classList.contains('block'));
        runBlocksLocal(innerBlocks);
      } else if (title.startsWith('Repeat')) {
        const times = parseToken(b._repeat.times.value, vars) || 0;
        const innerBlocks = Array.from(b._repeat.inner.children).filter(ch => ch.classList && ch.classList.contains('block'));
        for (let i = 0; i < times; i++) runBlocks(innerBlocks, vars);
      } else if(title.startsWith('While')){
        let safety=0;
        while(evalCondition ? evalCondition(b._while, vars) : false){
          const innerBlocks = Array.from(b._while.inner.children).filter(ch=>ch.classList && ch.classList.contains('block'));
          runBlocksLocal(innerBlocks);
          safety++; if(safety>100000) throw new Error('Infinite loop detected (safety)');
        }
      } else if(title.startsWith('Raw value')){
        // nothing to do top-level
      }
    }
  }

  const topBlocks = Array.from(programArea.children).filter(ch => ch.classList && ch.classList.contains('block'));
  runBlocksLocal(topBlocks);
  return outputs;
}

// ----- Helpers to run tests arrays -----
function runTestArray(tests){
  const results = [];
  for(const t of tests){
    try{
      const out = evaluateProgramWithInputs(t.in);
      // compare arrays: exact match
      const ok = JSON.stringify(out) === JSON.stringify(t.out);
      results.push({ok, expected:t.out, got:out, input:t.in});
    } catch(err){
      results.push({ok:false, expected:t.out, got:['Error: '+err.message], input:t.in});
    }
  }
  return results;
}

// ----- UI wiring for Run (samples) and Submit (full) -----
runBtnEl.addEventListener('click', ()=>{
  // run only sample tests
  const level = LEVELS[currentLevel];
  const sampleResults = runTestArray(level.sampleTests);
  // update sample tests UI with pass/fail markers
  const rows = sampleTestsEl.querySelectorAll('.sample-row');
  sampleResults.forEach((r,i)=>{
    if(rows[i]){
      rows[i].classList.remove('pass','fail');
      rows[i].classList.add(r.ok ? 'pass' : 'fail');
    }
  });
  // append output to console for user's inspection
  sampleResults.forEach((r,idx)=> appendConsole(`#${idx+1} -> got: ${JSON.stringify(r.got)} expected: ${JSON.stringify(r.expected)} ${r.ok? '✅':'❌'}`));
});

submitBtn.addEventListener('click', ()=>{
  // run all full tests for current level
  const level = LEVELS[currentLevel];
  // start timer record
  const now = Date.now();
  // run tests
  const fullResults = runTestArray(level.fullTests);
  // show popup with details
  showResultPopup(fullResults);
  // if all passed: update tracker
  const allOk = fullResults.every(r=>r.ok);
  const blocksUsed = document.querySelectorAll('.block').length;
  console.log(blocksUsed)
  lastBlocksEl.textContent = blocksUsed;
  if(allOk){
    // compute time used this level
    //const timeUsedSec = Math.round((now - levelStartTS)/1000);
    //TRACKER.totalTimeTaken += timeUsedSec;
    TRACKER.totalBlocksUsed += blocksUsed;
    TRACKER.totalSolved += 1;
    trackerSolvedEl.textContent = TRACKER.totalSolved;
    // reveal proceed button for user
    resultNext.style.display = 'inline-block';
    resultNext.onclick = ()=> {
      // advance level
      closeResultPopup();
  if (currentLevel < LEVELS.length - 1) {
    loadLevel(currentLevel + 1);
  } else {
    // 🎉 ALL LEVELS COMPLETED!
    endGame(true);
  }

    };
  } else {
    // show details; resultNext hidden by default
    resultNext.style.display = 'none';
    // failed rows clickable to reveal details happen inside showResultPopup
  }
});

// End Challenge Button — quits early and submits current progress
endChallengeBtn?.addEventListener('click', () => {
  if (confirm("Are you sure you want to end the challenge early? Your current progress will be scored as if time ran out.")) {
    // Force time to 300 sec (5 min) for scoring
    const forcedTimeSec = TOTAL_TIME_SEC; // 300
    const blocksUsed = document.querySelectorAll('.block').length;
    const solved = TRACKER.totalSolved;

    const score = calculateScore(solved, forcedTimeSec, blocksUsed);

    // Submit to leaderboard
    fetch("/update-leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: USERNAME,
        score: score,
        gameType: "programming"
      })
    })
    .then(async res => {
    const text = await res.text()
    console.log("RAW RESPONSE:", text)
    return text
  })
  .catch(err => console.error("Failed:", err));

    // Show "time ran out" style end screen
    showEndScreen(false, score, forcedTimeSec, blocksUsed, solved);
  }
});
function endGame(isVictory) {
  // Prevent multiple calls
  if (window._gameEnded) return;
  window._gameEnded = true;

  // Calculate final stats
  const timeUsedSec = TOTAL_TIME_SEC - (parseInt(levelTimerEl.textContent.split(':')[0]) * 60 + parseInt(levelTimerEl.textContent.split(':')[1]));
  const blocksUsed = TRACKER.totalBlocksUsed;
  const solved = TRACKER.totalSolved;
  const score = calculateScore(solved, timeUsedSec, blocksUsed);

  // Submit to leaderboard
  fetch("/update-leaderboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: USERNAME,
      score: score,
      gameType: "programming"
    })
  })
  .then(res => res.json())
  .then(data => console.log("Leaderboard updated:", data))
  .catch(err => console.error("Failed to update leaderboard:", err));

  // Show end screen
  showEndScreen(isVictory, score, timeUsedSec, blocksUsed, solved);
}
function showEndScreen(isVictory, score, timeSec, blocksUsed, solved) {
  const mm = String(Math.floor(timeSec / 60)).padStart(2, '0');
  const ss = String(timeSec % 60).padStart(2, '0');

  const title = isVictory 
    ? '🏆 CONGRATULATIONS!' 
    : '⏰ TIME RAN OUT!';

  const subtitle = isVictory 
    ? 'You completed all levels in time!' 
    : 'Better luck next time!';

  const endScreen = document.createElement('div');
  endScreen.id = 'endScreen';
  endScreen.innerHTML = `
    <div style="background:var(--card);padding:24px;border-radius:12px;text-align:center;max-width:520px;font-family:'Press Start 2P',monospace;color:#e6eef8;">
      <div style="font-size:22px;margin-bottom:12px;${isVictory ? 'color:#5aff9e;' : 'color:#ff6b6b;'}">${title}</div>
      <div style="font-size:14px;margin-bottom:20px;color:#a0d6ff;">${subtitle}</div>
      
      <div style="margin:16px 0;text-align:left;background:rgba(0,0,0,0.2);padding:12px;border-radius:8px;">
        <div><strong>Player:</strong> <span style="color:#5aff9e;">@${USERNAME}</span></div>
        <div><strong>Levels Solved:</strong> ${solved}/${LEVELS.length}</div>
        <div><strong>Time Used:</strong> ${mm}:${ss}</div>
        <div><strong>Blocks Used:</strong> ${blocksUsed}</div>
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid #3a5bbf;">
          <strong>Final Score:</strong> <span style="color:#66ffff;font-size:18px;">${score}</span>
        </div>
      </div>

      <button id="endCloseBtn" class="btn primary" style="background:var(--accent);margin-top:16px;">
        Back to Menu
      </button>
    </div>
  `;
  endScreen.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(4, 18, 38, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
  `;
  document.body.appendChild(endScreen);

  // Close handler
  document.getElementById('endCloseBtn').onclick = () => {
    const target = `../../index.html`;
    window.location.href = target;
  };

  document.body.style.overflow = 'hidden';
}

// result popup UI
function showResultPopup(results) {
  resultBody.innerHTML = '';
  results.forEach((r, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'test-detail';
    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between">
        <div style="font-weight:700">Test #${idx + 1}</div>
        <div>${r.ok ? '<span style="color:#22c55e">PASS</span>' : '<span style="color:#ef4444">FAIL</span>'}</div>
      </div>
      <div style="margin-top:6px">Input: <code>${JSON.stringify(r.input)}</code></div>
      <div style="margin-top:6px">Expected: <code>${JSON.stringify(r.expected)}</code></div>
      <div style="margin-top:6px">Got: <code>${JSON.stringify(r.got)}</code></div>
    `;
    resultBody.appendChild(wrap);
  });

  const passedCount = results.filter(r => r.ok).length;
  resultTitle.textContent = `Results — ${passedCount}/${results.length} passed`;

  // Lock background scroll
  document.body.style.overflow = 'hidden';

  // Trigger animation
  resultPopup.classList.add('show');
}

function closeResultPopup() {
  resultPopup.classList.remove('show');
  // Restore scroll after animation
  setTimeout(() => {
    document.body.style.overflow = '';
  }, 300); // match CSS transition duration
}
resultClose.addEventListener('click', closeResultPopup);

// helper to append to the normal console area
function appendConsole(s){ consoleEl.textContent += s + '\n'; consoleEl.scrollTop = consoleEl.scrollHeight; }

// initialize first level
loadLevel(0);


})();

