import { useState, useMemo, useRef, useEffect } from 'react';
import { useReducedMotion, MotionConfig, motion, AnimatePresence } from 'motion/react';
import 'playcaptcha/clawcaptcha.css';

// Pokemon Metadata override
export const TOY_META: Record<string, { label: string; accent: string }> = {
  bulbasaur: { label: "Bulbasaur", accent: "#3ECF8E" },
  charmander: { label: "Charmander", accent: "#FF6B00" },
  eevee: { label: "Eevee", accent: "#C98A4B" },
  jigglypuff: { label: "Jigglypuff", accent: "#E58AB0" },
  meowth: { label: "Meowth", accent: "#B08D57" },
  mew: { label: "Mew", accent: "#B287D8" },
  pikachu: { label: "Pikachu", accent: "#FFE600" },
  psyduck: { label: "Psyduck", accent: "#E8A33D" },
  snorlax: { label: "Snorlax", accent: "#3F4854" },
  squirtle: { label: "Squirtle", accent: "#5A93C9" },
  togepi: { label: "Togepi", accent: "#DE2121" }
};

const TOY_SET = [
  { toy: "bulbasaur", w: 92 },
  { toy: "charmander", w: 90 },
  { toy: "eevee", w: 88 },
  { toy: "jigglypuff", w: 86 },
  { toy: "meowth", w: 86 },
  { toy: "mew", w: 80 },
  { toy: "pikachu", w: 92 },
  { toy: "psyduck", w: 90 },
  { toy: "snorlax", w: 98 },
  { toy: "squirtle", w: 90 },
  { toy: "togepi", w: 82 }
];

