const expressValidator = require('express-validator');

const { createCondition } = require('../../controllers/condition-controller');
const Transducer = require('../../models/transducer');

jest.mock('express-validator');
jest.mock('../../models/transducer.js');

const req = {
  body: {
    condition: 'Working',
    note: 'In working condition!',
    transducer: '65c5412da9eedba40a62bf43',
  },
};

const res = {
  status: jest.fn((x) => x).mockReturnThis(),
  json: jest.fn((x) => x),
};

const next = jest.fn((x) => x);

describe('createCondition', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(expressValidator.validationResult).mockImplementation(() => ({
      isEmpty: jest.fn().mockReturnValue(true),
    }));
  });

  test('should throw an error if invalid request body inputs given', async () => {
    jest.mocked(expressValidator.validationResult).mockImplementation(() => ({
      isEmpty: jest.fn().mockReturnValue(false),
    }));

    await createCondition(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Invalid input values, please check your data')
    );
  });

  test('should fail to query the database', async () => {
    jest.mocked(Transducer.findById).mockRejectedValueOnce();
    await createCondition(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Could not query from database')
    );
  });

  test('should throw an error if transducer does not exist', async () => {
    jest.mocked(Transducer.findById).mockResolvedValueOnce(null);
    await createCondition(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Could not find a transducer with given id')
    );
  });
});
