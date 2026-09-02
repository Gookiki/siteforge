if (!document.querySelector('link[href="pages.css"]')) {
  const pageStyles = document.createElement('link');
  pageStyles.rel = 'stylesheet';
  pageStyles.href = 'pages.css';
  document.head.appendChild(pageStyles);
}

if (!document.querySelector('link[href="brand.css"]')) {
  const brandStyles = document.createElement('link');
  brandStyles.rel = 'stylesheet';
  brandStyles.href = 'brand.css';
  document.head.appendChild(brandStyles);
}

document.title = 'Siteforge | Managed websites for small businesses';
document.querySelectorAll('.brand').forEach((brand) => {
  const mark = brand.querySelector('.brand-mark');
  const wordmark = brand.querySelector('.brand-mark + span');
  if (mark) mark.textContent = 'S';
  if (wordmark) wordmark.innerHTML = 'siteforge<span class="brand-dot">.</span>';
});
document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.href = 'mailto:hello@siteforge.systems';
});

const replacements = new Map([
  ['Managed growth systems for HVAC teams', 'Managed growth systems for small businesses'],
  ['High-converting, intelligently managed websites for residential HVAC companies', 'High-converting, intelligently managed websites for small businesses'],
  ['Most HVAC websites', 'Most small-business websites'],
  ['homeowner', 'customer'],
  ['HVAC teams', 'small-business teams'],
  ['HVAC', 'small business'],
  ['CONCEPT PROJECT / HVAC', 'CONCEPT PROJECT / LOCAL BUSINESS'],
  ['LOCAL HEATING & COOLING', 'LOCAL SERVICE BUSINESS'],
  ['Not cooling', 'I need help with a service'],
  ['Residential HVAC repair', 'Service request'],
  ['HVAC replacement', 'Project estimate'],
  ['Maintenance plans', 'Ongoing support'],
  ['Other home service', 'Other small business'],
  ['Air conditioning repair', 'Service request'],
  ['New system installation', 'Project estimate'],
  ['Seasonal maintenance', 'Ongoing support'],
  ['What does your home need?', 'What does your business need?'],
  ['Choose the closest match so we can send the right technician.', 'Choose the closest match so we can route your request well.'],
  ['It is not cooling', 'I need help with a service'],
  ['Strange noise or smell', 'I have a project in mind'],
  ['I need to replace my system', 'I need ongoing support'],
  ['AC repair · $1,200 budget', 'Service request · $1,200 budget'],
  ['Trusted comfort, right on time.', 'Good work, right on time.'],
  ['Your home,', 'Your business,'],
  ['Fast, honest heating and cooling care for every season.', 'Fast, thoughtful support for the work you do every day.'],
  ['Book a service call', 'Start a project'],
  ['24/7 emergency service', 'Responsive support'],
  ['312 homeowners', '312 local customers'],
  ['Licensed & insured', 'Built to be trusted']
]);

const replaceBrandText = (node) => {
  if (node.nodeType === Node.TEXT_NODE && node.parentElement?.tagName !== 'SCRIPT') {
    node.nodeValue = [...replacements.entries()].reduce((text, [from, to]) => text.replaceAll(from, to), node.nodeValue.replace(/Northstar/g, 'Siteforge').replace(/northstar/g, 'siteforge'));
  }
  node.childNodes?.forEach(replaceBrandText);
};
replaceBrandText(document.body);
document.querySelector('.result-service')?.replaceChildren(document.createTextNode('Service request · I need help with a service'));
document.querySelector('.mock-hero small')?.replaceChildren(document.createTextNode('Good work, right on time.'));
document.querySelector('.mock-hero h2')?.replaceChildren(document.createTextNode('Your business,'), document.createElement('br'), Object.assign(document.createElement('i'), { textContent: ' just right.' }));
document.querySelector('.mock-hero p')?.replaceChildren(document.createTextNode('Fast, thoughtful support for the work you do every day.'));
document.querySelector('.mock-hero button')?.replaceChildren(document.createTextNode('Start a project '), Object.assign(document.createElement('span'), { textContent: '→' }));
document.querySelector('.mock-footer')?.replaceChildren(...['Responsive support', '★ 4.9 from 312 local customers', 'Built to be trusted'].map((text) => Object.assign(document.createElement('span'), { textContent: text })));
document.querySelectorAll('meta[name="description"]').forEach((meta) => {
  meta.content = meta.content.replace(/HVAC|residential HVAC/gi, 'small business');
});

const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');

