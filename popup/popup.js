let tasks=[]

updateTime()
function updateTime(){
    chrome.storage.local.get(["timer","timeOption"],(res) => {
        const time = document.getElementById("time")
        const minutes = `${res.timeOption - Math.ceil(res.timer /60)}`.padStart(2,"0")
        let seconds="00"
        if(res.timer %60 != 0){
            seconds = `${60 - res.timer%60}`.padStart(2,"0")
        }
        time.textContent = `${minutes}:${seconds}`
        
    })
}
setInterval(updateTime,1000)

chrome.storage.sync.get(["tasks"],(res) =>{
    tasks = res.tasks ? res.tasks : []
    renderTasKs()
})

const startTimerBtn = document.getElementById("start-timer-btn")
startTimerBtn.addEventListener("click", ()=>{
    chrome.storage.local.get(["isRunning"], (res)=>{
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, ()=>{
            startTimerBtn.textContent= !res.isRunning ? "Pause Timer": "Start Timer"
        })
    })
    
})
const resetTimerBtn = document.getElementById("reset-timer-btn")
resetTimerBtn.addEventListener("click",()=>{
    chrome.storage.local.set({
        timer:0,
        isRunning:false
    },()=>{
        startTimerBtn.textContent= "Start Timer"
    })
})

function saveTasks(){
    chrome.storage.sync.set({
        tasks,
    })
}
const addtaskbtn = document.getElementById('add-task-btn')
addtaskbtn.addEventListener("click",()=> addtask())

function renderTasK(taskNum){
    const taskRow= document.createElement("div")
    const text = document.createElement("input")
    text.type = "text"
    text.placeholder="Enter a Task.."
    text.value = tasks[taskNum]
    text.className = "taskinputs"
    text.addEventListener("change",()=>{
        tasks[taskNum]=text.value
        saveTasks()
        
    })

    const deletebtn = document.createElement("input")
    deletebtn.type = "button"
    deletebtn.value = "X"
    deletebtn.className = "deleteinput "
    deletebtn.addEventListener("click",()=>{
        deleteTask(taskNum)
    })

    taskRow.appendChild(text)
    taskRow.appendChild(deletebtn)

    const taskcontainer = document.getElementById("task-container")

    taskcontainer.appendChild(taskRow)
}
function addtask(){
    const taskNum = tasks.length
    tasks.push("")
    renderTasK(taskNum)
    saveTasks()    
}

function deleteTask(taskNum){
    tasks.splice(taskNum,1)
    renderTasKs()
    saveTasks()
}
function renderTasKs(){
    const taskcontainer = document.getElementById("task-container")
    taskcontainer.textContent = ""
    tasks.forEach( (taskText,taskNum) => {
        renderTasK(taskNum)
    })
} 