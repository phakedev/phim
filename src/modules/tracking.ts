export function useTracking() {
  const send = (key: string, value: any) => {
    if (key === "search") {
      gtag("event", "search", { q: value, search_term: value })
    } else if (key === "select_content") {
      gtag("event", "select_content", {
        content_type: value?.type,
        item_id: value?.id,
      })
    }
  }

  return { send }
}
