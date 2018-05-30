import React from 'react';

const ScoreRow = ({ name, score, buzzing, onReset, onInc, onDec }) => (
  <tr>
    <th scope="row">{name}</th>
    <td>{score}</td>
    <td>
      <div className="btn-group">
        <button type="button" className="btn btn-success" onClick={onInc}>+</button>
        <button type="button" className="btn btn-danger" onClick={onDec}>-</button>
      </div>
    </td>
    <td>
      <button type="button" className="btn" disabled={!buzzing} onClick={onReset}>Reset</button>
    </td>
  </tr>
);

export default ScoreRow;
