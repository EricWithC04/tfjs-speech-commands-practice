async function createModel() {

    const recognizer = await speechCommands.create('BROWSER_FFT');

    await recognizer.ensureModelLoaded();
    return recognizer;
}

async function init() {
    const recognizer = await createModel();

    const classLabels = recognizer.wordLabels();
    const startButton = document.getElementById('start-button');
    const resultDiv = document.getElementById('result');

    function listen() {
        recognizer.listen(result => {
            const {scores} = result;
            const scoresArray = Array.from(scores).map((s, i) => ({score: s, word: classLabels[i]}));
            scoresArray.sort((a, b) => b.score - a.score);
            resultDiv.innerHTML = `Command: ${scoresArray[0].word} (${(scoresArray[0].score * 100).toFixed(2)}%)`;
        }, {
            probabilityThreshold: 0.75
        });

        startButton.innerText = 'Stop Listening';
        startButton.onclick = () => {
            recognizer.stopListening();
            startButton.innerText = 'Start Listening';
            startButton.onclick = listen;
        };
    }

    startButton.onclick = listen;
}

init();