menuToggle?.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const demoMain = document.querySelector('.demo-main');
if (demoMain) {
  const demoState = { service: 'Service request', issue: 'I need help with a service', urgency: 'This week', budget: 'Under $2,000', appointment: 'Today at 2:30 PM' };
  const demoSteps = [
    { label: 'What does your business need?', detail: 'Choose the closest match so we can route your request well.', options: ['I need help with a service', 'I have a project in mind', 'I need ongoing support'], key: 'issue' },
    { label: 'How should we prioritize it?', detail: 'This helps the team respond with the right level of context.', options: ['I need it this week', 'I am researching options', 'It is urgent'], key: 'urgency' },
    { label: 'What kind of investment makes sense?', detail: 'A useful range helps separate a quick fix from a larger opportunity.', options: ['Under $2,000', '$2,000–$8,000', '$8,000+'], key: 'budget' },
    { label: 'When is a good time to talk?', detail: 'Choose a handoff time. A real person would confirm it before booking.', options: ['Today at 2:30 PM', 'Tomorrow at 9:00 AM', 'This week · flexible'], key: 'appointment' }
  ];
  let step = 0;
  const updateDemoProgress = () => {
    document.querySelectorAll('.demo-progress span').forEach((bar, index) => {
      bar.classList.toggle('active', index <= step);
    });
  };
  const renderDemo = () => {
    const current = demoSteps[step];
    const options = current.options.map((option, index) => `<button class="demo-option ${demoState[current.key] === option ? 'selected' : ''}" aria-pressed="${demoState[current.key] === option}" data-demo-value="${option}"><span>${['◌', '◉', '□'][index]}</span>${option}<b>↗</b></button>`).join('');
    demoMain.innerHTML = `<div class="demo-main-top"><span>Step ${step + 2} of 5</span><span class="demo-badge">● Live interaction</span></div><h3>${current.label}</h3><p>${current.detail}</p><div class="demo-options">${options}</div><div class="demo-selection">Selected: <strong>${demoState[current.key]}</strong></div><div class="demo-footer"><button class="demo-back" type="button" ${step === 0 ? 'disabled' : ''}>← Back</button><button class="button button-dark demo-next" type="button">${step === demoSteps.length - 1 ? 'Build the lead' : 'Next question'} <span>→</span></button></div>`;
    demoMain.querySelectorAll('.demo-option').forEach((option) => option.addEventListener('click', () => {
      demoState[current.key] = option.dataset.demoValue;
      renderDemo();
    }));
    demoMain.querySelector('.demo-back')?.addEventListener('click', () => { step -= 1; renderDemo(); });
    demoMain.querySelector('.demo-next')?.addEventListener('click', () => {
      if (step < demoSteps.length - 1) { step += 1; renderDemo(); return; }
      renderLead();
    });
    updateDemoProgress();
  };
  const renderLead = () => {
    const resultType = demoState.service === 'Project estimate' ? 'Estimate-ready opportunity' : demoState.service === 'Ongoing support' ? 'Recurring-revenue opportunity' : demoState.urgency === 'It is urgent' ? 'Priority callback opportunity' : 'Qualified service opportunity';
    demoMain.innerHTML = `<div class="demo-main-top"><span>Step 5 of 5</span><span class="demo-badge">● Ready to route</span></div><div class="demo-lead"><span class="result-kicker">${resultType.toUpperCase()}</span><h3>${resultType}.</h3><p>${demoState.service} · ${demoState.issue}</p><div class="result-fields"><span>Priority <b>${demoState.urgency === 'It is urgent' ? 'High' : 'Normal'}</b></span><span>Budget <b>${demoState.budget}</b></span><span>Appointment <b>${demoState.appointment}</b></span></div><p class="demo-reason">The owner receives the useful context before the first conversation, with a clear next action.</p><button class="text-link demo-reset" type="button">Start another demo ↻</button></div>`;
    step = 4;
    document.querySelectorAll('.demo-progress span').forEach((bar) => bar.classList.add('active'));
    updateDemoProgress();
    demoMain.querySelector('.demo-reset').addEventListener('click', () => { step = 0; renderDemo(); });
  };
  document.querySelectorAll('.service-choice').forEach((choice) => choice.addEventListener('click', () => {
    document.querySelectorAll('.service-choice').forEach((item) => item.classList.remove('active'));
    choice.classList.add('active');
    demoState.service = choice.dataset.service === 'Repair' ? 'Service request' : choice.dataset.service === 'Install' ? 'Project estimate' : 'Ongoing support';
    const servicePrompt = document.querySelector('.demo-sidebar > p');
    if (servicePrompt) servicePrompt.textContent = `${demoState.service} selected`;
    step = 0;
    renderDemo();
  }));
  renderDemo();
}

