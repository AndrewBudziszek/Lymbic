export function createSimulation() {
    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    let quarter1 = [];
    let quarter2 = [];
	let quarter3 = [];
	let quarter4 = [];

    for (var i = 0; i < 36; i++) {
        quarter1.push(true);
        quarter2.push(true);
        quarter3.push(false);
        quarter4.push(false);
    }

    for (var j = 0; j < 126; j++) {
        quarter1.push(false);
        quarter2.push(false);
        quarter3.push(true);
        quarter4.push(true);
    }

    quarter1 = shuffle(quarter1);
    quarter2 = shuffle(quarter2);
    quarter3 = shuffle(quarter3);
    quarter4 = shuffle(quarter4);

    return quarter1.concat(quarter2, quarter3, quarter4);
}