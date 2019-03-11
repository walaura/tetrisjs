import * as clear from 'clear';
import chalk from 'chalk';
import { terminal } from 'terminal-kit';

type Row = (0 | 1)[];
type Board = Row[];

type Game = {
	board: Board;
	piece: Piece;
	input?: 'left' | 'right';
};

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
	x: 2,
	angle: 0,
	shape: [[1, 1, 0], [0, 1, 1]],
});

const canGoDown = (board: Board, piece: Piece) => {
	return [...piece.shape]
		.pop()
		.map(
			(mino, minoIndex) =>
				mino === 0 ||
				(board[piece.y + piece.shape.length] &&
					board[piece.y + piece.shape.length][piece.x + minoIndex] !== 1)
		)
		.every(Boolean);
};

const commit = (board: Board, piece: Piece): Board => {
	let returnable = [...board];
	for (const [rowIndex, row] of piece.shape.entries()) {
		for (const [minoIndex, mino] of row.entries()) {
			if (mino === 1) {
				returnable[rowIndex + piece.y][piece.x + minoIndex] = 1;
			}
		}
	}
	return returnable;
};

const loop = ({ board, piece, input }: Game): Game => {
	const isFalling = canGoDown(board, piece);
	piece = {
		...piece,
		y: isFalling ? piece.y + 1 : piece.y,
	};
	if (input === 'right') {
		piece = {
			...piece,
			x: piece.x + 1,
		};
	}
	if (input === 'left') {
		piece = {
			...piece,
			x: piece.x - 1,
		};
	}

	if (!isFalling) {
		board = commit(board, piece);
		piece = getPiece();
	}

	return { board, piece };
};

const draw = (board: Board, piece = null) => {
	terminal.clear();
	for (const [rowIndex, row] of board.entries()) {
		terminal.white('|');
		for (const [minoIndex, mino] of row.entries()) {
			if (
				piece.shape[rowIndex - piece.y] &&
				piece.shape[rowIndex - piece.y][minoIndex - piece.x] &&
				piece.shape[rowIndex - piece.y][minoIndex - piece.x] === 1
			) {
				terminal.green(' ❇️️️ ');
			} else if (mino === 1) {
				terminal.blue(' ⏺ ');
			} else {
				terminal('   ');
			}
		}
		terminal.white('|');
		terminal('\n');
	}
};

const useTerminal = () => {
	let board = [...startingboard];
	let piece = getPiece();
	let input = null;
	terminal.fullscreen(true);
	terminal.hideCursor();
	terminal.grabInput();
	terminal.on('key', function(name, matches, data) {
		console.log("'key' event:", name);
		if (name === 'CTRL_C') {
			terminal.grabInput(false);
			setTimeout(function() {
				process.exit();
			}, 100);
		} else if (name === 'LEFT') {
			input = 'left';
		} else if (name === 'RIGHT') {
			input = 'right';
		}
	});

	setInterval(() => {
		({ board, piece } = loop({ board, piece, input }));
		draw(board, piece);
		input = null;
	}, 100);
};

useTerminal();
