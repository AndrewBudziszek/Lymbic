import { useState, FC, useEffect } from 'react';

interface EvalProps {
    foo: number;
    bar: string;
}

interface EvalSettings {
    countdownTime: number,
    runLymbic: boolean,
    testInProgress: boolean
}

interface EvalResults {
    responseTime: [number],
}

const Eval: FC<EvalProps> = (props) => {
    const countdownStartTime = 1;
    const [evalSettings, setEvalSettings] = useState<EvalSettings>({
        countdownTime: countdownStartTime,
        runLymbic: false,
        testInProgress: false
    })

    const cancelTest = () => setEvalSettings({
        countdownTime: countdownStartTime,
        runLymbic: false,
        testInProgress: false
    })

    const startCountdown = () => setEvalSettings({
        countdownTime: countdownStartTime,
        runLymbic: true,
        testInProgress: false
    })

    // Run Timer
    useEffect(() => {
        let timerId;
        if (evalSettings.runLymbic && !evalSettings.testInProgress) {
            timerId = setInterval(() => {
                setEvalSettings({
                    countdownTime: evalSettings.countdownTime - 1,
                    runLymbic: true,
                    testInProgress: false
                })
            }, 1000)
        } else {
            clearInterval(timerId);
        }

        return () => clearInterval(timerId);
    }, [evalSettings])

    // End timer
    useEffect(() => {
        if (evalSettings.countdownTime < 1 && evalSettings.runLymbic) {
            setEvalSettings({
                countdownTime: countdownStartTime,
                runLymbic: false,
                testInProgress: true
            })
        }
    }, [evalSettings]);

    // Key Listener
    const [pressed, setPressed] = useState<String[]>([]);

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


    return <div className="border-2">
        <div>
            TypeScript Implementation
        </div>
        {
            evalSettings.runLymbic && !evalSettings.testInProgress ? <div>{evalSettings.countdownTime}</div> : null
        }
        {!evalSettings.runLymbic ?
            <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={!evalSettings.runLymbic && !evalSettings.testInProgress ? startCountdown : cancelTest}
            >
                {!evalSettings.runLymbic && !evalSettings.testInProgress ? <p>Start</p> : <p>Cancel</p>}
            </button>
            :
            null
        }
        <div className='text-base'>Space is pressed: {pressed.includes(' ') ? 'Yes' : 'No'}</div>

    </div>
}

export default Eval;