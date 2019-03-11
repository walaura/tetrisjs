import * as clear from 'clear';
import chalk from 'chalk';

type Row = (0 | 1)[];
type Board = Row[];

const startingboard: Board = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 0, 1, 1, 1],
];

type Piece = {
	x: number;
	y: number;
	angle: 0 | 90 | 180 | 270;
	shape: Board;
};

const getPiece = (): Piece => ({
	y: 0,
	x: 0,
	angle: 0,
	shape: [[1, 1, 0], [0, 1, 1]],
});

const draw = (board: Board, piece = null) => {
	clear();
	for (const [rowIndex, row] of board.entries()) {
		process.stdout.write(chalk.white('|'));
		for (const [minoIndex, mino] of row.entries()) {
			if (
				piece.shape[piece.y - rowIndex] &&
				piece.shape[piece.y - rowIndex][minoIndex - piece.x]
			) {
				process.stdout.write(chalk.green('x'));
			} else if (mino === 1) {
				process.stdout.write(chalk.blue('x'));
			} else {
				process.stdout.write(' ');
			}
		}
		process.stdout.write(chalk.white('|'));
		process.stdout.write('\n');
	}
};

const canGoDown = (board: Board, piece: Piece) => {
	return board[piece.y + piece.shape.length][piece.x] === 0;
};

const commit = (board: Board, piece: Piece): Board => {
	let returnable = [...board];
	for (const [rowIndex, row] of piece.shape.entries()) {
		for (const [minoIndex, mino] of row.entries()) {
			if (mino === 1) {
				returnable[piece.y - rowIndex][piece.x + minoIndex] = 1;
			}
		}
	}

	return returnable;
};

const loop = (board, piece) => {
	const isFalling = canGoDown(board, piece);
	piece = {
		...piece,
		y: isFalling ? piece.y + 1 : piece.y,
	};
	draw(board, piece);

	if (!isFalling) {
		board = commit(board, piece);
		piece = getPiece();
	}

	return [board, piece];
};

let board = [...startingboard];
let piece = getPiece();
setInterval(() => {
	[board, piece] = loop(board, piece);
}, 100);
