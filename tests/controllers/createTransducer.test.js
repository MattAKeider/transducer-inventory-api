const expressValidator = require('express-validator');

const { createTransducer } = require('../../controllers/transducer-controller');
const Transducer = require('../../models/transducer');

jest.mock('express-validator');
jest.mock('../../models/transducer');

const transducerDocument = {
  _id: '65c5412da9eedba40a62bf43',
  name: 'TW',
  location: 'CROCKER',
  department: 'MFM',
  transducerType: 'TV',
  room: '201',
  serialNumber: '212',
  internalIdentifier: '41',
  controlNumber: '00FB-12346',
  dateReceived: '2024-01-22T00:00:00.000Z',
  outOfService: false,
  currentCondition: [],
  __v: 0,
  id: '65c5412da9eedba40a62bf43',
  toObject: jest.fn(),
};

const req = {
  body: {
    name: 'TW',
    location: 'CROCKER',
    department: 'MFM',
    room: '201',
    transducerType: 'TV',
    serialNumber: '212',
    internalIdentifier: '41',
    controlNumber: '00FB-12346',
    dateReceived: '2024-01-22',
    outOfService: false,
  },
};

const res = {
  status: jest.fn((x) => x).mockReturnThis(),
  json: jest.fn((x) => x),
};

const next = jest.fn((x) => x);

describe('createTransducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(expressValidator.validationResult).mockImplementation(() => ({
      isEmpty: jest.fn().mockReturnValue(true),
    }));
  });

  test('should create a transducer', async () => {
    jest.mocked(Transducer.findOne).mockResolvedValueOnce(undefined);
    await createTransducer(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test('should fail to query the database', async () => {
    jest.mocked(Transducer.findOne).mockRejectedValueOnce();
    await createTransducer(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Could not query database.'));
  });

  test('should throw an error if invalid request body inputs given', async () => {
    jest.mocked(expressValidator.validationResult).mockImplementation(() => ({
      isEmpty: jest.fn().mockReturnValue(false),
    }));

    await createTransducer(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Invalid input values, please check your data')
    );
  });

  test('should throw an error if transducer already exists', async () => {
    jest.mocked(Transducer.findOne).mockResolvedValueOnce(transducerDocument);
    await createTransducer(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Transducer already exists with given name or serial number')
    );
  });

  test('should fail to write to the database', async () => {
    jest.mocked(Transducer.prototype.save).mockRejectedValueOnce();
    await createTransducer(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Failed to write to database.')
    );
  });
});
