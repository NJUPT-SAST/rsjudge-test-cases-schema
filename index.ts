// SPDX-License-Identifier: Apache-2.0

import * as TOML from "smol-toml";
import type { Config } from "./rsjudge-schema";

/**
 * Write one configuration as both a JSON and a TOML example.
 *
 * Both files end with a newline: `cat out/classic-simple.json` and a diff
 * against a regenerated copy then behave the way a text file is expected to.
 * The files carry no SPDX header of their own — they are generated, and the
 * generator is the thing that is licensed and reviewed.
 */
async function emit(name: string, config: Config) {
  const json = `${JSON.stringify(config, undefined, 2)}\n`;
  const toml = TOML.stringify(config);

  await Bun.write(`out/${name}.json`, json);
  await Bun.write(`out/${name}.toml`, toml.endsWith("\n") ? toml : `${toml}\n`);
}

const classicSimple: Config = {
  score: 100,
  judge: {
    judgeType: "classic",
  },
  resourceLimits: {
    time: 1000,
    memory: 256,
  },
  task: {
    taskType: "simple",
    cases: [
      { input: "1.in", answer: "1.ans" },
      { input: "2.in", answer: "2.ans", score: 60 },
    ],
  },
};

const classicSubtasks: Config = {
  score: 100,
  judge: {
    judgeType: "classic",
  },
  resourceLimits: {
    time: 1000,
    memory: 256,
  },
  task: {
    taskType: "subtask",
    subtasks: [
      {
        cases: [
          { input: "1.in", answer: "1.ans" },
          { input: "2.in", answer: "2.ans" },
        ],
        score: 40,
      },
      {
        cases: [
          { input: "3.in", answer: "3.ans" },
          { input: "4.in", answer: "4.ans" },
        ],
        score: 60,
      },
    ],
  },
};

const interactiveSimple: Config = {
  score: 100,
  judge: {
    judgeType: "interactive",
    interactor: "interactor.cpp",
  },
  resourceLimits: {
    time: 1000,
    memory: 256,
  },
  task: {
    taskType: "simple",
    cases: [
      { input: "1.in", answer: "1.ans" },
      { input: "2.in", answer: "2.ans", score: 60 },
    ],
  },
};

const specialJudgeSubtasks: Config = {
  score: 100,
  judge: {
    judgeType: "special-judge",
    checker: "checker.cpp",
  },
  resourceLimits: {
    time: 1000,
    memory: 256,
  },
  task: {
    taskType: "subtask",
    subtasks: [
      {
        cases: [
          { input: "1.in", answer: "1.ans" },
          { input: "2.in", answer: "2.ans" },
        ],
        score: 40,
      },
      {
        cases: [
          { input: "3.in", answer: "3.ans" },
          { input: "4.in", answer: "4.ans" },
        ],
        score: 60,
      },
    ],
  },
};

await emit("classic-simple", classicSimple);
await emit("classic-subtasks", classicSubtasks);
await emit("interactive-simple", interactiveSimple);
await emit("special-judge-subtasks", specialJudgeSubtasks);
