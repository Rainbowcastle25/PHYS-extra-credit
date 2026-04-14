import type { FormulaItem, StudyTopic } from '../types';

export const studyTopics: StudyTopic[] = [
  {
    id: 'vectors',
    title: 'Vectors & Components',
    summary: 'Break every vector into x and y pieces before adding it. This makes motion, force, and momentum problems much easier to solve.',
    formulas: ['Ax = A cos(theta)', 'Ay = A sin(theta)', '|A| = sqrt(Ax^2 + Ay^2)', 'theta = tan^-1(Ay/Ax)'],
    mistakes: ['Using the wrong angle reference', 'Adding vector magnitudes directly', 'Forgetting signs on left/down components'],
    example: {
      prompt: 'A 12 N force acts 30 degrees above the +x axis. Find the components.',
      steps: ['Ax = 12 cos(30 degrees) = 10.39 N.', 'Ay = 12 sin(30 degrees) = 6.00 N.', 'Report both components with units and direction.'],
      answer: 'Fx = 10.4 N, Fy = 6.0 N.'
    },
    checkpoint: {
      question: 'A vector has components Ax = 3 and Ay = 4. Its magnitude is:',
      options: ['1', '5', '7', '12'],
      answerIndex: 1,
      explanation: 'Use the Pythagorean theorem: sqrt(3^2 + 4^2) = 5.'
    }
  },
  {
    id: 'kinematics',
    title: '1D & 2D Kinematics',
    summary: 'Describe motion using displacement, velocity, and acceleration. In 2D, split vectors into x/y components and treat each axis independently.',
    formulas: ['v = v0 + at', 'x = x0 + v0t + (1/2)at^2', 'v^2 = v0^2 + 2aΔx', 'Range = (v0^2 sin 2θ) / g'],
    mistakes: ['Mixing up displacement and distance', 'Forgetting sign conventions', 'Using one equation with too many unknowns'],
    example: {
      prompt: 'A ball is launched at 20 m/s at 35°. Find time of flight (ignore air resistance).',
      steps: ['Find vertical component: v0y = 20 sin(35°) = 11.47 m/s.', 'At landing, vertical displacement is 0 so t = 2v0y/g.', 't = 2(11.47)/9.8 = 2.34 s.'],
      answer: 'Time of flight ≈ 2.34 s.'
    },
    checkpoint: {
      question: 'If acceleration is constant and positive, velocity vs time graph is:',
      options: ['Horizontal', 'Line with positive slope', 'Parabola', 'Line with negative slope'],
      answerIndex: 1,
      explanation: 'Slope of v-t graph is acceleration. Positive constant acceleration gives a straight line with positive slope.'
    }
  },
  {
    id: 'newton-laws',
    title: 'Newton’s Laws & Forces',
    summary: 'Model interactions with free-body diagrams. Sum forces in each axis and apply ΣF = ma.',
    formulas: ['ΣFx = max', 'ΣFy = may', 'Ff ≤ μsN', 'Fk = μkN'],
    mistakes: ['Leaving out normal force or friction direction', 'Using μk when object is static', 'Skipping vector components'],
    example: {
      prompt: 'A 5 kg crate on rough floor has μk = 0.20 and is pulled with 25 N horizontally. Find acceleration.',
      steps: ['Normal force N = mg = 49 N.', 'Kinetic friction Fk = μkN = 9.8 N opposing motion.', 'Net force = 25 - 9.8 = 15.2 N, so a = Fnet/m = 3.04 m/s^2.'],
      answer: 'Acceleration ≈ 3.04 m/s^2.'
    },
    checkpoint: {
      question: 'When ΣF = 0, an object can be:',
      options: ['Only at rest', 'Only moving at constant speed in straight line', 'Either at rest or constant velocity', 'Always accelerating'],
      answerIndex: 2,
      explanation: 'Zero net force means zero acceleration. Velocity can be constant, including zero.'
    }
  },
  {
    id: 'inclines',
    title: 'Friction, Tension, and Inclined Planes',
    summary: 'Use force components on slopes, then compare the downhill pull with friction and tension. This topic is really an application of Newton’s laws.',
    formulas: ['mg sin(theta)', 'mg cos(theta)', 'Fk = μkN', 'Fs ≤ μsN', 'a = g sin(theta)'],
    mistakes: ['Using mg instead of mg sin(theta) along the slope', 'Forgetting that normal force is reduced on an incline', 'Pointing friction the wrong way'],
    example: {
      prompt: 'A 4.0 kg block slides down a frictionless 30 degree incline. Find its acceleration.',
      steps: ['Component of gravity along slope: mg sin(30) = 19.6 N.', 'Use F = ma along the slope.', 'a = 19.6 / 4.0 = 4.9 m/s^2.'],
      answer: 'Acceleration = 4.9 m/s^2 down the slope.'
    },
    checkpoint: {
      question: 'For a block on a 30 degree incline, the normal force is:',
      options: ['mg', 'mg sin(theta)', 'mg cos(theta)', 'Zero'],
      answerIndex: 2,
      explanation: 'The normal force balances the component of weight perpendicular to the surface, mg cos(theta).'
    }
  },
  {
    id: 'circular-motion',
    title: 'Circular Motion',
    summary: 'Objects moving in a circle need inward centripetal acceleration. The force can come from tension, gravity, friction, or any combination of real forces.',
    formulas: ['ac = v^2 / r', 'Fc = mv^2 / r', 'v = 2πr / T'],
    mistakes: ['Treating centripetal force as a new force', 'Using diameter instead of radius', 'Mixing up speed and velocity'],
    example: {
      prompt: 'A 2.0 kg object moves in a circle of radius 5.0 m at 6.0 m/s. Find the centripetal force.',
      steps: ['Use Fc = mv^2 / r.', 'Fc = (2.0)(6.0^2) / 5.0.', 'Fc = 14.4 N inward.'],
      answer: 'Centripetal force = 14.4 N inward.'
    },
    checkpoint: {
      question: 'If the speed of a circular-motion object doubles, the centripetal force becomes:',
      options: ['Half as large', 'Twice as large', 'Four times as large', 'Unchanged'],
      answerIndex: 2,
      explanation: 'Fc is proportional to v^2, so doubling speed quadruples the force.'
    }
  },
  {
    id: 'energy',
    title: 'Work, Energy, and Power',
    summary: 'Relate force and displacement through work, then use conservation of energy to connect speed, height, and springs.',
    formulas: ['W = Fd cosθ', 'K = (1/2)mv^2', 'Ug = mgh', 'Us = (1/2)kx^2', 'P = ΔE/Δt'],
    mistakes: ['Ignoring non-conservative work', 'Sign errors for work by friction', 'Confusing power and energy'],
    example: {
      prompt: 'A 0.50 kg block is dropped from 2.0 m. Find speed before impact.',
      steps: ['Use energy conservation: mgh = (1/2)mv^2.', 'Cancel mass and solve: v = √(2gh).', 'v = √(2*9.8*2.0) = 6.26 m/s.'],
      answer: 'Speed ≈ 6.26 m/s downward.'
    },
    checkpoint: {
      question: 'Which quantity is scalar?',
      options: ['Force', 'Momentum', 'Work', 'Acceleration'],
      answerIndex: 2,
      explanation: 'Work is scalar (can be positive/negative). Force, momentum, and acceleration are vectors.'
    }
  },
  {
    id: 'momentum',
    title: 'Momentum & Collisions',
    summary: 'Use momentum conservation in isolated systems. Mechanical energy is conserved only in elastic collisions.',
    formulas: ['p = mv', 'Impulse J = Δp = FΔt', 'm1u1 + m2u2 = m1v1 + m2v2'],
    mistakes: ['Applying energy conservation to inelastic collisions', 'Dropping sign of velocity', 'Mixing system and object perspectives'],
    example: {
      prompt: 'Two carts stick together: 1.0 kg at 3 m/s hits 2.0 kg at rest. Find final speed.',
      steps: ['Initial momentum = (1)(3) + (2)(0) = 3 kg·m/s.', 'Combined mass after collision = 3.0 kg.', 'v = p/m = 3/3 = 1.0 m/s.'],
      answer: 'Final speed is 1.0 m/s in original direction.'
    },
    checkpoint: {
      question: 'In a perfectly inelastic collision, what is always conserved?',
      options: ['Kinetic energy only', 'Momentum only', 'Momentum and kinetic energy', 'Neither'],
      answerIndex: 1,
      explanation: 'Momentum is conserved if external impulse is negligible; kinetic energy is not generally conserved.'
    }
  },
  {
    id: 'rotation',
    title: 'Rotation & Torque',
    summary: 'Rotational motion mirrors linear motion using angular variables. Torque causes angular acceleration.',
    formulas: ['τ = rF sinφ', 'Στ = Iα', 'Krot = (1/2)Iω^2', 'ω = ω0 + αt'],
    mistakes: ['Using radius instead of lever arm', 'Confusing tangential vs angular acceleration', 'Wrong moment of inertia for geometry'],
    example: {
      prompt: 'A 2.0 N force is applied tangentially at r = 0.30 m to a disk with I = 0.18 kg·m^2. Find α.',
      steps: ['Torque τ = rF = 0.30*2.0 = 0.60 N·m.', 'Apply Στ = Iα.', 'α = τ/I = 0.60/0.18 = 3.33 rad/s^2.'],
      answer: 'Angular acceleration ≈ 3.33 rad/s^2.'
    },
    checkpoint: {
      question: 'If net torque is zero, angular velocity is:',
      options: ['Always zero', 'Constant (possibly nonzero)', 'Increasing linearly', 'Undefined'],
      answerIndex: 1,
      explanation: 'Zero net torque means zero angular acceleration, so angular velocity stays constant.'
    }
  },
  {
    id: 'gravitation',
    title: 'Gravitation & Orbits',
    summary: 'Gravity follows an inverse-square law and explains both falling objects and orbital motion around planets and stars.',
    formulas: ['F = Gm1m2 / r^2', 'g = GM / r^2', 'v_orbit = sqrt(GM / r)', 'U = -GMm / r'],
    mistakes: ['Using the radius from the surface instead of the center', 'Forgetting that force shrinks with r^2', 'Thinking gravity is zero in orbit'],
    example: {
      prompt: 'If the distance between two masses doubles, how does the gravitational force change?',
      steps: ['Use the inverse-square law: F is proportional to 1/r^2.', 'Doubling r makes the denominator 2^2 = 4 times larger.', 'So the force drops to one fourth of the original.'],
      answer: 'The force becomes 1/4 as large.'
    },
    checkpoint: {
      question: 'When orbital radius increases, orbital speed:',
      options: ['Increases', 'Decreases', 'Stays the same', 'Becomes zero'],
      answerIndex: 1,
      explanation: 'v_orbit = sqrt(GM / r), so larger radius means smaller orbital speed.'
    }
  },
  {
    id: 'shm',
    title: 'Oscillations (SHM)',
    summary: 'Simple harmonic motion has restoring force proportional to displacement and produces sinusoidal motion.',
    formulas: ['F = -kx', 'ω = √(k/m)', 'T = 2π√(m/k)', 'x(t) = A cos(ωt + φ)'],
    mistakes: ['Forgetting SHM requires linear restoring force', 'Mixing angular frequency with frequency', 'Unit errors in spring constant'],
    example: {
      prompt: 'For m = 0.40 kg and k = 64 N/m, find period.',
      steps: ['Use T = 2π√(m/k).', 'm/k = 0.40/64 = 0.00625.', 'T = 2π√0.00625 = 0.497 s.'],
      answer: 'Period ≈ 0.50 s.'
    },
    checkpoint: {
      question: 'At maximum displacement in SHM, speed is:',
      options: ['Maximum', 'Minimum (zero)', 'Equal to average speed', 'Undefined'],
      answerIndex: 1,
      explanation: 'At turning points, kinetic energy is zero and speed is zero.'
    }
  },
  {
    id: 'waves',
    title: 'Waves & Sound',
    summary: 'Wave speed, frequency, and wavelength are connected by v = fλ. Frequency comes from the source, while speed depends on the medium.',
    formulas: ['v = fλ', 'f = 1/T', 'T = 1/f'],
    mistakes: ['Thinking frequency changes because the wave enters a new medium', 'Mixing up period and frequency', 'Forgetting that wavelength changes when speed changes'],
    example: {
      prompt: 'A sound wave travels at 340 m/s with frequency 170 Hz. Find the wavelength.',
      steps: ['Use v = fλ.', 'Solve for wavelength: λ = v / f.', 'λ = 340 / 170 = 2.0 m.'],
      answer: 'Wavelength = 2.0 m.'
    },
    checkpoint: {
      question: 'If frequency doubles while wave speed stays the same, wavelength:',
      options: ['Doubles', 'Halves', 'Stays the same', 'Becomes zero'],
      answerIndex: 1,
      explanation: 'Because v = fλ stays constant, wavelength must decrease when frequency increases.'
    }
  }
];

