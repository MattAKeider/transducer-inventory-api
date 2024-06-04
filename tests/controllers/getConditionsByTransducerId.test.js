const {
  getConditionsByTransducerId,
} = require('../../controllers/condition-controller');
const Condition = require('../../models/condition');

jest.mock('../../models/condition.js');

const conditionDocuments = [
  {
    condition: 'Working',
    conditionChangedDate: '2024-01-22T00:00:00.000Z',
    transducer: '65c5412da9eedba40a62bf43',
    _id: '65c5412da9eedba40a62bf56',
    __v: 0,
    toObject: jest.fn().mockReturnThis(),
  },
];

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

describe('getConditionsByTransducerId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return conditions for given transducer id', async () => {
    jest.mocked(Condition.find).mockResolvedValueOnce(conditionDocuments);
    await getConditionsByTransducerId(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ conditions: conditionDocuments });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test('should fail to query the database', async () => {
    jest.mocked(Condition.find).mockRejectedValueOnce();
    await getConditionsByTransducerId(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Could not query from database')
    );
  });

  test('should throw an error if conditions do not exist', async () => {
    jest.mocked(Condition.find).mockResolvedValueOnce(null);
    await getConditionsByTransducerId(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Could not find condition logs for given transducer id')
    );
  });

  test('should throw an error if conditions is an empty array', async () => {
    jest.mocked(Condition.find).mockResolvedValueOnce([]);
    await getConditionsByTransducerId(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Could not find condition logs for given transducer id')
    );
  });
});
