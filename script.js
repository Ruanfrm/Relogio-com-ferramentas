let hora = document.getElementById('hora')
let minuto = document.getElementById('minutos')
let segundo = document.getElementById('segundos')

function updateClock() {

var dataAtual = new Date()

 // Obter a hora formatada
  var horaFormatada = dataAtual.toLocaleTimeString();
  
  var horas = dataAtual.getHours();
  var minutos = dataAtual.getMinutes();
  var segundos = dataAtual.getSeconds();

  
  hora.textContent = horas 
  minuto.textContent = minutos
  segundo.textContent = segundos
}

updateClock()

setInterval(updateClock, 1000)

let timer;
let isRunning = false;
let seconds = 0;
let minutes = 0;
let hours = 0;

function startStop() {
    if (isRunning) {
        clearInterval(timer);
        document.getElementById('startStop').textContent = 'Iniciar';
    } else {
        timer = setInterval(updateTimer, 1000);
        document.getElementById('startStop').textContent = 'Parar';
    }

    isRunning = !isRunning;
}

function reset() {
    clearInterval(timer);
    isRunning = false;
    seconds = 0;
    minutes = 0;
    hours = 0;
    updateDisplay();
    document.getElementById('startStop').textContent = 'Iniciar';
}

function updateTimer() {
    seconds++;

    if (seconds === 60) {
        seconds = 0;
        minutes++;

        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
    }

    updateDisplay();
}

function updateDisplay() {
    const formattedTime = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    document.getElementById('timer').textContent = formattedTime;
}

function pad(value) {
    return value < 10 ? '0' + value : value;
}


//// calendario // 

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

document.addEventListener('DOMContentLoaded', renderCalendar);

function renderCalendar() {
    const monthYearElement = document.getElementById('monthYear');
    const calendarBody = document.getElementById('calendarBody');

    // Limpar o corpo do calendário
    calendarBody.innerHTML = '';

    // Configurar o cabeçalho do calendário
    monthYearElement.textContent = getMonthName(currentMonth) + ' ' + currentYear;

    // Obter o primeiro dia do mês
    const firstDay = new Date(currentYear, currentMonth, 1);

    // Obter o último dia do mês
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Calcular o número de células necessárias no calendário
    const totalCells = Math.ceil((lastDay.getDate() + firstDay.getDay()) / 7) * 7;

    // Preencher o corpo do calendário
    let dayCounter = 1;

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('td');
        if (i >= firstDay.getDay() && i < lastDay.getDate() + firstDay.getDay()) {
            cell.textContent = dayCounter;

            // Adicionar classe 'today' se for o dia atual
            if (
                currentDate.getDate() === dayCounter &&
                currentDate.getMonth() === currentMonth &&
                currentDate.getFullYear() === currentYear
            ) {
                cell.classList.add('today');
            }

            dayCounter++;
        } else {
            cell.classList.add('inactive');
        }
        calendarBody.appendChild(cell);
    }
}

function getMonthName(monthIndex) {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return monthNames[monthIndex];
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}





// variaveis globais

let nav = 0
let clicked = null
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []


// variavel do modal:
const newEvent = document.getElementById('newEventModal')
const deleteEventModal = document.getElementById('deleteEventModal')
const backDrop = document.getElementById('modalBackDrop')
const eventTitleInput = document.getElementById('eventTitleInput')
// --------
const calendar = document.getElementById('calendar') // div calendar:
const weekdays = ['domingo','segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'] //array with weekdays:

//funções

function openModal(date){
  clicked = date
  const eventDay = events.find((event)=>event.date === clicked)
 

  if (eventDay){
   document.getElementById('eventText').innerText = eventDay.title
   deleteEventModal.style.display = 'block'


  } else{
    newEvent.style.display = 'block'

  }

  backDrop.style.display = 'block'
}

//função load() será chamada quando a pagina carregar:

