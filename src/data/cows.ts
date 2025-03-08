export interface Cow {
  id: number;
  name: string;
  gender: 'Male' | 'Female';
  isAged: boolean;
  isSick: boolean;
  image: string;
}

export const cows: Cow[] = [
  {
    id: 1,
    name: 'Gauri',
    gender: 'Female',
    isAged: false,
    isSick: false,
    image: 'https://images.unsplash.com/photo-1485134532658-d720895a3b5e',
  },
  {
    id: 2,
    name: 'Kamdhenu',
    gender: 'Female',
    isAged: false,
    isSick: false,
    image: 'https://images.unsplash.com/photo-1485134532658-d720895a3b5e',
  },
  {
    id: 3,
    name: 'Nandi',
    gender: 'Male',
    isAged: true,
    isSick: false,
    image: 'https://images.unsplash.com/photo-1485134532658-d720895a3b5e',
  },
  {
    id: 4,
    name: 'Surabhi',
    gender: 'Female',
    isAged: false,
    isSick: true,
    image: 'https://images.unsplash.com/photo-1485134532658-d720895a3b5e',
  },
  {
    id: 5,
    name: 'Bhumi',
    gender: 'Female',
    isAged: true,
    isSick: false,
    image: 'https://images.unsplash.com/photo-1485134532658-d720895a3b5e',
  },
  {
    id: 6,
    name: 'Shiva',
    gender: 'Male',
    isAged: true,
    isSick: true,
    image: 'https://images.unsplash.com/photo-1485134532658-d720895a3b5e',
  },
  {
    id: 7,
    name: 'Krishna',
    gender: 'Male',
    isAged: false,
    isSick: false,
    image: 'https://images.unsplash.com/photo-1485134532658-d720895a3b5e',
  },
  {
    id: 8,
    name: 'Radha',
    gender: 'Female',
    isAged: false,
    isSick: false,
    image: 'https://images.unsplash.com/photo-1485134532658-d720895a3b5e',
  },
  {
    id: 9,
    name: 'Brahmi',
    gender: 'Female',
    isAged: true,
    isSick: true,
    image: 'https://images.unsplash.com/photo-1485134532658-d720895a3b5e',
  },
  {
    id: 10,
    name: 'Shakti',
    gender: 'Female',
    isAged: true,
    isSick: false,
    image: 'https://images.unsplash.com/photo-1485134532658-d720895a3b5e',
  },
];
