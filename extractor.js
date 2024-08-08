const axios = require('axios');
const cheerio = require('cheerio');

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

module.exports = { 
  scrapeAnimeVideoFile,
  scrapeRecentPage
} 