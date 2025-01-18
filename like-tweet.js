import puppeteer from 'puppeteer';

const TWEET_URL = ''; 
const USERNAME = ''; 
const PASSWORD = ''; 

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

    
    await page.waitForSelector('button[data-testid="LoginForm_Login_Button"]', { visible: true });
    await page.click('button[data-testid="LoginForm_Login_Button"]');

   
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    console.log('Connexion réussie.');

  
    console.log('Accès au tweet...');
    await page.goto(TWEET_URL, { waitUntil: 'networkidle2' });

   
    console.log('Attente du bouton "Like"...');
    await page.waitForSelector('button[data-testid="like"]', { visible: true });


    const isLiked = await page.$eval('button[data-testid="like"]', (likeButton) => {
      return likeButton.getAttribute('aria-label').includes('Like') === false; 
    });

    
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
