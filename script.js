const form = document.getElementById('ageForm');
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');

const yearsEl = document.getElementById('years');
const monthsEl = document.getElementById('months');
const daysEl = document.getElementById('days');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  errorEl.textContent = '';
  resultEl.classList.add('hidden');

  const day = parseInt(dayInput.value, 10);
  const month = parseInt(monthInput.value, 10);
  const year = parseInt(yearInput.value, 10);

  if (!day || !month || !year) {
    showError('Please fill in day, month, and year.');
    return;
  }

  if (month < 1 || month > 12) {
    showError('Month must be between 1 and 12.');
    return;
  }

  if (day < 1 || day > 31) {
    showError('Day must be between 1 and 31.');
    return;
  }

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  const isValidDate =
    birthDate.getFullYear() === year &&
    birthDate.getMonth() === month - 1 &&
    birthDate.getDate() === day;

  if (!isValidDate) {
    showError('That date does not exist. Please check the values.');
    return;
  }

  if (birthDate > today) {
    showError('Date of birth cannot be in the future.');
    return;
  }

  const age = calculateAge(birthDate, today);

  yearsEl.textContent = age.years;
  monthsEl.textContent = age.months;
  daysEl.textContent = age.days;
  resultEl.classList.remove('hidden');
});

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

function showError(message) {
  errorEl.textContent = message;
}