const CLAW_PIVOT = { x: 20.6, y: 22.7 };
const CLAW_BODY = [
  { "fill": "#666D85", "d": "M20.031,24.324c0.086,2.939,0.263,5.874,0.531,8.802c0.016,0.175,0.073,0.395,0.247,0.42\r\nc0.218,0.03,0.311-0.267,0.318-0.487c0.104-2.988,0.207-5.975,0.311-8.963C21.048,24.142,20.657,24.188,20.031,24.324z" },
  { "fill": "#3D4459", "d": "M20.222,11.816c0.023,2.291,0.046,4.583,0.069,6.874c0.356,0.036,0.717,0.036,1.073,0\r\nc-0.01-2.339-0.019-4.679-0.028-7.018C20.987,11.656,20.636,11.679,20.222,11.816z" },
  { "fill": "#666D85", "d": "M18.924,10.588c0.013,0.395,0.025,0.789,0.038,1.184c0.003,0.101,0.009,0.209,0.073,0.288\r\nc0.084,0.103,0.234,0.116,0.367,0.12c1.017,0.034,2.044,0.068,3.047-0.106c0.054-0.009,0.111-0.021,0.15-0.059\r\nc0.047-0.047,0.054-0.12,0.058-0.187c0.022-0.45,0.009-0.901-0.039-1.349c-0.004-0.04-0.011-0.083-0.04-0.11\r\nc-0.031-0.03-0.079-0.031-0.122-0.031C21.186,10.343,19.916,10.39,18.924,10.588z" },
  { "fill": "#DE2121", "d": "M18.282,9.052c-0.062,0-0.13,0.002-0.179,0.04c-0.059,0.045-0.074,0.126-0.084,0.199\r\nc-0.055,0.411-0.06,0.83-0.015,1.242c0.008,0.074,0.02,0.153,0.071,0.208c0.066,0.07,0.172,0.077,0.268,0.079\r\nc1.573,0.031,3.146,0.006,4.717-0.076c0.064-0.003,0.132-0.008,0.185-0.045c0.096-0.066,0.102-0.204,0.098-0.321\r\nc-0.015-0.438-0.031-0.875-0.046-1.313c-0.001-0.039-0.004-0.081-0.031-0.109c-0.029-0.03-0.076-0.032-0.119-0.032\r\nC22.905,8.925,19.701,9.046,18.282,9.052z" },
  { "fill": "#666D85", "d": "M19.815,20.079c-0.001-0.526-0.003-1.052-0.004-1.577c0-0.036,0-0.074,0.017-0.105\r\nc0.033-0.061,0.112-0.077,0.18-0.085c0.483-0.058,0.97-0.086,1.456-0.083c0.099,0.001,0.21,0.008,0.274,0.083\r\nc0.053,0.062,0.055,0.151,0.055,0.233c0,0.475-0.001,0.95-0.001,1.425C21.155,19.978,20.517,19.972,19.815,20.079z" },
  { "fill": "#B4B9C4", "d": "M19.458,20.771c-0.269,0.791-0.539,1.583-0.808,2.374c-0.016,0.048-0.033,0.098-0.022,0.147\r\nc0.01,0.047,0.045,0.085,0.077,0.121l0.799,0.87c0.083,0.091,0.169,0.184,0.28,0.238c0.134,0.066,0.289,0.068,0.438,0.069\r\nc0.471,0.003,0.942,0.006,1.413,0.01c0.048,0,0.098,0,0.141-0.021c0.052-0.026,0.085-0.078,0.115-0.127\r\nc0.244-0.399,0.487-0.797,0.731-1.196c0.047-0.078,0.096-0.159,0.106-0.249c0.011-0.101-0.027-0.199-0.065-0.293\r\nc-0.231-0.58-0.463-1.159-0.695-1.739c-0.029-0.072-0.061-0.149-0.124-0.194c-0.074-0.053-0.172-0.051-0.262-0.047\r\nC20.836,20.765,20.09,20.808,19.458,20.771z" },
  { "fill": "#3D4459", "d": "M21.101,22.267c-0.117-0.169-0.332-0.237-0.531-0.186c-0.182,0.047-0.359,0.12-0.459,0.274\r\nc-0.076,0.116-0.095,0.259-0.101,0.397c-0.004,0.095-0.002,0.192,0.034,0.28c0.061,0.149,0.214,0.245,0.372,0.274\r\nc0.254,0.047,0.53-0.066,0.678-0.278c0.147-0.212,0.158-0.51,0.025-0.732C21.114,22.286,21.107,22.276,21.101,22.267z" },
  { "fill": "#DE2121", "d": "M22.585,19.777c-1.368-0.115-2.751-0.055-4.105,0.179c-0.127,0.022-0.272,0.059-0.327,0.176\r\nc-0.028,0.06-0.025,0.129-0.022,0.195c0.009,0.173,0.017,0.345,0.026,0.518c0.003,0.058,0.007,0.118,0.037,0.167\r\nc0.053,0.084,0.164,0.106,0.262,0.118c1.395,0.173,2.808,0.083,4.21-0.007c0.351-0.023,0.703-0.045,1.047-0.121\r\nc0.053-0.012,0.109-0.026,0.145-0.066c0.044-0.048,0.049-0.119,0.05-0.184c0.003-0.209-0.01-0.418-0.039-0.625\r\nc-0.01-0.07-0.025-0.145-0.076-0.193c-0.048-0.045-0.118-0.055-0.183-0.064C23.273,19.826,22.935,19.806,22.585,19.777z" },
  { "fill": "#851313", "d": "M20.275,21.326c-0.53,0-1.06-0.021-1.589-0.064c-0.113-0.009-0.267-0.021-0.391-0.104\r\nc-0.281-0.187-0.251-0.584-0.204-0.866c0.007-0.041,0.046-0.068,0.086-0.061c0.041,0.007,0.068,0.045,0.062,0.086\r\nc-0.064,0.383-0.02,0.611,0.139,0.716c0.085,0.056,0.195,0.069,0.32,0.079c1.626,0.13,3.266,0.058,4.875-0.214\r\nc0.041-0.007,0.079,0.021,0.086,0.061c0.007,0.041-0.021,0.08-0.061,0.087C22.501,21.233,21.388,21.326,20.275,21.326z" },
  { "fill": "#1F2229", "d": "M20.376,17.8c-0.04,0-0.074-0.032-0.075-0.073l-0.152-5.054c-0.001-0.041,0.031-0.076,0.073-0.077\r\nc0.042,0,0.076,0.031,0.077,0.073l0.152,5.054c0.001,0.042-0.031,0.076-0.073,0.077C20.377,17.8,20.376,17.8,20.376,17.8z" },
  { "fill": "#851313", "d": "M17.993,10.472c-0.041,0-0.075-0.033-0.075-0.075l-0.001-0.949c0-0.109,0-0.258,0.087-0.372\r\nc0.126-0.164,0.364-0.165,0.492-0.166l4.541-0.022c0.088-0.001,0.179,0.004,0.25,0.068c0.089,0.081,0.087,0.211,0.086,0.282\r\nl-0.018,1.146c-0.001,0.042-0.033,0.074-0.076,0.074c-0.042-0.001-0.075-0.035-0.074-0.076l0.018-1.146\r\nc0.001-0.064-0.001-0.136-0.037-0.168c-0.031-0.028-0.087-0.03-0.148-0.03l-4.541,0.022c-0.141,0.001-0.298,0.01-0.374,0.108\r\nc-0.052,0.068-0.056,0.167-0.056,0.28l0.001,0.949C18.068,10.438,18.035,10.472,17.993,10.472\r\nC17.993,10.472,17.993,10.472,17.993,10.472z" }
];
const CLAW_ARM_L = [
  { "fill": "#808596", "d": "M18.965,20.803c-1.243,0.927-2.486,1.854-3.729,2.781c-0.176,0.131-0.363,0.279-0.417,0.491\r\nc-0.049,0.192,0.023,0.391,0.089,0.577c0.681,1.927,0.824,3.999,1.323,5.981c0.055,0.217,0.118,0.441,0.261,0.613\r\nc0.142,0.17,0.348,0.272,0.542,0.38c0.641,0.359,1.208,0.848,1.658,1.429c0.141,0.182,0.283,0.383,0.499,0.463\r\nc0.216,0.08,0.52-0.043,0.533-0.249c-0.459-0.883-1.167-1.635-2.02-2.147c-0.152-0.091-0.313-0.179-0.413-0.325\r\nc-0.081-0.119-0.113-0.263-0.142-0.404c-0.348-1.641-0.697-3.281-1.045-4.922c-0.102-0.478,0.135-0.964,0.574-1.178\r\nc0.616-0.3,1.225-0.615,1.827-0.943c0.325-0.177,0.656-0.367,0.882-0.66c0.274-0.355,0.358-0.817,0.433-1.259\r\nc0.029-0.17,0.057-0.35-0.007-0.51c-0.096-0.238-0.378-0.358-0.635-0.345C18.921,20.591,18.683,20.709,18.965,20.803z" },
  { "fill": "#3D4459", "d": "M19.335,32.718c-0.024,0-0.047-0.011-0.062-0.032c-0.347-0.498-0.802-0.934-1.314-1.26\r\nc-0.033-0.021-0.067-0.042-0.101-0.063c-0.213-0.132-0.432-0.268-0.574-0.485c-0.11-0.169-0.158-0.367-0.2-0.543\r\nc-0.391-1.627-0.752-3.283-1.073-4.922c-0.032-0.163-0.076-0.387,0.009-0.583c0.093-0.216,0.315-0.338,0.477-0.427l1.805-0.99\r\nc0.036-0.02,0.082-0.007,0.102,0.03c0.02,0.036,0.007,0.082-0.03,0.102l-1.805,0.99c-0.185,0.102-0.344,0.199-0.412,0.355\r\nc-0.061,0.141-0.036,0.307,0.001,0.494c0.321,1.638,0.681,3.292,1.072,4.916c0.039,0.163,0.084,0.349,0.18,0.496\r\nc0.123,0.188,0.328,0.316,0.527,0.439c0.034,0.021,0.068,0.042,0.102,0.064c0.529,0.336,0.998,0.786,1.357,1.3\r\nc0.024,0.034,0.015,0.081-0.019,0.104C19.365,32.714,19.35,32.718,19.335,32.718z" }
];
const CLAW_ARM_R = [
  { "fill": "#808596", "d": "M22.64,20.803c1.243,0.927,2.486,1.854,3.729,2.781c0.176,0.131,0.363,0.279,0.417,0.491\r\nc0.049,0.192-0.023,0.391-0.089,0.577c-0.681,1.927-0.824,3.999-1.323,5.981c-0.055,0.217-0.118,0.441-0.261,0.613\r\nc-0.142,0.17-0.348,0.272-0.542,0.38c-0.641,0.359-1.208,0.848-1.658,1.429c-0.141,0.182-0.284,0.383-0.499,0.463\r\nc-0.216,0.08-0.52-0.043-0.533-0.249c0.459-0.883,1.167-1.635,2.02-2.147c0.152-0.091,0.313-0.179,0.413-0.325\r\nc0.081-0.119,0.113-0.263,0.142-0.404c0.348-1.641,0.697-3.281,1.045-4.922c0.101-0.478-0.135-0.964-0.574-1.178\r\nc-0.616-0.3-1.225-0.615-1.827-0.943c-0.324-0.177-0.656-0.367-0.882-0.66c-0.274-0.355-0.358-0.817-0.433-1.259\r\nc-0.029-0.17-0.057-0.35,0.007-0.51c0.096-0.238,0.378-0.358,0.635-0.345C22.684,20.591,22.922,20.709,22.64,20.803z" },
  { "fill": "#3D4459", "d": "M24.41,30.372c-0.007,0-0.014-0.001-0.021-0.003c-0.04-0.012-0.063-0.053-0.051-0.093\r\nc0.464-1.586,0.83-3.218,1.089-4.85c0.007-0.041,0.045-0.069,0.086-0.062c0.041,0.007,0.069,0.045,0.062,0.086\r\nc-0.26,1.639-0.627,3.277-1.093,4.868C24.472,30.351,24.442,30.372,24.41,30.372z" },
  { "fill": "#3D4459", "d": "M22.613,33.409c-0.017,0-0.034-0.006-0.048-0.017c-0.032-0.027-0.036-0.074-0.009-0.106\r\nc0.565-0.675,1.234-1.247,1.99-1.698l0.055-0.033c0.18-0.107,0.365-0.217,0.488-0.377c0.142-0.186,0.197-0.436,0.244-0.656\r\nl1.14-5.256c0.009-0.04,0.049-0.066,0.089-0.057c0.041,0.009,0.066,0.049,0.057,0.089l-1.14,5.256\r\nc-0.051,0.236-0.109,0.503-0.272,0.715c-0.141,0.184-0.339,0.301-0.531,0.415l-0.055,0.032c-0.741,0.443-1.398,1.003-1.952,1.666\r\nC22.656,33.399,22.635,33.409,22.613,33.409z" }
];

