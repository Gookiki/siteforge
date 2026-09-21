const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');

function setMenuState(isOpen) {
  if (!header || !menuToggle) return;
  header.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = header && header.classList.contains('menu-open');
  setMenuState(!isOpen);
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenuState(false);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header && header.classList.contains('menu-open')) {
    setMenuState(false);
    menuToggle?.focus();
  }
});

const demoShell = document.querySelector('.demo-shell');
if (demoShell) {
  const scoringRules = {
    urgentTiming: 25,
    readyToSchedule: 25,
    unavailableService: 15,
    highProjectValue: 20,
    nearTermProject: 15,
    projectReady: 15,
    recurringService: 20,
    multipleLocations: 20,
    immediateStart: 15,
    researchStage: -15
  };

  const questionnaireConfig = {
    urgent: {
      label: 'Urgent service request', shortLabel: 'Urgent service',
      context: 'Urgent requests can be routed to the on-call team.',
      questions: [
        { id: 'timing', label: 'How quickly do you need help?', detail: 'Timing helps the team decide whether this belongs in the on-call queue.', options: ['As soon as possible', 'Within a few days', 'I’m planning ahead'] },
        { id: 'situation', label: 'What best describes the situation?', detail: 'A little context helps the right person prepare before calling.', options: ['The service is completely unavailable', 'It is working, but something is wrong', 'I need an inspection or diagnosis'] },
        { id: 'stage', label: 'Where are you in the process?', detail: 'Buying stage changes the next useful response.', options: ['Ready to schedule', 'Comparing providers', 'Gathering information'] },
        { id: 'contact', label: 'When should the team contact you?', detail: 'The handoff should match the customer’s preferred next step.', options: ['Call as soon as possible', 'Text me first', 'Let me choose a time'] }
      ]
    },
    project: {
      label: 'Project or estimate', shortLabel: 'Project / estimate',
      context: 'Budget and timing help separate immediate projects from early research.',
      questions: [
        { id: 'stage', label: 'What stage is the project in?', detail: 'This separates an active opportunity from a useful early conversation.', options: ['Ready to begin', 'Planning the details', 'Exploring possibilities'] },
        { id: 'budget', label: 'What level of investment are you considering?', detail: 'A range gives the team a sensible starting point without asking for personal details.', options: ['Under $2,000', '$2,000–$8,000', 'More than $8,000', 'Not sure yet'] },
        { id: 'timeline', label: 'When would you like the project completed?', detail: 'Completion timing determines how quickly the sales team should respond.', options: ['Within 30 days', 'Within 1–3 months', 'More than 3 months from now'] },
        { id: 'next', label: 'What would be most useful next?', detail: 'The recommended handoff follows the customer’s preferred action.', options: ['Schedule an estimate', 'Receive a preliminary call', 'Review more information first'] }
      ]
    },
    ongoing: {
      label: 'Ongoing service or maintenance', shortLabel: 'Ongoing service',
      context: 'Recurring requests can be assigned based on location and account capacity.',
      questions: [
        { id: 'relationship', label: 'What kind of relationship are you looking for?', detail: 'The relationship type shapes the account handoff and follow-up.', options: ['Regular maintenance', 'Recurring professional service', 'Help replacing a current provider'] },
        { id: 'frequency', label: 'How frequently do you expect to need service?', detail: 'Frequency helps the team understand potential account value.', options: ['Weekly', 'Monthly', 'Seasonally', 'Not sure yet'] },
        { id: 'locations', label: 'How many locations or properties are involved?', detail: 'Location count affects ownership and capacity planning.', options: ['One', 'Two to five', 'More than five'] },
        { id: 'start', label: 'When would you like service to begin?', detail: 'Start timing determines whether to book discovery or begin a nurture sequence.', options: ['Immediately', 'Within 30 days', 'Later this year'] }
      ]
    }
  };

  const demoState = { branch: null, step: 0, answers: {}, complete: false };
  const totalSteps = 5;
  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const controlledIcon = (text) => {
    const icon = create('span', 'demo-option-icon', text);
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  };
  const currentBranch = () => questionnaireConfig[demoState.branch];
  const currentQuestion = () => demoState.step === 0 ? null : currentBranch()?.questions[demoState.step - 1];
  const contextualMessage = () => {
    const answers = demoState.answers;
    if (demoState.branch === 'urgent' && answers.timing === 'As soon as possible') return 'Urgent requests can be routed to the on-call team.';
    if (demoState.branch === 'project' && answers.budget === 'More than $8,000') return 'A larger project can move directly toward an estimate-ready handoff.';
    if (demoState.branch === 'ongoing' && answers.locations && answers.locations !== 'One') return 'Multiple locations can be assigned based on account capacity.';
    return currentBranch()?.context || 'The next answer changes the useful handoff for the team.';
  };

  function calculateLeadScore() {
    if (!demoState.branch) return 0;
    const answers = demoState.answers;
    let score = 20;
    if (demoState.branch === 'urgent') {
      if (answers.timing === 'As soon as possible') score += scoringRules.urgentTiming;
      if (answers.stage === 'Ready to schedule') score += scoringRules.readyToSchedule;
      if (answers.situation === 'The service is completely unavailable') score += scoringRules.unavailableService;
      if (answers.stage === 'Gathering information') score += scoringRules.researchStage;
    }
    if (demoState.branch === 'project') {
      if (answers.budget === 'More than $8,000') score += scoringRules.highProjectValue;
      if (answers.timeline === 'Within 30 days') score += scoringRules.nearTermProject;
      if (answers.stage === 'Ready to begin') score += scoringRules.projectReady;
      if (answers.stage === 'Exploring possibilities') score += scoringRules.researchStage;
    }
    if (demoState.branch === 'ongoing') {
      if (['Weekly', 'Monthly', 'Seasonally'].includes(answers.frequency)) score += scoringRules.recurringService;
      if (answers.locations === 'Two to five' || answers.locations === 'More than five') score += scoringRules.multipleLocations;
      if (answers.start === 'Immediately') score += scoringRules.immediateStart;
    }
    return Math.max(0, Math.min(100, score));
  }

  function classifyLead() {
    const score = calculateLeadScore();
    const answers = demoState.answers;
    if (demoState.branch === 'urgent') {
      if (answers.timing === 'As soon as possible' && answers.stage === 'Ready to schedule') return { title: 'Priority service lead', temperature: 'High priority', action: 'Call immediately', route: 'Urgent service inbox', owner: 'On-call team notified within five minutes', customer: 'Confirmation with call-back expectation sent' };
      if (answers.stage === 'Gathering information') return { title: 'Nurture opportunity', temperature: 'Early stage', action: 'Add to a follow-up sequence', route: 'Service education queue', owner: 'Team receives a lower-priority context summary', customer: 'Helpful service information confirmation sent' };
      return { title: 'Qualified service opportunity', temperature: score >= 70 ? 'High priority' : 'Qualified', action: 'Send booking options', route: 'Urgent service inbox', owner: 'Service team receives the request context', customer: 'Booking options confirmation sent' };
    }
    if (demoState.branch === 'project') {
      if (answers.budget === 'More than $8,000' && answers.timeline === 'Within 30 days') return { title: 'Estimate-ready opportunity', temperature: 'High priority', action: 'Schedule an estimate', route: 'Sales pipeline', owner: 'Sales notification with project context created', customer: 'Estimate request confirmation and reminders sent' };
      if (answers.stage === 'Exploring possibilities') return { title: 'Long-term project opportunity', temperature: 'Early stage', action: 'Add to a follow-up sequence', route: 'Project nurture queue', owner: 'Sales team receives a research-stage summary', customer: 'Planning resources confirmation sent' };
      return { title: 'Qualified service opportunity', temperature: score >= 70 ? 'High priority' : 'Qualified', action: answers.next === 'Schedule an estimate' ? 'Schedule an estimate' : 'Receive a preliminary call', route: 'Sales pipeline', owner: 'Sales notification with project context created', customer: 'Next-step confirmation sent' };
    }
    if (demoState.answers.locations !== 'One' && demoState.answers.frequency !== 'Not sure yet') return { title: 'Recurring-revenue opportunity', temperature: score >= 70 ? 'High priority' : 'Qualified', action: 'Assign to an account manager', route: 'Account manager', owner: 'Account team notified with service scope', customer: 'Discovery call confirmation sent' };
    return { title: 'Qualified service opportunity', temperature: score >= 70 ? 'High priority' : 'Qualified', action: 'Assign to an account manager', route: 'Account manager', owner: 'Account team receives the relationship context', customer: 'Discovery options confirmation sent' };
  }

  function buildAutomationTimeline(result) {
    const timeline = [
      { label: 'Lead qualified', done: true },
      { label: 'CRM record created', done: true },
      { label: 'Owner notified', done: true },
      { label: 'Customer confirmation sent', done: true },
      { label: 'Follow-up scheduled', done: false }
    ];
    if (result.temperature === 'Early stage') timeline[2].label = 'Nurture owner notified';
    return timeline;
  }

  function updateProgress() {
    const progress = demoShell.querySelector('.demo-progress');
    progress.replaceChildren();
    for (let index = 0; index < totalSteps; index += 1) {
      const bar = create('span', index < demoState.step || demoState.complete ? 'active' : '');
      bar.setAttribute('aria-hidden', 'true');
      progress.appendChild(bar);
    }
  }

  function renderSummary() {
    const summary = demoShell.querySelector('.demo-knowledge');
    const list = summary.querySelector('.demo-knowledge-list');
    list.replaceChildren();
    const entries = [['Request type', currentBranch()?.label], ...Object.entries(demoState.answers).map(([key, value]) => [currentBranch()?.questions.find((question) => question.id === key)?.label, value])];
    entries.filter((entry) => entry[1]).forEach(([label, value]) => {
      const item = create('div', 'demo-knowledge-item');
      item.append(create('span', '', label), create('strong', '', value));
      list.appendChild(item);
    });
    const score = create('div', 'demo-live-score', `Current qualification score: ${calculateLeadScore()}/100`);
    summary.querySelector('.demo-live-score')?.replaceWith(score) || summary.appendChild(score);
    summary.classList.remove('is-updated');
    requestAnimationFrame(() => summary.classList.add('is-updated'));
  }

  function renderQuestion() {
    demoState.complete = false;
    demoShell.replaceChildren();
    const sidebar = create('aside', 'demo-sidebar');
    const brand = create('div', 'demo-brand');
    brand.append(create('span', 'mini-mark', 'CC'), create('strong', '', 'comfortcraft'));
    sidebar.append(brand, create('p', '', demoState.branch ? `${currentBranch().label} selected` : 'What should we help with?'));
    const progress = create('div', 'demo-progress');
    sidebar.append(progress);
    const serviceList = create('div', 'demo-service-list');
    Object.entries(questionnaireConfig).forEach(([key, branch]) => {
      const button = create('button', `service-choice ${demoState.branch === key ? 'active' : ''}`);
      button.type = 'button';
      button.append(create('span', '', branch.label), create('b', '', '→'));
      button.addEventListener('click', () => {
        demoState.branch = key;
        demoState.step = 1;
        demoState.answers = {};
        renderQuestion();
      });
      serviceList.appendChild(button);
    });
    sidebar.append(serviceList, create('small', '', 'INTERACTIVE DEMONSTRATION — ANSWERS ARE NOT SAVED OR SENT'));

    const main = create('div', 'demo-main');
    main.setAttribute('aria-label', 'Interactive lead qualification questionnaire');
    const top = create('div', 'demo-main-top');
    const displayStep = demoState.step === 0 ? 1 : demoState.step + 1;
    top.append(create('span', '', `Step ${displayStep} of ${totalSteps}`), create('span', 'demo-badge', '● Live routing logic'));
    main.append(top);
    const live = create('div', 'demo-live-status');
    live.setAttribute('aria-live', 'polite');
    live.textContent = demoState.step === 0 ? 'Choose a request type to begin.' : `Step ${displayStep} of ${totalSteps}: ${currentQuestion().label}`;
    main.append(live);
    const question = create('section', 'demo-question');
    question.tabIndex = -1;
    if (demoState.step === 0) {
      question.append(create('h3', '', 'Choose the request type'), create('p', '', 'The next questions and the handoff change with the kind of opportunity.'), create('p', 'demo-context-message', 'Start with the path that best matches the conversation you want your team to have.'));
      const options = create('div', 'demo-options');
      Object.entries(questionnaireConfig).forEach(([key, branch], index) => {
        const button = create('button', 'demo-option');
        button.type = 'button';
        button.setAttribute('aria-pressed', 'false');
        button.append(controlledIcon(['◌', '◉', '□'][index]), create('span', '', branch.label), create('b', '', '→'));
        button.addEventListener('click', () => {
          demoState.branch = key;
          demoState.step = 1;
          demoState.answers = {};
          renderQuestion();
        });
        options.appendChild(button);
      });
      question.append(options);
    } else {
      const current = currentQuestion();
      question.append(create('h3', '', current.label), create('p', '', current.detail), create('p', 'demo-context-message', contextualMessage()));
      const options = create('div', 'demo-options');
      current.options.forEach((option, index) => {
        const button = create('button', `demo-option ${demoState.answers[current.id] === option ? 'selected' : ''}`);
        button.type = 'button';
        button.setAttribute('aria-pressed', String(demoState.answers[current.id] === option));
        button.append(controlledIcon(['◌', '◉', '□', '＋'][index % 4]), create('span', '', option), create('b', '', '→'));
        button.addEventListener('click', () => {
          demoState.answers[current.id] = option;
          renderQuestion();
        });
        options.appendChild(button);
      });
      question.append(options);
      const selection = create('div', 'demo-selection', demoState.answers[current.id] ? `Selected: ${demoState.answers[current.id]}` : 'Select one option to continue.');
      question.append(selection);
      const footer = create('div', 'demo-footer');
      const back = create('button', 'demo-back', '← Back');
      back.type = 'button';
      back.addEventListener('click', () => {
        demoState.step -= 1;
        renderQuestion();
      });
      const next = create('button', 'button button-dark demo-next', demoState.step === totalSteps - 1 ? 'Build the lead →' : 'Continue →');
      next.type = 'button';
      next.disabled = !demoState.answers[current.id];
      next.addEventListener('click', () => {
        if (demoState.step === totalSteps - 1) renderLeadPreview();
        else {
          demoState.step += 1;
          renderQuestion();
        }
      });
      footer.append(back, next);
      question.append(footer);
    }
    main.append(question);
    const summary = create('details', 'demo-knowledge');
    summary.open = true;
    summary.append(create('summary', '', 'What the team knows'), create('div', 'demo-knowledge-list'), create('div', 'demo-live-score'));
    const shellContent = create('div', 'demo-question-layout');
    shellContent.append(main, summary);
    demoShell.append(sidebar, shellContent);
    updateProgress();
    renderSummary();
    question.focus();
  }

  function renderLeadPreview() {
    demoState.complete = true;
    const result = classifyLead();
    demoShell.replaceChildren();
    const main = create('div', 'demo-main demo-preview');
    main.setAttribute('aria-label', 'Qualified lead preview');
    const top = create('div', 'demo-main-top');
    top.append(create('span', '', 'Qualified lead preview'), create('span', 'demo-badge', '● Demonstration only'));
    main.append(top);
    const score = calculateLeadScore();
    const heading = create('div', 'demo-preview-heading');
    heading.append(create('span', 'result-kicker', result.title.toUpperCase()), create('h3', '', result.title), create('p', '', 'This is the useful context your team could receive before the first conversation.'));
    const scoreBox = create('div', 'demo-score-box');
    scoreBox.append(create('strong', '', `${score}/100`), create('span', '', result.temperature));
    heading.append(scoreBox);
    main.append(heading);
    const factorLabels = [];
    const answers = demoState.answers;
    if (demoState.branch === 'urgent') {
      if (answers.timing === 'As soon as possible') factorLabels.push(`urgent timing +${scoringRules.urgentTiming}`);
      if (answers.stage === 'Ready to schedule') factorLabels.push(`ready to schedule +${scoringRules.readyToSchedule}`);
      if (answers.situation === 'The service is completely unavailable') factorLabels.push(`service unavailable +${scoringRules.unavailableService}`);
      if (answers.stage === 'Gathering information') factorLabels.push(`research stage ${scoringRules.researchStage}`);
    }
    if (demoState.branch === 'project') {
      if (answers.budget === 'More than $8,000') factorLabels.push(`high project value +${scoringRules.highProjectValue}`);
      if (answers.timeline === 'Within 30 days') factorLabels.push(`near-term completion +${scoringRules.nearTermProject}`);
      if (answers.stage === 'Ready to begin') factorLabels.push(`ready to begin +${scoringRules.projectReady}`);
      if (answers.stage === 'Exploring possibilities') factorLabels.push(`research stage ${scoringRules.researchStage}`);
    }
    if (demoState.branch === 'ongoing') {
      if (['Weekly', 'Monthly', 'Seasonally'].includes(answers.frequency)) factorLabels.push(`recurring service +${scoringRules.recurringService}`);
      if (answers.locations === 'Two to five' || answers.locations === 'More than five') factorLabels.push(`multiple locations +${scoringRules.multipleLocations}`);
      if (answers.start === 'Immediately') factorLabels.push(`immediate start +${scoringRules.immediateStart}`);
    }
    if (!factorLabels.length) factorLabels.push('base context +20');
    const factors = create('p', 'demo-score-explanation', `Rule-based factors: ${factorLabels.slice(0, 3).join(' · ')}`);
    main.append(factors);
    const context = create('div', 'demo-result-section');
    context.append(create('h4', '', 'Captured context'));
    const contextList = create('div', 'demo-captured-context');
    contextList.append(create('span', '', `Request type: ${currentBranch().label}`));
    Object.entries(demoState.answers).forEach(([key, value]) => contextList.append(create('span', '', `${currentBranch().questions.find((question) => question.id === key).label}: ${value}`)));
    context.append(contextList);
    main.append(context);
    const route = create('div', 'demo-result-section demo-route');
    route.append(create('h4', '', 'Recommended next action'), create('strong', '', result.action), create('span', '', `Example routing: ${result.route}`), create('span', '', `Sample owner notification: ${result.owner}`), create('span', '', `Sample customer confirmation: ${result.customer}`));
    main.append(route);
    const timeline = create('div', 'demo-result-section');
    timeline.append(create('h4', '', 'Example automation timeline'));
    const timelineList = create('ol', 'demo-timeline');
    buildAutomationTimeline(result).forEach((item) => {
      const entry = create('li', item.done ? 'complete' : 'scheduled', item.label);
      timelineList.appendChild(entry);
    });
    timeline.append(timelineList);
    main.append(timeline);
    const actions = create('div', 'demo-final-actions');
    const reset = create('button', 'text-link demo-reset', 'Try another path ↻');
    reset.type = 'button';
    reset.addEventListener('click', resetDemo);
    const build = create('a', 'button button-dark', 'Build a flow like this →');
    build.href = 'audit.html';
    actions.append(reset, build);
    main.append(actions);
    const live = create('div', 'demo-live-status');
    live.setAttribute('aria-live', 'polite');
    live.textContent = `${result.title}. ${result.action}.`;
    main.prepend(live);
    demoShell.appendChild(main);
    requestAnimationFrame(() => main.querySelector('h3')?.focus());
  }

  function resetDemo() {
    demoState.branch = null;
    demoState.step = 0;
    demoState.answers = {};
    demoState.complete = false;
    renderQuestion();
  }

  renderQuestion();
}

