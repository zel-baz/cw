

// Main program
function crosswordSolver(emptyPuzzle, words) {
    if (typeof emptyPuzzle !== 'string' || !Array.isArray(words)) {
        console.log('Error');
        return;
    }

    const matrix = grid(emptyPuzzle);
    const cwords = words.map(w => (typeof w === 'string' ? w.toLowerCase() : w));
    if (!checkMatrix(matrix) || !checkWords(cwords)) {
        console.log('Error');
        return;
    }

    const slots = getWordPlacements(matrix);
    if (slots === null || slots.length !== cwords.length) {
        console.log('Error');
        return;
    }

    let solutions = solve(matrix, cwords, slots);
    if (solutions.length !== 1) {
        console.log('Error');
        return;
    }
    console.log(solutions[0]);
}

// Parses puzzle string into 2d array
function grid(data) {
    if (data.length === 0) return null;
    const matrix = [];
    const split = data.split('\n');
    const width = split[0].length;
    if (width === 0) return null;
    for (let i = 0; i < split.length; i++) {
        if (split[i].length !== width) return null;
        matrix.push(split[i].split(''));
    }
    return matrix;
}

// Returns available word placements in the puzzle, with their properties
function getWordPlacements(matrix) {
    const slots = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            const char = matrix[i][j];
            if (char === '.') continue;

            let starts = 0;
            // Horizontal
            if ((j === 0 || matrix[i][j - 1] === '.') && (j + 1 < matrix[i].length && matrix[i][j + 1] !== '.')) {
                let len = 0;
                while (j + len < matrix[i].length && matrix[i][j + len] !== '.') len++;
                slots.push({ r: i, c: j, dir: 'h', len });
                starts++;
            }
            // Vertical
            if ((i === 0 || matrix[i - 1][j] === '.') && (i + 1 < matrix.length && matrix[i + 1][j] !== '.')) {
                let len = 0;
                while (i + len < matrix.length && matrix[i + len][j] !== '.') len++;
                slots.push({ r: i, c: j, dir: 'v', len });
                starts++;
            }
            if (parseInt(char) !== starts) return null;
        }
    }
    return slots;
}

// Checks if the puzzle table is valid
function checkMatrix(matrix) {
    if (matrix === null) return false;
    const validChars = ['0', '1', '2', '.'];
    for (const row of matrix) {
        for (const cell of row) {
            if (!validChars.includes(cell)) return false;
        }
    }
    return true;
}

// Checks if words to be placed in the puzzle are valid
function checkWords(words) {
    const seen = new Set();
    for (const word of words) {
        if (typeof word !== 'string' || word === '' || seen.has(word)) {
            return false;
        }
        seen.add(word);
    }
    return true;
}

// Returns possible solutions of the puzzle
function solve(matrix, words, slots) {
    const solvedGrid = matrix.map(row => row.map(cell => (cell === '.' ? '.' : '')));
    const solutions = [];

    function canPlace(word, slot) {
        if (word.length !== slot.len) return false;
        for (let i = 0; i < word.length; i++) {
            const r = slot.dir === 'v' ? slot.r + i : slot.r;
            const c = slot.dir === 'h' ? slot.c + i : slot.c;
            if (solvedGrid[r][c] !== '' && solvedGrid[r][c] !== word[i]) return false;
        }
        return true;
    }

    function place(word, slot) {
        const original = [];
        for (let i = 0; i < word.length; i++) {
            const r = slot.dir === 'v' ? slot.r + i : slot.r;
            const c = slot.dir === 'h' ? slot.c + i : slot.c;
            original.push(solvedGrid[r][c]);
            solvedGrid[r][c] = word[i];
        }
        return original;
    }

    function unplace(slot, original) {
        for (let i = 0; i < original.length; i++) {
            const r = slot.dir === 'v' ? slot.r + i : slot.r;
            const c = slot.dir === 'h' ? slot.c + i : slot.c;
            solvedGrid[r][c] = original[i];
        }
    }

    function backtrack(slotIdx, used) {
        if (slotIdx === slots.length) {
            solutions.push(solvedGrid.map(row => row.join('')).join('\n'));
            return;
        }
        if (solutions.length > 1) return;

        const slot = slots[slotIdx];
        for (let i = 0; i < words.length; i++) {
            if (!used[i]) {
                if (canPlace(words[i], slot)) {
                    const original = place(words[i], slot);
                    used[i] = true;
                    backtrack(slotIdx + 1, used);
                    used[i] = false;
                    unplace(slot, original);
                }
            }
        }
    }

    backtrack(0, new Array(words.length).fill(false));
    return solutions;
}

// const emptyPuzzle = `...1...........
// ..1000001000...
// ...0....0......
// .1......0...1..
// .0....100000000
// 100000..0...0..
// .0.....1001000.
// .0.1....0.0....
// .10000000.0....
// .0.0......0....
// .0.0.....100...
// ...0......0....
// ..........0....`

// const words = [
//     'sun',
//     'sunglasses',
//     'suncream',
//     'swimming',
//     'bikini',
//     'beach',
//     'icecream',
//     'tan',
//     'deckchair',
//     'sand',
//     'seaside',
//     'sandals',
// ]

const emptyPuzzle = `2001
0..0
1000
0..0`
const words = ['casa', 'alan', 'ciao', 'anta']

crosswordSolver(emptyPuzzle, words)