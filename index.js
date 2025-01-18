const puppeteer = require('puppeteer');

const COMMUNITY_URL = 'https://x.com/i/communities/1848145497737015763';


const USERNAME = '@CompteVps95368';
const PASSWORD = 'Azerty123456*';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Connexion à Twitter/X...');
    await page.goto('https://x.com/login', { waitUntil: 'networkidle2' });

    await page.waitForSelector('input[name="text"]', { visible: true });
    await page.type('input[name="text"]', USERNAME);
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button[role="button"]'));
      const nextButton = buttons.find(button => button.innerText.includes('Next'));
      if (nextButton) nextButton.click();
    });

    await page.waitForSelector('input[name="password"]', { visible: true });
    await page.type('input[name="password"]', PASSWORD);
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button[role="button"]'));
      const loginButton = buttons.find(button => button.innerText.includes('Log in'));
      if (loginButton) loginButton.click();
    });

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    console.log('Navigation vers la communauté...');
    await page.goto(COMMUNITY_URL, { waitUntil: 'networkidle2' });

    console.log('Recherche de l’onglet "Latest"...');
    await page.waitForSelector('a[role="tab"]', { visible: true });

    const latestTab = await page.$('::-p-xpath(//a[@role="tab"]//span[contains(text(), "Latest")])');
    if (latestTab) {
      await latestTab.click();
      console.log('Onglet "Latest" cliqué avec succès.');
    } else {
      console.error('Impossible de trouver l’onglet "Latest".');
    }

    let lastTweetTimestamp = null;
    while (true) {
      console.log('Recherche des tweets récents...');
      await page.waitForSelector('article', { visible: true });

      const tweets = await page.$$('article');
      const tweetData = [];

      
      for (const tweet of tweets) {
        const isPinned = await tweet.evaluate(el =>
          el.innerText.includes('Pinned by Community mods')
        );
        if (isPinned) continue;

        const timestamp = await tweet.evaluate(el =>
          el.querySelector('time') ? el.querySelector('time').getAttribute('datetime') : null
        );

        tweetData.push({
          tweet,
          timestamp
        });
      }

      tweetData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      
      for (const { tweet, timestamp } of tweetData) {
        if (timestamp && timestamp !== lastTweetTimestamp) {
          const likeButton = await tweet.$('button[data-testid="like"]');
          if (likeButton) {
            await likeButton.click();
            console.log('Tweet récent liké:', timestamp);
            lastTweetTimestamp = timestamp;
            break;  
          }
        }
      }

      console.log('Attente avant la prochaine vérification...');
      await new Promise(resolve => setTimeout(resolve, 10000)); 
      await page.reload({ waitUntil: 'networkidle2' });
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await browser.close();
  }
})();
