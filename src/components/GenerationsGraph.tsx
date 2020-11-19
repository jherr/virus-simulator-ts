import React from 'react';
import {
  PEOPLE,
  COLORS,
  HISTORY
} from '../constants';

import {
  Generation,
  Status
} from '../engine'

const GenerationsGraph = ({ generations }: { generations: Generation[] }) => {
  const widthFactor = 100 / HISTORY;
  return (
    <svg
      width="100%"
      height={PEOPLE / 2}
    >
      {
        generations.map(({ generation, counts }, index) => (
          <g
            key={generation}
          >
            {counts[Status.Recovered] > 0 && (<rect
              x={`${index * widthFactor}%`}
              width={`${widthFactor}%`}
              y={0}
              height={counts[Status.Recovered] / 2}
              style={{
                fill: COLORS[Status.Recovered]
              }}
            />)}
            {counts[Status.Sick] > 0 && (<rect
              x={`${index * widthFactor}%`}
              width={`${widthFactor}%`}
              y={(PEOPLE - counts[Status.Sick]) / 2}
              height={counts[Status.Sick] / 2}
              style={{
                fill: COLORS[Status.Sick]
              }}
            />)}
          </g>
        ))
      }
    </svg>
  );
};

export default GenerationsGraph;
