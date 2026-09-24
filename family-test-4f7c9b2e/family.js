// Family connections are historical context, except where the episode itself names a relative.
const people = {
  louis: { group: 'Stan’s side: Lithuania to Manchester', name: 'Louis (Leiba) Freedman', relation: 'Stan’s great-grandfather on both parental lines', story: 'Born in Olkeniki; later lived in Manchester. His children included both Morris and Anna, Stan’s grandparents on different sides of the family.' },
  anna: { group: 'Stan’s side: Lithuania to Manchester', name: 'Anna (Khanka) Freedman', relation: 'Stan’s grandmother through his mother Lily', story: 'Born in Degsnės. Her branch connects the family to the Lithuanian villages discussed here and to relatives who stayed.' },
  morris: { group: 'Stan’s side: Lithuania to Manchester', name: 'Morris (Pinchas) Freedman', relation: 'Stan’s grandfather through his father Jack', story: 'Born in the Vilnius region; later part of the family’s Manchester story.' },
  kalmen: { group: 'Stan’s side: Lithuania to Manchester', name: 'Kalmen Cofnas and Shena Cofnas', relation: 'Stan’s great-uncle and his daughter, Stan’s first cousin once removed', story: 'Kalmen was born in Degsnės and remained in Eastern Europe. The tree records his death during the Holocaust and Shena’s around 1942. Their story connects the emigrating and remaining branches.' },
  max: { group: 'Sheila’s side: Britain', name: 'Max Gillman (Rafkind)', relation: 'Sheila’s grandfather through her father Gilly', story: 'Born in Polotsk; later lived in Liverpool. His wider Rafkin family included Chabad relatives and branches that migrated much farther.' },
  siblings: { group: 'Sheila’s side: Britain', name: 'Gilly and the Gillman siblings', relation: 'Sheila’s father, aunts and uncles', story: 'Max’s children included Samuel, Bertha, Hyman, Amy, Solomon, Sarah, Abraham (“Gilly”) and Joseph. Some were born before the move to Liverpool; Bertha later lived in Los Angeles.' },
  myer: { group: 'Sheila’s side: Britain', name: 'Myer and Selena Goldberg', relation: 'Sheila’s great-grandparents through Esther', story: 'The couple’s journey passed through London before Blackburn. Their son Philip carried the Goldberg line into the next generation.' },
  philip: { group: 'Sheila’s side: Britain', name: 'Philip Goldberg', relation: 'Sheila’s grandfather through her mother Esther', story: 'Part of the Goldberg branch that settled in Blackburn and later Liverpool. The Blackburn history featured in the playlist discusses this family line.' },
  esther: { group: 'Sheila’s side: Britain', name: 'Esther Goldberg', relation: 'Sheila’s mother', story: 'Born in Blackburn and later lived in Liverpool. Her life connects two important stops in the family journey.' },
  szejna: { group: 'Wider family: routes across the world', name: 'Szejna Drejza Rafkin', relation: 'Sheila’s great-aunt, Max’s sister', story: 'Born in Polotsk. Her children and grandchildren connect this Rafkin branch to Chabad history, wartime loss and later migration.' },
  aaron: { group: 'Wider family: routes across the world', name: 'Rabbi Aaron Tumarkin', relation: 'Sheila’s first cousin once removed, Szejna’s son', story: 'A Chabad rabbi who died in Kharkiv before the Second World War. The later lives of his family spread across several countries; some did not survive the war.' },
  tumarkinChildren: { group: 'Wider family: routes across the world', name: 'Aaron Tumarkin’s children', relation: 'Sheila’s second cousins', story: 'The family included Chackiel, Chana Rivka, Sara, Chaya Ida and Meer. Some died during the Second World War; other branches reached New York and Israel. Their individual paths should not be confused with the events depicted in any one podcast.' },
  malka: { group: 'Wider family: routes across the world', name: 'Malka Tumarkin', relation: 'Sheila’s first cousin once removed, Szejna’s daughter', story: 'Born in the Dokshytsy area and later lived in Montevideo. Her path makes the Uruguayan chapter of the family story concrete.' },
  joseph: { group: 'Wider family: routes across the world', name: 'Joseph Gillman (Rafkind)', relation: 'Sheila’s great-uncle, Max’s brother', story: 'Born in Polotsk and recorded living in Bluffton, Indiana, in 1910. The Indiana material offers context for that less familiar destination.' },
  leybl: { group: 'Wider family: routes across the world', name: 'Louis (Leybl) Gillman and family', relation: 'Sheila’s great-uncle and his children', story: 'Louis was Max’s brother. His children Emil and Lucille were born in Amarillo, Texas. Their story helps explain why this route appears in the playlist.' },
  frank: { group: 'Wider family: routes across the world', name: 'Frank Cohen', relation: 'Sheila’s great-uncle through her grandmother Rachel', story: 'Born in Britain and later lived in Cape Town. He gives the South African route a named family connection.' }
};

