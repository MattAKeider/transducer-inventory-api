const { deleteTransducer } = require('../../controllers/transducer-controller');
const Transducer = require('../../models/transducer');

jest.mock('../../models/transducer');

const req = {
  params: {
    id: '65c5412da9eedba40a62bf43',
  },
};

const res = {
  status: jest.fn((x) => x).mockReturnThis(),
  json: jest.fn((x) => x),
};

const next = jest.fn((x) => x);

describe('deleteTransducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fail to query the database', async () => {
    jest.mocked(Transducer.findById).mockRejectedValueOnce();
    await deleteTransducer(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Could not query database.'));
  });

  test('should throw an error if existing transducer does not exist', async () => {
    jest.mocked(Transducer.findById).mockResolvedValueOnce(null);
    await deleteTransducer(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Could not find a transducer with that id')
    );
  });
});
