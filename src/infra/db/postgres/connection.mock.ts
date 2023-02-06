import sql from './connection';

jest.mock('./connection', () => ({
  __esModule: true,
  default: jest.fn(),
}));

export const dbMock = sql as unknown as jest.Mock<any, any>;

beforeEach(() => {
  dbMock.mockClear();
});