const chatFaqs = [
  { match: /price|cost|month|fee/i, answer: 'Our managed plans are in the $450–$500 per month range, with onboarding from $500. Every engagement begins with an audit so the scope fits the business.' },
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
const chatFab = chatRoot.querySelector('.chat-fab');
const chatClose = chatRoot.querySelector('.chat-close');
const chatInput = chatRoot.querySelector('.chat-form input');
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

chatFab?.addEventListener('click', () => {
  chatPanel.hidden = false;
  chatFab.hidden = true;
  chatInput?.focus();
});

chatClose?.addEventListener('click', () => {
  chatPanel.hidden = true;
  chatFab.hidden = false;
  chatFab.focus();
});

chatRoot.querySelectorAll('.chat-suggestions button').forEach((button) => {
  button.addEventListener('click', () => {
    addChatMessage(button.textContent, 'user');
    addChatMessage(answerQuestion(button.textContent), 'bot');
  });
});

chatRoot.querySelector('.chat-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = chatInput?.value.trim();
  if (!question) return;
  addChatMessage(question, 'user');
  addChatMessage(answerQuestion(question), 'bot');
  chatInput.value = '';
});

const formSubmitUrl = 'https://formsubmit.co/ajax/siteforgerwebsites@gmail.com';
const forms = document.querySelectorAll('.audit-form');

