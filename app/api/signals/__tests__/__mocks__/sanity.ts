// Mock the Sanity client
export const clientFetch = jest.fn();

// Mock the Sanity client module
const mockSanityClient = {
  fetch: clientFetch,
};

// Mock the entire next-sanity module
jest.mock('next-sanity', () => ({
  createClient: jest.fn(() => mockSanityClient),
}));

// Helper to mock successful responses
export function mockSuccessfulResponse(data: any) {
  clientFetch.mockResolvedValueOnce(data);
}

// Helper to mock errors
export function mockErrorResponse(error: Error) {
  clientFetch.mockRejectedValueOnce(error);
}

// Reset all mocks between tests
export function resetMocks() {
  clientFetch.mockReset();
}
