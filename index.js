
function App () {

    const [displayTime, setDisplayTime] = React.useState(25*60);
    const [breakTime, setBreakTime] = React.useState(5);
    const [sessionTime, setSessionTime] = React.useState(25);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    
    const formatTime = (time) => {
        let minutes = Math.floor(time/60);
        let seconds = time % 60;
        return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    };

    const changeTime = (amount, type) => {
        if (type=="break"){
            if (breakTime<=1 && amount < 0){
                return;
            } else if (breakTime>=60 && amount > 0){
                return;
            }
            setBreakTime(breakTime + amount);
        } else if (type=="session"){
            if (sessionTime<=1 && amount < 0){
                return;
            } else if (sessionTime>=60 && amount >0){
                return;
            }
            setSessionTime(sessionTime + amount);
            if (!timerOn){
                setDisplayTime(sessionTime*60 + amount*60);
            }
        }
    };

    const playTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVar = onBreak;

        // if more than one second passes (checking every 50ms), then update display time with new time, and increment next date
        if (!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if (date > nextDate) {
                    setDisplayTime((prev) => {
                        if(prev <= 0 && !onBreakVar){
                            playBreakMusic();
                            onBreakVar = true;
                            setOnBreak(true);
                            return breakTime*60;
                        } else if (prev <= 0 && onBreakVar){
                            playBreakMusic();
                            onBreakVar = false;
                            setOnBreak(false);
                            return sessionTime*60;
                        }
                        
                        return prev-1;
                    });

                    nextDate += second;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem('interval-id', interval);
        }
        if (timerOn) {
            clearInterval(localStorage.getItem("interval-id"));
        }

        setTimerOn(!timerOn);
    };

    const resetTime = () => {
        setDisplayTime(sessionTime*60);
        if (timerOn) {
            playTime();
        }
        setOnBreak(false);
        let breakAudio = document.getElementById("beep");
        breakAudio.pause();
        breakAudio.currentTime = 0;

    };

    const playBreakMusic = () => {
        let breakAudio = document.getElementById("beep");
        breakAudio.play();
    };

    return (
        <div className="container-fluid" align="center">
            <h1 className="py-5">Pomodoro Clock by JEppehimer</h1>
            <div className="row">
                <h3 id="timer-label" className={`col-6 offset-3 ${onBreak ? "main-display-break" : "main-display-session"}`}>{onBreak ? "Break Time:" : "Work Time:" }</h3>
            </div>
            <div className="row">
                <div id="time-left" className="col-6 offset-3 main-display-time">{formatTime(displayTime)}</div>
            </div>
            <div className="row">
                <div className="col text-center">
                    <div
                    id="start_stop" 
                    className={"btn btn-secondary btn-lg fa " + (timerOn ? "fa-pause" : "fa-play")}
                    onClick={playTime}
                    ></div>
                    <div
                    id="reset" 
                    className={"btn btn-secondary btn-lg fas fa-redo"}
                    onClick={resetTime}
                    ></div>
                    <audio id="beep" src="./BigBell.mp3" />
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-4 offset-1">
                    <div>
                        <h4 id="break-label">Break Length:</h4>
                        <div id="break-increment" className="btn btn-secondary btn-sm fas fa-arrow-up" onClick={() => changeTime(1,"break")}></div>
                        <h5 id="break-length">{breakTime} min</h5>
                        <div id="break-decrement" className="btn btn-secondary btn-sm fas fa-arrow-down" onClick={() => changeTime(-1, "break")}></div>
                    </div>
                </div>
                <div className="col-4 offset-2">
                    <div>
                        <h4 id="session-label">Session Length:</h4>
                        <div id="session-increment" className="btn btn-secondary btn-sm fas fa-arrow-up" onClick={() => changeTime(1,"session")}></div>
                        <h5 id="session-length">{sessionTime} min</h5>
                        <div id="session-decrement" className="btn btn-secondary btn-sm fas fa-arrow-down" onClick={() => changeTime(-1, "session")}></div>
                    </div>
                </div>
            </div>

        </div>
        
        
    );
}


ReactDOM.render(<App />, document.getElementById("root"));