function load (){ 
  const date = new Date() 
  

  //mudar titulo do mês:
  if(nav !== 0){
    date.setMonth(new Date().getMonth() + nav) 
  }
  
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  
  
  const daysMonth = new Date (year, month + 1 , 0).getDate()
  const firstDayMonth = new Date (year, month, 1)
  

  const dateString = firstDayMonth.toLocaleDateString('pt-br', {
    weekday: 'long',
    year:    'numeric',
    month:   'numeric',
    day:     'numeric',
  })
  

  const paddinDays = weekdays.indexOf(dateString.split(', ') [0])
  
  //mostrar mês e ano:
  document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('pt-br',{month: 'long'})}, ${year}`

  
  calendar.innerHTML =''

  // criando uma div com os dias:

  for (let i = 1; i <= paddinDays + daysMonth; i++) {
    const dayS = document.createElement('div')
    dayS.classList.add('day')

    const dayString = `${month + 1}/${i - paddinDays}/${year}`

    //condicional para criar os dias de um mês:
     
    if (i > paddinDays) {
      dayS.innerText = i - paddinDays
      

      const eventDay = events.find(event=>event.date === dayString)
      
      if(i - paddinDays === day && nav === 0){
        dayS.id = 'currentDay'
      }


      if(eventDay){
        const eventDiv = document.createElement('div')
        eventDiv.classList.add('event')
        eventDiv.innerText = eventDay.title
        dayS.appendChild(eventDiv)

      }

      dayS.addEventListener('click', ()=> openModal(dayString))

    } else {
      dayS.classList.add('padding')
    }

    
    calendar.appendChild(dayS)
  }
}

function closeModal(){
  eventTitleInput.classList.remove('error')
  newEvent.style.display = 'none'
  backDrop.style.display = 'none'
  deleteEventModal.style.display = 'none'

  eventTitleInput.value = ''
  clicked = null
  load()

}
function saveEvent(){
  if(eventTitleInput.value){
    eventTitleInput.classList.remove('error')

    events.push({
      date: clicked,
      title: eventTitleInput.value
    })

    localStorage.setItem('events', JSON.stringify(events))
    closeModal()

  }else{
    eventTitleInput.classList.add('error')
  }
}

function deleteEvent(){

  events = events.filter(event => event.date !== clicked)
  localStorage.setItem('events', JSON.stringify(events))
  closeModal()
}

// botões 

function buttons (){
  document.getElementById('backButton').addEventListener('click', ()=>{
    nav--
    load()
    
  })

  document.getElementById('nextButton').addEventListener('click',()=>{
    nav++
    load()
    
  })

  document.getElementById('saveButton').addEventListener('click',()=> saveEvent())

  document.getElementById('cancelButton').addEventListener('click',()=>closeModal())

  document.getElementById('deleteButton').addEventListener('click', ()=>deleteEvent())

  document.getElementById('closeButton').addEventListener('click', ()=>closeModal())
  
}
buttons()
load()


const html = document.querySelector('html')
const checkbox = document.querySelector("input[name=theme]")

const getStyle = (element, style) => 
    window
        .getComputedStyle(element)
        .getPropertyValue(style)


const initialColors = {
  bodyColor: getStyle(html, '--body-color'),
  headerColor: getStyle(html, '--header-color'),
  headerButton: getStyle(html, '--header-button'),
  colorWeekdays: getStyle(html, '--color-weekdays'),
  currentDay: getStyle(html, '--current-day'),
  eventColor: getStyle(html, '--event-color'),
  eventColor: getStyle(html, '--event-color'),
  colorDay: getStyle(html, '--color-day'),
  modalEvent: getStyle(html, '--modal-event')
  

  
}

const darkMode = {
  bodyColor:'#282a36',
  headerColor: '#ff5555',
  headerButton:'#bd93f9',
  colorWeekdays: '#6272a4' ,
  currentDay: '#f8f8f2',
  eventColor: '#6272a4',
  colorDay: '#44475a',
  modalEvent: '#6272a4'
  
}

const transformKey = key => 
    "--" + key.replace(/([A-Z])/, "-$1").toLowerCase()


const changeColors = (colors) => {
    Object.keys(colors).map(key => {
        html.style.setProperty(transformKey(key), colors[key]) 
        console.log(transformKey(key), colors[key])
      }
    )
    console.log(colors)
}



checkbox.addEventListener("change", ({target}) => {
    target.checked ? changeColors(darkMode) : changeColors(initialColors)
})



let currentTask = null;

function startCountdown() {
    const countdownInput = document.getElementById('countdownInput');
    const countdownValue = parseInt(countdownInput.value, 10);

    if (!isNaN(countdownValue) && countdownValue > 0) {
        const countdownEndTime = new Date();
        countdownEndTime.setMinutes(countdownEndTime.getMinutes() + countdownValue);

        // Atualizar o temporizador a cada segundo
        const countdownInterval = setInterval(function () {
            const now = new Date();
            const remainingTime = countdownEndTime - now;

            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                openModal();
            } else {
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

                document.getElementById('countdown').textContent = `Temporizador Regressivo: ${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`;
            }
        }, 1000);
    } else {
        alert('Por favor, insira um valor válido para o temporizador.');
    }
}

function formatTwoDigits(value) {
    return value < 10 ? `0${value}` : value;
}

function openModalTemporizador() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';

    // Exibir informações da tarefa vinculada, se houver
    const taskInfoElement = document.getElementById('taskInfo');
    if (currentTask) {
        taskInfoElement.textContent = `Temporizador concluído para a tarefa: ${currentTask}`;
    } else {
        taskInfoElement.textContent = 'Temporizador concluído.';
    }
}

function closeModalTemporizador() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

function linkTask() {
    const taskName = prompt('Digite o nome da tarefa:');
    if (taskName) {
        currentTask = taskName;
        alert(`Temporizador vinculado à tarefa: ${taskName}`);
    }
}



// lista de tarefas

let tasks = [];

// Carregar tarefas salvas no localStorage
document.addEventListener('DOMContentLoaded', function () {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        updateTaskList();
    }
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskName = taskInput.value.trim();

    if (taskName !== '') {
        tasks.push({ name: taskName, completed: false });
        updateTaskList();
        saveTasksToLocalStorage();
        taskInput.value = '';
    }
}

function updateTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        const noTaskMessage = document.createElement('li');
        noTaskMessage.textContent = 'Nenhuma tarefa encontrada';
        taskList.appendChild(noTaskMessage);
    } else {
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
        <div class="tooltip-container">

            <input type="checkbox" id="task${index}" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <label for="task${index}" ${task.completed ? 'class="completed"' : ''}>${task.name}</label>
            
            <div class="tooltip-baixo">Marcar como feita</div>
            </div>

            
            
            <h4  id="task${index}" ${task.completed ? 'class="completed"' : ''}>${task.name}</h4>

        <div class="tooltip-container">
            <div class="tooltip">Tem certeza que deseja excluir essa tarefa?</div>
            <button onclick="deleteTask(${index})">Excluir</button>
        </div>


        `;
            taskList.appendChild(li);
        });
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    saveTasksToLocalStorage();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
    saveTasksToLocalStorage();
}

function clearTasks() {
    tasks = [];
    updateTaskList();
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
