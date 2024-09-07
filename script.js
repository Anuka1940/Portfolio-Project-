let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shiftPattern = ['afternoon', 'afternoon', 'morning', 'morning', 'night', 'night', 'off', 'off'];
const shiftType = ['4_shift', '3_shift', '2_shift'];

let startDate = null;

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText =
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  for(let i = 0; i < paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    if (i >= paddingDays) {
      const dayNumber = i - paddingDays + 1;
      daySquare.innerText = dayNumber;

      const currentDate = new Date(year, month, dayNumber);
      

      if (startDate) {
        const daysFromStart = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        const startFrom = daysFromStart + 1;
        if (startFrom  >= 0) {
          const shiftIndex = startFrom % shiftPattern.length;
          const shiftClass = shiftPattern[shiftIndex];
          daySquare.classList.add(shiftClass);
          daySquare.innerText += ` -    ${shiftClass}`;
        }
      }

      if (dayNumber === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);
  }
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });
}

document.getElementById('createShift').addEventListener('click', createShift);

function createShift() {
  const startDateString = document.getElementById('startDate').value;
  startDate = new Date(startDateString);
  if (isNaN(startDate)) {
    alert('Please select a valid start date.');
    return;
  }
  load();
}

load();
initButtons();