export const formulaSheet: FormulaItem[] = [
  { topic: 'Kinematics', name: 'Constant acceleration velocity', expression: 'v = v0 + at', note: 'Use with constant a.' },
  { topic: 'Kinematics', name: 'Position update', expression: 'x = x0 + v0t + (1/2)at^2', note: 'Great when time is known.' },
  { topic: 'Kinematics', name: 'No-time relation', expression: 'v^2 = v0^2 + 2aΔx', note: 'Eliminate t.' },
  { topic: 'Forces', name: 'Newton 2nd Law', expression: 'ΣF = ma', note: 'Apply by axis.' },
  { topic: 'Forces', name: 'Kinetic friction', expression: 'Fk = μkN', note: 'Opposes relative motion.' },
  { topic: 'Energy', name: 'Kinetic energy', expression: 'K = (1/2)mv^2', note: 'Scalar quantity.' },
  { topic: 'Energy', name: 'Gravitational PE', expression: 'Ug = mgh', note: 'Near Earth surface.' },
  { topic: 'Energy', name: 'Work', expression: 'W = Fd cosθ', note: 'Component along displacement matters.' },
  { topic: 'Momentum', name: 'Linear momentum', expression: 'p = mv', note: 'Vector quantity.' },
  { topic: 'Momentum', name: 'Impulse-momentum', expression: 'J = Δp = FΔt', note: 'Area under F-t curve.' },
  { topic: 'Rotation', name: 'Torque', expression: 'τ = rF sinφ', note: 'Use lever arm.' },
  { topic: 'Rotation', name: 'Rotational Newton 2nd Law', expression: 'Στ = Iα', note: 'Angular analog of ΣF = ma.' },
  { topic: 'SHM', name: 'Angular frequency', expression: 'ω = √(k/m)', note: 'Spring-mass system.' },
  { topic: 'SHM', name: 'Period', expression: 'T = 2π√(m/k)', note: 'Seconds per cycle.' },
  { topic: 'Vectors & Components', name: 'Vector components', expression: 'Ax = A cos(theta), Ay = A sin(theta)', note: 'Break vectors into perpendicular pieces.' },
  { topic: 'Vectors & Components', name: 'Magnitude from components', expression: '|A| = sqrt(Ax^2 + Ay^2)', note: 'Use the Pythagorean theorem.' },
  { topic: 'Friction, Tension, and Inclined Planes', name: 'Slope components', expression: 'Along slope: mg sin(theta), perpendicular: mg cos(theta)', note: 'Resolve weight into axes aligned with the incline.' },
  { topic: 'Friction, Tension, and Inclined Planes', name: 'Friction', expression: 'Fk = μkN, Fs ≤ μsN', note: 'Friction points opposite relative motion or impending motion.' },
  { topic: 'Circular Motion', name: 'Centripetal acceleration', expression: 'ac = v^2 / r', note: 'Points inward toward the center.' },
  { topic: 'Circular Motion', name: 'Centripetal force', expression: 'Fc = mv^2 / r', note: 'Real force supplying inward acceleration.' },
  { topic: 'Gravitation & Orbits', name: 'Universal gravitation', expression: 'F = Gm1m2 / r^2', note: 'Inverse-square law.' },
  { topic: 'Gravitation & Orbits', name: 'Orbital speed', expression: 'v = sqrt(GM / r)', note: 'Circular orbit around mass M.' },
  { topic: 'Waves & Sound', name: 'Wave equation', expression: 'v = fλ', note: 'Wave speed equals frequency times wavelength.' },
  { topic: 'Waves & Sound', name: 'Frequency-period relation', expression: 'f = 1/T', note: 'They are reciprocals.' }
];
