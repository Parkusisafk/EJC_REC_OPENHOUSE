/* programming.js
   Full block editor & interpreter for the step you requested.
   Save as programming.js and open programming.html.
*/

(() => {
  // fixed inputs
  const FIXED_N = 10;
  const FIXED_K = 5;

  // DOM
  const programArea = document.getElementById('programArea');
  const runBtn = document.getElementById('runBtn');
  const clearBtn = document.getElementById('clearBtn');
  const consoleEl = document.getElementById('console');
  const varsPanel = document.getElementById('varsPanel');
  document.getElementById('dispN').textContent = FIXED_N;
  document.getElementById('dispK').textContent = FIXED_K;

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
    const vars = { n: FIXED_N, k: FIXED_K }; // inject read-only n,k into vars for convenience
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

  // convenience: allow double-clicking a plus to insert default set variable


})();
