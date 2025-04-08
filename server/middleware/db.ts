export default defineEventHandler(async (event) => {
  event.context.db = await getCachedDatabaseClient()
})
