const movies = [
  "Sweet Sixteen",
  "Fatal Games",
  "Windows",
  "Hitcher in the Dark",
  "Humongous (DVD)",
  "To all a Goodnight (DVD)",
  "Screamplay (DVD)",
  "Boogeyman 2 (DVD)",
  "Ghastly Ones",
  "Body Beneath",
  "Torture Dungeon",
  "Guru Mad Monk",
  "Thinner",
  "Apt Pupil",
  "Golden Years",
  "Desperation",
  "Interview with Vampire",
  "The Vampire (1957)",
  "Velvet Vampire",
  "El Vampiro",
  "House on Skull Mountain",
  "Invisible Invaders",
  "What's Matter Helen",
  "Mephisto Waltz",
  "Dolly Dearest",
  "Passion Darkly Noon",
  "Kolobos",
  "Mary Shelley's Frankenstein",
  "Lady Morgan's Vengeance",
  "Blancheville Monster",
  "The Third Eye",
  "The Witch",
];

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const makeList = () => {
  let indexes = [];

  for (let i = 0; i < 32; i += 4) {
    indexes.push([]);
    for (let j = i; j < i + 4; j++) {
      indexes[i / 4].push(movies[j]);
    }
    shuffle(indexes[i / 4]);
  }

  let shuffled = [];

  for (let i = 0; i < 4; i++) {
    shuffled[i] = [];
    for (let j = 0; j < 8; j++) {
      shuffled[i].push(indexes[j][i]);
    }
    shuffle(shuffled[i]);
  }

  console.log(shuffled);
};

makeList();
