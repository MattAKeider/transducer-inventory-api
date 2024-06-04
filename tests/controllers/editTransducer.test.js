const expressValidator = require('express-validator');

const { editTransducer } = require('../../controllers/transducer-controller');
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
  params: {
    id: '65c5412da9eedba40a62bf43',
  },
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

describe('editTransducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(expressValidator.validationResult).mockImplementation(() => ({
      isEmpty: jest.fn().mockReturnValue(true),
    }));
  });

  test('should edit a transducer', async () => {
    jest.mocked(Transducer.findById).mockImplementation(() => ({
      save: jest.fn((x) => x),
      toObject: jest.fn(),
    }));

    await editTransducer(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(Transducer.findById).toHaveBeenCalledWith(req.params.id);
  });

  test('should throw an error if invalid request body inputs given', async () => {
    jest.mocked(expressValidator.validationResult).mockImplementation(() => ({
      isEmpty: jest.fn().mockReturnValue(false),
    }));

    await editTransducer(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Invalid input values, please check your data')
    );
  });

  test('should fail to query the database', async () => {
    jest.mocked(Transducer.findById).mockRejectedValueOnce();
    await editTransducer(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Could not query database.'));
  });

  test('should throw an error if existing transducer does not exist', async () => {
    jest.mocked(Transducer.findById).mockResolvedValueOnce(null);
    await editTransducer(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Could not find a transducer with that id.')
    );
  });

  test('should fail to write to the database', async () => {
    jest.mocked(Transducer.findById).mockResolvedValueOnce(transducerDocument);
    await editTransducer(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Could not write to database'));
  });
});
