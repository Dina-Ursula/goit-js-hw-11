import axios from 'axios';

export async function getImages(query, page = 1) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '32923977-2b8c4baca426f7e2e03c5661d',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page,
      },
    });

    const images = response.data.hits.map(el => {
      return {
        webformatURL: el.webformatURL,
        largeImageURL: el.largeImageURL,
        tags: el.tags,
        likes: el.likes,
        views: el.views,
        comments: el.comments,
        downloads: el.downloads,
      };
    });
    console.log(response.data);

    return { totalHits: response.data.totalHits, hits: images };
  } catch (error) {
    console.error(error);
  }
}
