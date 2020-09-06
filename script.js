let now = new Date();
let lessons =[];
const lessonContainer = document.querySelector('.lessonContainer');
const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const months=['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь',
'ноябрь','декабрь'];
let displayDay = now.getDay();
document.querySelector('#saveLesson').onclick=()=>{
    createLesson();
}
document.querySelector('#btnSelectDay') .onclick=()=>{
    selectDisplayDay();
}
class Lesson{
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
            displayDay=Number(radio[i].value);
            if(displayDay==='today') displayDay = now.getDay();
            break;
            
        }
   }
   refresh();
}
function check(lesson){
    let time, header; 
    updateState(lesson);
    if((lesson.state==='Not started')){
        if(displayDay === now.getDay()){
            time = findDifference(lesson.start);
            header = 'До начала осталось: ';
            printTimeLeft(lesson,time,header) 
        }
    }else if((lesson.state==='Ended')){
        //time = findDifference(lesson.start);
        //header = 'До начала осталось: ';
        //printTimeLeft(lesson,time,header);
        lesson.containerTimer.textContent='Закончено';
    }else if(lesson.state==='Started'){
        time = findDifference(lesson.end);
        header = 'До конца осталось: ';
        printTimeLeft(lesson,time,header);
    }
}
function updateState(lesson){
    let timeToStart=findDifference(lesson.start),
    timeToEnd=findDifference(lesson.end);
    if(now.getHours===0){ //в полночь обнуляемся
        refresh();
        lesson.state='Not started';
    }
    if((timeToEnd>0)&&(timeToStart>0)){
        lesson.state='Not started';
    }else if((timeToEnd>0)&&(timeToStart<0)){
        lesson.state='Started';
        lesson.container.classList.add('border');
        lesson.container.classList.add('border-danger');
    } else if((timeToEnd<0)&&(timeToStart<0)){
        lesson.state='Ended';
        lesson.container.classList.remove('border');
        lesson.container.classList.remove('border-danger');
    } 
}
function findDifference(time){
    let difference=0;
    let _now = now.getHours()*60*60 +now.getMinutes()*60+now.getSeconds();
    let n = time.hours*60*60+time.minutes*60+time.seconds;
    difference = n-_now;
    return difference
}
function printMeta(lesson){
    lesson.containerTitle.textContent=lesson.title;
    lesson.containerStart.textContent=`Начало: ${lesson.start.hours}:${lesson.start.minutes}:${lesson.start.seconds}`;
    lesson.containerEnd.textContent=`Конец: ${lesson.end.hours}:${lesson.end.minutes}:${lesson.end.seconds}`;
    let daysString='';
    for(let i=0;i<lesson.days.length;i++){
        if(lesson.days[i]===true){
            lesson.days[i];
            daysString+=`${days[i]}, `
        }
    }
    lesson.containerDays.textContent=`Дни недели: ${daysString}`;
}
function printTimeLeft(lesson,difference,header){
    /*
    if(lesson.state==='Ended'){
        difference = 24*60*60 - Math.abs(difference);
    }
    */
        let hours = Math.floor(difference/(60*60));
        difference = difference % (60*60);
        let minutes = Math.floor(difference/60);
        difference = difference%60;
        let seconds = difference;
        let string =`${header} ${hours}:${minutes}:${seconds}`;
        lesson.containerTimer.textContent=string;
}
function deleteLesson(lesson){
    lesson.container.parentNode.removeChild(lesson.container);
    let index = lessons.findIndex((_lesson)=>{
        return _lesson.id===lesson.id;
    })
    console.log(index);
    lessons.splice(index,1);
}
function initLesson(lesson){
    lesson.container = document.createElement('div');
    lesson.container.id=`lesson${lesson.id}`;
    lesson.container.classList.add('lesson');
    lesson.container.classList.add('col-md-3');
    lesson.container.classList.add('card');
    lesson.container.classList.add('p-2');
    lesson.container.classList.add('shadow');
    lessonContainer.append(lesson.container);


    lesson.containerTitle = document.createElement('h3');
    lesson.containerTitle.classList.add('lessonTitle');
    lesson.container.append(lesson.containerTitle);

    lesson.containerStart = document.createElement('div');
    lesson.containerStart.classList.add('timeStart');
    lesson.container.append(lesson.containerStart);

    lesson.containerEnd = document.createElement('div');
    lesson.containerEnd.classList.add('timeEnd');
    lesson.container.append(lesson.containerEnd);

    lesson.containerTimer = document.createElement('div');
    lesson.containerTimer.classList.add('font-weight-bold');
    lesson.container.append(lesson.containerTimer);

    lesson.btnDelete = document.createElement('img');
    lesson.btnDelete.src='cross.png';
    lesson.btnDelete.width='25';
    lesson.btnDelete.id='btnDelete';
    lesson.btnDelete.onclick=()=>{
        deleteLesson(lesson);
        saveData();
    }
    lesson.container.append(lesson.btnDelete);

    lesson.containerDays = document.createElement('div');
    lesson.containerDays.classList.add('days');
    lesson.container.append(lesson.containerDays);

    printMeta(lesson);
    setInterval(() =>{
        check(lesson);
        }, 1000)
} 
function createLesson(){
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
    let lesson = new Lesson(title,timeStart,timeEnd,days);
    if(timeEnd<timeStart){
        lesson.state='Ended';
    }
    lessons.push(lesson);
    saveData();
    refresh();
    console.log(lesson);
}
function refresh(){
    now = new Date();
    document.querySelector('#currentDateMessage').textContent = `Сегодня ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
    while(lessonContainer.firstChild){
        lessonContainer.removeChild(lessonContainer.lastChild);
    }
    if(lessons.length!=0){
        for(let i=0;i<lessons.length;i++){
            if(checkDay(lessons[i])){
                lessons[i].id=i;
                initLesson(lessons[i]);
            }
        }   
    }
}
function checkDay(lesson){
    let day = now.getDay();
    if(displayDay===now.getDay()){
        if(lesson.days[day]===true) return true
    }else{
        if(lesson.days[displayDay]==true) {
            
            return true
        }
    }
    
}
let loadData=()=>{
    if(localStorage['data']){
        lessons = JSON.parse(localStorage['data']);
    }
}
function saveData(){
    let saveData = JSON.stringify(lessons);
    localStorage.setItem('data',saveData);
}
setInterval(() =>{
    now = new Date();
    }, 1000)

loadData();
refresh();