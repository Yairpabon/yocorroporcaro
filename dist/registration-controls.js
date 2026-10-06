'use strict';
const dateField = document.querySelector('#participant-form [name="birthDate"]');
const dateWrapper = document.createElement('div');
dateWrapper.className = 'registration-date-control';
dateField.before(dateWrapper);
dateWrapper.append(dateField);
const calendarButton = document.createElement('button');
calendarButton.type = 'button';
calendarButton.className = 'registration-calendar-button';
calendarButton.setAttribute('aria-label', 'Elegir fecha de nacimiento');
calendarButton.setAttribute('aria-expanded', 'false');
calendarButton.setAttribute('aria-controls', 'birth-calendar');
calendarButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h1m6 0h1"/></svg>';
dateWrapper.append(calendarButton);
const calendar = document.createElement('div');
calendar.id = 'birth-calendar';
calendar.className = 'registration-calendar';
calendar.setAttribute('role', 'dialog');
calendar.setAttribute('aria-label', 'Elegir fecha de nacimiento');
calendar.hidden = true;
dateWrapper.append(calendar);
const todayParts = dateField.max.split('-').map(Number);
const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
let calendarYear = todayParts[0] - 25;
let calendarMonth = todayParts[1] - 1;
function closeBirthCalendar(restoreFocus = false) {
  calendar.hidden = true;
  calendarButton.setAttribute('aria-expanded', 'false');
  if (restoreFocus) calendarButton.focus();
}
function renderBirthCalendar() {
  calendar.innerHTML = `<div class="birth-calendar-heading"><span>Fecha de nacimiento</span><button type="button" data-calendar-close aria-label="Cerrar calendario">×</button></div><div class="birth-calendar-navigation"><button type="button" data-calendar-prev aria-label="Mes anterior">‹</button><select aria-label="Mes">${monthNames.map((name,index)=>`<option value="${index}" ${index===calendarMonth?'selected':''}>${name}</option>`).join('')}</select><select aria-label="Año">${Array.from({length:121},(_,index)=>todayParts[0]-index).map(year=>`<option ${year===calendarYear?'selected':''}>${year}</option>`).join('')}</select><button type="button" data-calendar-next aria-label="Mes siguiente">›</button></div><div class="birth-calendar-week" aria-hidden="true">${['L','M','M','J','V','S','D'].map(day=>`<span>${day}</span>`).join('')}</div><div class="birth-calendar-days"></div><p>Puedes elegir el mes y el año directamente.</p>`;
  const days = calendar.querySelector('.birth-calendar-days');
  const offset = (new Date(calendarYear,calendarMonth,1).getDay()+6)%7;
  for(let index=0;index<offset;index++) days.append(document.createElement('span'));
  const count = new Date(calendarYear,calendarMonth+1,0).getDate();
  for(let day=1;day<=count;day++) {
    const iso = `${calendarYear}-${String(calendarMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const button = document.createElement('button');
    button.type='button'; button.textContent=day;
    button.disabled=iso>dateField.max;
    button.setAttribute('aria-label',`${day} de ${monthNames[calendarMonth]} de ${calendarYear}`);
    button.setAttribute('aria-pressed',String(iso===dateField.value));
    button.addEventListener('click',()=>{dateField.value=iso;dateField.dispatchEvent(new Event('input',{bubbles:true}));dateField.dispatchEvent(new Event('change',{bubbles:true}));closeBirthCalendar(true);});
    days.append(button);
  }
  const selects=calendar.querySelectorAll('select');
  selects[0].addEventListener('change',()=>{calendarMonth=Number(selects[0].value);renderBirthCalendar();calendar.querySelector('[aria-label="Mes"]').focus();});
  selects[1].addEventListener('change',()=>{calendarYear=Number(selects[1].value);renderBirthCalendar();calendar.querySelector('[aria-label="Año"]').focus();});
  function moveMonth(delta) {const date=new Date(calendarYear,calendarMonth+delta,1);if(date.getFullYear()<todayParts[0]-120||date.getFullYear()>todayParts[0])return;calendarYear=date.getFullYear();calendarMonth=date.getMonth();renderBirthCalendar();calendar.querySelector(delta<0?'[data-calendar-prev]':'[data-calendar-next]').focus();}
  calendar.querySelector('[data-calendar-prev]').addEventListener('click',()=>moveMonth(-1));
  calendar.querySelector('[data-calendar-next]').addEventListener('click',()=>moveMonth(1));
  calendar.querySelector('[data-calendar-close]').addEventListener('click',()=>closeBirthCalendar(true));
}
calendarButton.addEventListener('click',()=>{
  if(!calendar.hidden){closeBirthCalendar();return;}
  if(dateField.value){const parts=dateField.value.split('-').map(Number);calendarYear=parts[0];calendarMonth=parts[1]-1;}
  renderBirthCalendar();calendar.hidden=false;calendarButton.setAttribute('aria-expanded','true');calendar.querySelector('[aria-label="Mes"]').focus();
});
calendar.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeBirthCalendar(true);}});
registrationDialog.addEventListener('click',event=>{if(!dateWrapper.contains(event.target))closeBirthCalendar();});
registrationDialog.addEventListener('close',()=>closeBirthCalendar());



