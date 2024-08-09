const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const chromium = require('chromium');


const BASE_URL = 'https://gogoanime3.co';
const consumetapivid = 'https://consumet-api-cw2f.onrender.com/anime/gogoanime/watch/';
const consumetapirecent = 'https://consumet-api-cw2f.onrender.com/anime/gogoanime/recent-episodes';

let scrapeAnimeVideoFile = async ({ id }) => {
    try {
      console.log('hey');
      const url = `${consumetapivid}${id}`;
      // console.log(url);
      // i have no fucking clue of what i did here but it fucking works
      const data = await axios.get(url, { params: { server: "gogocdn" } });
  
  
      // console.log(data);
  
      let GetBest = data['data']['sources'].length
  
      // console.log(data['data']['sources']);
      // console.log(data['data']['sources'][GetBest - 2]['url']);
      // Gets the default source i think
      return {video: data['data']['sources'][GetBest - 2]['url']};
  
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  };

let scrapeRecentPage = async ({}) => {
  try {
    const list = []
    // const url = `${consumetapirecent}`
    const mainPage = await axios.get(`${BASE_URL}`);
  const $ = cheerio.load(mainPage.data);

  $('div.last_episodes.loaddub > ul > li').each((i, el) => {
    list.push({
      animeId: $(el).find('p.name > a').attr('href').split('/')[1].split('-episode-')[0],
      episodeId: $(el).find('p.name > a').attr('href').split('/')[1],
      name: $(el).find('p.name > a').attr('title'),
      episodeNum: $(el).find('p.episode').text().replace('Episode ', '').trim(),
      subOrDub: $(el).find('div > a > div').attr('class').replace('type ic-', ''),
      imgUrl: $(el).find('div > a > img').attr('src')
    });
  });

  console.log(list)
  return list

  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

let scrapeAnimeDetails = async ({ id }) => {
  try {
    let genres = [];
    let epList = [];
    const chromiumExecutablePath = chromium.path;


    // const animePageTest = await axios.get(`${BASE_URL}/category/${id}`);
    // const animePageTest = await axios.get(`https://ww8.gogoanimes.org/category/${id}`);

    // const $ = cheerio.load(animePageTest.data);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromiumExecutablePath
    });
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/category/${id}`, { waitUntil: 'networkidle2' });


    const content = await page.content();
    const $ = cheerio.load(content);
    await browser.close();


    const animeTitle = $('div.anime_info_body_bg > h1').text();
    const animeImage = $('div.anime_info_body_bg > img').attr('src');
    const type = $('div.anime_info_body_bg > p:nth-child(4) > a').text();
    const desc = $('div.anime_info_body_bg > p:nth-child(6)')
      .text()
      .replace('Plot Summary: ', '');
    const releasedDate = $('div.anime_info_body_bg > p:nth-child(8)')
      .text()
      .replace('Released: ', '');
    const status = $('div.anime_info_body_bg > p:nth-child(9) > a').text();
    const otherName = $('div.anime_info_body_bg > p:nth-child(10)')
      .text()
      .replace('Other name: ', '')
      .replace(/;/g, ',');

    $('div.anime_info_body_bg > p:nth-child(7) > a').each((i, elem) => {
      genres.push($(elem).attr('title').trim());
    });

    const ep_start = $('#episode_page > li').first().find('a').attr('ep_start');
    const ep_end = $('#episode_page > li').last().find('a').attr('ep_end');
    const movie_id = $('#movie_id').attr('value');
    const alias = $('#alias_anime').attr('value');
    const episode_info_html = $('div.anime_info_episodes_next').html();
    const episode_page = $('ul#episode_page').html();
    // const loadEp = $('#load_ep');
    // const episodeRelated = loadEp.find('#episode_related');

    // console.log(episodeRelated.length);
    // console.log(episodeRelated.html());
    // console.log();
    // console.log(episode_page);

    // console.log(movie_id);
    // console.log("--------------");
    // console.log(ep_start);
    // console.log("--------------");
    // console.log(ep_end);
    // console.log("--------------");
    // console.log(alias);
    // console.log("------END--------");

    // console.log($$.children());
    
    // console.log($('ul#episode_related'));

    // console.log($)

    const episodeRelated = $('ul#episode_related > li');

    // console.log(episodeRelated.length);

    episodeRelated.each((i, el) => {
      epList.push({
        episodeId: $(el).find('a').attr('href').split('/')[1],
        episodeNum: $(el).find(`div.name`).text().replace('EP ', ''),
      });
    });

    console.log(epList.reverse());
    

    return {
      name: animeTitle.toString(),
      type: type.toString(),
      released: releasedDate.toString(),
      status: status.toString(),
      genres: genres,
      othername: otherName,
      synopsis: desc.toString(),
      imageUrl: animeImage.toString(),
      totalEpisodes: ep_end,
      episode_id: epList.reverse(),
      episode_info_html: episode_info_html.trim(),
      episode_page: episode_page.toString().trim(),
    };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};


module.exports = { 
  scrapeAnimeVideoFile,
  scrapeRecentPage,
  scrapeAnimeDetails,
} 