// Each episode can illuminate several lives; links express relevance, not a claim that the person appears in the audio.
const connections = {
  1: { people: ['louis','anna','morris','max','myer'], text: 'These branches began in or near Jewish small towns. Kassow offers a broad frame for their communities, not an account of any one ancestor.' },
  2: { people: ['louis','anna','morris','max','myer','szejna'], text: 'This overview spans the places and movements that shaped both the Freedman and Gillman/Goldberg lines. It is a broad historical introduction.' },
  3: { people: ['louis','anna','morris','kalmen'], text: 'Stan’s Cofnas/Freedman branch came from the Vilnius region. Vilna’s history provides the regional setting.' },
  4: { people: ['anna','morris','kalmen'], text: 'The memories help place the family’s Vilnius-area origins in a wider world of schools, politics and Jewish neighbourhoods.' },
  5: { people: ['louis','anna','morris','kalmen'], text: 'The family’s Lithuanian religious and communal background makes this a useful guide to the world of learning around them.' },
  6: { people: ['louis','morris','anna'], text: 'The Vilna Gaon’s influence belongs to the religious landscape of Stan’s Lithuanian branch. We do not know how individual relatives understood his legacy.' },
  7: { people: ['morris','anna'], text: 'The Vilna publishing story opens another side of the city and region where Stan’s family lived; no family link to the Romm press is claimed.' },
  8: { people: ['louis','anna','morris','max'], text: 'Interviews about small-town life offer context for the Lithuanian and Belarusian communities these relatives knew.' },
  9: { people: ['louis','anna','morris'], text: 'The wider family included tavern landlords. The research concerns the Kingdom of Poland, so it offers comparison rather than a direct account of these relatives.' },
  10: { people: ['louis','anna','morris','max','aaron'], text: 'The family included shochets and Chabad relatives. Goldenshteyn’s autobiography brings those worlds to life, but it is his own story rather than theirs.' },
  11: { people: ['louis','myer','philip'], text: 'Marriage shaped the networks through which the Freedman and Goldberg families grew. The episode is general historical context.' },
  12: { people: ['louis','morris','max'], text: 'Yiddish popular reading belonged to the wider cultural world of these families; we do not know what any of them read.' },
  13: { people: ['louis','morris','max'], text: 'These relatives lived amid changing Jewish ideas. The episode does not establish their individual views.' },
  14: { people: ['morris','max','szejna'], text: 'This period of change spans the places and generation from which both sides of the family emigrated.' },
  15: { people: ['morris','max','szejna'], text: 'Debates about Jewish futures formed part of their wider Eastern European world; no personal political position is assumed.' },
  16: { people: ['max','szejna'], text: 'The Kishinev violence influenced Jewish discussion across the Russian Empire. No direct family involvement in the riot is recorded here.' },
  17: { people: ['max','szejna','aaron'], text: 'The Gillman/Rafkin line includes Chabad relatives, including Rabbi Aaron Tumarkin. This supplies the movement’s broader history.' },
  18: { people: ['max','szejna','aaron'], text: 'A wider history of Hasidism helps place the family’s Chabad branch without assigning particular beliefs to every relative.' },
  19: { people: ['max','szejna','aaron'], text: 'Chabad thought is relevant to the Tumarkin branch. The episode explores ideas, not these people’s individual testimony.' },
  20: { people: ['louis','morris','max','myer','siblings'], text: 'Several branches left Eastern Europe for Britain. Max’s older children were born before the family settled in Liverpool. The episode does not identify their ship.' },
  21: { people: ['myer','philip','esther'], text: 'The Goldberg line passed through London before moving north. The episode evokes that immigrant setting.' },
  22: { people: ['louis','morris','max','myer','siblings'], text: 'These branches settled beyond the East End, including Manchester, Blackburn and Liverpool.' },
  23: { people: ['louis','morris','anna','kalmen'], text: 'Manchester became home to the Freedman/Cofnas branch. The voices and streets supply local context.' },
  24: { people: ['myer','philip','esther'], text: 'The Blackburn research discusses the maternal Goldberg line; Esther was born in that town.' },
  25: { people: ['myer','philip','esther'], text: 'The Goldbergs lived in Blackburn. This local history describes the community around them.' },
  26: { people: ['max','siblings','philip','esther'], text: 'The Gillman and Goldberg branches came together in Liverpool. Several generations on both sides lived there.' },
  27: { people: ['anna','kalmen','tumarkinChildren'], text: 'Relatives remained in Eastern Europe as Jewish towns were destroyed. The episode is not testimony about these named people.' },
  28: { people: ['anna','kalmen','tumarkinChildren'], text: 'This history helps explain the violence that reached communities connected to both sides of the family; it does not document each relative’s fate.' },
  29: { people: ['anna','kalmen','tumarkinChildren'], text: 'Stories of resistance and protection illuminate the wartime choices faced across the region. No participation by these relatives is asserted.' },
  30: { people: ['anna','morris','kalmen'], text: 'Some relatives had emigrated from the Vilnius region; others remained. The invasion is part of that wider family history.' },
  31: { people: ['anna','kalmen'], text: 'The destruction of Vilna provides context for relatives who remained in the region, without identifying them as people in this testimony.' },
  32: { people: ['anna','kalmen'], text: 'The aftermath belongs to the region from which Stan’s family came and where relatives remained.' },
  33: { people: ['anna','louis'], text: 'Relatives from Degsnės and Olkeniki were taken to Eišiškės and murdered there. The family did not live in Eišiškės.' },
  34: { people: ['tumarkinChildren'], text: 'The wider Tumarkin branch also suffered wartime losses in Poland and elsewhere. This Łódź account is historical context, not their testimony.' },
  35: { people: ['tumarkinChildren'], text: 'Photographs from Łódź help understand a wider world of wartime loss; no pictured person is identified as a family member.' },
  36: { people: ['louis','max','siblings','szejna','joseph','malka','frank'], text: 'These branches spread across countries. Family reconnection is a theme of their descendants’ story, not an appearance by the ancestors in the episode.' },
  37: { people: ['louis','max','malka','joseph'], text: 'A journey back to a lost town reflects the questions raised by the family’s own places and scattered branches.' },
  38: { people: ['szejna','aaron','tumarkinChildren','malka'], text: 'The Tumarkin family began in the lands now covered by Belarus and Poland and dispersed widely. This museum story provides regional context.' },
  39: { people: ['frank','max'], text: 'Frank Cohen reached Cape Town. The episode’s research route may help follow his South African branch; it is not a recording about him.' },
  40: { people: [], text: 'The wider family has Australian and Tasmanian branches. This resource helps explore their history without assigning the material to a particular ancestor.' },
  41: { people: ['joseph','leybl','szejna'], text: 'Several Rafkin/Gillman relatives reached America. Ellis Island is migration context, not a documented entry point for each of them.' },
  42: { people: ['joseph','leybl','szejna'], text: 'The Lower East Side represents one immigrant setting for Eastern European Jewish families; these relatives’ addresses are not established by the episode.' },
  43: { people: ['aaron','szejna','tumarkinChildren'], text: 'The wider Rafkin/Chabad line has American descendants. Crown Heights is a later Chabad setting, not a place attributed to these ancestors.' },
  44: { people: ['joseph','max'], text: 'Sheila’s great-uncle Joseph Gillman (Rafkind) is recorded in Bluffton, Indiana. This regional history gives that destination context.' },
  45: { people: ['leybl','joseph'], text: 'Louis Gillman’s children Emil and Lucille were born in Amarillo. The episode provides a wider Texas setting, not their personal account.' },
  46: { people: ['malka','szejna'], text: 'Malka Tumarkin, Szejna’s daughter, later lived in Montevideo. This episode helps frame that part of the family journey.' },
};

