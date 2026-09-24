// A small, provisional editorial layer based on Jon's working GEDCOM.
const familyNotes = {
  1: ['Louis (Leiba) Freedman', 'person-louis', 'Stan’s great-grandfather Louis was born in Olkeniki. This episode offers context for small-town life, not an account of his own experiences.'],
  2: ['Morris Freedman', 'person-morris', 'Stan’s grandfather Morris came from the Vilnius region. The city’s history helps place his family’s surroundings in context.'],
  3: ['Anna Freedman', 'person-anna', 'Stan’s grandmother Anna was born in Degsnės. These memories help us imagine the region before the war, though the speakers do not describe her village.'],
  4: ['Louis (Leiba) Freedman', 'person-louis', 'Louis came from Olkeniki, where religious study and communal roles were part of local Jewish life. The episode describes that wider setting.'],
  6: ['Louis (Leiba) Freedman', 'person-louis', 'Louis’s Olkeniki roots make this research into small-town Jewish life useful background for his story.'],
  7: ['Morris Freedman', 'person-morris', 'Stan’s Lithuanian branch included tavern landlords. This research concerns the Kingdom of Poland, so it offers comparison rather than evidence about a named ancestor.'],
  10: ['Louis (Leiba) Freedman', 'person-louis', 'Louis lived through a century of changing Jewish ideas in Lithuania. We do not know which of those ideas he held.'],
  14: ['Max Gillman (Rafkind)', 'person-max', 'Sheila’s grandfather Max belongs to the Gillman/Rafkin line, which includes Chabad relatives. This episode gives the movement’s wider history.'],
  15: ['Max Gillman (Rafkind)', 'person-max', 'The Hasidic world is relevant to the Gillman/Rafkin branch. This history does not establish Max’s personal beliefs.'],
  16: ['Max Gillman (Rafkind)', 'person-max', 'Chabad thought helps explain a tradition present in Sheila’s wider Gillman/Rafkin family. We cannot assume Max shared every view described.'],
  17: ['Louis (Leiba) Freedman', 'person-louis', 'Louis was born in Olkeniki and later lived in Manchester. The episode explains a migration route, not necessarily his own journey.'],
  18: ['Philip Goldberg', 'person-philip', 'The Goldberg branch spent time in Whitechapel before moving north. This episode evokes the immigrant neighbourhood they passed through.'],
  20: ['Morris Freedman', 'person-morris', 'Morris’s branch settled in Manchester. This episode helps place their new surroundings in the city.'],
  21: ['Esther Goldberg', 'person-esther', 'Sheila’s mother Esther was born in Blackburn in 1910. The episode explores the community in which she began life.'],
  22: ['Philip Goldberg', 'person-philip', 'The Goldberg family lived in Blackburn before settling in Liverpool. This local history adds context to that part of their journey.'],
  23: ['Esther Goldberg', 'person-esther', 'Esther’s family settled in Liverpool. This history helps explain the Jewish community in which she grew up.'],
  24: ['Anna Freedman', 'person-anna', 'Anna had left Degsnės, but relatives remained in the region. This episode covers the destruction of Jewish small towns; it is not testimony about those relatives.'],
  27: ['Morris Freedman', 'person-morris', 'Morris had emigrated from the Vilnius region. Relatives remained nearby, so the invasion forms part of the wider family history.'],
  30: ['Anna Freedman', 'person-anna', 'Anna was born in Degsnės. Relatives from Degsnės and Olkeniki were taken to Eišiškės and murdered there; the family did not live in Eišiškės.'],
  33: ['Louis (Leiba) Freedman', 'person-louis', 'Louis’s descendants became part of a family scattered across several countries. This episode is about reconnecting families, not his individual story.']
};

const episodes = [...document.querySelectorAll('main > article')];
for (const article of episodes) {
  const number = Number(article.querySelector('.number')?.textContent);
  article.id = `episode-${number}`;
  const note = familyNotes[number];
  if (!note) continue;
  const box = document.createElement('div');
  box.className = 'family-connection';
  const heading = document.createElement('strong');
  heading.textContent = 'Our family connection';
  const description = document.createElement('p');
  description.textContent = note[2];
  const link = document.createElement('a');
  link.href = `#${note[1]}`;
  link.textContent = `Meet ${note[0]} →`;
  box.append(heading, description, link);
  article.querySelector('.listen').after(box);
}

document.querySelectorAll('.topic-nav button').forEach(button => {
  button.addEventListener('click', () => {
    const first = Number(button.dataset.first);
    const last = Number(button.dataset.last);
    const target = episodes.find(article => {
      const number = Number(article.querySelector('.number')?.textContent);
      return number >= first && number <= last && !article.closest('#listened-items');
    });
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const archive = document.querySelector('#listened-archive');
      archive.open = true;
      episodes.find(article => {
        const number = Number(article.querySelector('.number')?.textContent);
        return number >= first && number <= last;
      })?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// On narrow screens, the long family background starts folded away.
const journeys = document.querySelector('#family-journeys');
const narrow = window.matchMedia('(max-width: 520px)');
function syncJourneyLayout(event) {
  journeys.open = !event.matches;
}
syncJourneyLayout(narrow);
narrow.addEventListener('change', syncJourneyLayout);

document.querySelector('.people-section').addEventListener('click', event => {
  const link = event.target.closest('a[href^="#episode-"]');
  if (!link) return;
  const article = document.querySelector(link.getAttribute('href'));
  if (article?.closest('#listened-items')) {
    document.querySelector('#listened-archive').open = true;
  }
});