const GW = 380;
const GH = 320;
const RAIL_Y = 14;
const HOME_Y = 64;
const DROP_Y = 198;
const CLAW_MIN = 46;
const CLAW_MAX = 334;
const COIL_LEN = 50;
const GRAB_RADIUS = 38;
const GRIP_OFFSET = 46;
const TRAY = { cx: 232, cy: GH + 56, min: 150, max: 320 };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const CONFETTI = [
  { dx: -44, dy: -54, dr: -150, c: "#34c759", d: 0 },
  { dx: -30, dy: -66, dr: 120, c: "#ffd60a", d: 0.05 },
  { dx: -14, dy: -76, dr: -80, c: "#5cd679", d: 0.02 },
  { dx: 2, dy: -80, dr: 60, c: "#5a93c9", d: 0.07 },
  { dx: 16, dy: -74, dr: -130, c: "#ffb340", d: 0.03 },
  { dx: 30, dy: -64, dr: 100, c: "#a8e6b8", d: 0.06 },
  { dx: 44, dy: -52, dr: -110, c: "#34c759", d: 0.01 },
  { dx: -54, dy: -36, dr: 90, c: "#e58ab0", d: 0.09 },
  { dx: 54, dy: -34, dr: -70, c: "#5a93c9", d: 0.08 }
];

const easeInQuad = (p: number) => p * p;
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInOutCubic = (p: number) => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const clamp01 = (p: number) => Math.min(1, Math.max(0, p));
const T = {
  antic: 0.16,
  down: 0.78,
  dwell1: 0.18,
  close: 0.45,
  dwell2: 0.26,
  load: 0.24,
  up: 0.95,
  open: 0.4
};
const ANTIC_RISE = 8;
const DROP_G = 1150;
const ENTRANCE_G = 1500;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

interface Slot {
  toy: string;
  w: number;
  x: number;
  b: number;
  z: number;
  rot: number;
  dropFrom: number;
  delay: number;
  landed?: boolean;
}

function scatterPile(target: string): Slot[] {
  const order = shuffle(TOY_SET);
  const rest = order.filter((t) => t.toy !== target);
  const tgt = order.find((t) => t.toy === target)!;
  const nB = 8;
  const nTop = order.length - nB;
  const bottomIdx = 2 + Math.floor(Math.random() * 4);
  const slots = new Array<Slot>(order.length);
  let r = 0;
  const frontW: number[] = [];
  const frontToy: typeof TOY_SET = [];
  for (let i = 0; i < nB; i++) {
    const isTarget = i === bottomIdx;
    const t = isTarget ? tgt : rest[r++];
    frontToy.push(t);
    frontW.push(t.w * (isTarget ? rand(1, 1.05) : rand(0.76, 0.86)));
  }
  const xs = [0];
  for (let i = 1; i < nB; i++) {
    xs.push(xs[i - 1] + (frontW[i - 1] + frontW[i]) / 2 * rand(0.62, 0.68));
  }
  const span = xs[nB - 1];
  const fit = Math.min(1, (GW - 80) / span);
  for (let i = 0; i < nB; i++) frontW[i] *= fit;
  const offset = (GW - span * fit) / 2;
  const centers: number[] = [];
  for (let i = 0; i < nB; i++) {
    const cx = offset + xs[i] * fit + rand(-3, 3);
    centers.push(cx);
    const isTarget = i === bottomIdx;
    slots[i] = {
      toy: frontToy[i].toy,
      w: frontW[i],
      x: Math.min(GW - 26, Math.max(26, cx)),
      b: rand(0, 2),
      z: isTarget ? 4 : 2,
      rot: rand(-7, 7),
      dropFrom: -rand(340, 440),
      delay: i * 0.05 + rand(0, 0.1)
    };
  }
  const gaps: number[] = [];
  for (let g = 0; g < nB - 1; g++) {
    if (g === bottomIdx - 1 || g === bottomIdx) continue;
    gaps.push(g);
  }
  const useGaps = shuffle(gaps).slice(0, nTop);
  let ti = 0;
  for (const g of useGaps) {
    const t = rest[r++];
    const cx = (centers[g] + centers[g + 1]) / 2 + rand(-3, 3);
    slots[nB + ti] = {
      toy: t.toy,
      w: t.w * rand(0.7, 0.8),
      x: Math.min(GW - 26, Math.max(26, cx)),
      b: rand(6, 16),
      z: 1,
      rot: rand(-8, 8),
      dropFrom: -rand(360, 470),
      delay: 0.45 + ti * 0.08 + rand(0, 0.1)
    };
    ti++;
  }
  const tip = slots[nB + Math.floor(Math.random() * nTop)];
  tip.rot = rand(10, 16) * (Math.random() < 0.5 ? -1 : 1);
  return slots;
}

