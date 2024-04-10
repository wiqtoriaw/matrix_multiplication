let matrix1 = [];
let matrix2 = [];

function createMatrix(matrixNumber) {
    let rows = document.getElementById(`rows${matrixNumber}`).value;
    let cols = document.getElementById(`cols${matrixNumber}`).value;
    let matrixElements = document.getElementById(`matrix${matrixNumber}Elements`);
    matrixElements.innerHTML = '';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let input = document.createElement('input');
            input.type = 'number';
            input.id = `matrix${matrixNumber}Element${i}${j}`;
            matrixElements.appendChild(input);
        }
        matrixElements.appendChild(document.createElement('br'));
    }
}



function multiply() {
    let rows1 = parseInt(document.getElementById('rows1').value, 10);
    let cols1 = parseInt(document.getElementById('cols1').value, 10);
    let rows2 = parseInt(document.getElementById('rows2').value, 10);
    let cols2 = parseInt(document.getElementById('cols2').value, 10);

    multiplyMatrices(rows1, cols1, rows2, cols2);
}

function multiplyMatrices(rows1, cols1, rows2, cols2) {

    if (cols1 !== rows2) {
        if (cols1 !== rows2) {
         
            const errorMsg = "Błąd! Liczba kolumn w pierwszej macierzy musi być równa liczbie wierszy w drugiej macierzy.";
            document.getElementById('outputMatrix').innerHTML = `<p style="color: rgba(255, 0, 0, 0.596);">${errorMsg}</p>`;
            document.getElementById('steps').innerHTML = "";
            return;
        }
    }

    console.log(matrix1);

    initializeMatrices(rows1, cols1, rows2, cols2);

    let result = Array.from({ length: rows1 }, () => new Array(cols2).fill(0));
    
    for (let i = 0; i < rows1; i++) {
        for (let j = 0; j < cols2; j++) {
            for (let k = 0; k < cols1; k++) {
                result[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }

    let matrix1Latex = matrixToLatex(matrix1);
    let matrix2Latex = matrixToLatex(matrix2);
    let resultMatrixLatex = matrixToLatex(result);

    let operationLatex = `$$ ${matrix1Latex} \\times ${matrix2Latex} = ${resultMatrixLatex} $$`;

    document.getElementById('outputMatrix').innerHTML = operationLatex;
    MathJax.typeset();
    for (let row of result) row.fill('*');
    showSteps(result, rows1, cols1, cols2);
}

function showSteps(result, rows1, cols1, cols2) {
    let steps = document.getElementById('steps');
    steps.innerHTML = '';

    for (let i = 0; i < rows1; i++) {
        for (let j = 0; j < cols2; j++) {
            let sum = 0;
            let stepText = `Krok ${i * cols2 + j + 1}: Oblicz element na pozycji (${i + 1}, ${j + 1}):<br>`;

            let rowVector = matrix1[i].map(el => `{${el}}`).join(' & ');
            let colVector = matrix2.map(row => `{${row[j]}}`).join(' \\\\ ');

            stepText += `$$\\begin{bmatrix}${rowVector}\\end{bmatrix} \\times \\begin{bmatrix}${colVector}\\end{bmatrix} = `;

            let terms = [];
            for (let k = 0; k < cols1; k++) {
                terms.push(`({${matrix1[i][k]}} \\times {${matrix2[k][j]}})`);
                sum += matrix1[i][k] * matrix2[k][j];
            }
            stepText += terms.join(' + ') + ` = ${sum}$$<br>Aktualny wynik macierzy:<br>`;

            result[i][j] = sum;

            let displayMatrix = result.map(row => [...row]);

            for (let m = 0; m < result.length; m++) {
                for (let n = 0; n < result[m].length; n++) {
                    if (result[m][n] === '*') {
                        displayMatrix[m][n] = '*';
                    }
                }
            }

            stepText += `$$${matrixToLatex(displayMatrix)}$$<br>`;
            let stepElement = document.createElement('div');
            stepElement.innerHTML = stepText;
            steps.appendChild(stepElement);
        }
    }
    MathJax.typeset();
}

function matrixToLatex(matrix) {
    let latex = '\\begin{bmatrix}';
    for (let row of matrix) {
        latex += row.map(item => item === '*' ? '*' : item).join(' & ') + ' \\\\ ';
    }
    latex += '\\end{bmatrix}';
    return latex;
}

function initializeMatrices(rows1, cols1, rows2, cols2) {
    matrix1 = [];
    matrix2 = [];
    for (let i = 0; i < rows1; i++) {
        let row = [];
        for (let j = 0; j < cols1; j++) {
            row.push(parseInt(document.getElementById(`matrix1Element${i}${j}`).value, 10));
        }
        matrix1.push(row);
    }
    for (let i = 0; i < rows2; i++) {
        let row = [];
        for (let j = 0; j < cols2; j++) {
            row.push(parseInt(document.getElementById(`matrix2Element${i}${j}`).value, 10));
        }
        matrix2.push(row);
    }
}

function example1() {

    document.getElementById('rows1').value = 2;
    document.getElementById('cols1').value = 3;
    document.getElementById('rows2').value = 3;
    document.getElementById('cols2').value = 2;
    
    createMatrix(1);
    createMatrix(2);

    let exampleMatrix1 = [
        [2, 1, 3],
        [-1, 2, 4]
    ];
    
    let exampleMatrix2 = [
        [1, 3],
        [2, -2],
        [-1, 4]
    ];

    setMatrixInputs(exampleMatrix1, 1);
    setMatrixInputs(exampleMatrix2, 2);
    
    multiply();
}

function example2() {

    document.getElementById('rows1').value = 2;
    document.getElementById('cols1').value = 3;
    document.getElementById('rows2').value = 2;
    document.getElementById('cols2').value = 2;
    
    createMatrix(1);
    createMatrix(2);

    let exampleMatrix1 = [
        [4, 2, -5],
        [-1, 3, 1]
    ];
    
    let exampleMatrix2 = [
        [2, 2],
        [2, 2]
    ];

    setMatrixInputs(exampleMatrix1, 1);
    setMatrixInputs(exampleMatrix2, 2);
    
    multiply();
}

function setMatrixInputs(matrix, matrixNumber) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            let inputId = `matrix${matrixNumber}Element${i}${j}`;
            let inputElement = document.getElementById(inputId);
            if (inputElement) {
                inputElement.value = matrix[i][j];
            }
        }
    }
}
