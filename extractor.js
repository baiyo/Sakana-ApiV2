const axios = require('axios');

const consumetapi = 'https://consumet-api-cw2f.onrender.com/anime/gogoanime/watch/';

let scrapeAnimeVideoFile = async ({ id }) => {
    try {
      console.log('hey');
      const url = `${consumetapi}${id}`;
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