interface Props {
  target?: string;
  onVerify: () => void;
  title?: string;
  assetBase?: string;
  className?: string;
}

export function ClawCaptcha({
  target: targetProp,
  onVerify,
  title = "Verify you’re human",
  assetBase = "/toys/",
  className
}: Props) {
  const reduce = useReducedMotion();
  const [autoTarget] = useState(() => TOY_SET[Math.floor(Math.random() * TOY_SET.length)].toy);
  const target = targetProp ?? autoTarget;
  const [phase, setPhase] = useState("idle");
  const [infoOpen, setInfoOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [overTray, setOverTray] = useState(false);
  const [trayMode, setTrayMode] = useState<"open" | "win" | "no" | "">("");
  const pile = useMemo(() => scatterPile(target), [target]);
  const rigEl = useRef<SVGSVGElement | null>(null);
  const clawEl = useRef<SVGGElement | null>(null);
  const coilEl = useRef<SVGGElement | null>(null);
  const fingerL = useRef<SVGGElement | null>(null);
  const fingerR = useRef<SVGGElement | null>(null);
  const carriedEl = useRef<HTMLImageElement | null>(null);
  const stickEl = useRef<HTMLDivElement | null>(null);
  const trolleyEl = useRef<HTMLDivElement | null>(null);
  const shadowEl = useRef<HTMLDivElement | null>(null);
  const machineEl = useRef<HTMLDivElement | null>(null);
  const trayEl = useRef<HTMLDivElement | null>(null);
  const pileEls = useRef<(HTMLImageElement | null)[]>([]);
  const dir = useRef(0);
  const phaseRef = useRef("idle");
  
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;

  const sim = useRef({
    x: GW / 2,
    y: HOME_Y,
    vx: 0,
    drive: 0,
    sway: 0,
    swayV: 0,
    breeze: 0,
    close: 0,
    carried: -1,
    carry: { x: 0, y: 0 },
    stage: "",
    st: 0,
    depthY: DROP_Y,
    fallV: 0,
    stretch: 0,
    xrot: 0,
    swallow: 0,
    released: false,
    mouthY: 353
  });

  const softRef = useRef<{
    dx: number;
    dy: number;
    rot: number;
    sq: number;
    vdx: number;
    vdy: number;
    vrot: number;
    vsq: number;
    ey: number;
    evy: number;
    delay: number;
    landed: boolean;
  }[] | null>(null);

  if (softRef.current === null) {
    softRef.current = pile.map((s) => ({
      dx: 0,
      dy: 0,
      rot: 0,
      sq: 0,
      vdx: 0,
      vdy: 0,
      vrot: 0,
      vsq: 0,
      ey: s.dropFrom,
      evy: 0,
      delay: s.delay,
      landed: false
    }));
  }

  const setPhaseBoth = (p: string) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const api = useRef({ setPhaseBoth, setMessage, setVerified, setOverTray, setTrayMode });
  api.current = { setPhaseBoth, setMessage, setVerified, setOverTray, setTrayMode };
  const targetIdx = useMemo(() => pile.findIndex((p) => p.toy === target), [pile, target]);

  useEffect(() => {
    const s = sim.current;
    const soft = softRef.current!;
    let raf = 0;
    let wasOverTray = false;
    let prevNow = 0;
    const speedMul = reduce ? 2.4 : 1;

    if (reduce) {
      soft.forEach((b) => {
        b.ey = 0;
        b.landed = true;
      });
    }

    const toyCenter = (i: number) => {
      const p = pile[i];
      return { x: p.x, y: GH - p.b - p.w / 2 * 0.92 };
    };

    const ripple = (x: number, power: number, except = -1) => {
      pile.forEach((p, i) => {
        if (i === except || i === s.carried) return;
        const d = Math.abs(p.x - x);
        if (d < 80) {
          const f = (1 - d / 80) * power;
          const side = p.x < x ? -1 : 1;
          const b = soft[i];
          b.vdx += side * f * 1.6;
          b.vdy -= f * 1.1;
          b.vrot += side * f * 2;
          b.vsq += f * 0.02;
        }
      });
    };

    const pend = () => {
      const len = Math.max(2, s.y - RAIL_Y);
      const rad = reduce ? 0 : (s.sway + s.breeze) * Math.PI / 180;
      return { ex: s.x + Math.sin(rad) * len, ey: RAIL_Y + Math.cos(rad) * len };
    };

    const gripY = (ey: number) => ey + GRIP_OFFSET + (s.carried >= 0 ? pile[s.carried].w : 80) / 2;

    const candidateAt = (x: number) => {
      let best = -1;
      let bestScore = -Infinity;
      pile.forEach((q, i) => {
        const d = Math.abs(q.x - x);
        if (d < GRAB_RADIUS) {
          const score = q.z * 100 - d;
          if (score > bestScore) {
            bestScore = score;
            best = i;
          }
        }
      });
      return best;
    };

    const render = () => {
      const sway = reduce ? 0 : s.sway + s.breeze;
      const len = Math.max(2, s.y - RAIL_Y);
      if (trolleyEl.current) trolleyEl.current.style.transform = `translateX(${(s.x - 14).toFixed(2)}px)`;
      if (shadowEl.current) {
        const rad = sway * Math.PI / 180;
        const ex = s.x + Math.sin(rad) * len;
        const bottomY = s.carried >= 0 ? s.carry.y + pile[s.carried].w / 2 : s.y + 58;
        const t2 = clamp01(1 - (GH - bottomY) / 210);
        shadowEl.current.style.transform = `translateX(${(ex - 45).toFixed(2)}px) scaleX(${(1.25 - 0.5 * t2).toFixed(3)})`;
        shadowEl.current.style.opacity = (0.1 + 0.3 * t2).toFixed(3);
      }
      if (rigEl.current) {
        const totalH = len + 70;
        rigEl.current.setAttribute("viewBox", `0 0 36 ${totalH.toFixed(1)}`);
        rigEl.current.setAttribute("height", totalH.toFixed(1));
        rigEl.current.style.transform = `translateX(${s.x.toFixed(2)}px) rotate(${sway.toFixed(2)}deg)`;
      }
      coilEl.current?.setAttribute("transform", `translate(9 0) scale(1 ${(len / 100).toFixed(4)})`);
      clawEl.current?.setAttribute("transform", `translate(18 ${len.toFixed(2)}) scale(2.5) translate(-20.6 -8.9)`);
      const pinch = 15 * s.close;
      fingerL.current?.setAttribute("transform", `rotate(${pinch.toFixed(2)} ${CLAW_PIVOT.x} ${CLAW_PIVOT.y})`);
      fingerR.current?.setAttribute("transform", `rotate(${(-pinch).toFixed(2)} ${CLAW_PIVOT.x} ${CLAW_PIVOT.y})`);
      for (let i = 0; i < pile.length; i++) {
        const el = pileEls.current[i];
        if (!el) continue;
        const b = soft[i];
        el.style.transform = `translate(${b.dx.toFixed(2)}px, ${(b.dy + b.ey).toFixed(2)}px) rotate(${(pile[i].rot + b.rot).toFixed(2)}deg) scale(${(1 - b.sq * 0.6).toFixed(3)}, ${(1 + b.sq).toFixed(3)})`;
      }
      if (s.carried >= 0 && carriedEl.current) {
        const w = pile[s.carried].w;
        const sc = 1 - s.swallow * 0.78;
        const sx = (sc * (1 - s.stretch * 0.55)).toFixed(3);
        const sy = (sc * (1 + s.stretch)).toFixed(3);
        carriedEl.current.style.transform = `translate(${s.carry.x - w / 2}px, ${s.carry.y - w / 2}px) rotate(${(sway + s.xrot).toFixed(2)}deg) scale(${sx}, ${sy})`;
        if (s.swallow > 0) carriedEl.current.style.opacity = (1 - s.swallow).toFixed(2);
      }
    };

    const stageP = (dur: number, dt: number) => {
      s.st += dt;
      return clamp01(s.st / dur);
    };

    const nextStage = (st: string) => {
      s.stage = st;
      s.st = 0;
    };

    const step = (now: number) => {
      const dtRaw = prevNow ? Math.min(0.04, Math.max(4e-3, (now - prevNow) / 1e3)) : 1 / 60;
      prevNow = now;
      const dt = dtRaw * speedMul;
      const f = dt * 60;
      const ph = phaseRef.current;
      const a = api.current;
      if (!reduce) {
        const lean = ph === "idle" || ph === "carry" ? -s.vx * 0.042 : 0;
        s.swayV += (lean - s.sway) * 0.05 * f;
        s.swayV *= Math.pow(0.93, f);
        s.sway += s.swayV * f;
        s.breeze = Math.sin(now / 1500) * 0.45 + Math.sin(now / 521) * 0.12;
      }
      for (let i = 0; i < soft.length; i++) {
        const b = soft[i];
        if (!b.landed) {
          if (b.delay > 0) {
            b.delay -= dt;
          } else {
            b.evy += ENTRANCE_G * dt;
            b.ey += b.evy * dt;
            if (b.ey >= 0) {
              b.ey = 0;
              b.landed = true;
              b.vsq += Math.min(0.055, b.evy * 6e-5);
              b.vrot += rand(-0.8, 0.8);
              ripple(pile[i].x, Math.min(0.22, b.evy * 2e-4), i);
            }
          }
        }
        b.vdx += -b.dx * 0.055 * f;
        b.vdy += -b.dy * 0.055 * f;
        b.vrot += -b.rot * 0.05 * f;
        b.vsq += -b.sq * 0.13 * f;
        const damp = Math.pow(0.9, f);
        b.vdx *= damp;
        b.vdy *= damp;
        b.vrot *= Math.pow(0.91, f);
        b.vsq *= Math.pow(0.84, f);
        b.dx += b.vdx * f;
        b.dy += b.vdy * f;
        b.rot += b.vrot * f;
        b.sq += b.vsq * f;
      }
      if (ph === "idle" || ph === "carry") {
        s.drive += (dir.current - s.drive) * (1 - Math.exp(-13 * dt));
        s.vx += s.drive * 720 * dt;
        s.vx *= Math.exp(-5.5 * dt);
        s.x = Math.min(CLAW_MAX, Math.max(CLAW_MIN, s.x + s.vx * dt));
        if (ph === "carry") {
          s.xrot += (s.sway * 0.5 - s.xrot) * (1 - Math.exp(-6 * dt));
          const { ex, ey } = pend();
          s.carry.x = ex;
          s.carry.y = gripY(ey);
          const over = s.x >= TRAY.min && s.x <= TRAY.max;
          if (over !== wasOverTray) {
            wasOverTray = over;
            a.setOverTray(over);
          }
        }
      } else if (ph === "seq") {
        if (s.stage === "antic") {
          const p = stageP(T.antic, dt);
          s.y = HOME_Y - ANTIC_RISE * easeOutCubic(p);
          s.close = -0.55 * easeOutCubic(p);
          if (p >= 1) {
            const cand = candidateAt(s.x);
            if (cand >= 0) {
              const c = toyCenter(cand);
              s.depthY = Math.min(GH - 46, Math.max(HOME_Y + 50, c.y - GRIP_OFFSET - pile[cand].w / 2));
            } else {
              s.depthY = DROP_Y;
            }
            nextStage("down");
          }
        } else if (s.stage === "down") {
          const p = stageP(T.down, dt);
          s.y = HOME_Y - ANTIC_RISE + (s.depthY - HOME_Y + ANTIC_RISE) * easeInQuad(p);
          if (s.y > 130 && !reduce) {
            pile.forEach((q, i) => {
              const d = Math.abs(q.x - s.x);
              if (d < 56) {
                const push = (1 - d / 56) * 7 * dt;
                const side = q.x < s.x ? -1 : 1;
                soft[i].vdx += side * push;
                soft[i].vsq += push * 0.012;
              }
            });
          }
          if (p >= 1) nextStage("dwell1");
        } else if (s.stage === "dwell1") {
          const p = stageP(T.dwell1, dt);
          s.y = s.depthY + (reduce ? 0 : 3.5 * Math.sin(Math.PI * p));
          if (p >= 1) {
            s.y = s.depthY;
            nextStage("close");
          }
        } else if (s.stage === "close") {
          const p = stageP(T.close, dt);
          s.close = -0.55 + 1.55 * easeOutCubic(p);
          if (p >= 1) {
            const best = candidateAt(s.x);
            s.carried = best;
            if (best >= 0) {
              s.carry = { ...toyCenter(best) };
              s.xrot = pile[best].rot + soft[best].rot;
              const el = pileEls.current[best];
              if (el) el.style.visibility = "hidden";
              ripple(pile[best].x, 0.35, best);
              if (carriedEl.current) {
                carriedEl.current.src = el?.src ?? carriedEl.current.src;
                carriedEl.current.style.width = `${pile[best].w}px`;
                carriedEl.current.style.visibility = "visible";
                carriedEl.current.style.opacity = "";
              }
            } else {
              ripple(s.x, 0.2);
            }
            nextStage("dwell2");
          }
        } else if (s.stage === "dwell2") {
          if (stageP(T.dwell2, dt) >= 1) nextStage(s.carried >= 0 && !reduce ? "load" : "up");
          if (s.carried >= 0) {
            s.xrot += -s.xrot * (1 - Math.exp(-3.5 * dt));
            const { ex, ey } = pend();
            s.carry.x = ex;
            s.carry.y = gripY(ey);
          }
        } else if (s.stage === "load") {
          const p = stageP(T.load, dt);
          const bell = Math.sin(Math.PI * p);
          s.y = s.depthY + 6 * bell;
          s.close = 1 + 0.12 * bell;
          s.xrot += -s.xrot * (1 - Math.exp(-3.5 * dt));
          const { ex, ey } = pend();
          s.carry.x = ex;
          s.carry.y = gripY(ey);
          if (p >= 1) {
            s.y = s.depthY;
            nextStage("up");
          }
        } else if (s.stage === "up") {
          const p = stageP(T.up, dt);
          s.y = s.depthY + (HOME_Y - s.depthY) * easeInOutCubic(p);
          if (s.carried >= 0) {
            s.xrot += -s.xrot * (1 - Math.exp(-3.5 * dt));
            const { ex, ey } = pend();
            s.carry.x = ex;
            s.carry.y = gripY(ey);
          }
          if (p >= 1) {
            if (s.carried >= 0) {
              a.setPhaseBoth("carry");
              a.setMessage(null);
            } else {
              a.setPhaseBoth("idle");
              a.setMessage("Came up empty. Try again.");
            }
          }
        }
      } else if (ph === "toTray") {
        const right = s.carried === targetIdx;
        if (s.stage === "open") {
          const p = stageP(T.open, dt);
          s.close = 1 - easeOutCubic(p);
          if (s.st > 0.12 && !s.released) {
            s.released = true;
            if (right) {
              a.setTrayMode("open");
              if (reduce) {
                if (carriedEl.current) carriedEl.current.style.visibility = "hidden";
                s.carried = -1;
                a.setOverTray(false);
                a.setTrayMode("win");
                nextStage("beat");
                a.setPhaseBoth("celebrate");
              } else {
                const m = machineEl.current?.getBoundingClientRect();
                const tr = trayEl.current?.getBoundingClientRect();
                if (m && tr) s.mouthY = tr.top - m.top + 2;
                s.fallV = 30;
              }
            } else {
              s.fallV = 40;
            }
          }
        }
        if (right && s.released && s.carried >= 0) {
          s.fallV = Math.min(s.fallV + DROP_G * dt, 460);
          s.carry.y += s.fallV * dt;
          s.carry.x += (TRAY.cx - s.carry.x) * (1 - Math.exp(-2.2 * dt));
          s.xrot += -s.xrot * (1 - Math.exp(-4 * dt));
          s.stretch = Math.abs(s.fallV) / 460 * 0.09;
          const w = pile[s.carried].w;
          const sunk = s.carry.y + w / 2 - s.mouthY;
          if (sunk > 0 && carriedEl.current) {
            carriedEl.current.style.clipPath = `inset(0 0 ${sunk.toFixed(1)}px 0)`;
            carriedEl.current.style.filter = `brightness(${Math.max(0.4, 1 - sunk / w * 0.75).toFixed(3)})`;
          }
          if (sunk >= w + 4) {
            if (carriedEl.current) {
              carriedEl.current.style.visibility = "hidden";
              carriedEl.current.style.clipPath = "";
              carriedEl.current.style.filter = "";
            }
            s.carried = -1;
            a.setOverTray(false);
            a.setTrayMode("win");
            nextStage("beat");
            a.setPhaseBoth("celebrate");
          }
        }
        if (!right && s.fallV !== 0) {
          s.fallV = Math.min(s.fallV + DROP_G * dt, 360);
          s.carry.y += s.fallV * dt;
          s.carry.x += (TRAY.cx - s.carry.x) * (1 - Math.exp(-4 * dt));
          s.xrot += -s.xrot * (1 - Math.exp(-3 * dt));
          s.stretch = Math.abs(s.fallV) / 460 * 0.09;
          if (s.fallV > 0 && s.carry.y >= TRAY.cy) {
            if (s.fallV > 200) {
              s.carry.y = TRAY.cy;
              s.fallV = -s.fallV * 0.28;
              s.xrot += rand(-7, 7);
            } else {
              s.carry.y = TRAY.cy;
              s.fallV = 0;
              s.stretch = 0;
              a.setOverTray(false);
              a.setTrayMode("no");
              a.setMessage(
                `That’s ${TOY_META[pile[s.carried].toy].label}! Find ${TOY_META[target].label}.`
              );
              nextStage("beat");
              a.setPhaseBoth("deny");
            }
          }
        }
      } else if (ph === "celebrate") {
        if (s.stage === "beat") {
          if (stageP(0.28, dt) >= 1) {
            nextStage("shine");
            api.current.setVerified(true);
            onVerifyRef.current?.();
          }
        } else if (s.stage === "shine") {
          if (stageP(0.7, dt) >= 1) api.current.setPhaseBoth("done");
        }
      } else if (ph === "deny") {
        if (s.stage === "beat") {
          const p = stageP(0.46, dt);
          s.swallow = easeOutCubic(p);
          s.carry.y -= 46 * dt;
          if (p >= 1) {
            const idx = s.carried;
            api.current.setTrayMode("");
            const el = pileEls.current[idx];
            if (el) el.style.visibility = "";
            if (carriedEl.current) {
              carriedEl.current.style.visibility = "hidden";
              carriedEl.current.style.opacity = "";
              carriedEl.current.style.clipPath = "";
              carriedEl.current.style.filter = "";
            }
            s.swallow = 0;
            const b = soft[idx];
            b.vsq += 0.05;
            b.vrot += rand(-1, 1);
            ripple(pile[idx].x, 0.25, idx);
            s.carried = -1;
            a.setPhaseBoth("idle");
          }
        }
      }
      render();
      raf = requestAnimationFrame(step);
    };

    render();
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduce, targetIdx, target, pile]);

  const action = () => {
    const s = sim.current;
    if (verified) return;
    if (phaseRef.current === "idle") {
      setMessage(null);
      s.close = 0;
      s.stage = "antic";
      s.st = 0;
      setPhaseBoth("seq");
    } else if (phaseRef.current === "carry") {
      if (s.x >= TRAY.min && s.x <= TRAY.max) {
        if (carriedEl.current) {
          carriedEl.current.style.visibility = "visible";
          carriedEl.current.style.opacity = "";
          carriedEl.current.style.clipPath = "";
          carriedEl.current.style.filter = "";
        }
        s.stage = "open";
        s.st = 0;
        s.fallV = 0;
        s.swallow = 0;
        s.stretch = 0;
        s.released = false;
        setOverTray(false);
        setPhaseBoth("toTray");
      } else {
        setMessage("Move the toy over the drop zone first.");
      }
    }
  };

  const stickDrag = useRef<{ id: number; startX: number } | null>(null);
  const onStickDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (verified) return;
    (e.target as HTMLDivElement).setPointerCapture(e.pointerId);
    stickDrag.current = { id: e.pointerId, startX: e.clientX };
    if (stickEl.current) stickEl.current.style.transition = "none";
  };

  const onStickMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = stickDrag.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = Math.max(-26, Math.min(26, e.clientX - d.startX));
    dir.current = dx / 26;
    if (stickEl.current) stickEl.current.style.transform = `rotate(${(dx * 1.05).toFixed(1)}deg)`;
  };

  const onStickUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (stickDrag.current?.id !== e.pointerId) return;
    stickDrag.current = null;
    dir.current = 0;
    if (stickEl.current) {
      stickEl.current.style.transition = "transform 0.25s cubic-bezier(0.2, 1.6, 0.4, 1)";
      stickEl.current.style.transform = "";
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (infoOpen) {
      if (e.key === "Escape") setInfoOpen(false);
      return;
    }
    if (verified) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      dir.current = -1;
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      dir.current = 1;
    } else if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      action();
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") dir.current = 0;
  };

  const t = TOY_META[target];
  const busy = phase !== "idle" && phase !== "carry";
  const stepNo = verified || phase === "carry" || phase === "toTray" || phase === "celebrate" ? 3 : phase === "seq" ? 2 : 1;
  const carried = sim.current.carried;
  const carriedW = carried >= 0 ? pile[carried].w : 80;
  const len = Math.max(2, sim.current.y - RAIL_Y);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className ? `clawcap ${className}` : "clawcap"}
        role="group"
        aria-label="Claw machine verification"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <header className="clawcap-top">
          <motion.span
            key={verified ? "ok" : "idle"}
            className={verified ? "clawcap-shield clawcap-shield--ok" : "clawcap-shield"}
            aria-hidden="true"
            initial={verified ? { scale: 0.55 } : false}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
          >
            <svg viewBox="0 0 20 20" width="14" height="14">
              <path
                d="M10 2.2 4 4.6v4.6c0 4 2.6 6.7 6 8.2 3.4-1.5 6-4.2 6-8.2V4.6Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {verified && (
                <path d="m7 9.8 2.2 2.2L13.4 7.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </motion.span>
          <button
            type="button"
            className="clawcap-help"
            aria-label="About PlayCaptcha"
            aria-haspopup="dialog"
            onClick={() => setInfoOpen(true)}
          >
            <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
              <circle cx="10" cy="10" r="7.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 8.2c.2-1.2 1-1.9 2.1-1.9 1.2 0 2 .8 2 1.8 0 1.6-2.1 1.7-2.1 3.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="10" cy="13.9" r="0.9" fill="currentColor" />
            </svg>
          </button>
        </header>

        <AnimatePresence>
          {infoOpen && (
            <motion.div
              className="clawcap-info"
              role="dialog"
              aria-modal="true"
              aria-label="About PlayCaptcha"
              onClick={() => setInfoOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <motion.div
                className="clawcap-info-card"
                onClick={(e) => e.stopPropagation()}
                initial={reduce ? false : { opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.13, ease: "easeOut" } }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
              >
                <button
                  type="button"
                  className="clawcap-info-x"
                  aria-label="Close"
                  onClick={() => setInfoOpen(false)}
                >
                  <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                    <path d="M5 5l10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="clawcap-info-head">
                  <span className="clawcap-info-tile">
                    <img src="/playcaptcha.svg" alt="" aria-hidden="true" />
                  </span>
                  <h4 className="clawcap-info-title">
                    PlayCaptcha <span className="clawcap-info-ver">v1</span>
                  </h4>
                  <p className="clawcap-info-tag">Catch the right toy to prove you’re human.</p>
                </div>
                <ol className="clawcap-info-list">
                  {[
                    ["Move", <>Line the claw up right over your prize — joystick or <kbd>←</kbd> <kbd>→</kbd></>],
                    ["Grab", <>Commit. The claw dives, bites and hauls it up — red button or <kbd>Space</kbd></>],
                    ["Drop", <>Ferry it to the hatch and let go. Wrong toy? Straight back on the pile</>]
                  ].map(([label, desc], i) => (
                    <li key={label as string}>
                      <span className="clawcap-info-n">{i + 1}</span>
                      <span>
                        <strong>{label as string}</strong>
                        <span className="clawcap-info-d">{desc}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <button type="button" className="clawcap-info-done" onClick={() => setInfoOpen(false)}>
                  Got it
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <h3 className="clawcap-title">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={verified ? "verified" : "title"}
              style={{ display: "inline-block" }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              {verified ? "Verified" : title}
            </motion.span>
          </AnimatePresence>
        </h3>

        <p className="clawcap-sub" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={verified ? "done" : message ?? "challenge"}
              style={{ display: "inline-block" }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {verified ? (
                "You’re human. Nice catch."
              ) : message ? (
                message
              ) : (
                <>
                  Use the claw to pick up{" "}
                  <em style={{ color: t.accent }}>
                    <img className="clawcap-sub-toy" src={`${assetBase}${target}.png`} alt="" draggable={false} />
                    {t.label}
                  </em>
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </p>

        <ol className="clawcap-steps" aria-hidden="true">
          <span className="clawcap-steps-pill" style={{ transform: `translateX(${(stepNo - 1) * 100}%)` }} />
          {["Move", "Grab", "Drop"].map((label, i) => (
            <li key={label} className={stepNo === i + 1 ? "is-active" : undefined}>
              <span className="clawcap-step-n">{i + 1}</span> {label}
            </li>
          ))}
        </ol>

        <div ref={machineEl} className="clawcap-machine">
          <div className="clawcap-case">
            <div className={verified ? "clawcap-glass clawcap-glass--dim" : "clawcap-glass"}>
              <div className="cc-rail" />
              <div ref={trolleyEl} className="cc-trolley" aria-hidden="true" />
              <div ref={shadowEl} className="cc-claw-shadow" aria-hidden="true" />
              {pile.map((p, i) => (
                <img
                  key={p.toy}
                  ref={(el) => {
                    pileEls.current[i] = el;
                  }}
                  className="cc-toy"
                  src={`${assetBase}${p.toy}.png`}
                  alt=""
                  draggable={false}
                  style={{
                    left: p.x - p.w / 2,
                    bottom: p.b,
                    width: p.w,
                    zIndex: p.z,
                    transform: `translateY(${p.dropFrom}px)`,
                    transformOrigin: "50% 100%"
                  }}
                />
              ))}
              <div className="cc-pile-shadow" />
              <svg ref={rigEl} className="cc-rig" width="36" height={len + 70} viewBox={`0 0 36 ${len + 70}`} aria-hidden="true">
                <g ref={coilEl} transform={`translate(9 0) scale(1 ${(len / 100).toFixed(4)})`}>
                  <path
                    d="M9 0 L9 5 C 15 7.5 15 9.5 9 12 C 3 14.5 3 16.5 9 19 C 15 21.5 15 23.5 9 26 C 3 28.5 3 30.5 9 33 C 15 35.5 15 37.5 9 40 C 3 42.5 3 44.5 9 47 C 15 49.5 15 51.5 9 54 C 3 56.5 3 58.5 9 61 C 15 63.5 15 65.5 9 68 C 3 70.5 3 72.5 9 75 C 15 77.5 15 79.5 9 82 C 3 84.5 3 86.5 9 89 C 15 91.5 15 93.5 9 95 L 9 100"
                    fill="none"
                    stroke="#9A9FA8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
                <g ref={clawEl} transform={`translate(18 ${len.toFixed(2)}) scale(2.5) translate(-20.6 -8.9)`}>
                  <g ref={fingerL}>
                    {CLAW_ARM_L.map((p, i) => <path key={i} fill={p.fill} d={p.d} />)}
                  </g>
                  <g ref={fingerR}>
                    {CLAW_ARM_R.map((p, i) => <path key={i} fill={p.fill} d={p.d} />)}
                  </g>
                  {CLAW_BODY.map((p, i) => <path key={i} fill={p.fill} d={p.d} />)}
                </g>
              </svg>
              <div className="cc-glass-shine" />
            </div>

            <div className="clawcap-panel">
              <div
                className="cc-joy"
                role="slider"
                aria-label="Move the claw"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round((sim.current.x - CLAW_MIN) / (CLAW_MAX - CLAW_MIN) * 100)}
                onPointerDown={onStickDown}
                onPointerMove={onStickMove}
                onPointerUp={onStickUp}
                onPointerCancel={onStickUp}
              >
                <div className="cc-joy-base" />
                <div ref={stickEl} className="cc-joy-stick">
                  <div className="cc-joy-shaft" />
                  <div className="cc-joy-ball" />
                </div>
              </div>

              <div
                ref={trayEl}
                className={`cc-tray${
                  trayMode === "open"
                    ? " cc-tray--open"
                    : trayMode === "win"
                    ? " cc-tray--win"
                    : trayMode === "no"
                    ? " cc-tray--no"
                    : overTray
                    ? " cc-tray--hot"
                    : ""
                }`}
              >
                <span className="cc-tray-hatch" aria-hidden="true">
                  <span className="cc-tray-mouth" />
                  <span className="cc-tray-door cc-tray-door--l" />
                  <span className="cc-tray-door cc-tray-door--r" />
                  <span className="cc-tray-skin" />
                </span>
                {trayMode === "win" && !reduce && (
                  <span className="cc-confetti" aria-hidden="true">
                    {CONFETTI.map((p, i) => (
                      <i
                        key={i}
                        style={{
                          background: p.c,
                          animationDelay: `${p.d}s`,
                          // @ts-ignore
                          "--dx": `${p.dx}px`,
                          // @ts-ignore
                          "--dy": `${p.dy}px`,
                          // @ts-ignore
                          "--dr": `${p.dr}deg`
                        }}
                      />
                    ))}
                  </span>
                )}
                <span className="cc-tray-label">
                  {trayMode === "win" ? (
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                      <path d="m3.6 8.6 2.9 2.9 6-6.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : trayMode === "no" ? (
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                      <path d="M13.2 8A5.2 5.2 0 1 1 11.6 4.25" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M11.7 1.5v2.9h2.9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                      <circle cx="8" cy="4.9" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2.4 12.1h3.7M9.9 12.1h3.7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                  <span>
                    {trayMode === "win" ? "Nice catch!" : trayMode === "no" ? "Hmm, wrong toy" : overTray ? "Release!" : "Drop here"}
                  </span>
                </span>
              </div>

              <button
                type="button"
                className={phase === "carry" && overTray ? "cc-action cc-action--ready" : "cc-action"}
                onClick={action}
                disabled={busy || verified}
                aria-label={phase === "carry" ? "Drop the toy" : "Grab"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={phase === "carry" ? "drop" : "grab"}
                    style={{ display: "inline-block" }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                  >
                    {phase === "carry" ? "Drop" : "Grab"}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>

          <img
            ref={carriedEl}
            className="cc-carried"
            src={carried >= 0 ? `${assetBase}${pile[carried].toy}.png` : `${assetBase}${target}.png`}
            alt=""
            draggable={false}
            style={{
              width: carriedW,
              visibility: carried >= 0 && phase !== "idle" ? "visible" : "hidden"
            }}
          />
        </div>

        <p className="clawcap-hint">Joystick or ← → to move · Space to grab & drop</p>
      </motion.div>
    </MotionConfig>
  );
}
