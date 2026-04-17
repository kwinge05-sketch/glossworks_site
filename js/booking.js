/* GlossWorks — Booking Page Scripts */

// Cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; });
  (function animateRing(){ rx+=(mx-rx)*0.15; ry+=(my-ry)*0.15; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animateRing); })();

  // Generate date options
  function buildDates() {
    const grid = document.getElementById('date-grid');
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const today = new Date();
    grid.innerHTML = '';
    let count = 0, offset = 1;
    while (count < 8) {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      offset++;
      if (d.getDay() === 0) continue; // skip Sundays
      const id = 'date-' + count;
      const val = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
      grid.innerHTML += `
        <input type="radio" name="date" id="${id}" class="date-option" value="${val}">
        <label for="${id}"><div class="date-card">
          <div class="date-day">${days[d.getDay()]}</div>
          <div class="date-num">${d.getDate()}</div>
          <div class="date-month">${months[d.getMonth()]}</div>
        </div></label>`;
      count++;
    }
  }
  buildDates();

  // Step nav
  let currentStep = 1;
  function goToStep(n) {
    document.getElementById('step-' + currentStep).classList.remove('active');
    document.getElementById('tab-' + currentStep).classList.remove('active');
    if (n > currentStep) document.getElementById('tab-' + currentStep).classList.add('done');
    else document.getElementById('tab-' + (currentStep)).classList.remove('done');

    currentStep = n;
    document.getElementById('step-' + n).classList.add('active');
    document.getElementById('tab-' + n).classList.add('active');
    document.querySelector('.right').scrollTo({ top: 0, behavior: 'smooth' });

    if (n === 4) buildSummary();
  }

  // Step 1 validation — enable button only when service selected
  document.querySelectorAll('input[name="service"]').forEach(r => {
    r.addEventListener('change', () => {
      const btn = document.getElementById('next-1');
      btn.textContent = 'Next: Your Details →';
    });
  });

  function goToStep2() {
    if (!document.querySelector('input[name="service"]:checked')) {
      alert('Please select a service first.');
      return;
    }
    goToStep(2);
  }
  document.getElementById('next-1').onclick = goToStep2;

  // Step 2 validation
  function validateStep2() {
    let valid = true;
    const checks = [
      { id: 'fname', fg: 'fg-fname', test: v => v.trim().length > 0 },
      { id: 'lname', fg: 'fg-lname', test: v => v.trim().length > 0 },
      { id: 'phone', fg: 'fg-phone', test: v => v.trim().length > 6 },
      { id: 'email', fg: 'fg-email', test: v => /\S+@\S+\.\S+/.test(v) },
      { id: 'veh-year', fg: 'fg-year', test: v => v.trim().length > 0 },
    ];
    checks.forEach(({ id, fg, test }) => {
      const el = document.getElementById(id);
      const fg_el = document.getElementById(fg);
      if (!test(el.value)) { fg_el.classList.add('has-error'); valid = false; }
      else { fg_el.classList.remove('has-error'); }
    });
    if (valid) goToStep(3);
  }

  // Step 3 validation
  function validateStep3() {
    const date = document.querySelector('input[name="date"]:checked');
    const time = document.querySelector('input[name="time"]:checked');
    if (!date) { alert('Please select a date.'); return; }
    if (!time) { alert('Please select a time.'); return; }
    goToStep(4);
  }

  // Build summary
  function buildSummary() {
    const svc = document.querySelector('input[name="service"]:checked');
    const svcParts = svc ? svc.value.split('|') : ['—','—','—'];
    const date = document.querySelector('input[name="date"]:checked');
    const time = document.querySelector('input[name="time"]:checked');
    const loc = document.getElementById('location');

    const rows = [
      ['Service', svcParts[0]],
      ['Estimated Price', svcParts[1]],
      ['Duration', svcParts[2]],
      ['Name', `${document.getElementById('fname').value} ${document.getElementById('lname').value}`],
      ['Vehicle', `${document.getElementById('veh-year').value} ${document.getElementById('veh-model').value} ${document.getElementById('veh-color').value}`.trim()],
      ['Date', date ? date.value : '—'],
      ['Time', time ? time.value : '—'],
      ['Location', loc.options[loc.selectedIndex].text],
    ];

    document.getElementById('summary-rows').innerHTML = rows.map((r, i) =>
      `<div class="summary-row${i === rows.length-1 ? '' : ''}">
        <span class="summary-key">${r[0]}</span>
        <span class="summary-val">${r[1]}</span>
      </div>`
    ).join('') + `<div class="summary-row summary-total">
        <span class="summary-key">Starting From</span>
        <span class="summary-val">${svcParts[1]}</span>
      </div>`;
  }

  // Submit
  function submitBooking() {
    document.getElementById('step-4').classList.remove('active');
    document.getElementById('tab-4').classList.add('done');
    document.getElementById('success').classList.add('active');
    document.querySelector('.right').scrollTo({ top: 0, behavior: 'smooth' });
  }