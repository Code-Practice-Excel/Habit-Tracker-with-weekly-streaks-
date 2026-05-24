// 1. App State Data Variables
let habits = JSON.parse(localStorage.getItem('my_habits_data')) || [];
let weekcount = 0; // 0 is this week, -1 is last week, 1 is next week

// 2. Startup trigger setup
window.onload = function() {
    document.getElementById('addForm').onsubmit = addANewHabit;
    document.getElementById('prevBtn').onclick = function() { weekOffset--; drawTrackerGrid(); };
    document.getElementById('nextBtn').onclick = function() { weekOffset++; drawTrackerGrid(); };
    document.getElementById('currentBtn').onclick = function() { weekcount= 0; drawTrackerGrid(); };
    
    drawTrackerGrid();
};

// 3. Helper function to calculate calendar dates for the week
function getDatesForSelectedWeek() {
    let datesArray = [];
    let today = new Date();
    
    // Calculate the Sunday of the current week
    let currentSunday = new Date(today);
    currentSunday.setDate(today.getDate() - today.getDay());
    
    // Shift week based on navigation button presses
    let targetSunday = new Date(currentSunday);
    targetSunday.setDate(currentSunday.getDate() + (weekcount* 7));
    
    for (let i = 0; i < 7; i++) {
        let tempDay = new Date(targetSunday);
        tempDay.setDate(targetSunday.getDate() + i);
        datesArray.push(tempDay);
    }
    return datesArray;
}

