import { HttpClient } from '../src';

describe('Standard HTTP Client', () => {
  const { request: http } = HttpClient;
  
  it('should get a valid response', async () => {
    const response = await http({ method: 'GET', url: 'https://www.google.com' });
    
    expect(response).toBeDefined();
  });
});
