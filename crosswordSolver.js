
function crosswordSolver(emptyPuzzle, words) {
    if (typeof emptyPuzzle !== 'string' || !Array.isArray(words)) {
        console.log('Error');
        return;
    }

    const matrix = grid(emptyPuzzle);
    if (!validinput(matrix, words)) {
        console.log('Error');
        return;
    }

    const slots = getWordPlacements(matrix);
    if (!slots || slots.length !== words.length) {
        console.log('Error');
        return;
    }

    solve(matrix, words, slots);
}

function grid(data) {
    if (data.length === 0) return [];
    const matrix = [];
    const split = data.split("\n");
    const width = split[0].length;
    for (let i = 0; i < split.length; i++) {
        if (split[i].length !== width) return []; // Invalid grid shape
        matrix.push(split[i].split(""));
    }
    return matrix;
}

function validinput(matrix, words) {
    if (matrix.length === 0) return false;
    if (!ParseMatrix(matrix)) return false;
    if (!Parswords(words)) return false;
    return true;
}

function ParseMatrix(matrix) {
    const valid = ['0', '1', '2', '.'];
    for (const row of matrix) {
        for (const element of row) {
            if (!valid.includes(element)) return false;
        }
    }
    return true;
}

function Parswords(words) {
    const seen = new Set();
    for (const word of words) {
        if (typeof word !== 'string' || word === "" || seen.has(word)) {
            return false;
        }
        seen.add(word);
    }
    return true;
}

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

    if (solutions.length === 1) {
        console.log(solutions[0]);
    } else {
        console.log('Error');
    }
}

const puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
const words = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
]

crosswordSolver(puzzle, words)