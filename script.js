
let now = new Date();
let events =[];
const eventContainer = document.querySelector('.eventContainer');
const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const months=['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь',
'ноябрь','декабрь'];
let displayDay = now.getDay();
document.querySelector('#saveEvent').onclick=()=>{
    createEvent();
}
document.querySelector('#btnSelectDay') .onclick=()=>{
    selectDisplayDay();
}
class Event{
    constructor(title,timeStart,timeEnd,days){
        this.title=title;
        this.start={
            days: timeStart.getHours(),
            hours: timeStart.getHours(),
            minutes: timeStart.getMinutes(),
            seconds: timeStart.getSeconds()
        };
        this.end={
            days: timeEnd.getHours(),
            hours: timeEnd.getHours(),
            minutes: timeEnd.getMinutes(),
            seconds: timeEnd.getSeconds()
        }
        this.days=days;
        this.state='Not started';
        this.id;
        this.container;
        this.containerTitle;
        this.containerTimer;
        this.containerStart;
        this.containerEnd;
        this.containerDays;
        this.btnDelete;
    }
}
let selectDisplayDay=()=>{
   let radio = document.getElementsByName('selectedDay');
   for(let i=0;i<radio.length;i++){
        if(radio[i].checked===true){
            displayDay=radio[i].value;
            if(displayDay =='today') displayDay = now.getDay();
            else displayDay = Number(displayDay);
            break;
        }
   }
   refresh();
}
function check(event){
    let time, header; 
    updateState(event);
    if((event.state==='Not started')){
        if(displayDay === now.getDay()){
            time = findDifference(event.start);
            header = 'До начала осталось: ';
            printTimeLeft(event,time,header) 
        }
    }else if((event.state==='Ended')){
        event.containerTimer.textContent='Закончено';
    }else if(event.state==='Started'){
        time = findDifference(event.end);
        header = 'До конца осталось: ';
        printTimeLeft(event,time,header);
    }
}
function updateState(event){
    let timeToStart=findDifference(event.start),
    timeToEnd=findDifference(event.end);
    if(now.getHours===0){ //в полночь обнуляемся
        refresh();
        event.state='Not started';
    }
    if((timeToEnd>0)&&(timeToStart>0)){
        event.state='Not started';
    }else if((timeToEnd>0)&&(timeToStart<0)){
        event.state='Started';
        event.container.classList.add('border');
        event.container.classList.add('border-danger');
    } else if((timeToEnd<0)&&(timeToStart<0)){
        event.state='Ended';
        event.container.classList.remove('border');
        event.container.classList.remove('border-danger');
    } 
}
function findDifference(time){
    let difference=0;
    let _now = now.getHours()*60*60 +now.getMinutes()*60+now.getSeconds();
    let n = time.hours*60*60+time.minutes*60+time.seconds;
    difference = n-_now;
    return difference
}
function printMeta(event){
    event.containerTitle.textContent=event.title;
    event.containerStart.textContent=`Начало: ${event.start.hours}:${event.start.minutes}:${event.start.seconds}`;
    event.containerEnd.textContent=`Конец: ${event.end.hours}:${event.end.minutes}:${event.end.seconds}`;
    let daysString='';
    for(let i=0;i<event.days.length;i++){
        if(event.days[i]===true){
            event.days[i];
            daysString+=`${days[i]}, `
        }
    }
    event.containerDays.textContent=`Дни недели: ${daysString}`;
}
function printTimeLeft(event,difference,header){
        let hours = Math.floor(difference/(60*60));
        difference = difference % (60*60);
        let minutes = Math.floor(difference/60);
        difference = difference%60;
        let seconds = difference;
        let string =`${header} ${hours}:${minutes}:${seconds}`;
        event.containerTimer.textContent=string;
}
function deleteEvent(event){
    event.container.parentNode.removeChild(event.container);
    let index = events.findIndex((_event)=>{
        return _event.id===event.id;
    })
    events.splice(index,1);
}
function initEvent(event){
    event.container = document.createElement('div');
    event.container.id=`event${event.id}`;
    event.container.classList.add('event');
    event.container.classList.add('col-md-3');
    event.container.classList.add('card');
    event.container.classList.add('p-2');
    event.container.classList.add('shadow');
    eventContainer.append(event.container);


    event.containerTitle = document.createElement('h3');
    event.containerTitle.classList.add('eventTitle');
    event.container.append(event.containerTitle);

    event.containerStart = document.createElement('div');
    event.containerStart.classList.add('timeStart');
    event.container.append(event.containerStart);

    event.containerEnd = document.createElement('div');
    event.containerEnd.classList.add('timeEnd');
    event.container.append(event.containerEnd);

    event.containerTimer = document.createElement('div');
    event.containerTimer.classList.add('font-weight-bold');
    event.container.append(event.containerTimer);

    event.btnDelete = document.createElement('img');
    event.btnDelete.src='cross.png';
    event.btnDelete.width='25';
    event.btnDelete.id='btnDelete';
    event.btnDelete.onclick=()=>{
        deleteEvent(event);
        saveData();
    }
    event.container.append(event.btnDelete);

    event.containerDays = document.createElement('div');
    event.containerDays.classList.add('days');
    event.container.append(event.containerDays);

    printMeta(event);
    setInterval(() =>{
        check(event);
        }, 1000)
} 
function createEvent(){
    let title = document.querySelector('#inputTitle').value;
    let timePickerStart = document.querySelector('#timePickerStart').value;
    let timeStart = new Date(`${now.getFullYear()},${now.getMonth()},${now.getDate()} ${timePickerStart}`);
    let timePickerEnd = document.querySelector('#timePickerEnd').value;
    let timeEnd = new Date(`${now.getFullYear()},${now.getMonth()},${now.getDate()} ${timePickerEnd}`);
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes = Array.prototype.slice.call(checkboxes);
    let days = checkboxes.map((checkbox)=>{
        if(checkbox.checked) return true;
        else return false;
    })
    let event = new Event(title,timeStart,timeEnd,days);
    if(timeEnd<timeStart){
        event.state='Ended';
    }
    events.push(event);
    saveData();
    refresh();
}
function refresh(){
    now = new Date();
    document.querySelector('#currentDateMessage').textContent = `Сегодня ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
    while(eventContainer.firstChild){
        eventContainer.removeChild(eventContainer.lastChild);
    }
    if(events.length!=0){
        for(let i=0;i<events.length;i++){
            if(events[i].days[displayDay]){
                events[i].id=i;
                initEvent(events[i]);
            }
        }   
    }
}
let loadData=()=>{
    if(localStorage['data']){
        events = JSON.parse(localStorage['data']);
    }
}
function saveData(){
    let saveData = JSON.stringify(events);
    localStorage.setItem('data',saveData);
}
setInterval(() =>{
    now = new Date();
    }, 1000)
loadData();
refresh();

