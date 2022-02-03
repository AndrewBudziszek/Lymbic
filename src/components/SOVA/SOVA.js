import { useState, useEffect, useRef } from 'react';
import High from './sounds/high.wav';
import Low from './sounds/low.wav';
import { createSimulation } from './testUtil';

const SOVA = () => {
    const countdownStartTime = 1;
    const [testTracker, setTestTracker] = useState(0);

    const [countDown, setCountDown] = useState(countdownStartTime); //
    const [runLymbic, setRunLymbic] = useState(false); //
    const [testInProgress, setTestInProgress] = useState(false);//
    const [testSettings, setTestSettings] = useState({
        countdownTime: countdownStartTime,
        runLymbic: false,
        testInProgress: false
    })

    const cancelTest = () => setTestInProgress(false); //
    const startCountdown = () => setRunLymbic(true); //

    //Run timer
    useEffect(() => {
        let timerId;

        if (runLymbic && !testInProgress) {
            timerId = setInterval(() => {
                setTestSettings(testSettings => ({
                    countdownTime: testSettings.countdownTime - 1,
                    runLymbic: true,
                    testInProgress: false
                }))
                setCountDown(countDown => countDown - 1);
                if(countDown < 1 && runLymbic) {
                    setTestSettings({
                        countdownTime: 1,
                        runLymbic: false,
                        testInProgress: true
                    })
                }
            }, 1000)
        } else {
            clearInterval(timerId);
        }

        return () => clearInterval(timerId)
    }, [runLymbic, testInProgress, testSettings]);

    //End timer
    useEffect(() => {
        if (countDown < 1 && runLymbic) {
            setTestSettings({
                countdownTime: 1,
                runLymbic: false,
                testInProgress: true
            })
            setRunLymbic(false);
            setCountDown(1);
            setTestInProgress(true);
        }
    }, [countDown, runLymbic, testSettings]);

    //Start SOVA Test
    let testId = useRef();
    useEffect(() => {
        const LowAudio = new Audio(Low);
        const HighAudio = new Audio(High);

        if (testInProgress) {
            let testArray = createSimulation();
            let i = 0;

            testId.current = setInterval(() => {
                if (testArray[i]) {
                    HighAudio.play();
                } else {
                    LowAudio.play();
                }
                i += 1
            }, 2000)
        } else {
            clearInterval(testId.current);
        }
    }, [testInProgress, testId])

    // Listen for Keypress
    const [pressed, setPressed] = useState([])

    useEffect(() => {
        const ALLOWED_KEYS = [' ']

        const handleKeyDown = event => {
            const { key } = event
            if (ALLOWED_KEYS.includes(key) && !pressed.includes(key)) {
                setPressed(prevPressed => [...prevPressed, key]);
            }
        };

        const handleKeyUp = event => {
            const { key } = event
            setPressed(pressed.filter(k => k !== key))
        };

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [pressed])

    return (
        <div className='border-4'>
            <div>
                JavaScript Implementation
            </div>
            {
                runLymbic && !testInProgress ? <div>
                    {countDown}
                </div>
                    : null
            }
            {!runLymbic ? <button
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                onClick={!runLymbic && !testInProgress ? startCountdown : cancelTest}>
                {!runLymbic && !testInProgress ? <p>Start</p> : <p>Cancel</p>}
            </button> : null}
            {!runLymbic && !testInProgress ? <p className='text-base'>Click Start to begin the Evaluation</p> : null}

            <div className='text-base'>Space is pressed: {pressed == ' ' ? 'Yes' : 'No'}</div>

        </div>
    )
}

export default SOVA;