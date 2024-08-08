const axios = require('axios');

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
    // const url = `${consumetapirecent}`
    const { data } = await axios.get(consumetapirecent, { params: { page: 1, type: 1 } });
    return data;

  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

module.exports = { 
  scrapeAnimeVideoFile,
  scrapeRecentPage
} 