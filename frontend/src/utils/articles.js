import {Client} from 'utils/api-client'
import {useQuery, useQueryClient} from 'react-query'
import gg from 'assets/gg.jpg'
const loadingArticle = {
  title: 'Loading...',
  createdTime: 'loading...',
  coverImageUrl: gg,
  category: 'Loading Publishing',
  message: 'Loading...',
  loadingArticle: true,
}
// const loadingArticles = Array.from({length: 10}, (v, index) => ({
//   id: `loading-article-${index}`,
//   ...loadingArticle,
// }))
function useArticleSearch(query) {
  const queryClient = useQueryClient()
  const result = useQuery(
    ['articleSearch', {query}],
    () => {
      const result = Client(
        `articlebytitle?article=${encodeURIComponent(query)}`,
      )
      return result
      // setQueried(false)
      // return Client(`articlebytitle?article=${encodeURIComponent(query)}`)
    },

    {
      onSuccess(articles) {
        if (articles) {
          for (const article of articles) {
            queryClient.setQueryData(
              ['article', {articleID: article.articleID}],
              article,
            )
          }
        }
      },
    },
  )
  return {...result, articles: result.data ?? []}
}

function useArticle(articleID) {
  const result = useQuery(['article', {articleID: articleID}], () =>
    Client(`articles/${articleID}`),
  )
  return result.data ?? loadingArticle
  // return {...result, article: result.data ?? loadingArticle}
}
export {useArticleSearch, useArticle}
