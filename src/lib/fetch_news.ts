export async function fetchNewsClient() {
  try {
    const response = await fetch('/api/news');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}