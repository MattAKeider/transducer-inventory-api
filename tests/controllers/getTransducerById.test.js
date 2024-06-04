const {
  getTransducerById,
} = require('../../controllers/transducer-controller');
const Transducer = require('../../models/transducer');

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
  toObject: jest.fn().mockReturnThis(),
};

const req = {
  params: {
    id: transducerDocument.id,
  },
};

const res = {
  status: jest.fn((x) => x).mockReturnThis(),
  json: jest.fn((x) => x),
};

const next = jest.fn((x) => x);

describe('getTransducerById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get transducer', async () => {
    jest.mocked(Transducer.findById).mockResolvedValueOnce(transducerDocument);
    await getTransducerById(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ transducer: transducerDocument });
  });

  test('should fail to query the database', async () => {
    jest.mocked(Transducer.findById).mockRejectedValueOnce();
    await getTransducerById(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Could not query from database')
    );
  });

  test('should fail to find a transducer with given id', async () => {
    jest.mocked(Transducer.findById).mockResolvedValueOnce(null);
    await getTransducerById(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Could not find a transducer with that id.')
    );
  });
});
