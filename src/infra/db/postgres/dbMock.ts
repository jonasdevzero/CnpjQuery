import sql from './db';

jest.mock('./db', () => ({
  __esModule: true,
  default: jest.fn(),
}));

export const dbMock = sql as unknown as jest.Mock<any, any>;

beforeEach(() => {
  dbMock.mockClear();
});
