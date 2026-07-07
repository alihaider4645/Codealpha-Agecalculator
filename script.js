// ---------- Element references ----------
const form = document.getElementById('ageForm');
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');
const resetBtn = document.getElementById('resetBtn');
const copyBtn = document.getElementById('copyBtn');
const copyIcon = document.getElementById('copyIcon');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const yearsEl = document.getElementById('years');
const monthsEl = document.getElementById('months');
const daysEl = document.getElementById('days');
const dayOfWeekEl = document.getElementById('dayOfWeek');
const zodiacEl = document.getElementById('zodiac');
const totalDaysEl = document.getElementById('totalDays');
const totalWeeksEl = document.getElementById('totalWeeks');
const totalMonthsEl = document.getElementById('totalMonths');
const nextBirthdayEl = document.getElementById('nextBirthday');

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ZODIAC_SIGNS = [
  { sign: 'Capricorn', from: [12, 22], to: [1, 19] },
  { sign: 'Aquarius', from: [1, 20], to: [2, 18] },
  { sign: 'Pisces', from: [2, 19], to: [3, 20] },
  { sign: 'Aries', from: [3, 21], to: [4, 19] },
  { sign: 'Taurus', from: [4, 20], to: [5, 20] },
  { sign: 'Gemini', from: [5, 21], to: [6, 20] },
  { sign: 'Cancer', from: [6, 21], to: [7, 22] },
  { sign: 'Leo', from: [7, 23], to: [8, 22] },
  { sign: 'Virgo', from: [8, 23], to: [9, 22] },
  { sign: 'Libra', from: [9, 23], to: [10, 22] },
  { sign: 'Scorpio', from: [10, 23], to: [11, 21] },
  { sign: 'Sagittarius', from: [11, 22], to: [12, 21] }
];

let lastSummary = '';

// ---------- Theme ----------
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(prefersDark ? 'dark' : 'light');

themeToggle.addEventListener('click', function () {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ---------- Clear invalid state as user types ----------
[dayInput, monthInput, yearInput].forEach(function (input) {
  input.addEventListener('input', function () {
    input.classList.remove('invalid');
    errorEl.textContent = '';
  });
});

// ---------- Form submit ----------
form.addEventListener('submit', function (e) {
  e.preventDefault();
  errorEl.textContent = '';
  resultEl.classList.add('hidden');
  [dayInput, monthInput, yearInput].forEach(function (i) { i.classList.remove('invalid'); });

  const day = parseInt(dayInput.value, 10);
  const month = parseInt(monthInput.value, 10);
  const year = parseInt(yearInput.value, 10);

  if (!day || !month || !year) {
    showError('Please fill in day, month, and year.', getMissingFields(day, month, year));
    return;
  }

  if (month < 1 || month > 12) {
    showError('Month must be between 1 and 12.', [monthInput]);
    return;
  }

  if (day < 1 || day > 31) {
    showError('Day must be between 1 and 31.', [dayInput]);
    return;
  }

  if (year < 1900 || year > new Date().getFullYear()) {
    showError('Please enter a realistic birth year.', [yearInput]);
    return;
  }

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  const isValidDate =
    birthDate.getFullYear() === year &&
    birthDate.getMonth() === month - 1 &&
    birthDate.getDate() === day;

  if (!isValidDate) {
    showError('That date does not exist. Please check the values.', [dayInput, monthInput]);
    return;
  }

  if (birthDate > today) {
    showError('Date of birth cannot be in the future.', [dayInput, monthInput, yearInput]);
    return;
  }

  renderResult(birthDate, today);
});

function getMissingFields(day, month, year) {
  const fields = [];
  if (!day) fields.push(dayInput);
  if (!month) fields.push(monthInput);
  if (!year) fields.push(yearInput);
  return fields;
}

function showError(message, fields) {
  errorEl.textContent = message;
  (fields || []).forEach(function (f) { f.classList.add('invalid'); });
}

// ---------- Reset ----------
resetBtn.addEventListener('click', function () {
  form.reset();
  errorEl.textContent = '';
  resultEl.classList.add('hidden');
  [dayInput, monthInput, yearInput].forEach(function (i) { i.classList.remove('invalid'); });
  dayInput.focus();
});

// ---------- Copy result ----------
copyBtn.addEventListener('click', function () {
  if (!lastSummary) return;
  navigator.clipboard.writeText(lastSummary).then(function () {
    copyBtn.classList.add('copied');
    copyIcon.textContent = '✅';
    setTimeout(function () {
      copyBtn.classList.remove('copied');
      copyIcon.textContent = '📋';
    }, 1600);
  }).catch(function () {
    showError('Could not copy to clipboard. Please copy manually.');
  });
});

// ---------- Core calculation ----------
function calculateAge(birthDate, today) {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function getZodiacSign(month, day) {
  for (const entry of ZODIAC_SIGNS) {
    const [fromMonth, fromDay] = entry.from;
    const [toMonth, toDay] = entry.to;

    if (fromMonth === toMonth) {
      if (month === fromMonth && day >= fromDay && day <= toDay) return entry.sign;
    } else {
      if ((month === fromMonth && day >= fromDay) || (month === toMonth && day <= toDay)) {
        return entry.sign;
      }
    }
  }
  return '—';
}

function getNextBirthday(birthDate, today) {
  let next = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (next < today) {
    next = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((stripTime(next) - stripTime(today)) / msPerDay);

  if (diffDays === 0) return 'Today! 🎉';
  if (diffDays === 1) return 'Tomorrow';
  return diffDays + ' days';
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function renderResult(birthDate, today) {
  const age = calculateAge(birthDate, today);
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((stripTime(today) - stripTime(birthDate)) / msPerDay);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = age.years * 12 + age.months;

  yearsEl.textContent = age.years;
  monthsEl.textContent = age.months;
  daysEl.textContent = age.days;

  dayOfWeekEl.textContent = DAY_NAMES[birthDate.getDay()];
  zodiacEl.textContent = getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate());
  totalDaysEl.textContent = totalDays.toLocaleString();
  totalWeeksEl.textContent = totalWeeks.toLocaleString();
  totalMonthsEl.textContent = totalMonths.toLocaleString();
  nextBirthdayEl.textContent = getNextBirthday(birthDate, today);

  lastSummary = `I am ${age.years} years, ${age.months} months, and ${age.days} days old ` +
    `(born on a ${DAY_NAMES[birthDate.getDay()]}). ` +
    `That's ${totalDays.toLocaleString()} days lived. Next birthday in ${getNextBirthday(birthDate, today)}.`;

  resultEl.classList.remove('hidden');
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}