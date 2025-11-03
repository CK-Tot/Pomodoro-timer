const $ = id = document.getElementById(id);

const timerEl = $('timer');
const sessionTypeEl = $('session-type');
const progressBar = $('progress-bar');
const startBtn = $('start-btn');
const resetBtn = $('reset-btn');
const pauseBtn = $('pause-btn');
const completedEl = $('completed');
const cycleEl = $('cycle');
const workDurationInput = $('work-duration');
const breakDurationInput = $('break-duration');
const longBreakDurationInput = $('long-break-duration');

let timer;
let isRunning = false;
let isWorkSession = true;
let timerLeft;
let totalTime;
let completedSessions = 0;
let currentCyle = 1;
const cyclesPerLongBreak = 4;

