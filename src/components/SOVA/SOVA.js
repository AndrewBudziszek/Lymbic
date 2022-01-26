import React, { useState, useEffect, useRef } from 'react';
import High from './sounds/high.wav';
import Low from './sounds/low.wav';
import { createSimulation } from './testUtil';

const SOVA = () => {
    const [countDown, setCountDown] = useState(1);
    const [runSOVA, setRunSOVA] = useState(false);
    const [testInProgress, setTestInProgress] = useState(false);

    const cancelTest = () => setTestInProgress(false);
    const startCountdown = () => setRunSOVA(true);

    //Run timer
    useEffect(() => {
        let timerId;

        if (runSOVA && !testInProgress) {
            setCountDown(1);
            timerId = setInterval(() => {
                setCountDown(countDown => countDown - 1);
            }, 1000)
        } else {
            clearInterval(timerId);
        }

        return () => clearInterval(timerId)
    }, [runSOVA, testInProgress]);

    //End timer
    useEffect(() => {
        if (countDown < 1 && runSOVA) {
            setRunSOVA(false);
            setCountDown(1);
            setTestInProgress(true);
        }
    }, [countDown, runSOVA]);

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
        <div className='game'>
            {
                runSOVA && !testInProgress ? <div>
                    {countDown}
                </div>
                    : null
            }
            {!runSOVA && !testInProgress ? <p>Click Start to begin the Lymbic ADHD Evaluation</p> : null}
            {!runSOVA ? <button
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                onClick={!runSOVA && !testInProgress ? startCountdown : cancelTest}>
                {!runSOVA && !testInProgress ? <p>Start</p> : <p>Cancel</p>}
            </button> : null}

            <div>This is pressed: [{pressed}]</div>

        </div>
    )
}

export default SOVA;