function echo (string, numTimes) {
    for (var i = 0; i < numTimes; i++) {
       console.log(string);
    }
}

function average (scores) {
    let total = 0;
    scores.forEach(function(score) {
        total += score;
    });

    return Math.round(total / scores.length);
}

// Express
// Library vs Framework ==> Inversion of Control: Framework calls YOU