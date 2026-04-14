import type { Flashcard } from '../types';

export const flashcards: Flashcard[] = [
  { id: 'fc0', topic: 'Vectors & Components', front: 'How do you find x and y parts of a vector?', back: 'Use x = A cos(theta) and y = A sin(theta).' },
  { id: 'fc00', topic: 'Vectors & Components', front: 'What is the magnitude from components?', back: 'Use sqrt(Ax^2 + Ay^2).' },
  { id: 'fc1', topic: 'Kinematics', front: 'What does slope of velocity-time graph represent?', back: 'Acceleration.' },
  { id: 'fc2', topic: 'Kinematics', front: 'Key no-time kinematics equation?', back: 'v^2 = v0^2 + 2aΔx.' },
  { id: 'fc3', topic: 'Forces', front: 'Newton’s 2nd law?', back: 'ΣF = ma.' },
  { id: 'fc4', topic: 'Forces', front: 'Difference between static and kinetic friction?', back: 'Static prevents relative motion up to μsN; kinetic acts during sliding at μkN.' },
  { id: 'fc5a', topic: 'Friction, Tension, and Inclined Planes', front: 'Weight component down an incline?', back: 'mg sin(theta).' },
  { id: 'fc5b', topic: 'Friction, Tension, and Inclined Planes', front: 'Weight component perpendicular to incline?', back: 'mg cos(theta).' },
  { id: 'fc5', topic: 'Energy', front: 'Work by a constant force formula?', back: 'W = Fd cosθ.' },
  { id: 'fc6', topic: 'Energy', front: 'Conservative force examples?', back: 'Gravity and ideal spring force.' },
  { id: 'fc6a', topic: 'Circular Motion', front: 'Centripetal acceleration formula?', back: 'ac = v^2 / r.' },
  { id: 'fc6b', topic: 'Circular Motion', front: 'What direction is centripetal acceleration?', back: 'Toward the center.' },
  { id: 'fc7', topic: 'Momentum', front: 'Impulse-momentum theorem?', back: 'J = Δp = FΔt.' },
  { id: 'fc8', topic: 'Momentum', front: 'What is always conserved in isolated collisions?', back: 'Total momentum.' },
  { id: 'fc9', topic: 'Rotation', front: 'Torque equation?', back: 'τ = rF sinφ.' },
  { id: 'fc10', topic: 'Rotation', front: 'Rotational analog of mass?', back: 'Moment of inertia I.' },
  { id: 'fc10a', topic: 'Gravitation & Orbits', front: 'Newton’s law of gravitation depends on what?', back: 'The product of masses and inverse square of distance.' },
  { id: 'fc10b', topic: 'Gravitation & Orbits', front: 'Orbital speed formula?', back: 'v = sqrt(GM / r).' },
  { id: 'fc11', topic: 'SHM', front: 'SHM period for mass-spring?', back: 'T = 2π√(m/k).' },
  { id: 'fc12', topic: 'SHM', front: 'Where is speed max in SHM?', back: 'At equilibrium (x = 0).' },
  { id: 'fc13', topic: 'Waves & Sound', front: 'Wave equation?', back: 'v = fλ.' },
  { id: 'fc14', topic: 'Waves & Sound', front: 'How are frequency and period related?', back: 'They are reciprocals: f = 1/T.' }
];
