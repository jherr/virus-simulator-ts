import React from 'react';
import {
  Slider,
  Typography,
} from '@material-ui/core';

import {
  State
} from '../engine';

const Controls:React.FC<{
  onChange: (key: string, value: number) => void;
  state: State;
}> = ({ onChange, state }) => (
  <>
    <Typography id="motion-slider" gutterBottom>
      Motion
    </Typography>
    <Slider
      defaultValue={3}
      value={state.motion}
      aria-labelledby="motion-slider"
      valueLabelDisplay="on"
      step={0.5}
      onChange={(evt, value) => onChange('motion', value as number)}
      marks
      min={0}
      max={7}
    />

    <Typography id="radius-slider" gutterBottom>
      Radius
    </Typography>
    <Slider
      defaultValue={5}
      value={state.radius}
      aria-labelledby="radius-slider"
      valueLabelDisplay="on"
      step={0.5}
      onChange={(evt, value) => onChange('radius', value as number)}
      marks
      min={1}
      max={10}
    />

    <Typography id="infectionRate-slider" gutterBottom>
      Infection Rate
    </Typography>
    <Slider
      defaultValue={0.5}
      value={state.infectionRate}
      aria-labelledby="infectionRate-slider"
      valueLabelDisplay="on"
      step={0.1}
      onChange={(evt, value) => onChange('infectionRate', value as number)}
      marks
      min={0.1}
      max={1}
    />

    <Typography id="infectionLength-slider" gutterBottom>
      Infection Length
    </Typography>
    <Slider
      defaultValue={14}
      value={state.infectionLength}
      aria-labelledby="infectionLength-slider"
      valueLabelDisplay="on"
      step={1}
      onChange={(evt, value) => onChange('infectionLength', value as number)}
      marks
      min={7}
      max={21}
    />
  </>
);

export default Controls;