// Convert a date object cleanly into "YYYY-MM-DD"
function getFormattedString(dateObj) {
    let year = dateObj.getFullYear();
    let month = String(dateObj.getMonth() + 1).padStart(2, '0');
    let day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 4. Calculate Streak Count (Tied to Today/Yesterday boundary limits)
function countStreakDays(habitItem) {
    let checkedDates = habitItem.history || [];
    if (checkedDates.length === 0) return 0;
    
    let todayStr = getFormattedString(new Date());
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let yesterdayStr = getFormattedString(yesterday);
    
    // If neither today nor yesterday is checked, consecutive streak is broken
    if (!checkedDates.includes(todayStr) && !checkedDates.includes(yesterdayStr)) {
        return 0;
    }
    
    let currentStreak = 0;
    let evalDate = new Date(); // Start counting backward from today
    
    // If today is empty but yesterday is done, start checking backwards from yesterday
    if (!checkedDates.includes(todayStr) && checkedDates.includes(yesterdayStr)) {
        evalDate = yesterday;
    }
    
    while (true) {
        let evalStr = getFormattedString(evalDate);
        if (checkedDates.includes(evalStr)) {
            currentStreak++;
            evalDate.setDate(evalDate.getDate() - 1); // step back one day
        } else {
            break;
        }
    }
    return currentStreak;
}

// 5. Main Drawing Engine Function
function drawTrackerGrid() {
    let gridBox = document.getElementById('gridBox');
    let noHabitsBox = document.getElementById('noHabitsBox');
    let weekDates = getDatesForSelectedWeek();
    let todayStr = getFormattedString(new Date());
    
    // Toggle Empty screen layout state
    if (habits.length === 0) {
        gridBox.style.display = 'none';
        noHabitsBox.style.display = 'block';
        return;
    } else {
        gridBox.style.display = 'grid';
        noHabitsBox.style.display = 'none';
    }
    
    gridBox.innerHTML = ''; // Wipe out old elements
    
    // A. Create Table Header Rows
    let firstHeader = document.createElement('div');
    firstHeader.className = 'cell header-cell';
    firstHeader.innerText = 'Habit';
    gridBox.appendChild(firstHeader);
    
    let weekDaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekDates.forEach(function(date) {
        let dayHeader = document.createElement('div');
        let dateStr = getFormattedString(date);
        
        dayHeader.className = 'cell header-cell';
        if (dateStr === todayStr) {
            dayHeader.className += ' today-cell today-header';
        }
        
        dayHeader.innerHTML = `<div>${weekDaysShort[date.getDay()]}</div><div style="font-size:10px">${date.getMonth()+1}/${date.getDate()}</div>`;
        gridBox.appendChild(dayHeader);
    });
    
    let lastHeader = document.createElement('div');
    lastHeader.className = 'cell header-cell';
    lastHeader.innerText = 'Streak';
    gridBox.appendChild(lastHeader);
    
    // B. Create Habit Row Entries
    habits.forEach(function(habit) {
        // Name Block Cell
        let nameCell = document.createElement('div');
        nameCell.className = 'cell habit-name';
        nameCell.innerHTML = `
            <span>${habit.title}</span>
            <div>
                <button class="rename-btn" onclick="renameHabitItem('${habit.id}')">✏️</button>
                <button class="delete-btn" onclick="deleteHabitItem('${habit.id}')">❌</button>
            </div>
        `;
        gridBox.appendChild(nameCell);
        
        // 7 Toggling Interactive Checkbox Cells
        weekDates.forEach(function(date) {
            let checkCell = document.createElement('div');
            let dateStr = getFormattedString(date);
            checkCell.className = 'cell';
            if (dateStr === todayStr) checkCell.className += ' today-cell';
            
            let isToggled = habit.history && habit.history.includes(dateStr);
            let isFuture = date > new Date() && dateStr !== todayStr;
            
            let buttonElement = document.createElement('button');
            buttonElement.className = isToggled ? 'checkbox checked' : 'checkbox';
            buttonElement.disabled = isFuture; // Block clicking into future calendar zones
            
            buttonElement.onclick = function() { toggleDateCheckmark(habit.id, dateStr); };
            
            checkCell.appendChild(buttonElement);
            gridBox.appendChild(checkCell);
        });
        
        // Streak Display Cell
        let streakCell = document.createElement('div');
        streakCell.className = 'cell streak-cell';
        streakCell.innerText = countStreakDays(habit) + ' 🔥';
        gridBox.appendChild(streakCell);
    });
    
    // Update the Date Text Label at the top
    document.getElementById('weekLabel').innerText = 
        `Showing Week: ${weekDates[0].toLocaleDateString()} to ${weekDates[6].toLocaleDateString()}`;
}

// 6. Action Processing Functions
function addANewHabit(event) {
    event.preventDefault();
    let inputField = document.getElementById('habitInput');
    let text = inputField.value.trim();
    if (text === '') return;
    
    // Simple basic object structure mapping
    let newHabitObject = {
        id: 'id_' + Date.now(),
        title: text,
        history: []
    };
    
    habits.push(newHabitObject);
    saveDataToBrowser();
    inputField.value = '';
    drawTrackerGrid();
}

function toggleDateCheckmark(habitId, targetDateStr) {
    for (let i = 0; i < habits.length; i++) {
        if (habits[i].id === habitId) {
            let matchIndex = habits[i].history.indexOf(targetDateStr);
            if (matchIndex > -1) {
                habits[i].history.splice(matchIndex, 1); // Remove checkmark
            } else {
                habits[i].history.push(targetDateStr); // Add checkmark
            }
        }
    }
    saveDataToBrowser();
    drawTrackerGrid();
}

function renameHabitItem(habitId) {
    for (let i = 0; i < habits.length; i++) {
        if (habits[i].id === habitId) {
            let currentName = habits[i].title;
            let updatedName = prompt('Enter a new habit title:', currentName);
            if (updatedName && updatedName.trim() !== '') {
                habits[i].title = updatedName.trim();
                saveDataToBrowser();
                drawTrackerGrid();
            }
        }
    }
}

function deleteHabitItem(habitId) {
    if (confirm('Are you sure you want to remove this habit?')) {
        habits = habits.filter(function(item) {
            return item.id !== habitId;
        });
        saveDataToBrowser();
        drawTrackerGrid();
    }
}

function saveDataToBrowser() {
    localStorage.setItem('my_habits_data', JSON.stringify(habits));
}