const episodes = [...document.querySelectorAll('main > article')];
const episodeTitles = new Map();
const related = new Map(Object.keys(people).map(id => [id, []]));
for (const article of episodes) {
  const number = Number(article.querySelector('.number')?.textContent);
  article.id = `episode-${number}`;
  episodeTitles.set(number, article.querySelector('h3').childNodes[0].textContent.trim());
  const entry = connections[number];
  if (!entry) continue;
  const box = document.createElement('div');
  box.className = 'family-connection';
  const heading = document.createElement('strong');
  heading.textContent = 'Our family connection';
  const description = document.createElement('p');
  description.textContent = entry.text;
  box.append(heading, description);
  if (entry.people.length) {
    const links = document.createElement('div');
    links.className = 'family-people';
    for (const id of entry.people) {
      if (!people[id]) continue;
      related.get(id).push(number);
      const link = document.createElement('a');
      link.href = `#person-${id}`;
      link.textContent = people[id].name;
      links.append(link);
    }
    box.append(links);
  }
  article.querySelector('.listen').after(box);
}

const cards = document.querySelector('#people-cards');
let groupName = '';
let grid;
for (const [id, person] of Object.entries(people)) {
  if (person.group !== groupName) {
    groupName = person.group;
    const heading = document.createElement('h3');
    heading.className = 'people-group';
    heading.textContent = groupName;
    grid = document.createElement('div');
    grid.className = 'people-grid';
    cards.append(heading, grid);
  }
  const card = document.createElement('div');
  card.className = 'person-card';
  card.id = `person-${id}`;
  const title = document.createElement('h4');
  title.textContent = person.name;
  const relation = document.createElement('p');
  relation.className = 'relation';
  relation.textContent = person.relation;
  const story = document.createElement('p');
  story.textContent = person.story;
  const more = document.createElement('details');
  more.className = 'related';
  const summary = document.createElement('summary');
  const nums = related.get(id);
  summary.textContent = `Related podcasts (${nums.length})`;
  const list = document.createElement('ol');
  for (const number of nums) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#episode-${number}`;
    link.textContent = `${number}. ${episodeTitles.get(number)}`;
    li.append(link);
    list.append(li);
  }
  more.append(summary, list);
  card.append(title, relation, story, more);
  grid.append(card);
}

// The tracker moves listened episodes into an archive. Open it before following a related-episode link.
cards.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#episode-"]');
  if (!link) return;
  const article = document.querySelector(link.getAttribute('href'));
  if (article?.closest('#listened-items')) document.querySelector('#listened-archive').open = true;
});

document.querySelectorAll('.topic-nav button').forEach(button => {
  button.addEventListener('click', () => {
    const first = Number(button.dataset.first);
    const last = Number(button.dataset.last);
    const inTopic = episodes.filter(article => {
      const number = Number(article.querySelector('.number')?.textContent);
      return number >= first && number <= last;
    });
    const target = inTopic.find(article => !article.closest('#listened-items')) || inTopic[0];
    if (target?.closest('#listened-items')) document.querySelector('#listened-archive').open = true;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const journeys = document.querySelector('#family-journeys');
const narrow = window.matchMedia('(max-width: 520px)');
function syncJourneyLayout(event) { journeys.open = !event.matches; }
syncJourneyLayout(narrow);
narrow.addEventListener('change', syncJourneyLayout);

const backTop = document.querySelector('#back-to-top');
function updateBackTop() { backTop.classList.toggle('is-visible', window.scrollY > 650); }
window.addEventListener('scroll', updateBackTop, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
updateBackTop();