const chatFaqs = [
  { match: /price|cost|month|fee/i, answer: 'Our managed plans start at $1,200 per month, with onboarding from $1,500. Every engagement begins with an audit so the scope fits the business.' },
  { match: /cancel|leave|own|ownership|domain/i, answer: 'You own your domain and the content we create. After the minimum term, you can cancel with 30 days notice and receive a clean export plus a documented handoff.' },
  { match: /time|long|launch|week/i, answer: 'Most launches take 3–5 weeks after content and access arrive. The process is audit, plan, build, test, launch, then ongoing improvement.' },
  { match: /ai|bot|accuracy|autom/i, answer: 'AI stays bounded: it answers from approved sources, follows guardrails, logs usage, and hands unclear questions to a human.' },
  { match: /crm|lead|form|follow/i, answer: 'We can qualify inquiries, collect useful context, route leads to your CRM, notify your team, and support follow-up.' }
];
const chatRoot = document.createElement('div');
chatRoot.className = 'site-chat';
chatRoot.innerHTML = '<button class="chat-fab" type="button" aria-label="Open Siteforge assistant"><span>✦</span><b>Ask Siteforge</b></button><section class="chat-panel" aria-label="Siteforge assistant" hidden><header><div><span class="chat-status"></span> Siteforge assistant</div><button class="chat-close" type="button" aria-label="Close assistant">×</button></header><div class="chat-messages"><div class="chat-message chat-message-bot">Hi. I can answer questions about pricing, ownership, timelines, lead systems, and practical AI.</div><div class="chat-suggestions"><button type="button">What does it cost?</button><button type="button">How long does launch take?</button><button type="button">What happens if I cancel?</button></div></div><form class="chat-form"><input aria-label="Ask a question" placeholder="Ask a question..."><button aria-label="Send question" type="submit">→</button></form></section>';
document.body.appendChild(chatRoot);
const chatPanel = chatRoot.querySelector('.chat-panel');
const chatMessages = chatRoot.querySelector('.chat-messages');
const answerQuestion = (question) => {
  const match = chatFaqs.find((faq) => faq.match.test(question));
  return match ? match.answer : 'That is a good question for a human. Request an audit and include it in the notes; we will reply with a specific answer for your business.';
};
const addChatMessage = (text, type) => {
  const message = document.createElement('div');
  message.className = `chat-message chat-message-${type}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
};
chatRoot.querySelector('.chat-fab').addEventListener('click', () => { chatPanel.hidden = false; chatRoot.querySelector('.chat-fab').hidden = true; chatRoot.querySelector('.chat-form input').focus(); });
chatRoot.querySelector('.chat-close').addEventListener('click', () => { chatPanel.hidden = true; chatRoot.querySelector('.chat-fab').hidden = false; });
chatRoot.querySelectorAll('.chat-suggestions button').forEach((button) => button.addEventListener('click', () => { addChatMessage(button.textContent, 'user'); addChatMessage(answerQuestion(button.textContent), 'bot'); }));
chatRoot.querySelector('.chat-form').addEventListener('submit', (event) => { event.preventDefault(); const input = chatRoot.querySelector('.chat-form input'); const question = input.value.trim(); if (!question) return; addChatMessage(question, 'user'); addChatMessage(answerQuestion(question), 'bot'); input.value = ''; });

const auditForm = document.querySelector('#audit-form');
const success = document.querySelector('.form-success');

auditForm?.addEventListener('submit', (event) => {
  auditForm.querySelectorAll('input, select, textarea').forEach((field, index) => {
    if (!field.name) field.name = field.id || `audit_field_${index + 1}`;
  });
  if (!auditForm.querySelector('[name="_subject"]')) {
    auditForm.insertAdjacentHTML('beforeend', '<input type="hidden" name="_subject" value="New Siteforge website audit request"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_template" value="table">');
  }
  auditForm.action = 'https://formsubmit.co/marseichin@outlook.com';
  auditForm.method = 'POST';
  auditForm.target = 'siteforge-form-response';
  auditForm.hidden = true;
  success.hidden = false;
});

if (auditForm) {
  const responseFrame = document.createElement('iframe');
  responseFrame.name = 'siteforge-form-response';
  responseFrame.title = 'Form submission response';
  responseFrame.hidden = true;
  document.body.appendChild(responseFrame);
}

document.querySelector('.reset-form')?.addEventListener('click', () => {
  auditForm.reset();
  auditForm.hidden = false;
  success.hidden = true;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));