forms.forEach((form) => {
  const submitButton = form.querySelector('button[type="submit"]');
  const successBox = form.parentElement?.querySelector('.form-success');
  const errorBox = form.querySelector('.form-error');
  const statusBox = form.querySelector('[data-form-status]');
  const honeypot = form.querySelector('input[name="website"]');

  if (errorBox) {
    errorBox.setAttribute('role', 'alert');
    errorBox.setAttribute('aria-live', 'assertive');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!submitButton || submitButton.disabled) return;
    if (!form.reportValidity()) {
      const firstInvalid = form.querySelector(':invalid');
      firstInvalid?.focus();
      return;
    }

    if (honeypot && honeypot.value.trim()) {
      console.warn('Submission blocked by honeypot.');
      return;
    }

    if (window.location.protocol === 'file:') {
      form.submit();
      return;
    }

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    if (errorBox) {
      errorBox.hidden = true;
      errorBox.textContent = '';
    }
    if (statusBox) {
      statusBox.textContent = 'Submitting your request...';
      statusBox.setAttribute('aria-live', 'polite');
    }

    const payload = Object.fromEntries(new FormData(form).entries());
    payload._captcha = payload._captcha || 'false';
    payload._template = payload._template || 'table';
    payload._subject = payload._subject || 'Siteforge audit request';
    payload._replyto = payload.email || payload._replyto || '';

    try {
      const response = await fetch(formSubmitUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json().catch(() => ({}));
      if (result.success === false || result.success === 'false') {
        throw new Error('FormSubmit rejected the submission');
      }

      form.reset();
      if (successBox) {
        successBox.hidden = false;
        form.hidden = true;
      }
      if (statusBox) {
        statusBox.textContent = 'Your request was sent successfully.';
      }
    } catch (errorObject) {
      console.error('Form submission failed:', errorObject instanceof Error ? errorObject.message : 'Unknown error');
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = 'We could not send your request automatically. Your email app should open with the request ready to send, or email siteforgerwebsites@gmail.com directly.';
      }
      if (statusBox) {
        statusBox.textContent = 'We could not send your request right now.';
      }
      const subject = encodeURIComponent('Website audit request');
      const body = encodeURIComponent(Array.from(form.elements)
        .filter((field) => field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)
        .filter((field) => field.name && field.value.trim())
        .map((field) => `${field.name}: ${field.value.trim()}`)
        .join('\n'));
      window.location.href = `mailto:siteforgerwebsites@gmail.com?subject=${subject}&body=${body}`;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });

  if (successBox) {
    const resetButton = successBox.querySelector('.reset-form');
    resetButton?.addEventListener('click', () => {
      form.reset();
      form.hidden = false;
      successBox.hidden = true;
      if (errorBox) {
        errorBox.hidden = true;
        errorBox.textContent = '';
      }
      if (statusBox) {
        statusBox.textContent = '';
      }
      submitButton?.focus();
    });
  }
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
