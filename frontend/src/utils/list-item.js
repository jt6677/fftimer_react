import {useQuery, useMutation, useQueryClient} from 'react-query'
import {useFetch} from 'context/FetchContext'
import {Client} from 'utils/api-client'
function useListItems() {
  return useQuery('list-items', () => Client(`/articleactions`))
}
function useListItem(articleID) {
  const listItems = useListItems()
  return listItems.data?.find(li => li.articleID === articleID) ?? []
}

function useRemoveListItem(articleID, options) {
  const {authClient} = useFetch()
  const queryClient = useQueryClient()
  return useMutation(
    () => {
      return authClient(`deletearticleaction/${articleID}`, {
        method: 'DELETE',
      })
    },
    {
      onMutate: newItem => {
        const previouseItems = queryClient.getQueryData('list-items')
        queryClient.setQueryData('list-items', old => {
          return old.filter(item => {
            return item.articleID !== articleID
          })
        })
        return () => queryClient.setQueryData('list-items', previouseItems)
      },
      onError: (err, varialbe) => {
        recover(err)
      },
      onSettled: () => {
        queryClient.invalidateQueries('articles')
        queryClient.invalidateQueries('list-items')
      },
      ...options,
    },
  )
}

function useCreateListItem(articleID, options) {
  const queryClient = useQueryClient()
  const {authClient} = useFetch()
  return useMutation(
    () => {
      // const startedtime = Date.now()
      return authClient(`createarticleaction`, {
        method: 'POST',
        data: {articleID: articleID},
        // data: {articleID: articleID, starteddate: startedtime},
      })
    },
    {
      onMutate: () => {
        const previouseItems = queryClient.getQueryData('list-items')
        // const startedtime = Date.now()
        const newItem = {articleID: articleID}
        queryClient.setQueryData('list-items', old => {
          old.push(newItem)
          return old
        })

        return () => queryClient.setQueryData('list-items', previouseItems)
      },
      onError: (err, varialbe) => {
        recover(err)
      },
      onSettled: () => {
        queryClient.invalidateQueries('list-items')
        queryClient.invalidateQueries('userarticles')
        queryClient.invalidateQueries('articles')
      },
      ...options,
    },
  )
}
function useUpdateListItem(articleID, options) {
  const queryClient = useQueryClient()
  const {authClient} = useFetch()
  return useMutation(
    //if updates===1314, backend will read it as a signal to delete finisheddate field
    updates => {
      return authClient(`updatearticleaction`, {
        method: 'PUT',
        data: {articleID: articleID, ...updates},
      })
    },
    {
      onMutate: newItem => {
        const previouseItems = queryClient.getQueryData('list-items')
        queryClient.setQueryData('list-items', old => {
          return old.map(item => {
            return item.articleID === articleID ? {...item, ...newItem} : item
          })
        })
        
        return () => queryClient.setQueryData('list-items', previouseItems)
      },
      onError: (err, varialbe) => {
        recover(err)
      },
      onSettled: () => {
        queryClient.invalidateQueries('articles')
        queryClient.invalidateQueries('list-items')
      },
      ...options,
    },
  )
}
const recover = err => {
  console.log('query', err)
  // window.location.assign(window.location)
}
export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
