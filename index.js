import puppeteer from 'puppeteer';

const TWEET_URL = 'https://x.com/Besty_boy23/status/1868719662617563262'; 
const USERNAME = 'amun1066149'; 
const PASSWORD = 'bajjus-necged-sEdke3'; 

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Connexion à Twitter/X...');
    await page.goto('https://x.com/login', { waitUntil: 'networkidle2' });

    // Remplir le nom d'utilisateur
    await page.waitForSelector('input[name="text"]', { visible: true });
    await page.type('input[name="text"]', USERNAME);

    // Cliquer sur le bouton "Next"
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button[role="button"]'));
      const nextButton = buttons.find(button => button.innerText.includes('Next'));
      if (nextButton) nextButton.click();
    });

    // Attendre que le champ de mot de passe soit visible et le remplir
    await page.waitForSelector('input[name="password"]', { visible: true });
    await page.type('input[name="password"]', PASSWORD);

    // Attendre que le bouton "Login" soit visible et cliquer dessus
    await page.waitForSelector('button[data-testid="LoginForm_Login_Button"]', { visible: true });
    await page.click('button[data-testid="LoginForm_Login_Button"]');

    // Attendre la navigation vers la page suivante
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    console.log('Connexion réussie.');

    // 2. Aller au tweet spécifique
    console.log('Accès au tweet...');
    await page.goto(TWEET_URL, { waitUntil: 'networkidle2' });

    // 3. Attendre que le bouton "Like" soit visible et cliquer dessus
    console.log('Attente du bouton "Like"...');
    await page.waitForSelector('button[data-testid="like"]', { visible: true });

    // Vérifier si le tweet est déjà liké
    const isLiked = await page.$eval('button[data-testid="like"]', (likeButton) => {
      return likeButton.getAttribute('aria-label').includes('Like') === false; // Si l'aria-label indique "Unlike", c'est déjà liké
    });

    // 4. Si le tweet n'est pas liké, on le like
    if (!isLiked) {
      console.log('Le tweet n\'est pas encore liké. Liking...');
      await page.click('button[data-testid="like"]');
      console.log('Tweet liké avec succès.');
    } else {
      console.log('Le tweet est déjà liké.');
    }

  } catch (error) {
    console.error('Une erreur est survenue :', error);
    await page.screenshot({ path: 'error.png' });
  } finally {
    await browser.close();
  }
})();
