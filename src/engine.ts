import { quadtree } from 'd3-quadtree';
import {
  PEOPLE,
  BOX_SIZE,
  HISTORY
} from './constants';

export enum Status {
  Recovered = -1,             // Recovered is when someone was sick and is now immune
  Healthy = 0,                // A healthy person who can potentially become infected
  Sick = 1                    // A person who is actively sick and contageous
}

export interface Person {
  id: number;                 // Unique ID
  x: number;                  // X Position
  y: number;                  // Y Position
  direction: number;          // Movement direction in radians
  speed: number;              // Movement speed in pixels
  status: Status;             // Health status
  sickness: number;           // Countdown timer when sick
}

export interface Counts {
  [Status.Recovered]: number; // Number of recovered people
  [Status.Sick]: number;      // Number of sick people
  [Status.Healthy]: number;   // Number of healthy people
}

export interface Generation {
  generation: number;         // The generation index
  counts: Counts;             // The counts of the current generation
}

export interface State {
  paused: boolean;            // True if the simulation is paused
  people: Person[];           // The people in the simulation
  motion: number;             // The motion control
  radius: number;             // The infection radius
  infectionRate: number;      // How contageous the infection is
  infectionLength: number;    // How long the infection lasts
  generations: Generation[];  // The history of the generations
  generation: number;         // The current generation index
}

export const generatePeople = (state: State): Person[] =>
  new Array(PEOPLE)
    .fill({})
    .map((n, i) => ({
      id: i,
      x: Math.random() * BOX_SIZE,
      y: Math.random() * BOX_SIZE,
      direction: Math.random() * (Math.PI * 2),
      speed: state.motion,
      status: i === 0 ? Status.Sick : Status.Healthy,
      sickness: state.infectionLength,
    }));

export const runGenerationOnPerson = (person: Person, state: State) => {
  let { speed, direction, x, y, sickness, status } = person;
  x += Math.sin(direction) * speed;
  y += Math.cos(direction) * speed;

  if (
    x <= state.radius ||
    y <= state.radius ||
    x >= BOX_SIZE - (state.radius * 2) ||
    y >= BOX_SIZE - (state.radius * 2) ||
    Math.random() < 0.1
  ) {
    x = Math.min(BOX_SIZE - (state.radius * 2), Math.max(x, state.radius));
    y = Math.min(BOX_SIZE - (state.radius * 2), Math.max(y, state.radius));
    direction += Math.random() * (Math.PI / 4);
    speed = state.motion;
  }

  if (status === Status.Sick && sickness > 0) {
    sickness -= 0.2;
    if (sickness < 1) {
      status = -1;
    }
  }

  return {
    ...person,
    x,
    y,
    speed,
    direction,
    sickness,
    status,
  };
}

export const runGeneration = (state: State) => {
  if (state.paused) {
    return state;
  }

  const people: Person[] = state.people.map((person) => runGenerationOnPerson(person, state));

  const qt = quadtree()
    .extent([[0, 0], [BOX_SIZE, BOX_SIZE]])
    .addAll(
      (people
        .filter(({ status }) => status === Status.Healthy)
        .map(({ x, y, id }) => ([x, y, id])) as unknown) as [number,number][]
    );

  people
    .filter(({ status }) => status === Status.Sick)
    .forEach((person) => {
      const found = qt.find(person.x, person.y, state.radius);
      if (found) {
        const id = ((found as unknown) as [number, number, number])[2];
        if (Math.random() < state.infectionRate) {
          people[id].status = Status.Sick;
          people[id].sickness = state.infectionLength;
        }
      }
    });

  const counts: Counts = people.reduce((a: Counts, { status }) => {
    a[status] += 1;
    return a;
  }, {
    [Status.Healthy]: 0,
    [Status.Sick]: 0,
    [Status.Recovered]: 0,
  });
  state.generations.push({
    generation: state.generation,
    counts,
  });
  if (state.generations.length > HISTORY) {
    state.generations.splice(0, 1);
  }

  return {
    ...state,
    people,
    generations: state.generations,
    generation: state.generation + 1,
    paused: counts[Status.Sick] === 0,
  };
};

export const createInitialState = (state: State = {
  motion: 3,
  radius: 5,
  infectionRate: 0.5,
  infectionLength: 14,
  generations: [],
  generation: 0,
  paused: false,
  people: []
}): State => {
  const initialState: State = {
    ...state,
    paused: false,
    generations: [],
    people: []
  };
  initialState.people = generatePeople(initialState);
  return initialState;
};
