export async function withRetry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || error.code !== 'ETIMEDOUT') {
      throw error;
    }
    console.warn(`Query timed out, retrying... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}