import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let bold = props.winnerSquare ? {fontWeight: 'bold'} : {fontWeight: 'normal'};
  return (
    <button className="square" onClick={props.onClick} style={bold}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {  
  renderSquare(i) {
    let winnerSquares = this.props.winnerSquares
    let winnerSquare = winnerSquares.includes(i) ? true : false;

    return (
    <Square 
    key = {i}
    winnerSquare={winnerSquare}
    value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)}
     />
    );
  }

  getLayout() {
    let NUM_ROWS = 3;
    let NUM_COLS = 3;

    var rows = [];
    for (let row=0; row<NUM_ROWS; row++) {
      let curRow = [];
      for (let col=0; col<NUM_COLS; col++) {
        let idx = row * NUM_COLS + col;
        curRow.push(this.renderSquare(idx));
      }
      rows.push(<div key={row} className='board-row'>{curRow}</div>);
    }
    return rows;
  }

  render() {
    return (
      <div>
        {this.getLayout()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row: null,
        col: null
      }],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // if the square is filled or there is a winner, return
    if (calculateWinner(squares)[0] !== false || squares[i]) {
      return;
    }

    const row = Math.floor(i / 3);
    const col = i % 3;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history : history.concat([{
        squares: squares,
        row: row,
        col: col
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleOrder() {
    this.setState({
      ascending: this.state.ascending ? false : true,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const ascending = this.state.ascending;
    const current = history[this.state.stepNumber];
    const [winner, winnerSquares] = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move + ' Position: ' + step.row + ',' + step.col :
        'Go to game start';

      const divStyle = move === history.length-1 ? {fontWeight : 'bold'} :
        {fontWeight : 'normal'};

      return (
        <li key={move}>
          <button style={divStyle} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    moves = ascending ? moves : moves.reverse();
    let ascendingStatus = ascending ? 'ASC' : 'DESC';

    let status;

    if (winner) {
      status = 'Winner ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    if (current.squares.length == history.length -1){
      status = 'Draw'
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winnerSquares={winnerSquares}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <hr></hr>
          <button onClick={() => this.handleOrder()}>Move List Order: {ascendingStatus}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a,b,c]];
    }
  }
  return [false, []];
}