const axios = require('axios');
const cheerio = require('cheerio');

const ajax = 'https://ajax.gogocdn.net/';
const list_episodes_url = 'https://ajax.gogocdn.net/ajax/load-list-episode'
const BASE_URL = 'https://gogoanime3.co';
const consumetapivid = ''; // Put consumet api here
const search_path = '/search.html';

let scrapeAnimeVideoFile = async ({ id }) => {
    try {
      const url = `${consumetapivid}${id}`;
      const data = await axios.get(url, { params: { server: "gogocdn" } });
  
  
  
      let GetBest = data['data']['sources'].length
      return {video: data['data']['sources'][GetBest - 2]['url']};
  
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  };

let scrapeRecentPage = async ({}) => {
  try {
    const list = []
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


    const animePageTest = await axios.get(`${BASE_URL}/category/${id}`);

    const $ = cheerio.load(animePageTest.data);


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

    const html = await axios.get(
      `${list_episodes_url}?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`
    );
    const $$ = cheerio.load(html.data);


    const episodeRelated = $$('ul#episode_related > li');


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

let scrapeWatchAnime = async ({ id }) => {
  try {
    let genres = [];
    let epList = [];

    console.log(id);
    const WatchAnime = await axios.get(`${BASE_URL}/${id}`);
    const $ = cheerio.load(WatchAnime.data);

    const anime_category = $('div.anime-info a').attr('href').replace('/category/', '')
    const episode_page = $('ul#episode_page').html();
    const movie_id = $('#movie_id').attr('value');
    const alias = $('#alias_anime').attr('value');
    const episode_link = $('div.play-video > iframe').attr('src');
    const gogoserver = $('li.vidcdn > a').attr('data-video');
    const streamsb = $('li.streamsb > a').attr('data-video');
    const xstreamcdn = $('li.xstreamcdn > a').attr('data-video');
    const anime_name_with_ep = $('div.title_name h2').text();
    const ep_num = $('div.anime_video_body > input.default_ep').attr('value');
    const download = $('li.dowloads a').attr('href');
    const nextEpText = $('div.anime_video_body_episodes_r a').text();
    const nextEpLink = $('div.anime_video_body_episodes_r > a').attr('href');
    const prevEpText = $('div.anime_video_body_episodes_l a').text();
    const prevEpLink = $('div.anime_video_body_episodes_l > a').attr('href');

    console.log(episode_link);


    console.log("returning");
    return {
      video: episode_link,
      gogoserver: gogoserver,
      streamsb: streamsb,
      xstreamcdn: xstreamcdn,
      animeNameWithEP: anime_name_with_ep.toString(),
      ep_num: ep_num,
      ep_download: download,
      anime_info: anime_category,
      movie_id: movie_id,
      alias: alias,
      episode_page: episode_page,
      nextEpText: nextEpText,
      nextEpLink: nextEpLink,
      prevEpLink: prevEpLink,
      prevEpText: prevEpText,
    };
    console.log("returned");
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

let scrapeSearchResults = async ({ list = [], keyw, page = 1  }) => {
  try {
    const searchPage = await axios.get(
      `${BASE_URL + search_path}?keyword=${keyw}&page=${page}`
    );
    const $ = cheerio.load(searchPage.data);

    $('div.last_episodes > ul > li').each((i, el) => {
      list.push({
        anime_id: $(el).find('p.name > a').attr('href').split('/')[2],
        name: $(el).find('p.name > a').attr('title'),
        img_url: $(el).find('div > a > img').attr('src'),
        status: $(el).find('p.released').text().trim(),
      });
    });

    return list;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

module.exports = { 
  scrapeAnimeVideoFile,
  scrapeRecentPage,
  scrapeAnimeDetails,
  scrapeWatchAnime,
  scrapeSearchResults
} 