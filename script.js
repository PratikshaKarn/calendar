const holidays = {
  '2024-01-01': 'New Year\'s Day',
  '2024-07-04': 'Independence Day',
  '2024-12-25': 'Christmas Day',
  // Add more holidays as needed
};

const meetings = {};

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let isYearView = false;

const monthYear = document.getElementById('month-year');
const calendarBody = document.getElementById('calendar-body');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const toggleViewButton = document.getElementById('toggle-view');

const modal = document.getElementById('meeting-modal');
const closeModal = document.querySelector('.close');
const meetingForm = document.getElementById('meeting-form');
const meetingDateInput = document.getElementById('meeting-date');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function renderCalendar(month, year) {
  calendarBody.innerHTML = '';
  monthYear.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let date = 1;
  for (let i = 0; i < 6; i++) {
      const row = document.createElement('tr');
      
      for (let j = 0; j < 7; j++) {
          const cell = document.createElement('td');
          
          if (i === 0 && j < firstDay) {
              cell.textContent = '';
          } else if (date > daysInMonth) {
              break;
          } else {
              const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
              cell.textContent = date;
              cell.dataset.date = currentDate;

              if (holidays[currentDate]) {
                  cell.classList.add('holiday');
                  cell.title = holidays[currentDate];
              }

              if (meetings[currentDate]) {
                  const meeting = meetings[currentDate];
                  cell.classList.add('meeting');
                  cell.title = meeting.description;
                  const meetingDiv = document.createElement('div');
                  meetingDiv.textContent = `Meeting: ${meeting.description}`;
                  meetingDiv.style.fontSize = '0.75em'; // Small font size for the meeting name
                  cell.appendChild(meetingDiv);
              }

              cell.addEventListener('click', () => {
                  meetingDateInput.value = currentDate;
                  modal.style.display = 'flex';
              });

              date++;
          }
          row.appendChild(cell);
      }
      
      calendarBody.appendChild(row);
  }
}

function renderYear(year) {
  calendarBody.innerHTML = '';
  monthYear.textContent = `${year}`;

  for (let month = 0; month < 12; month++) {
      const monthContainer = document.createElement('div');
      monthContainer.classList.add('month-container');
      const monthTitle = document.createElement('div');
      monthTitle.classList.add('month-title');
      monthTitle.textContent = months[month];
      monthContainer.appendChild(monthTitle);

      const monthTable = document.createElement('table');
      monthTable.classList.add('month-table');
      const thead = document.createElement('thead');
      const theadRow = document.createElement('tr');
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
          const th = document.createElement('th');
          th.textContent = day;
          theadRow.appendChild(th);
      });
      thead.appendChild(theadRow);
      monthTable.appendChild(thead);

      const tbody = document.createElement('tbody');
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      let date = 1;
      for (let i = 0; i < 6; i++) {
          const row = document.createElement('tr');
          
          for (let j = 0; j < 7; j++) {
              const cell = document.createElement('td');
              
              if (i === 0 && j < firstDay) {
                  cell.textContent = '';
              } else if (date > daysInMonth) {
                  break;
              } else {
                  const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                  cell.textContent = date;
                  if (holidays[currentDate]) {
                      cell.classList.add('holiday');
                      cell.title = holidays[currentDate];
                  }
                  date++;
              }
              row.appendChild(cell);
          }
          tbody.appendChild(row);
      }
      monthTable.appendChild(tbody);
      monthContainer.appendChild(monthTable);
      calendarBody.appendChild(monthContainer);
  }
}

prevButton.addEventListener('click', () => {
  if (isYearView) {
      currentYear--;
      renderYear(currentYear);
  } else {
      currentMonth--;
      if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
      }
      renderCalendar(currentMonth, currentYear);
  }
});

nextButton.addEventListener('click', () => {
  if (isYearView) {
      currentYear++;
      renderYear(currentYear);
  } else {
      currentMonth++;
      if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
      }
      renderCalendar(currentMonth, currentYear);
  }
});

toggleViewButton.addEventListener('click', () => {
  isYearView = !isYearView;
  if (isYearView) {
      renderYear(currentYear);
  } else {
      renderCalendar(currentMonth, currentYear);
  }
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

meetingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const date = meetingDateInput.value;
  const time = document.getElementById('meeting-time').value;
  const description = document.getElementById('meeting-description').value;

  meetings[date] = { time, description };
  modal.style.display = 'none';

  if (!isYearView) {
      renderCalendar(currentMonth, currentYear);
  } else {
      renderYear(currentYear);
  }
});

window.addEventListener('click', (e) => {
  if (e.target == modal) {
      modal.style.display = 'none';
  }
});

renderCalendar(currentMonth, currentYear);
